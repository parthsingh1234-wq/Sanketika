import NavigationHeader from '@/components/NavigationHeader';
import NavigationFooter from '@/components/NavigationFooter';
import Link from 'next/link';
import { Target, Users2, Sparkles, ArrowRight } from 'lucide-react';

export default function MotivesPage() {
  return (
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <NavigationHeader showBackHome />
      
      <main className="content-wrapper" style={{ flex: 1, padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Our Motives & Mission
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Accessibility without compromise. Designing technology that adapts to humans, rather than forcing humans to adapt to hardware bottlenecks.
        </p>

        <div className="prose" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <Users2 size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Empowering Over 70 Million Signers</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              More than 70 million deaf individuals use sign language as their primary mode of expression. Despite rapid advances in voice assistants and speech-to-text, sign language technology has lagged behind. Our primary motive is democratizing seamless communication between signers and non-signers across both American Sign Language (ASL) and Indian Sign Language (ISL).
            </p>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <Target size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Independence in Everyday Digital Services</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Independent access to public counters—metro ticketing, pharmacy counters, bank teller desks, and emergency departments—remains fraught with anxiety for people with speech and hearing impairments. Sanketika (संकेतिका) provides specialized Inclusive Digital Services panels with high-contrast customer-counter views that eliminate friction in public life.
            </p>
          </div>

          <div className="team-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              <Sparkles size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>The Kinesthetic Future of Computing</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Keyboards and mice are arbitrary artificial constraints. We believe your hands are the ultimate universal controller. By combining raw computer vision with machine learning models, we are pioneering a spatial computing landscape where every movement is natural, expressive, and accessible.
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
            Try Live Recognition <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <NavigationFooter />
    </div>
  );
}
