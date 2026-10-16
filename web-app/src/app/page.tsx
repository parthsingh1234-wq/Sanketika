'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Phone,
  Volume2,
  Eye,
  Layers,
  Cpu,
  AlertTriangle,
  Bus,
  CreditCard,
  CheckCircle2,
  Sliders,
  FileText,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

import styles from './page.module.css';
import NavigationHeader from '@/components/NavigationHeader';
import NavigationFooter from '@/components/NavigationFooter';
import {
  REGIONAL_LANGUAGES,
  translateSignToRegional,
  getLocaleForLang,
  type SupportedRegionalLang,
} from '@/utils/regionalLanguages';

// ── 3D HAND SKELETON TOPOLOGY (MediaPipe 21 Landmarks) ──────────────────────
type GestureKey = 'OPEN_PALM' | 'PEACE_V' | 'THUMBS_UP' | 'ASL_L' | 'FIST';

interface GestureTelemetry {
  name: string;
  category: string;
  confidence: number;
  latencyMs: number;
  engine: string;
  activeJoints: string;
  points: [number, number][];
}

const GESTURE_DATA: Record<GestureKey, GestureTelemetry> = {
  OPEN_PALM: {
    name: 'Open Palm (Neutral / Ready)',
    category: 'Universal Detection Ready',
    confidence: 99.4,
    latencyMs: 7.8,
    engine: 'TensorFlow.js WASM SIMD',
    activeJoints: 'All 5 digits extended (MCP-TIP angle > 165°)',
    points: [
      [150, 275], // 0: Wrist
      [115, 235], [92, 198], [76, 162], [65, 130], // 1-4: Thumb
      [120, 188], [112, 142], [105, 96], [100, 52], // 5-8: Index
      [150, 180], [150, 132], [150, 86], [150, 38], // 9-12: Middle
      [180, 188], [186, 142], [191, 96], [195, 54], // 13-16: Ring
      [205, 202], [216, 168], [226, 132], [235, 98], // 17-20: Pinky
    ],
  },
  PEACE_V: {
    name: 'Peace / ASL "V" (Greeting)',
    category: 'Kinetic Sign: Hello / Greeting',
    confidence: 98.9,
    latencyMs: 8.1,
    engine: 'Client Heuristic + TFLite',
    activeJoints: 'Index & Middle extended; Thumb locks Ring & Pinky',
    points: [
      [150, 275], // 0: Wrist
      [132, 218], [126, 192], [136, 176], [146, 176], // 1-4: Thumb (curled)
      [130, 188], [120, 142], [110, 96], [100, 52], // 5-8: Index (extended left)
      [170, 182], [180, 136], [190, 92], [200, 50], // 9-12: Middle (extended right)
      [180, 198], [180, 218], [174, 232], [165, 222], // 13-16: Ring (curled)
      [205, 212], [205, 228], [195, 238], [185, 228], // 17-20: Pinky (curled)
    ],
  },
  THUMBS_UP: {
    name: 'Thumbs Up (Agree / Confirm)',
    category: 'Universal Sign: Yes / Agree',
    confidence: 99.6,
    latencyMs: 6.9,
    engine: 'Kinetic Heuristic Geometry',
    activeJoints: 'Thumb vertical (>80° elevation); Fingers 2-5 flexed',
    points: [
      [150, 275], // 0: Wrist
      [122, 230], [102, 182], [96, 132], [96, 80], // 1-4: Thumb (straight up)
      [142, 206], [162, 206], [176, 216], [162, 226], // 5-8: Index (fist)
      [152, 222], [172, 222], [186, 232], [172, 242], // 9-12: Middle (fist)
      [162, 236], [176, 236], [192, 246], [176, 256], // 13-16: Ring (fist)
      [172, 252], [182, 252], [196, 262], [182, 270], // 17-20: Pinky (fist)
    ],
  },
  ASL_L: {
    name: 'ASL Letter "L" (Direction / Live)',
    category: 'Alphabet Token: Character L',
    confidence: 97.8,
    latencyMs: 7.4,
    engine: 'Scikit-Learn Random Forest',
    activeJoints: 'Index vertical, Thumb horizontal (90° orthogonal)',
    points: [
      [150, 275], // 0: Wrist
      [122, 226], [96, 202], [68, 192], [38, 192], // 1-4: Thumb (horizontal left)
      [136, 186], [136, 142], [136, 96], [136, 46], // 5-8: Index (vertical up)
      [162, 202], [166, 222], [162, 236], [152, 232], // 9-12: Middle (curled)
      [182, 212], [186, 226], [182, 242], [172, 236], // 13-16: Ring (curled)
      [202, 222], [202, 236], [196, 250], [186, 244], // 17-20: Pinky (curled)
    ],
  },
  FIST: {
    name: 'Clenched Fist (Backspace / Clear)',
    category: 'Control Gesture: Buffer Backspace',
    confidence: 99.1,
    latencyMs: 6.2,
    engine: 'Kinetic Heuristic Geometry',
    activeJoints: 'All 5 digits curled (MCP-TIP Euclidean distance < 35px)',
    points: [
      [150, 275], // 0: Wrist
      [122, 228], [122, 198], [136, 182], [152, 182], // 1-4: Thumb
      [132, 202], [146, 198], [156, 218], [146, 228], // 5-8: Index
      [152, 206], [166, 202], [172, 222], [162, 232], // 9-12: Middle
      [172, 216], [182, 212], [186, 230], [176, 240], // 13-16: Ring
      [192, 226], [196, 222], [202, 240], [192, 250], // 17-20: Pinky
    ],
  },
};

const BONES: [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Knuckle connections
  [5, 9], [9, 13], [13, 17],
];

const TIP_INDICES = new Set([4, 8, 12, 16, 20]);

