'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  Volume2,
  Vibrate,
  Sliders,
  Type,
  Sun,
  Moon,
  Keyboard,
  Check,
  RotateCcw,
} from 'lucide-react';
import { sonificationEngine, screenReader } from '@/utils/screenReaderSonification';

interface AccessibilityControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export type HighContrastMode = 'standard' | 'yellow-on-black' | 'white-on-black' | 'colorblind-safe';

export default function AccessibilityControlsModal({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}: AccessibilityControlsModalProps) {
  const [contrastMode, setContrastMode] = useState<HighContrastMode>('standard');
  const [fontSizeScale, setFontSizeScale] = useState<number>(100);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(sonificationEngine.isSoundEnabled());
  const [isHapticsOn, setIsHapticsOn] = useState(sonificationEngine.isHapticsEnabled());
  const [volume, setVolume] = useState(60);

  // Load saved preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedContrast = (localStorage.getItem('sanketika_contrast_mode') as HighContrastMode) || 'standard';
      const savedScale = Number(localStorage.getItem('sanketika_font_scale')) || 100;
      const savedDyslexic = localStorage.getItem('sanketika_dyslexic_font') === 'true';

      setContrastMode(savedContrast);
      setFontSizeScale(savedScale);
      setIsDyslexicFont(savedDyslexic);
      applyVisualStyles(savedContrast, savedScale, savedDyslexic);
    } catch {}
  }, []);

  const applyVisualStyles = (contrast: HighContrastMode, scale: number, dyslexic: boolean) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Apply high contrast attributes
    root.setAttribute('data-contrast-mode', contrast);
    root.setAttribute('data-dyslexic-font', String(dyslexic));
    root.style.fontSize = `${scale}%`;

    try {
      localStorage.setItem('sanketika_contrast_mode', contrast);
      localStorage.setItem('sanketika_font_scale', String(scale));
      localStorage.setItem('sanketika_dyslexic_font', String(dyslexic));
    } catch {}
  };

  const handleContrastSelect = (mode: HighContrastMode) => {
    setContrastMode(mode);
    applyVisualStyles(mode, fontSizeScale, isDyslexicFont);
    sonificationEngine.triggerSensoryFeedback('mode_switch');
    screenReader.announce(`Contrast mode set to ${mode}`, 'polite');
  };

  const handleFontScaleChange = (scale: number) => {
    setFontSizeScale(scale);
    applyVisualStyles(contrastMode, scale, isDyslexicFont);
    sonificationEngine.triggerSensoryFeedback('mode_switch');
    screenReader.announce(`Text size scaled to ${scale}%`, 'polite');
  };

  const handleDyslexicToggle = () => {
    const next = !isDyslexicFont;
    setIsDyslexicFont(next);
    applyVisualStyles(contrastMode, fontSizeScale, next);
    sonificationEngine.triggerSensoryFeedback('mode_switch');
    screenReader.announce(`Dyslexia font ${next ? 'enabled' : 'disabled'}`, 'polite');
  };

  const handleSoundToggle = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    sonificationEngine.setSoundEnabled(next);
    if (next) sonificationEngine.playEarcon('sign_commit');
  };

  const handleHapticsToggle = () => {
    const next = !isHapticsOn;
    setIsHapticsOn(next);
    sonificationEngine.setHapticsEnabled(next);
    if (next) sonificationEngine.triggerHaptic('sign_commit');
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    sonificationEngine.setMasterVolume(vol / 100);
  };

  const resetDefaults = () => {
    setContrastMode('standard');
    setFontSizeScale(100);
    setIsDyslexicFont(false);
    setIsSoundOn(true);
    setIsHapticsOn(true);
    setVolume(60);
    sonificationEngine.setSoundEnabled(true);
    sonificationEngine.setHapticsEnabled(true);
    sonificationEngine.setMasterVolume(0.6);
    applyVisualStyles('standard', 100, false);
    onThemeChange('dark');
    sonificationEngine.triggerSensoryFeedback('clear');
    screenReader.announce('Accessibility settings reset to default', 'polite');
  };

  if (!isOpen) return null;

  return (
    <div
      className="accessibility-modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="accessibility-modal card"
        style={{
          background: 'var(--bg-base)',
          border: '2px solid var(--accent)',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-dialog-title"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={20} color="var(--accent)" />
            <h2 id="accessibility-dialog-title" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Accessibility & Sensory Controls
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Close accessibility settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Visual Contrast Presets */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Display & Contrast Mode (WCAG AAA)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {[
              { id: 'standard', label: 'Default Theme', desc: currentTheme === 'dark' ? 'Dark Slate' : 'Clean Light' },
              { id: 'yellow-on-black', label: 'Yellow on Black', desc: 'Max Low-Vision Contrast' },
              { id: 'white-on-black', label: 'White on Black', desc: 'Monochrome High-Contrast' },
              { id: 'colorblind-safe', label: 'Color-Safe Palette', desc: 'Deuteran / Protan Safe' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleContrastSelect(m.id as HighContrastMode)}
                style={{
                  background: contrastMode === m.id ? 'var(--accent-soft)' : 'var(--bg-surface)',
                  border: contrastMode === m.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.label}</span>
                  {contrastMode === m.id && <Check size={14} color="var(--accent)" />}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Text Size & Dyslexia Font */}
        <div style={{ marginBottom: '1.25rem', padding: '12px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} /> Text Scaling
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[100, 125, 150, 175].map(scale => (
                <button
                  key={scale}
                  onClick={() => handleFontScaleChange(scale)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: fontSizeScale === scale ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: fontSizeScale === scale ? 'var(--accent)' : 'var(--bg-card)',
                    color: fontSizeScale === scale ? '#FFFFFF' : 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  {scale}%
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              Dyslexia-Friendly Spacing & Typography
            </span>
            <button
              onClick={handleDyslexicToggle}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: isDyslexicFont ? 'var(--emerald)' : 'var(--bg-card)',
                color: isDyslexicFont ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              {isDyslexicFont ? 'Active' : 'Off'}
            </button>
          </div>
        </div>

        {/* Section 3: Audio Earcons & Tactile Haptics */}
        <div style={{ marginBottom: '1.25rem', padding: '12px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
            Sensory Feedback (Audio & Haptics)
          </span>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Volume2 size={15} /> Acoustic Earcon Chimes
            </span>
            <button
              onClick={handleSoundToggle}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: isSoundOn ? 'var(--accent)' : 'var(--bg-card)',
                color: isSoundOn ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              {isSoundOn ? 'Enabled' : 'Muted'}
            </button>
          </div>

          {isSoundOn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingLeft: '20px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Volume:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={volume}
                onChange={e => handleVolumeChange(Number(e.target.value))}
                style={{ flex: 1, cursor: 'pointer' }}
                aria-label="Earcon volume"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '32px' }}>{volume}%</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Vibrate size={15} /> Tactile Haptic Vibration
            </span>
            <button
              onClick={handleHapticsToggle}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: isHapticsOn ? 'var(--emerald)' : 'var(--bg-card)',
                color: isHapticsOn ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              {isHapticsOn ? 'Enabled' : 'Off'}
            </button>
          </div>
        </div>

        {/* Section 4: Keyboard Navigation Shortcut Guide */}
        <div style={{ marginBottom: '1.25rem', padding: '10px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Keyboard size={14} /> Accessibility Keyboard Shortcuts
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div><kbd>Alt + S</kbd> Speak Sentence</div>
            <div><kbd>Alt + C</kbd> Clear Canvas</div>
            <div><kbd>Alt + M</kbd> Cycle Mode</div>
            <div><kbd>Alt + E</kbd> Emergency SOS</div>
            <div><kbd>Alt + A</kbd> Accessibility Panel</div>
            <div><kbd>Space</kbd> Start / Stop Engine</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button
            onClick={resetDefaults}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCcw size={13} /> Reset to Defaults
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'var(--text-primary)',
              color: 'var(--bg-base)',
              border: 'none',
              borderRadius: '99px',
              padding: '8px 20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
