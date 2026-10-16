# Sanketika (संकेतिका) — Assistive Technology & Accessibility Suite

Solutions improving accessibility, communication, and independent access to services for persons with disabilities.

📖 **Full technical specification & ML architecture:** [DOCUMENTATION.md](../DOCUMENTATION.md)

## 🌟 Assistive Technology & Inclusive Features

### 1. Sign Language Recognition (ASL & ISL)
- **Real-time kinetic hand & body landmark tracking** powered by MediaPipe Holistic & TensorFlow.js / TFLite.
- **American Sign Language (ASL)** and **Indian Sign Language (ISL)** dictionaries.
- **Kinetic Custom Gestures**: Support for one-hand and two-hand spatial computing gestures.

### 2. Screen Reader & Non-Visual Accessibility
- **Acoustic Earcon Sonification**: Zero-dependency Web Audio API sound synthesis providing audible melodic cues when signs are registered (`C5 -> E5`), characters deleted, sentences cleared, and modes cycled.
- **Tactile Haptic Feedback**: `navigator.vibrate` haptic pulses on recognition and international Morse code SOS alert.
- **ARIA Live Regions**: Screen reader announcements with `polite` and `assertive` priorities for NVDA, JAWS, VoiceOver, and TalkBack.
- **Visual Accessibility Customizer (`Alt + A`)**:
  - High Contrast Yellow on Black (WCAG 2.2 AAA standard for low-vision)
  - High Contrast White on Black
  - Colorblind-safe palette (Wong 2011 standard)
  - Dyslexia-friendly typography toggle
  - Text zoom scaling (100% to 175%)

### 3. Regional Language Localization (12 Languages)
- Real-time translation and offline fallback dictionary for:
  - **Hindi (हिन्दी)**
  - **Tamil (தமிழ்)**
  - **Telugu (తెలుగు)**
  - **Bengali (বাংলা)**
  - **Marathi (मराठी)**
  - **Kannada (ಕನ್ನಡ)**
  - **Gujarati (ગુજરાતી)**
  - **Malayalam (മലയാളം)**
  - **Punjabi (ਪੰਜਾਬੀ)**
  - **Spanish (Español)**
  - **French (Français)**
  - **English (Native)**
- Native script display, phonetic Roman transliteration guides, and localized SpeechSynthesis.

### 4. Inclusive Digital Services Communicator & AAC Hub
- **Emergency SOS & Safety**: Real-time distress siren, GPS coordinate beacon, and distress cards in regional languages.
- **Healthcare & Hospital Consultation**: Interactive 0–10 Wong-Baker Clinical Pain Scale with visual facial expressions and symptom cards.
- **Public Transit & Transport**: One-tap route verification, destination inquiries, and wheelchair ramp boarding requests.
- **Banking & Essential Services**: Teller communication cards for cash withdrawal, passbook updates, and balance checks.
- **Augmentative and Alternative Communication (AAC) Grid**: 12 core daily living tiles with single-switch accessibility scanning mode.
- **Show Counter Staff Full-Screen View**: High-contrast, large-format modal for presenting clear messages directly to tellers, doctors, and bus drivers with regional voice output.

---

## ⌨️ Accessibility Keyboard Shortcuts

| Shortcut | Function |
|---|---|
| `Alt + S` | Speak sentence aloud in chosen regional language |
| `Alt + C` | Clear sentence and canvas |
| `Alt + M` | Cycle detection modes (ASL ↔ ISL ↔ Custom ↔ Services) |
| `Alt + E` | Trigger Emergency SOS Panic Alert |
| `Alt + A` | Open Accessibility & Sensory Settings Modal |
| `Space` | Start / Pause video detection |

---

## 🧪 Automated Testing

Run the automated test suite verifying regional languages, screen reader sonification, and inclusive service cards:

```bash
npm test
```

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