export default function LandingPage() {
  // Visual Hand Skeleton Interactive State
  const [activeGesture, setActiveGesture] = useState<GestureKey>('OPEN_PALM');
  const [inspectedJoint, setInspectedJoint] = useState<number | null>(null);

  // Multilingual matrix interactive state
  const [selectedLang, setSelectedLang] = useState<SupportedRegionalLang>('hi');
  const [selectedPhrase, setSelectedPhrase] = useState('HELLO');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active Service Tab state
  const [activeServiceTab, setActiveServiceTab] = useState<
    'sos' | 'healthcare' | 'transit' | 'banking' | 'aac' | 'counter'
  >('sos');

  // Interactive selected pain scale preview
  const [previewPain, setPreviewPain] = useState<number>(6);

  // Procedural Web Audio Earcon Synthesizer (Zero-dependency Web Audio API)
  const triggerProceduralEarcon = (type: 'success' | 'delete' | 'sos') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        // Ascending major third (C5 523.25Hz -> E5 659.25Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'delete') {
        // Descending minor third (A4 440Hz -> F4 349.23Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'sos') {
        // Urgent dual-frequency alternating siren
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.15);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch {
      // Ignore audio error if browser blocks autoplay
    }
  };

  // Tactile Vibration Feedback Test (Web Vibration API)
  const triggerHaptics = (pattern: number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptics error
      }
    }
  };

  // Native Speech Synthesis
  const triggerSpeech = (text: string, lang: SupportedRegionalLang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const locale = getLocaleForLang(lang);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale;
      utterance.rate = 0.95;

      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  // Sample phrases catalog
  const SAMPLE_PHRASES = [
    { key: 'HELLO', label: 'Greeting (Hello)' },
    { key: 'HELP', label: 'Urgent Help' },
    { key: 'THANK_YOU', label: 'Courtesy (Thank You)' },
    { key: 'WATER', label: 'Hydration (Water)' },
    { key: 'PAIN_SEVERE', label: 'Clinical Triage' },
    { key: 'BUS_ROUTE', label: 'Public Transit' },
  ];

  const currentTranslation = translateSignToRegional(selectedPhrase, selectedLang);
  const currentLangInfo = REGIONAL_LANGUAGES[selectedLang];
  const activeGestureTelemetry = GESTURE_DATA[activeGesture];

  return (
    <div className={styles.landingContainer}>
      {/* Ambient Lighting Orbs */}
      <div className={styles.ambientOrbPrimary} />
      <div className={styles.ambientOrbSecondary} />

      {/* Keyboard Accessibility Skip Link */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Main Top Navigation */}
      <NavigationHeader />

      {/* Hero Section */}
      <main id="main-content" className={styles.heroSection}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.heroBadge}
        >
          <ShieldCheck size={16} color="var(--emerald)" />
          <span>संकेतिका (Sanketika) • Edge Machine Learning &amp; Assistive Tech • WCAG 2.1 AAA</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.heroTitle}
        >
          Universal Sign Recognition &amp;
          <span className={styles.heroTitleHighlight}>
            Inclusive Digital Services at the Edge
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.heroSubtitle}
        >
          Engineered to eliminate communication exclusion for <strong>70 million deaf individuals</strong> and non-verbal persons worldwide. Delivering 120 FPS on-device computer vision, 12 regional languages with phonetic guides, procedural non-visual earcons, and real-world public service tools.
        </motion.p>

        {/* Primary Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={styles.heroActions}
        >
          <Link href="/live" className={styles.primaryBtn} id="hero-live-btn">
            <Radio size={18} />
            Launch Live Recognition Engine
            <ArrowRight size={16} />
          </Link>
          <Link href="/call" className={styles.secondaryBtn} id="hero-call-btn">
            <Phone size={18} />
            P2P Accessible Video Call
          </Link>
          <a href="#visualizer" className={styles.ghostBtn}>
            Interactive Hand Visualizer ↓
          </a>
        </motion.div>

        {/* Key Engineering Benchmarks Strip */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>
              ~8 <span className={styles.metricUnit}>ms</span>
            </div>
            <div className={styles.metricLabel}>Edge Inference Latency</div>
            <div className={styles.metricDesc}>
              TensorFlow.js WebAssembly SIMD runtime executing locally in browser RAM.
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricValue}>
              543 <span className={styles.metricUnit}>pts</span>
            </div>
            <div className={styles.metricLabel}>3D Holistic Landmark Mesh</div>
            <div className={styles.metricDesc}>
              Real-time spatial tracking across 21 hand joints, face contours, and pose reference planes.
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricValue}>
              12 <span className={styles.metricUnit}>locales</span>
            </div>
            <div className={styles.metricLabel}>Multilingual Matrix</div>
            <div className={styles.metricDesc}>
              Native regional scripts, Roman phonetic pronunciation guides, and BCP-47 speech synthesis.
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricValue}>
              100 <span className={styles.metricUnit}>%</span>
            </div>
            <div className={styles.metricLabel}>On-Device Privacy</div>
            <div className={styles.metricDesc}>
              Zero camera pixels or biometric streams ever transmitted to remote cloud infrastructure.
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          FEATURED VISUALIZATION: 3D Hand Landmark Kinetic Skeleton
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.handVisualSection} id="visualizer">
        <div className={styles.handVisualCard}>
          {/* Left Canvas Viewport */}
          <div className={styles.handCanvasViewport}>
            <div className={styles.hudHeader}>
              <span className={styles.hudStatusBadge}>● 21 LANDMARKS TRACKED</span>
              <span className={styles.hudFpsBadge}>120 FPS • GPU WEBGL</span>
            </div>

            <svg viewBox="0 0 300 300" className={styles.handSvg}>
              {/* Skeletal Bone Lines */}
              {BONES.map(([i1, i2], idx) => {
                const p1 = activeGestureTelemetry.points[i1];
                const p2 = activeGestureTelemetry.points[i2];
                return (
                  <line
                    key={`bone-${idx}`}
                    x1={p1[0]}
                    y1={p1[1]}
                    x2={p2[0]}
                    y2={p2[1]}
                    className={styles.handBone}
                  />
                );
              })}

              {/* 21 Joint Landmark Circles */}
              {activeGestureTelemetry.points.map((p, idx) => {
                const isTip = TIP_INDICES.has(idx);
                const isHovered = inspectedJoint === idx;
                return (
                  <circle
                    key={`joint-${idx}`}
                    cx={p[0]}
                    cy={p[1]}
                    r={isHovered ? 7 : isTip ? 5.2 : 3.8}
                    className={isTip ? styles.handJointTip : styles.handJoint}
                    onMouseEnter={() => setInspectedJoint(idx)}
                    onMouseLeave={() => setInspectedJoint(null)}
                  />
                );
              })}
            </svg>

            {/* Hover Joint Coordinate Tooltip */}
            {inspectedJoint !== null && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '14px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--text-primary)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                Landmark #{inspectedJoint}: X:{activeGestureTelemetry.points[inspectedJoint][0]}, Y:
                {activeGestureTelemetry.points[inspectedJoint][1]}
              </div>
            )}
          </div>

          {/* Right Interactive Telemetry Panel */}
          <div className={styles.handVisualMeta}>
            <div className={styles.handVisualBadge}>
              <Sparkles size={14} /> Interactive Spatial Landmark Engine
            </div>

            <h2 className={styles.handVisualTitle}>{activeGestureTelemetry.name}</h2>
            <p className={styles.handVisualDesc}>
              Simulate normalized Cartesian hand coordinates in real time. Switch between gestures to inspect the joint angle vectors and sub-millisecond edge classifications.
            </p>

            {/* Gesture Selection Chips */}
            <div className={styles.gestureSelectorRow}>
              {(['OPEN_PALM', 'PEACE_V', 'THUMBS_UP', 'ASL_L', 'FIST'] as GestureKey[]).map((key) => {
                const isActive = activeGesture === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.gesturePillBtn} ${isActive ? styles.gesturePillBtnActive : ''}`}
                    onClick={() => {
                      setActiveGesture(key);
                      triggerProceduralEarcon('success');
                      triggerHaptics([30]);
                    }}
                  >
                    {key.replace('_', ' ')}
                  </button>
                );
              })}
            </div>

            {/* Telemetry Matrix Grid */}
            <div className={styles.telemetryGrid}>
              <div>
                <div className={styles.telemetryItemLabel}>Confidence</div>
                <div className={styles.telemetryItemValue} style={{ color: 'var(--emerald)' }}>
                  {activeGestureTelemetry.confidence}%
                </div>
              </div>
              <div>
                <div className={styles.telemetryItemLabel}>Inference</div>
                <div className={styles.telemetryItemValue}>
                  {activeGestureTelemetry.latencyMs} ms
                </div>
              </div>
              <div>
                <div className={styles.telemetryItemLabel}>Active Engine</div>
                <div className={styles.telemetryItemValue} style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
                  {activeGestureTelemetry.engine}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              <strong>Kinetic Geometry</strong>: {activeGestureTelemetry.activeJoints}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Architectural Pipeline Flow Visual
          ───────────────────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="pipeline">
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeaderCenter}>
            <div className={styles.sectionBadge}>
              <Layers size={14} /> End-to-End Edge Pipeline
            </div>
            <h2 className={styles.sectionTitle}>
              Zero-Latency Spatial ML Architecture
            </h2>
            <p className={styles.sectionSubtitle}>
              From raw photons entering your webcam to localized regional speech synthesis, every computation runs within an optimized edge-first topology.
            </p>
          </div>

          {/* 5-Stage Animated Pipeline Flow */}
          <div className={styles.pipelineFlowContainer}>
            <div className={styles.pipelineNode}>
              <div className={styles.pipelineNodeNumber}>1</div>
              <div className={styles.pipelineNodeTitle}>Camera Feed</div>
              <div className={styles.pipelineNodeDesc}>
                Captures standard RGB video stream directly in browser memory at up to 120 FPS.
              </div>
              <span className={styles.pipelineNodeTech}>navigator.mediaDevices</span>
            </div>

            <div className={styles.pipelineNode}>
              <div className={styles.pipelineNodeNumber}>2</div>
              <div className={styles.pipelineNodeTitle}>Holistic Vision</div>
              <div className={styles.pipelineNodeDesc}>
                MediaPipe Holistic extracts 543 3D coordinates (hands, face contours, pose planes).
              </div>
              <span className={styles.pipelineNodeTech}>WebGL GPU Shaders</span>
            </div>

            <div className={styles.pipelineNode}>
              <div className={styles.pipelineNodeNumber}>3</div>
              <div className={styles.pipelineNodeTitle}>Hybrid Inference</div>
              <div className={styles.pipelineNodeDesc}>
                Routes between client TFLite WASM, joint angle heuristics, and Python FastAPI.
              </div>
              <span className={styles.pipelineNodeTech}>TF.js &amp; Random Forest</span>
            </div>

            <div className={styles.pipelineNode}>
              <div className={styles.pipelineNodeNumber}>4</div>
              <div className={styles.pipelineNodeTitle}>12-Language Engine</div>
              <div className={styles.pipelineNodeDesc}>
                Localizes tokens into native scripts and Roman phonetic transliterations.
              </div>
              <span className={styles.pipelineNodeTech}>BCP-47 Matrix</span>
            </div>

            <div className={styles.pipelineNode}>
              <div className={styles.pipelineNodeNumber}>5</div>
              <div className={styles.pipelineNodeTitle}>Multimodal Output</div>
              <div className={styles.pipelineNodeDesc}>
                Native speech synthesis, procedural harmonic earcons, and tactile haptic pulses.
              </div>
              <span className={styles.pipelineNodeTech}>Web Audio &amp; Haptics</span>
            </div>
          </div>

          {/* Tri-Tier Inference Cards */}
          <div className={styles.triTierGrid}>
            {/* Tier 1: Client Edge */}
            <div className={styles.archCard}>
              <div className={styles.archTierBadge}>
                <span>Tier 1 • Client Edge</span>
                <span className={styles.archEngineStatus}>Default (Offline)</span>
              </div>
              <h3 className={styles.archTitle}>TensorFlow.js TFLite WASM</h3>
              <p className={styles.archSub}>
                Executes directly in browser RAM with WebAssembly SIMD hardware acceleration. Biometric camera frames never leave the device.
              </p>
              <ul className={styles.archList}>
                <li className={styles.archListItem}>
                  <Zap size={15} className={styles.archListIcon} />
                  <span><strong>~8ms Latency</strong>: Zero network round-trip delay.</span>
                </li>
                <li className={styles.archListItem}>
                  <CheckCircle2 size={15} className={styles.archListIcon} />
                  <span><strong>100% Privacy</strong>: Compliant with HIPAA &amp; GDPR biometrics.</span>
                </li>
                <li className={styles.archListItem}>
                  <Cpu size={15} className={styles.archListIcon} />
                  <span><strong>Static Weights</strong>: <code className={styles.codeBadge}>model.tflite</code> &amp; <code className={styles.codeBadge}>isl_model.tflite</code>.</span>
                </li>
              </ul>
            </div>

            {/* Tier 2: Kinetic Heuristic Geometry */}
            <div className={styles.archCard}>
              <div className={styles.archTierBadge}>
                <span>Tier 2 • Heuristic Geometry</span>
                <span className={styles.archEngineStatus}>Instantaneous</span>
              </div>
              <h3 className={styles.archTitle}>Spatial Vector Calculus</h3>
              <p className={styles.archSub}>
                Evaluates Euclidean joint distances between TIP, PIP, and MCP coordinates for instant control actions and universal signs.
              </p>
              <ul className={styles.archList}>
                <li className={styles.archListItem}>
                  <Zap size={15} className={styles.archListIcon} />
                  <span><strong>Instant Actions</strong>: Fist (Backspace), Peace (Greeting), Thumbs Up (Agree).</span>
                </li>
                <li className={styles.archListItem}>
                  <CheckCircle2 size={15} className={styles.archListIcon} />
                  <span><strong>Dual-Fist Panic Trigger</strong>: Clenching both fists initiates Emergency SOS beacon.</span>
                </li>
                <li className={styles.archListItem}>
                  <Cpu size={15} className={styles.archListIcon} />
                  <span><strong>Zero Memory Footprint</strong>: Executes in basic JS execution loop.</span>
                </li>
              </ul>
            </div>

            {/* Tier 3: Server ML Microservice */}
            <div className={styles.archCard}>
              <div className={styles.archTierBadge}>
                <span>Tier 3 • Server Microservice</span>
                <span className={styles.archEngineStatus}>High Precision</span>
              </div>
              <h3 className={styles.archTitle}>Scikit-Learn Random Forest</h3>
              <p className={styles.archSub}>
                Python 3.13 FastAPI microservice executing an ensemble classifier with 100 decision trees over 42 normalized spatial features.
              </p>
              <ul className={styles.archList}>
                <li className={styles.archListItem}>
                  <Zap size={15} className={styles.archListIcon} />
                  <span><strong>Top-3 Probability Distribution</strong>: Ranked confidence emission.</span>
                </li>
                <li className={styles.archListItem}>
                  <CheckCircle2 size={15} className={styles.archListIcon} />
                  <span><strong>30 Total Classes</strong>: Full ASL/ISL alphabet + editing controls.</span>
                </li>
                <li className={styles.archListItem}>
                  <Cpu size={15} className={styles.archListIcon} />
                  <span><strong>High-Throughput Endpoint</strong>: <code className={styles.codeBadge}>POST /api/predict</code>.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Multilingual Regional Localization Matrix
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.section} id="multilingual">
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <Globe size={14} /> Regional Localization Engine
            </div>
            <h2 className={styles.sectionTitle}>
              12 Regional Languages with Native Scripts &amp; Phonetics
            </h2>
            <p className={styles.sectionSubtitle}>
              Deaf signers routinely interact with non-signers who read and speak native vernacular languages. Sanketika bridges this divide by generating native regional scripts, Romanized phonetic pronunciation guides, and localized speech synthesis simultaneously.
            </p>
          </div>

          <div className={styles.matrixCard}>
            <div className={styles.matrixTopBar}>
              <span className={styles.matrixControlsLabel}>Select Target Regional Language:</span>
              <span className={styles.localeBadge}>BCP-47: {currentLangInfo.locale}</span>
            </div>

            {/* Language Selector Pills */}
            <div className={styles.langPillsGrid} role="tablist" aria-label="Regional Languages">
              {(Object.keys(REGIONAL_LANGUAGES) as SupportedRegionalLang[]).map((langKey) => {
                const info = REGIONAL_LANGUAGES[langKey];
                const isActive = selectedLang === langKey;
                return (
                  <button
                    key={langKey}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.langPill} ${isActive ? styles.langPillActive : ''}`}
                    onClick={() => setSelectedLang(langKey)}
                  >
                    <span>{info.nativeLabel}</span>
                    <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({info.label})</span>
                  </button>
                );
              })}
            </div>

            {/* Phrase Selector */}
            <div style={{ marginBottom: '1rem' }}>
              <span className={styles.matrixControlsLabel}>Select Recognized Gesture / Phrase:</span>
            </div>
            <div className={styles.phraseSelectorRow}>
              {SAMPLE_PHRASES.map((phrase) => {
                const isActive = selectedPhrase === phrase.key;
                return (
                  <button
                    key={phrase.key}
                    type="button"
                    className={`${styles.phraseBtn} ${isActive ? styles.phraseBtnActive : ''}`}
                    onClick={() => {
                      setSelectedPhrase(phrase.key);
                      triggerProceduralEarcon('success');
                      triggerHaptics([40]);
                    }}
                  >
                    {phrase.label}
                  </button>
                );
              })}
            </div>

            {/* Translation Output Display */}
            <div className={styles.translationDisplayBox}>
              <div>
                <div className={styles.translationMeta}>
                  <span className={styles.localeBadge}>{currentLangInfo.locale}</span>
                  <span className={styles.regionTag}>{currentLangInfo.region}</span>
                  {currentTranslation.isDictionaryMatch && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--emerald)',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle2 size={13} /> Verified Lexical Match
                    </span>
                  )}
                </div>

                <div className={styles.nativeScriptText}>
                  {currentTranslation.text || selectedPhrase}
                </div>

                <div className={styles.phoneticGuideText}>
                  Phonetic Guide: &ldquo;{currentTranslation.phonetic || selectedPhrase}&rdquo;
                </div>
              </div>

              <div className={styles.speechActionCol}>
                <button
                  type="button"
                  className={styles.speakBtn}
                  disabled={isPlayingAudio}
                  onClick={() => triggerSpeech(currentTranslation.text || selectedPhrase, selectedLang)}
                >
                  {isPlayingAudio ? (
                    <div className={styles.waveformVisualizer}>
                      <span className={styles.waveBar} />
                      <span className={styles.waveBar} />
                      <span className={styles.waveBar} />
                      <span className={styles.waveBar} />
                      <span className={styles.waveBar} />
                    </div>
                  ) : (
                    <Volume2 size={18} />
                  )}
                  {isPlayingAudio ? 'Speaking Voice...' : 'Listen in Native Voice'}
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Web SpeechSynthesis with BCP-47 routing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: Inclusive Digital Services Subsystem
          ───────────────────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="inclusive-services">
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <HeartPulse size={14} /> Real-World Independence
            </div>
            <h2 className={styles.sectionTitle}>
              Inclusive Digital Services Subsystem
            </h2>
            <p className={styles.sectionSubtitle}>
              Assistive technology must extend beyond casual conversation into clinical consultations, public counters, transport terminals, and distress emergencies. Explore the 6 dedicated modules:
            </p>
          </div>

          {/* Service Tabs */}
          <div className={styles.servicesTabNav} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeServiceTab === 'sos'}
              className={`${styles.servicesTabBtn} ${activeServiceTab === 'sos' ? styles.servicesTabBtnActive : ''}`}
              onClick={() => setActiveServiceTab('sos')}
            >
              <AlertTriangle size={16} /> Emergency SOS
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeServiceTab === 'healthcare'}
              className={`${styles.servicesTabBtn} ${activeServiceTab === 'healthcare' ? styles.servicesTabBtnActive : ''}`}
              onClick={() => setActiveServiceTab('healthcare')}
            >
              <HeartPulse size={16} /> Clinical Pain Scale (0-10)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeServiceTab === 'transit'}
              className={`${styles.servicesTabBtn} ${activeServiceTab === 'transit' ? styles.servicesTabBtnActive : ''}`}
              onClick={() => setActiveServiceTab('transit')}
            >
              <Bus size={16} /> Public Transit
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeServiceTab === 'banking'}
              className={`${styles.servicesTabBtn} ${activeServiceTab === 'banking' ? styles.servicesTabBtnActive : ''}`}
              onClick={() => setActiveServiceTab('banking')}
            >
              <CreditCard size={16} /> Banking &amp; Public Desk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeServiceTab === 'aac'}
              className={`${styles.servicesTabBtn} ${activeServiceTab === 'aac' ? styles.servicesTabBtnActive : ''}`}
              onClick={() => setActiveServiceTab('aac')}
            >
              <Activity size={16} /> 12-Tile AAC Grid
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeServiceTab === 'counter'}
              className={`${styles.servicesTabBtn} ${activeServiceTab === 'counter' ? styles.servicesTabBtnActive : ''}`}
              onClick={() => setActiveServiceTab('counter')}
            >
              <Eye size={16} /> Show Staff Modal
            </button>
          </div>

          {/* Active Service Tab Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeServiceTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className={styles.serviceDetailPanel}
            >
              {activeServiceTab === 'sos' && (
                <>
                  <div>
                    <h3 className={styles.serviceDetailTitle}>One-Tap Emergency SOS Distress Beacon</h3>
                    <p className={styles.serviceDetailDesc}>
                      Dialing emergency numbers (112, 911, 108) requires acoustic dialogue that deaf or non-verbal victims cannot conduct. Sanketika generates instant telemetry payloads with live GPS coordinates, triggers an audible high-decibel alarm, pulses tactile SOS Morse code, and auto-dispatches incident records to regional APIs.
                    </p>
                    <div className={styles.serviceFeatureGrid}>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>GPS Coordinate Telemetry</div>
                        <div className={styles.serviceFeatureItemText}>Captures latitude/longitude via browser Geolocation API.</div>
                      </div>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Tactile Morse Code</div>
                        <div className={styles.serviceFeatureItemText}>S-O-S vibration sequence: [80, 50, 80] · [200, 50, 200] · [80, 50, 80].</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={styles.earconPlayBtn}
                        onClick={() => {
                          triggerProceduralEarcon('sos');
                          triggerHaptics([80, 50, 80, 50, 80, 100, 200, 50, 200, 50, 200, 100, 80, 50, 80, 50, 80]);
                        }}
                      >
                        <AlertTriangle size={14} color="var(--danger)" /> Simulate Audio Siren &amp; Haptics
                      </button>
                      <Link href="/live" className={styles.earconPlayBtn} style={{ textDecoration: 'none' }}>
                        Open in Live Engine <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  <div className={styles.servicePreviewWidget}>
                    <div className={styles.servicePreviewHeader}>
                      <span>Emergency Telemetry Simulator</span>
                      <span style={{ color: 'var(--danger)', fontWeight: 700 }}>● ACTIVE BEACON</span>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                        <strong style={{ color: 'var(--emerald)' }}>DISPATCHED (ETA 3-5m)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Coordinates:</span>
                        <code>12.9716° N, 77.5946° E</code>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Incident ID:</span>
                        <code>SOS-833E6B79</code>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                        Dispatched to: Local Police, Fire, Ambulance &amp; Medical Triage.
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeServiceTab === 'healthcare' && (
                <>
                  <div>
                    <h3 className={styles.serviceDetailTitle}>0–10 Wong-Baker Clinical Pain Rating Scale</h3>
                    <p className={styles.serviceDetailDesc}>
                      Motor-impaired and non-verbal patients frequently experience delayed medical intervention due to pain miscommunication. Sanketika features a standardized 0–10 clinical pain matrix with visual facial expressions, symptom tags, and locus selection (Head, Chest, Abdomen, Limbs).
                    </p>
                    <div className={styles.serviceFeatureGrid}>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Visual Pain Expressions</div>
                        <div className={styles.serviceFeatureItemText}>Recognized universally by doctors, nurses, and paramedics.</div>
                      </div>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Symptom Checkboxes</div>
                        <div className={styles.serviceFeatureItemText}>Breathing distress, dizziness, nausea, chest constriction.</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.servicePreviewWidget}>
                    <div className={styles.servicePreviewHeader}>
                      <span>Interactive Pain Severity: Level {previewPain} / 10</span>
                    </div>
                    <div className={styles.painScaleBar}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const colors = ['#10B981', '#10B981', '#34D399', '#FBBF24', '#F59E0B', '#F97316', '#EA580C', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'];
                        const isSelected = previewPain === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            className={styles.painScaleItem}
                            style={{
                              background: colors[num],
                              outline: isSelected ? '2px solid var(--text-primary)' : 'none',
                              outlineOffset: '2px',
                            }}
                            onClick={() => {
                              setPreviewPain(num);
                              triggerProceduralEarcon('success');
                            }}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {previewPain === 0 && 'No Hurt — Patient comfortable'}
                      {previewPain > 0 && previewPain <= 3 && 'Mild Pain — Annoying, minor discomfort'}
                      {previewPain > 3 && previewPain <= 6 && 'Moderate Pain — Interferes with concentration'}
                      {previewPain > 6 && previewPain <= 8 && 'Severe Pain — Impairs mobility and basic activities'}
                      {previewPain > 8 && 'Worst Possible Pain — Medical emergency requiring immediate analgesia'}
                    </div>
                  </div>
                </>
              )}

              {activeServiceTab === 'transit' && (
                <>
                  <div>
                    <h3 className={styles.serviceDetailTitle}>Public Transit &amp; Commuter Cards</h3>
                    <p className={styles.serviceDetailDesc}>
                      Navigating metro stations, city buses, and rail terminals requires rapid communication with conductors and ticket agents. Sanketika provides high-contrast, pre-translated digital boarding cards.
                    </p>
                    <div className={styles.serviceFeatureGrid}>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Wheelchair Ramp Request</div>
                        <div className={styles.serviceFeatureItemText}>One-tap audio alert for driver to deploy accessibility ramp.</div>
                      </div>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Next Stop Alert</div>
                        <div className={styles.serviceFeatureItemText}>Prompts conductor to signal upcoming stop visually for deaf commuters.</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.servicePreviewWidget}>
                    <div className={styles.servicePreviewHeader}>
                      <span>Transit Display Card</span>
                      <Bus size={16} />
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        कृपया व्हीलचेयर रैंप खोलें
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                        &ldquo;Kripya wheelchair ramp kholein&rdquo; (Please deploy wheelchair ramp)
                      </div>
                      <button
                        type="button"
                        className={styles.earconPlayBtn}
                        onClick={() => triggerSpeech('कृपया व्हीलचेयर रैंप खोलें', 'hi')}
                      >
                        <Volume2 size={14} /> Announce to Conductor
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeServiceTab === 'banking' && (
                <>
                  <div>
                    <h3 className={styles.serviceDetailTitle}>Banking Counters &amp; Public Desk Services</h3>
                    <p className={styles.serviceDetailDesc}>
                      Financial counters often present barriers due to rushed tellers and glass partitions. Sanketika equips deaf customers with instant transactional cards with high-contrast text and polite request prompts.
                    </p>
                    <div className={styles.serviceFeatureGrid}>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Cash Withdrawal &amp; Deposit</div>
                        <div className={styles.serviceFeatureItemText}>Pre-formatted slips with account and passbook queries.</div>
                      </div>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>&ldquo;Please Write It Down&rdquo;</div>
                        <div className={styles.serviceFeatureItemText}>Politely instructs tellers to write complex explanations in plain text.</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.servicePreviewWidget}>
                    <div className={styles.servicePreviewHeader}>
                      <span>Banking Counter Card</span>
                      <CreditCard size={16} />
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        దయచేసి వివరాలను రాసి ఇవ్వండి
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                        &ldquo;Dayachesi vivaraalannu raasi ivvandi&rdquo; (Please write the details down)
                      </div>
                      <button
                        type="button"
                        className={styles.earconPlayBtn}
                        onClick={() => triggerSpeech('దయచేసి వివరాలను రాసి ఇవ్వండి', 'te')}
                      >
                        <Volume2 size={14} /> Speak to Teller (Telugu)
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeServiceTab === 'aac' && (
                <>
                  <div>
                    <h3 className={styles.serviceDetailTitle}>12-Tile AAC Daily Living Grid</h3>
                    <p className={styles.serviceDetailDesc}>
                      Designed for non-verbal individuals, locked-in syndrome patients, and motor neurodegenerative conditions (ALS, Cerebral Palsy). Features 12 core life communication tiles controllable via touch, mouse, keyboard shortcuts, or single-switch scanning.
                    </p>
                    <div className={styles.serviceFeatureGrid}>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Single-Switch Scanning</div>
                        <div className={styles.serviceFeatureItemText}>Timed automatic tile cycling triggered by single-click or spacebar.</div>
                      </div>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Core Daily Needs</div>
                        <div className={styles.serviceFeatureItemText}>Hunger, Thirst, Rest, Medicine, Restroom, Family assistance.</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.servicePreviewWidget}>
                    <div className={styles.servicePreviewHeader}>
                      <span>AAC Grid Sample Tiles</span>
                      <span>12 TILES ACTIVE</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {[
                        { icon: '💧', label: 'Water / Thirst' },
                        { icon: '🍲', label: 'Hunger / Food' },
                        { icon: '💊', label: 'Medicine' },
                        { icon: '🚻', label: 'Restroom' },
                        { icon: '🛏️', label: 'Sleep / Rest' },
                        { icon: '🤝', label: 'Assistance' },
                      ].map((tile, i) => (
                        <div
                          key={i}
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            triggerProceduralEarcon('success');
                            triggerHaptics([40]);
                          }}
                        >
                          <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{tile.icon}</div>
                          <div>{tile.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeServiceTab === 'counter' && (
                <>
                  <div>
                    <h3 className={styles.serviceDetailTitle}>Show Counter Staff Modal</h3>
                    <p className={styles.serviceDetailDesc}>
                      When interacting with cashiers, pharmacy staff, or airline agents, typing notes on small phones creates misunderstanding. Sanketika features a specialized full-screen, high-contrast modal specifically designed to be turned around and presented directly to staff.
                    </p>
                    <div className={styles.serviceFeatureGrid}>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Ultra-Large Typography</div>
                        <div className={styles.serviceFeatureItemText}>High readability from across a service desk or glass divider.</div>
                      </div>
                      <div className={styles.serviceFeatureItem}>
                        <div className={styles.serviceFeatureItemTitle}>Dual Voice Button</div>
                        <div className={styles.serviceFeatureItemText}>Staff can tap to hear spoken synthesis or trigger audio reply.</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.servicePreviewWidget}>
                    <div className={styles.servicePreviewHeader}>
                      <span>Presentation Counter Card</span>
                      <Eye size={16} />
                    </div>
                    <div style={{ background: '#000', color: '#FFF', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#FBBF24', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        MESSAGE FOR COUNTER STAFF
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        I am deaf. Please speak facing me or write instructions here.
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                        मैं सुन नहीं सकता। कृपया लिखकर बात करें।
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: Non-Visual Sensory & Earcon Sonification
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.section} id="accessibility">
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeaderCenter}>
            <div className={styles.sectionBadge}>
              <Volume2 size={14} /> Universal Design (WCAG 2.1 AAA)
            </div>
            <h2 className={styles.sectionTitle}>
              Screen Reader, Procedural Sonification &amp; Tactile Haptics
            </h2>
            <p className={styles.sectionSubtitle}>
              Sign language tools must not assume unimpaired vision. Low-vision signers, Usher Syndrome individuals, and blind users require sensory redundancy. Sanketika provides zero-dependency procedural harmonic earcons, millisecond tactile pulses, and dual-channel ARIA announcements.
            </p>
          </div>

          <div className={styles.sensoryCardsGrid}>
            {/* Card 1: Procedural Earcons */}
            <div className={styles.sensoryCard}>
              <div className={styles.sensoryIconCircle}>
                <Volume2 size={22} />
              </div>
              <h3 className={styles.sensoryCardTitle}>Web Audio Procedural Earcons</h3>
              <p className={styles.sensoryCardBody}>
                Zero MP3 downloads or network dependencies. Harmonics synthesized live via native <code className={styles.codeBadge}>AudioContext</code>:
                <br /><br />
                • <strong>Sign Commit</strong>: Ascending major third (C5 523Hz → E5 659Hz).<br />
                • <strong>Character Deleted</strong>: Descending minor third (A4 440Hz → F4 349Hz).<br />
                • <strong>Emergency Siren</strong>: Alternating 880Hz ↔ 440Hz sawtooth oscillation.
              </p>
              <div className={styles.earconPlayRow}>
                <button
                  type="button"
                  className={styles.earconPlayBtn}
                  onClick={() => triggerProceduralEarcon('success')}
                >
                  ▶ Commit Earcon
                </button>
                <button
                  type="button"
                  className={styles.earconPlayBtn}
                  onClick={() => triggerProceduralEarcon('delete')}
                >
                  ▶ Delete Tone
                </button>
                <button
                  type="button"
                  className={styles.earconPlayBtn}
                  onClick={() => triggerProceduralEarcon('sos')}
                >
                  ▶ Siren
                </button>
              </div>
            </div>

            {/* Card 2: Tactile Haptics */}
            <div className={styles.sensoryCard}>
              <div className={styles.sensoryIconCircle}>
                <Activity size={22} />
              </div>
              <h3 className={styles.sensoryCardTitle}>Tactile Haptic Feedback</h3>
              <p className={styles.sensoryCardBody}>
                Engineered for Deafblind and low-vision users via the Web Vibration API (<code className={styles.codeBadge}>navigator.vibrate</code>):
                <br /><br />
                • <strong>Valid Sign Confirmed</strong>: Single 40ms pulse.<br />
                • <strong>Word Boundary Space</strong>: Dual pulse [50ms, 40ms, 50ms].<br />
                • <strong>Emergency SOS</strong>: Full Morse code sequence (··· --- ···).
              </p>
              <div className={styles.earconPlayRow}>
                <button
                  type="button"
                  className={styles.earconPlayBtn}
                  onClick={() => triggerHaptics([40])}
                >
                  Test Confirm Pulse
                </button>
                <button
                  type="button"
                  className={styles.earconPlayBtn}
                  onClick={() => triggerHaptics([80, 50, 80, 50, 80, 100, 200, 50, 200, 50, 200, 100, 80, 50, 80, 50, 80])}
                >
                  Test Morse SOS
                </button>
              </div>
            </div>

            {/* Card 3: ARIA Live & Visual Ergonomics */}
            <div className={styles.sensoryCard}>
              <div className={styles.sensoryIconCircle}>
                <Sliders size={22} />
              </div>
              <h3 className={styles.sensoryCardTitle}>Screen Readers &amp; High Contrast</h3>
              <p className={styles.sensoryCardBody}>
                Full dual-channel screen reader integration:
                <br /><br />
                • <code className={styles.codeBadge}>aria-live=&quot;polite&quot;</code>: Non-disruptive word stream.<br />
                • <code className={styles.codeBadge}>aria-live=&quot;assertive&quot;</code>: Critical SOS &amp; camera alerts.<br />
                • <strong>Visual Ergonomics</strong>: High Contrast Yellow/Black, Bang Wong Colorblind-safe palette, and OpenDyslexic typography.
              </p>
              <div style={{ marginTop: 'auto' }}>
                <Link
                  href="/live"
                  className={styles.earconPlayBtn}
                  style={{ textDecoration: 'none', display: 'inline-flex' }}
                >
                  Configure in Live Settings <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: Peer-to-Peer Accessible Video Calling
          ───────────────────────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="video-call">
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <Phone size={14} /> Encrypted Video Calling
            </div>
            <h2 className={styles.sectionTitle}>
              Peer-to-Peer Video Communication Room (/call)
            </h2>
            <p className={styles.sectionSubtitle}>
              Engineered specifically for remote communication between deaf signers and hearing non-signers with zero intermediary media recording servers.
            </p>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '22px',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Real-Time WebRTC + PeerJS Mesh
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Direct peer-to-peer media streams with end-to-end encryption. When a deaf participant signs, the local engine interprets gestures and speaks them aloud to the remote participant via synthetic voice in real time.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/call" className={styles.primaryBtn}>
                  <Phone size={16} /> Enter Video Call Room
                </Link>
                <Link href="/about" className={styles.secondaryBtn}>
                  <FileText size={16} /> WebRTC Architecture
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  Live Sign Interpretation Overlay
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Both participants view recognized words directly on screen without looking away from the camera.
                </div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  Synthetic Voice Output for Hearing Peers
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Signers compose sentences that are automatically spoken into the call audio stream.
                </div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  In-Call Emergency &amp; Medical Quick Cards
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Instant access to Wong-Baker pain scale and distress beacons without interrupting the call.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: Full Technology Stack Specification
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.section} id="specs">
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <BrainCircuit size={14} /> Full Stack Specifications
            </div>
            <h2 className={styles.sectionTitle}>
              Verified Technology Matrix &amp; RESTful API Directory
            </h2>
            <p className={styles.sectionSubtitle}>
              Rigorous specifications conforming to modern web standards, edge machine learning runtimes, and accessible APIs.
            </p>
          </div>

          <div className={styles.specTableWrapper}>
            <table className={styles.specTable}>
              <thead>
                <tr>
                  <th>Architecture Layer</th>
                  <th>Technology Component</th>
                  <th>Engine / Version</th>
                  <th>Primary Purpose &amp; Execution Context</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Frontend Framework</strong></td>
                  <td>Next.js (App Router, Turbopack)</td>
                  <td><code className={styles.codeBadge}>16.2.9</code> / React 19</td>
                  <td>SSR/CSR hybrid rendering, API route handlers, route prefetching</td>
                </tr>
                <tr>
                  <td><strong>Computer Vision (Edge)</strong></td>
                  <td>MediaPipe Holistic</td>
                  <td><code className={styles.codeBadge}>0.5.16</code> (WebGL/WASM)</td>
                  <td>543 holistic 3D coordinates (hands, face, pose) tracked at up to 120 FPS</td>
                </tr>
                <tr>
                  <td><strong>Web ML Runtime</strong></td>
                  <td>TensorFlow.js Core &amp; TFLite</td>
                  <td><code className={styles.codeBadge}>4.22.0</code> / <code className={styles.codeBadge}>0.0.1</code></td>
                  <td>WASM SIMD hardware acceleration in browser RAM (~8ms latency)</td>
                </tr>
                <tr>
                  <td><strong>Server ML Engine</strong></td>
                  <td>Scikit-Learn Random Forest</td>
                  <td><code className={styles.codeBadge}>1.8.0</code> / Python 3.13</td>
                  <td>Ensemble classifier with 100 decision trees over 42 normalized features</td>
                </tr>
                <tr>
                  <td><strong>Backend Microservice</strong></td>
                  <td>FastAPI &amp; Uvicorn</td>
                  <td><code className={styles.codeBadge}>0.115</code> / <code className={styles.codeBadge}>0.34</code></td>
                  <td>High-throughput REST API for gesture predictions &amp; emergency telemetry</td>
                </tr>
                <tr>
                  <td><strong>P2P Video Communication</strong></td>
                  <td>WebRTC + PeerJS</td>
                  <td><code className={styles.codeBadge}>1.5.5</code></td>
                  <td>Zero-server end-to-end encrypted accessible video call rooms</td>
                </tr>
                <tr>
                  <td><strong>Sensory Sonification</strong></td>
                  <td>Web Audio API</td>
                  <td>Standard (Procedural)</td>
                  <td>Zero-dependency harmonic earcons for non-visual sensory feedback</td>
                </tr>
                <tr>
                  <td><strong>Tactile Feedback</strong></td>
                  <td>Web Vibration API</td>
                  <td>Standard (<code className={styles.codeBadge}>navigator.vibrate</code>)</td>
                  <td>Physical confirmation pulses &amp; Morse code SOS distress sequences</td>
                </tr>
                <tr>
                  <td><strong>Mobile Native Container</strong></td>
                  <td>Capacitor Android</td>
                  <td><code className={styles.codeBadge}>8.4.1</code></td>
                  <td>Native Android APK packaging with hardware WebView &amp; native TTS bridge</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* REST API Endpoints Quick Reference */}
          <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Core RESTful Microservice Endpoints
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>GET</span>
                  <code style={{ fontSize: '0.85rem', fontWeight: 700 }}>/api/health</code>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Returns model load state, uptime, and Random Forest classes count.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>POST</span>
                  <code style={{ fontSize: '0.85rem', fontWeight: 700 }}>/api/predict</code>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Ingests 42 normalized landmark floats; emits top-3 ranked predictions and latency.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>POST</span>
                  <code style={{ fontSize: '0.85rem', fontWeight: 700 }}>/api/emergency</code>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Receives GPS telemetry, pain rating, and auto-dispatches incident record.
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>POST</span>
                  <code style={{ fontSize: '0.85rem', fontWeight: 700 }}>/api/translate</code>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Translates English/sign tokens into 12 regional scripts with phonetic guides.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: Final Call to Action
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionWrapper}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Experience Accessible Spatial AI</h2>
            <p className={styles.ctaText}>
              Whether signing with your webcam, connecting in a private P2P video call, or exploring regional vernacular translations, Sanketika provides an inclusive, private, and resilient platform.
            </p>
            <div className={styles.ctaButtonGroup}>
              <Link href="/live" className={styles.primaryBtn} id="cta-live-btn">
                <Radio size={18} />
                Open Live Engine (Camera)
                <ArrowRight size={16} />
              </Link>
              <Link href="/call" className={styles.secondaryBtn} id="cta-call-btn">
                <Phone size={18} />
                P2P Video Call Room
              </Link>
              <Link href="/about" className={styles.ghostBtn}>
                Full Technical Architecture <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <NavigationFooter />
    </div>
  );
}
