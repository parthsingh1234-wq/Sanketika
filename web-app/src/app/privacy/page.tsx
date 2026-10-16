import NavigationHeader from '@/components/NavigationHeader';
import NavigationFooter from '@/components/NavigationFooter';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, ArrowRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <NavigationHeader showBackHome />
      
      <main className="content-wrapper" style={{ flex: 1, padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Privacy Architecture & Guarantees
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Privacy is not an afterthought in Sanketika (संकेतिका); it is an architectural foundation. Here is exactly how your biometric video stream is protected.
        </p>

        <div className="prose" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <Lock size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Absolute Edge Processing Guarantee</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Sanketika (संकेतिका) utilizes client-side WebGL acceleration and local MediaPipe inference. This architectural guarantee means your raw camera feed, biometric features, and physical motion never leave the physical RAM of your local device.
            </p>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <EyeOff size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Zero Video Transmission Protocol</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              We do not transmit, record, or store video feeds on external servers. When optional server-side prediction is enabled via our Python backend API, only numerical coordinate vectors (normalized x, y landmark floats) are exchanged—never images or video pixels.
            </p>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#f59e0b' }}>
              <ShieldCheck size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Emergency SOS Telemetry Consent</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              When an explicit Emergency SOS beacon is dispatched by user action, location coordinates and distress level are securely transmitted only to authorized local first-responder services, with explicit visual confirmation in the UI.
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
            Enter Live Engine <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <NavigationFooter />
    </div>
  );
}
