'use client';

import { useScrollY } from './hooks';
import { useConfig, waLink } from '@/lib/useConfig';
import { WhatsAppIcon } from './CtaPair';

const WA_MESSAGE =
  '2356 Bonjour Docteur, je souhaite des informations sur vos solutions naturelles.';

export function StickyCTA({ onBook }: { onBook: () => void }) {
  const y = useScrollY();
  const config = useConfig();
  const number = config.whatsapp_default ?? '237699114722';
  const bookingEnabled = config.booking_enabled !== 'false';
  const wa = waLink(number, WA_MESSAGE);
  const visible = y > 500;

  return (
    <>
      {/* Barre persistante mobile */}
      <div className="sticky-cta">
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{ fontSize: 13 }}>
          <WhatsAppIcon size={18} /> Parler au docteur
        </a>
        {bookingEnabled && (
          <button onClick={onBook} className="btn btn-outline" style={{ fontSize: 13, flex: '0 0 auto' }}>
            Réserver
          </button>
        )}
      </div>

      {/* Actions flottantes desktop */}
      <div
        className="sticky-fab"
        style={{
          position: 'fixed',
          bottom: 'clamp(16px,3vw,28px)',
          right: 'clamp(16px,3vw,28px)',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'flex-end',
          transform: visible ? 'translateY(0)' : 'translateY(120px)',
          opacity: visible ? 1 : 0,
          transition: 'all .5s cubic-bezier(.2,.7,.2,1)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Remonter en haut"
          style={{
            width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)',
            border: '1px solid rgba(12,34,24,0.12)', color: 'var(--ink)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M3 8L8 3L13 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa"
          style={{ padding: '16px 24px', fontSize: 13 }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 2s infinite' }} />
          <WhatsAppIcon size={18} /> Parler au docteur
        </a>
      </div>

      <style>{`
        .sticky-fab { display: flex; }
        @media (max-width: 760px) { .sticky-fab { display: none !important; } }
      `}</style>
    </>
  );
}
