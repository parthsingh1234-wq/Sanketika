'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  HeartPulse,
  Bus,
  Building2,
  Grid,
  Volume2,
  Maximize2,
  X,
  Share2,
  MapPin,
  Bell,
  CheckCircle,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  INCLUSIVE_SERVICE_CARDS,
  AAC_CORE_TILES,
  PAIN_SCALE_LEVELS,
  type ServiceCategory,
  type ServiceCard,
  type AACTile,
  type PainScaleLevel,
} from '@/utils/inclusiveServices';
import {
  REGIONAL_LANGUAGES,
  translateSignToRegional,
  type SupportedRegionalLang,
} from '@/utils/regionalLanguages';
import { sonificationEngine, screenReader } from '@/utils/screenReaderSonification';
import { dispatchEmergencySOS } from '@/utils/backendClient';

interface InclusiveServicesPanelProps {
  targetLang: SupportedRegionalLang;
  onSpeak: (text: string, langCode: string) => void;
}

export default function InclusiveServicesPanel({
  targetLang,
  onSpeak,
}: InclusiveServicesPanelProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedCard, setSelectedCard] = useState<ServiceCard | null>(null);
  const [activePainLevel, setActivePainLevel] = useState<PainScaleLevel | null>(null);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [modalText, setModalText] = useState<{ title: string; main: string; phonetic: string; emoji: string }>({
    title: '',
    main: '',
    phonetic: '',
    emoji: '',
  });

  // SOS Beacon State
  const [isSosActive, setIsSosActive] = useState(false);
  const [sosLocation, setSosLocation] = useState<string | null>(null);
  const [sosDispatchStatus, setSosDispatchStatus] = useState<string | null>(null);

  // AAC Switch Scanning state
  const [isSwitchScanning, setIsSwitchScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const langInfo = REGIONAL_LANGUAGES[targetLang] || REGIONAL_LANGUAGES.en;

  // Filter service cards
  const filteredCards = activeCategory === 'all'
    ? INCLUSIVE_SERVICE_CARDS
    : INCLUSIVE_SERVICE_CARDS.filter(c => c.category === activeCategory);

  // Handle Card Click -> Show Counter Staff View
  const handleSelectCard = (card: ServiceCard) => {
    setSelectedCard(card);
    sonificationEngine.triggerSensoryFeedback('sign_commit');

    // Translate to regional language
    const translation = translateSignToRegional(card.regionalKey, targetLang);
    const mainText = translation.isDictionaryMatch ? translation.text : card.fullMessage;
    const phoneticText = translation.isDictionaryMatch ? translation.phonetic : '';

    setModalText({
      title: card.title,
      main: mainText,
      phonetic: phoneticText,
      emoji: card.emoji,
    });
    setShowCounterModal(true);

    screenReader.announce(`Opened ${card.title} service card in ${langInfo.nativeLabel}`, 'polite');
  };

  // Handle AAC Tile Click
  const handleSelectAACTile = (tile: AACTile) => {
    sonificationEngine.triggerSensoryFeedback('sign_commit');
    const translation = translateSignToRegional(tile.id.toUpperCase(), targetLang);
    const spoken = translation.isDictionaryMatch ? translation.text : tile.phrase;

    setModalText({
      title: tile.label,
      main: spoken,
      phonetic: translation.isDictionaryMatch ? translation.phonetic : '',
      emoji: tile.emoji,
    });
    setShowCounterModal(true);

    // Speak automatically in target regional language
    onSpeak(spoken, langInfo.code);
    screenReader.announce(`AAC tile selected: ${tile.label}`, 'polite');
  };

  // Handle Pain Scale Click
  const handleSelectPain = (level: PainScaleLevel) => {
    setActivePainLevel(level);
    sonificationEngine.triggerSensoryFeedback('sign_commit');

    const painMsg = `Pain Level ${level.score}/10 (${level.label}): ${level.description}`;
    const translation = translateSignToRegional('PAIN_SCALE', targetLang);
    const displayMsg = translation.isDictionaryMatch ? `${translation.text} [${level.score}/10 - ${level.label}]` : painMsg;

    setModalText({
      title: `Pain Rating: ${level.score}/10`,
      main: displayMsg,
      phonetic: translation.phonetic,
      emoji: level.emoji,
    });
    setShowCounterModal(true);
    onSpeak(displayMsg, langInfo.code);
  };

  // Toggle SOS Panic
  const toggleSos = () => {
    if (!isSosActive) {
      setIsSosActive(true);
      sonificationEngine.triggerSensoryFeedback('emergency_sos');
      screenReader.announce('EMERGENCY SOS ACTIVATED. Siren broadcasting.', 'assertive');

      const triggerDispatch = async (lat?: number, lng?: number, addressStr?: string) => {
        try {
          const res = await dispatchEmergencySOS({
            latitude: lat,
            longitude: lng,
            painLevel: activePainLevel?.score ?? 0,
            address: addressStr || 'Real-time GPS Beacon',
            userNote: `Emergency Assistance requested via Accessible Sign AI. Pain Level: ${activePainLevel?.score ?? 0}/10`
          });
          setSosDispatchStatus(`${res.incidentId} • ${res.status} (ETA: ${res.eta})`);
        } catch (e) {
          console.error(e);
        }
      };

      // Fetch Geolocation if available
      if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const coords = `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`;
            setSosLocation(coords);
            triggerDispatch(pos.coords.latitude, pos.coords.longitude, coords);
          },
          () => {
            setSosLocation('Location coordinates unavailable');
            triggerDispatch();
          }
        );
      } else {
        triggerDispatch();
      }

      const sosTranslation = translateSignToRegional('EMERGENCY_SOS', targetLang);
      setModalText({
        title: 'EMERGENCY SOS ALERT',
        main: sosTranslation.isDictionaryMatch ? sosTranslation.text : 'CRITICAL EMERGENCY: I need immediate medical & police assistance!',
        phonetic: sosTranslation.phonetic,
        emoji: '🚨',
      });
      setShowCounterModal(true);
      onSpeak(sosTranslation.text, langInfo.code);
    } else {
      setIsSosActive(false);
      setSosDispatchStatus(null);
      screenReader.announce('Emergency SOS deactivated.', 'polite');
    }
  };

  // Switch Scanning Toggle
  const toggleSwitchScanning = () => {
    if (isSwitchScanning) {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setIsSwitchScanning(false);
      screenReader.announce('Switch scanning stopped.', 'polite');
    } else {
      setIsSwitchScanning(true);
      screenReader.announce('Switch scanning activated. Press space or enter to select.', 'polite');
      scanIntervalRef.current = setInterval(() => {
        setScanIndex(prev => {
          const next = (prev + 1) % AAC_CORE_TILES.length;
          sonificationEngine.playEarcon('scan_tick');
          return next;
        });
      }, 1400);
    }
  };

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  return (
    <div className="inclusive-services-container card animate-in" style={{ marginTop: '1.5rem', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--accent)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Inclusive Digital Services & Accessible Communicator
          </h2>
          <span style={{ fontSize: '0.75rem', background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
            {langInfo.nativeLabel} ({langInfo.label})
          </span>
        </div>

        {/* SOS Alert Trigger Button */}
        <button
          onClick={toggleSos}
          className="sos-button"
          aria-label="Emergency SOS Beacon"
          style={{
            background: isSosActive ? '#DC2626' : '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '99px',
            padding: '6px 14px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isSosActive ? '0 0 18px rgba(239, 68, 68, 0.8)' : '0 2px 8px rgba(239, 68, 68, 0.3)',
            animation: isSosActive ? 'pulse 1s infinite' : 'none',
          }}
        >
          <AlertTriangle size={15} />
          {isSosActive ? 'SOS ACTIVE (STOP)' : 'EMERGENCY SOS'}
        </button>
      </div>

      {sosDispatchStatus && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px', margin: '0.5rem 0' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
          <span><strong>Emergency Dispatch Confirmed:</strong> {sosDispatchStatus}</span>
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem 0' }}>
        Independent access to public, medical, transport, and financial services in {langInfo.nativeLabel}. Tap any card to display large high-contrast visual instructions for service counters or bystanders.
      </p>

      {/* Category Tabs */}
      <div className="services-tabs" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }} role="tablist">
        {[
          { id: 'all', label: 'All Services', icon: <Grid size={14} /> },
          { id: 'emergency', label: 'SOS & Safety', icon: <AlertTriangle size={14} /> },
          { id: 'health', label: 'Healthcare & Clinic', icon: <HeartPulse size={14} /> },
          { id: 'transit', label: 'Public Transit', icon: <Bus size={14} /> },
          { id: 'banking', label: 'Banking & Cash', icon: <Building2 size={14} /> },
          { id: 'aac_core', label: 'AAC Communication Grid', icon: <Sliders size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeCategory === tab.id}
            onClick={() => {
              setActiveCategory(tab.id as any);
              sonificationEngine.triggerSensoryFeedback('mode_switch');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              border: activeCategory === tab.id ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: activeCategory === tab.id ? 'var(--accent-soft)' : 'var(--bg-surface)',
              color: activeCategory === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* View Section 1: AAC Grid View (when AAC or All is selected) */}
      {(activeCategory === 'aac_core' || activeCategory === 'all') && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Grid size={14} /> Augmentative and Alternative Communication (AAC) Grid
            </span>
            <button
              onClick={toggleSwitchScanning}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: isSwitchScanning ? 'var(--accent)' : 'var(--bg-base)',
                color: isSwitchScanning ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {isSwitchScanning ? 'Scanning Active (Stop)' : 'Enable Switch Scanning'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '8px' }}>
            {AAC_CORE_TILES.map((tile, idx) => {
              const isCurrentScan = isSwitchScanning && scanIndex === idx;
              return (
                <button
                  key={tile.id}
                  onClick={() => handleSelectAACTile(tile)}
                  style={{
                    background: isCurrentScan ? 'var(--accent)' : 'var(--bg-card)',
                    border: isCurrentScan ? '2px solid #FFFFFF' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '10px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isCurrentScan ? '0 0 12px var(--accent)' : 'none',
                    transform: isCurrentScan ? 'scale(1.05)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                  title={tile.phrase}
                >
                  <span style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{tile.emoji}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCurrentScan ? '#FFFFFF' : 'var(--text-primary)' }}>
                    {tile.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View Section 2: Interactive Pain Scale (when Healthcare or All is selected) */}
      {(activeCategory === 'health' || activeCategory === 'all') && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
            <HeartPulse size={14} color="#EF4444" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Wong-Baker Universal Clinical Pain Scale (0–10)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '6px' }}>
            {PAIN_SCALE_LEVELS.map(level => (
              <button
                key={level.score}
                onClick={() => handleSelectPain(level)}
                style={{
                  background: activePainLevel?.score === level.score ? level.color : 'var(--bg-card)',
                  color: activePainLevel?.score === level.score ? '#FFFFFF' : 'var(--text-primary)',
                  border: `2px solid ${level.color}`,
                  borderRadius: '10px',
                  padding: '8px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{level.emoji}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{level.score}</span>
                <span style={{ fontSize: '0.65rem', textAlign: 'center', fontWeight: 600 }}>{level.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View Section 3: Service Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
        {filteredCards.map(card => {
          const trans = translateSignToRegional(card.regionalKey, targetLang);
          return (
            <div
              key={card.id}
              onClick={() => handleSelectCard(card)}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${card.urgency === 'critical' ? '#EF4444' : 'var(--border)'}`,
                borderLeft: `4px solid ${card.accentColor}`,
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectCard(card);
                }
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{card.emoji}</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: card.urgency === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'var(--accent-soft)',
                      color: card.urgency === 'critical' ? '#EF4444' : 'var(--accent)',
                    }}
                  >
                    {card.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '4px 0', color: 'var(--text-primary)' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                  {card.summary}
                </p>

                {trans.isDictionaryMatch && (
                  <div style={{ background: 'var(--accent-soft)', padding: '4px 8px', borderRadius: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                      {trans.text}
                    </span>
                    {trans.phonetic && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                        [{trans.phonetic}]
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={12} /> Show Counter Staff
                </span>
                <Maximize2 size={13} color="var(--accent)" />
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL-SCREEN SHOW COUNTER STAFF MODAL */}
      {showCounterModal && (
        <div
          className="counter-modal-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setShowCounterModal(false)}
        >
          <div
            className="counter-card"
            style={{
              background: '#000000',
              border: '3px solid #FACC15', // High Contrast Gold on Black
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '650px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              color: '#FFFFFF',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="counter-card-title"
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{modalText.emoji}</span>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#FACC15', fontWeight: 800 }}>
                    PLEASE READ THIS SCREEN (ASSISTIVE CARD)
                  </span>
                  <h2 id="counter-card-title" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    {modalText.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowCounterModal(false)}
                style={{
                  background: '#1F2937',
                  border: '1px solid #4B5563',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Huge High-Contrast Body Text */}
            <div
              style={{
                background: '#111827',
                border: '2px solid #374151',
                borderRadius: '14px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <p
                style={{
                  fontSize: '1.8rem',
                  lineHeight: 1.4,
                  fontWeight: 800,
                  color: '#FACC15', // WCAG AAA High Contrast
                  margin: 0,
                  wordBreak: 'break-word',
                }}
              >
                {modalText.main}
              </p>

              {modalText.phonetic && (
                <p style={{ fontSize: '1.1rem', color: '#9CA3AF', marginTop: '0.75rem', fontStyle: 'italic', margin: '0.75rem 0 0 0' }}>
                  Pronunciation guide: {modalText.phonetic}
                </p>
              )}

              {sosLocation && isSosActive && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 700 }}>
                  <MapPin size={16} /> GPS Location: {sosLocation}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <button
                onClick={() => onSpeak(modalText.main, langInfo.code)}
                style={{
                  background: '#FACC15',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Volume2 size={18} /> Speak Aloud in {langInfo.nativeLabel}
              </button>

              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(modalText.main);
                    sonificationEngine.triggerSensoryFeedback('sign_commit');
                    screenReader.announce('Message copied to clipboard', 'polite');
                  }
                }}
                style={{
                  background: '#374151',
                  color: '#FFFFFF',
                  border: '1px solid #4B5563',
                  borderRadius: '99px',
                  padding: '12px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Share2 size={16} /> Copy Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
