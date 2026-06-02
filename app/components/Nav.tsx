'use client';

import { useState, useEffect, useRef } from 'react';
import { useScrollY, scrollToId } from './hooks';
import { Arrow } from './Reveal';

/* Items affichés directement dans la barre */
const NAV_PRIMARY = [
  { id: 'soins',    label: 'Soins' },
  { id: 'boutique', label: 'Boutique' },
  { id: 'contact',  label: 'Contact' },
];

/* Items regroupés dans le menu déroulant "Explorer" */
const NAV_DROPDOWN = [
  { id: 'philosophie', label: 'Manifeste' },
  { id: 'maladies',   label: 'Maladies traitées' },
  { id: 'centres',    label: 'Nos centres' },
  { id: 'galerie',    label: 'Galerie' },
  { id: 'journal',    label: 'Journal' },
];

const NAV_LINK_ITEMS = [
  { href: '/almanach', label: "L'Almanach" },
];

function Logo({ color = 'currentColor' }: { color?: string }) {
  return (
    <a
      href="#top"
      onClick={(e) => { e.preventDefault(); scrollToId('top'); }}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, textDecoration: 'none' }}
    >
      <span style={{ fontFamily: 'var(--serif)', fontSize: 24, letterSpacing: '-0.02em', color, fontWeight: 400, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 2 }}>
        No Limit
        <span style={{ color: 'var(--terracotta)', fontStyle: 'italic', fontWeight: 300 }}>.</span>
      </span>
      <span style={{ fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: color === 'var(--ink)' ? 'var(--muted)' : 'rgba(245,241,234,0.6)', fontWeight: 400, lineHeight: 1 }}>
        Solution Santé Nature
      </span>
    </a>
  );
}

function Dropdown({ solid, onNav }: { solid: boolean; onNav?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          fontSize: 13, fontWeight: 500, letterSpacing: '0.04em',
          color: solid ? 'var(--ink-soft)' : 'rgba(245,241,234,0.92)',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', gap: 5, transition: 'color .3s',
        }}
      >
        Explorer
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--cream)', borderRadius: 12, boxShadow: '0 16px 48px -8px rgba(26,26,26,0.18)',
          border: '1px solid rgba(26,26,26,0.07)', minWidth: 200, overflow: 'hidden',
          animation: 'slideUp .2s ease',
        }}>
          {NAV_DROPDOWN.map((it) => (
            <a key={it.id} href={`#${it.id}`}
              onClick={(e) => { e.preventDefault(); scrollToId(it.id); setOpen(false); onNav?.(); }}
              style={{
                display: 'block', padding: '11px 20px', fontSize: 13, fontWeight: 500,
                color: 'var(--ink-soft)', letterSpacing: '0.03em',
                borderBottom: '1px solid rgba(26,26,26,0.05)', transition: 'background .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {it.label}
            </a>
          ))}
          {NAV_LINK_ITEMS.map((it) => (
            <a key={it.href} href={it.href}
              style={{ display: 'block', padding: '11px 20px', fontSize: 13, fontWeight: 500, fontStyle: 'italic', color: 'var(--terracotta)', letterSpacing: '0.03em', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {it.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Nav({ onBook }: { onBook: () => void }) {
  const y = useScrollY();
  const solid = y > 60;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const allMobileItems = [...NAV_PRIMARY, ...NAV_DROPDOWN];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all .45s cubic-bezier(.2,.7,.2,1)',
        padding: solid ? '12px 0' : '22px 0',
        background: solid ? 'rgba(245,241,234,0.82)' : 'transparent',
        backdropFilter: solid ? 'blur(18px) saturate(140%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(18px) saturate(140%)' : 'none',
        borderBottom: solid ? '1px solid rgba(26,26,26,0.06)' : '1px solid transparent',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <Logo color={solid ? 'var(--ink)' : 'var(--cream)'} />

          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="nav-desktop">
            <Dropdown solid={solid} />
            {NAV_PRIMARY.map((it) => (
              <a key={it.id} href={`#${it.id}`}
                onClick={(e) => { e.preventDefault(); scrollToId(it.id); }}
                style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', color: solid ? 'var(--ink-soft)' : 'rgba(245,241,234,0.92)', transition: 'color .3s ease' }}>
                {it.label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={onBook} className="btn btn-primary nav-book-btn" style={{ fontSize: 13, padding: '12px 22px' }} aria-label="Réserver">
              Réserver <Arrow />
            </button>
            <button onClick={() => setMenuOpen(v => !v)} aria-label="Menu" className="nav-burger" style={{
              width: 44, height: 44, borderRadius: '50%', border: '1px solid', display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5,
              borderColor: solid ? 'rgba(26,26,26,0.2)' : 'rgba(245,241,234,0.4)',
            }}>
              <span style={{ width: 18, height: 1, background: solid ? 'var(--ink)' : 'var(--cream)', transition: 'transform .3s, opacity .3s', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
              <span style={{ width: 18, height: 1, background: solid ? 'var(--ink)' : 'var(--cream)', transition: 'opacity .3s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width: 18, height: 1, background: solid ? 'var(--ink)' : 'var(--cream)', transition: 'transform .3s, opacity .3s', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'var(--ink)', color: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(24px,6vw,80px)', animation: 'fadeIn .3s ease' }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 28, right: 28, width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(245,241,234,0.3)', color: 'var(--cream)' }} aria-label="Fermer">✕</button>

          <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,241,234,0.4)', marginBottom: 32 }}>
            Solution Santé Nature
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allMobileItems.map((it, idx) => (
              <a key={it.id} href={`#${it.id}`}
                onClick={(e) => { e.preventDefault(); scrollToId(it.id); setMenuOpen(false); }}
                style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 8vw, 64px)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--cream)', opacity: 0.9, display: 'block', lineHeight: 1.15, animationDelay: `${idx * 50}ms`, animation: 'slideUp .5s ease both' }}>
                {it.label}
              </a>
            ))}
            {NAV_LINK_ITEMS.map((it, idx) => (
              <a key={it.href} href={it.href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 5.5vw, 50px)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--terracotta)', display: 'block', lineHeight: 1.15, fontStyle: 'italic', animationDelay: `${(allMobileItems.length + idx) * 50}ms`, animation: 'slideUp .5s ease both' }}>
                {it.label}
              </a>
            ))}
          </nav>

          <button onClick={() => { onBook(); setMenuOpen(false); }} className="btn btn-primary" style={{ marginTop: 40, alignSelf: 'flex-start' }}>
            Réserver une séance <Arrow />
          </button>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex; }
        .nav-burger { display: none !important; }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
          .nav-book-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
