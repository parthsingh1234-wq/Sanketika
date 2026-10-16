import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8008';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`${BACKEND_URL}/health`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: 'online',
        backend: 'fastapi',
        url: BACKEND_URL,
        modelLoaded: data.model_loaded ?? true,
        classesCount: data.classes?.length ?? 30,
        classes: data.classes ?? [],
        engine: data.engine ?? 'RandomForestClassifier',
        timestamp: Date.now(),
        mode: 'connected'
      });
    }
  } catch {
    // If Python backend is offline or timed out, report edge fallback
  }

  return NextResponse.json({
    status: 'edge_fallback',
    backend: 'client_edge',
    url: BACKEND_URL,
    modelLoaded: true,
    classesCount: 30,
    classes: ['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    engine: 'TensorFlow.js / WebGL Edge Inference',
    timestamp: Date.now(),
    mode: 'offline_capable'
  });
}
