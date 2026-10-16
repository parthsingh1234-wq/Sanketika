import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  checkBackendHealth,
  predictGestureServer,
  dispatchEmergencySOS,
  translateTextRegional,
  fetchRoutesCatalog,
} from '../utils/backendClient.ts';

const originalFetch = global.fetch;

describe('Backend Client & API Integration Suite', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('checkBackendHealth() gracefully returns edge_fallback when network fails', async () => {
    global.fetch = (() => Promise.reject(new Error('Network error'))) as any;
    const health = await checkBackendHealth();

    assert.ok(health);
    assert.strictEqual(health.status, 'edge_fallback');
    assert.strictEqual(health.backend, 'client_edge');
    assert.strictEqual(health.modelLoaded, true);
    assert.strictEqual(health.classesCount, 30);
    assert.strictEqual(health.mode, 'offline_capable');
  });

  it('checkBackendHealth() parses online status when backend is responsive', async () => {
    const mockPayload = {
      status: 'online',
      backend: 'fastapi',
      url: 'http://127.0.0.1:8000',
      modelLoaded: true,
      classesCount: 30,
      classes: ['a', 'b', 'c'],
      engine: 'RandomForestClassifier',
      timestamp: Date.now(),
      mode: 'connected'
    };

    global.fetch = (() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPayload),
      })) as any;

    const health = await checkBackendHealth();
    assert.strictEqual(health.status, 'online');
    assert.strictEqual(health.backend, 'fastapi');
    assert.strictEqual(health.mode, 'connected');
  });

  it('predictGestureServer() returns valid prediction format', async () => {
    const mockResponse = {
      prediction: 'B',
      raw_character: 'b',
      confidence: 0.94,
      top_predictions: [
        { label: 'B', confidence: 0.94 },
        { label: 'D', confidence: 0.04 }
      ],
      latency_ms: 1.5,
      source: 'python_fastapi_backend',
      timestamp: Date.now() / 1000
    };

    global.fetch = (() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })) as any;

    const dummyLandmarks = new Array(42).fill(0.1);
    const result = await predictGestureServer(dummyLandmarks);

    assert.strictEqual(result.prediction, 'B');
    assert.ok(result.confidence > 0.9);
    assert.ok(result.top_predictions.length > 0);
    assert.strictEqual(result.source, 'python_fastapi_backend');
  });

  it('dispatchEmergencySOS() dispatches distress payload and returns incidentId', async () => {
    const mockSosResponse = {
      success: true,
      incidentId: 'SOS-TEST1234',
      status: 'DISPATCHED',
      message: 'Emergency SOS beacon logged.',
      eta: '3 to 5 minutes',
      recordedAt: new Date().toISOString(),
      latitude: 12.9716,
      longitude: 77.5946,
      source: 'python_fastapi_backend'
    };

    global.fetch = (() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSosResponse),
      })) as any;

    const res = await dispatchEmergencySOS({
      latitude: 12.9716,
      longitude: 77.5946,
      painLevel: 8,
      address: 'Bengaluru, India',
      userNote: 'Severe distress, ambulance needed'
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.incidentId, 'SOS-TEST1234');
    assert.strictEqual(res.status, 'DISPATCHED');
    assert.strictEqual(res.latitude, 12.9716);
  });

  it('translateTextRegional() supports Hindi, Tamil and Spanish lookups', async () => {
    global.fetch = ((url: any, opts: any) => {
      const parsed = JSON.parse(opts.body);
      const targetLang = parsed.targetLang;
      const dict: Record<string, string> = {
        hi: 'नमस्ते',
        ta: 'வணக்கம்',
        es: 'Hola'
      };
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          originalText: 'Hello',
          targetLang,
          translatedText: dict[targetLang] || 'Hello',
          phoneticGuide: targetLang === 'hi' ? 'Namaste' : 'Vanakkam',
          bcp47Locale: `${targetLang}-IN`,
          isDictionaryMatch: true
        })
      });
    }) as any;

    const resHindi = await translateTextRegional('Hello', 'hi');
    assert.strictEqual(resHindi.translatedText, 'नमस्ते');
    assert.strictEqual(resHindi.phoneticGuide, 'Namaste');

    const resTamil = await translateTextRegional('Hello', 'ta');
    assert.strictEqual(resTamil.translatedText, 'வணக்கம்');

    const resSpanish = await translateTextRegional('Hello', 'es');
    assert.strictEqual(resSpanish.translatedText, 'Hola');
  });

  it('fetchRoutesCatalog() returns all application routes', async () => {
    global.fetch = (() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          routes: [
            { path: '/', name: 'Home' },
            { path: '/live', name: 'Live Engine' },
            { path: '/call', name: 'Video Call' },
            { path: '/about', name: 'About' },
            { path: '/motives', name: 'Motives' },
            { path: '/privacy', name: 'Privacy' },
            { path: '/terms', name: 'Terms' },
          ]
        })
      })) as any;

    const routes = await fetchRoutesCatalog();
    assert.strictEqual(routes.length, 7);
    const paths = routes.map(r => r.path);
    assert.ok(paths.includes('/'));
    assert.ok(paths.includes('/live'));
    assert.ok(paths.includes('/call'));
    assert.ok(paths.includes('/about'));
    assert.ok(paths.includes('/motives'));
    assert.ok(paths.includes('/privacy'));
    assert.ok(paths.includes('/terms'));
  });
});
