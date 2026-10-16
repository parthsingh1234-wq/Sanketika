'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Heart, Terminal } from 'lucide-react';

export default function NavigationFooter() {
  return (
    <footer className="landing-footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', padding: '4rem 2rem 2rem' }}>
      <div className="footer-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Accessible Sign AI & Inclusive Communication
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Helping people communicate with more confidence through sign recognition, regional-language speech, captions, and inclusive digital services.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/live"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '99px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
               boxShadow: '0 8px 25px var(--accent-glow)'
            }}
          >
            Launch Live Engine <ArrowRight size={16} />
          </Link>
          <Link
            href="/call"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              padding: '0.75rem 2rem',
              borderRadius: '99px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Video Call Room
          </Link>
        </div>
      </div>

      <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link>
        <Link href="/live" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Live Engine</Link>
        <Link href="/call" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Video Call</Link>
        <Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>About Architecture</Link>
        <Link href="/motives" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Motives & Mission</Link>
        <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Guarantee</Link>
        <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link>
      </div>

      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '2rem auto 0', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--accent)" />
          <span>Built with accessibility in mind • On-device fallback available • Please confirm important translations</span>
        </div>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Sanketika (संकेतिका) Systems. All rights reserved.</p>
      </div>
    </footer>
  );
}
