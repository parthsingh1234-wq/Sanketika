'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Phone, Info, Target, Users, Shield, FileText, ArrowRight, Zap, Menu, X } from 'lucide-react';
import { checkBackendHealth, type BackendHealth } from '@/utils/backendClient';

export default function NavigationHeader({ showBackHome = false }: { showBackHome?: boolean }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  useEffect(() => {
    checkBackendHealth().then(setBackendHealth);
    const interval = setInterval(() => {
      checkBackendHealth().then(setBackendHealth);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/live', label: 'Live Engine', icon: <Radio size={14} /> },
    { href: '/call', label: 'Video Call', icon: <Phone size={14} /> },
    { href: '/about', label: 'About', icon: <Info size={14} /> },
    { href: '/motives', label: 'Motives', icon: <Target size={14} /> },
  ];

  return (
    <nav className="app-nav" aria-label="Main navigation">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="brand-logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Sanketika <span style={{ fontSize: '0.82em', opacity: 0.9 }}>(संकेतिका)</span></span>
            <span style={{ fontSize: '0.65rem', background: 'var(--emerald-soft, rgba(16, 185, 129, 0.15))', color: 'var(--emerald, #10B981)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              Assistive Tech
            </span>
          </div>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="nav-links">
        {navLinks.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? 'nav-link active' : 'nav-link'}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}

        {/* Backend Status Badge */}
        <div
          title={
            backendHealth?.status === 'online'
              ? `Connected to FastAPI Backend (Python 3.13 / ASL_model.p with ${backendHealth.classesCount} classes)`
              : 'Edge Fallback Mode Active (Client-Side WebGL Inference)'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            padding: '3px 10px',
            borderRadius: '99px',
            background: backendHealth?.status === 'online' ? 'var(--emerald-soft)' : 'var(--accent-soft)',
            border: `1px solid ${backendHealth?.status === 'online' ? 'rgba(16, 185, 129, 0.4)' : 'var(--accent-muted)'}`,
            color: backendHealth?.status === 'online' ? 'var(--emerald)' : 'var(--accent)',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: backendHealth?.status === 'online' ? 'var(--emerald)' : 'var(--accent)',
              boxShadow: backendHealth?.status === 'online' ? '0 0 8px #10B981' : 'none',
            }}
          />
          {backendHealth?.status === 'online' ? 'Online recognition' : 'On-device mode'}
        </div>

        {pathname !== '/live' && (
          <Link
            href="/live"
            style={{
              background: 'var(--text-primary)',
              color: 'var(--bg-base)',
              padding: '0.5rem 1.25rem',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              marginLeft: '0.5rem'
            }}
          >
            Launch Engine <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Navigation Menu"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          padding: '8px'
         }}
         aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
           className="mobile-nav-drawer"
           role="dialog"
           aria-label="Mobile navigation"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
               className={pathname === link.href ? 'nav-link active' : 'nav-link'}
               aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <Link
            href="/live"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              background: 'var(--accent)',
              color: '#fff',
              padding: '0.75rem',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            Launch Live Engine <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </nav>
  );
}
