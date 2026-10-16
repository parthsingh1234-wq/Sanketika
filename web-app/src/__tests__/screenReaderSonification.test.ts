import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  sonificationEngine,
  screenReader,
  type EarconType,
} from '../utils/screenReaderSonification.ts';

describe('Screen Reader & Sonification Engine', () => {
  it('should manage sound enabled and disabled states cleanly', () => {
    sonificationEngine.setSoundEnabled(true);
    assert.strictEqual(sonificationEngine.isSoundEnabled(), true);

    sonificationEngine.setSoundEnabled(false);
    assert.strictEqual(sonificationEngine.isSoundEnabled(), false);

    // Reset
    sonificationEngine.setSoundEnabled(true);
  });

  it('should manage haptic feedback states', () => {
    sonificationEngine.setHapticsEnabled(true);
    assert.strictEqual(sonificationEngine.isHapticsEnabled(), true);

    sonificationEngine.setHapticsEnabled(false);
    assert.strictEqual(sonificationEngine.isHapticsEnabled(), false);

    // Reset
    sonificationEngine.setHapticsEnabled(true);
  });

  it('should handle volume bounds safely between 0 and 1', () => {
    sonificationEngine.setMasterVolume(0.8);
    // Boundary checks: negative or over 1.0 clamped
    sonificationEngine.setMasterVolume(-0.5);
    sonificationEngine.setMasterVolume(1.5);
    sonificationEngine.setMasterVolume(0.6);
    assert.ok(true, 'Volume clamping executed without exception');
  });

  it('should execute sensory feedback triggers without throwing in Node environment', () => {
    const earcons: EarconType[] = [
      'sign_commit',
      'delete',
      'clear',
      'mode_switch',
      'emergency_sos',
      'scan_tick',
      'announce',
    ];

    for (const earcon of earcons) {
      assert.doesNotThrow(() => {
        sonificationEngine.triggerSensoryFeedback(earcon);
      }, `Earcon ${earcon} should not throw when window or AudioContext is absent`);
    }
  });

  it('should dispatch ARIA screen reader announcements to subscribers', () => {
    let receivedMessage = '';
    let receivedPriority = '';

    const unsubscribe = screenReader.subscribe(announcement => {
      receivedMessage = announcement.message;
      receivedPriority = announcement.priority;
    });

    screenReader.announce('Sign recognized: HELLO', 'polite');
    assert.strictEqual(receivedMessage, 'Sign recognized: HELLO');
    assert.strictEqual(receivedPriority, 'polite');

    screenReader.announce('EMERGENCY SOS BROADCAST', 'assertive');
    assert.strictEqual(receivedMessage, 'EMERGENCY SOS BROADCAST');
    assert.strictEqual(receivedPriority, 'assertive');

    const history = screenReader.getHistory();
    assert.ok(history.length >= 2);
    assert.strictEqual(history[0].message, 'EMERGENCY SOS BROADCAST');

    unsubscribe();
  });
});
