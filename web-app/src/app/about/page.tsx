import NavigationHeader from '@/components/NavigationHeader';
import NavigationFooter from '@/components/NavigationFooter';
import Link from 'next/link';
import { ShieldCheck, Cpu, Globe, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <NavigationHeader showBackHome />
      
      <main className="content-wrapper" style={{ flex: 1, padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          About Sanketika (संकेतिका) Architecture
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Sanketika (संकेतिका) is an assistive technology and spatial computing platform engineered to bridge communication gaps for deaf, hard-of-hearing, non-verbal, and motor-impaired individuals across the globe.
        </p>

        <div className="prose" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <Cpu size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Dual-Engine Machine Learning Pipeline</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Our platform operates on a coordinated dual-engine architecture:
            </p>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li><strong>Python 3.13 FastAPI Backend:</strong> Runs high-precision Scikit-Learn ensemble inference on <code>ASL_model.p</code> (Random Forest with 100 estimators), providing server-grade probability distributions, top predictions, and API routing.</li>
              <li><strong>Client-Side WebGL Engine:</strong> Employs TensorFlow.js and MediaPipe directly in the browser for 120 FPS edge tracking with zero server transmission, guaranteeing absolute user privacy.</li>
            </ul>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <Globe size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Regional Languages & Multilingual AAC</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Recognizing that sign language and disability services must not be limited to English, Sanketika (संकेतिका) incorporates 12 regional languages: Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Gujarati, Malayalam, Punjabi, Spanish, French, and English, each equipped with native scripts, phonetic Roman guides, and localized speech synthesis.
            </p>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#f59e0b' }}>
              <Heart size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Inclusive Digital Services & Safety</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              From one-tap Emergency SOS panic beacons that stream GPS coordinates to medical dispatchers, to the Wong-Baker Pain Rating Scale (0–10) and single-switch scanning for severe motor impairments, Sanketika (संकेतिका) is built for real-world independence.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link
            href="/live"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              padding: '0.85rem 2.5rem',
              borderRadius: '99px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Experience Live Engine <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <NavigationFooter />
    </div>
  );
}
