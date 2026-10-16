import NavigationHeader from '@/components/NavigationHeader';
import NavigationFooter from '@/components/NavigationFooter';
import Link from 'next/link';
import { FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <NavigationHeader showBackHome />
      
      <main className="content-wrapper" style={{ flex: 1, padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Terms of Service & Usage License
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Terms governing your access to the Sanketika (संकेतिका) spatial recognition engine and assistive communication services.
        </p>

        <div className="prose" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <CheckCircle size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              By accessing Sanketika (संकेतिका), you agree to comply with these terms of service. This software is provided to enhance communication accessibility and spatial human-computer interaction.
            </p>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <FileText size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>2. Permitted Capabilities</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              You are granted a non-exclusive license to utilize the spatial inference engine, regional translation services, and inclusive communication tools for personal, educational, clinical, and accessibility applications.
            </p>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#f59e0b' }}>
              <AlertCircle size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>3. Emergency Dispatch Notice</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The Emergency SOS feature provides assistive telemetry and beaconing. While engineered for rapid emergency logging, it complements, rather than replaces, local official emergency telephone lines (e.g. 911, 112, 108).
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
            Launch Live Engine <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <NavigationFooter />
    </div>
  );
}
