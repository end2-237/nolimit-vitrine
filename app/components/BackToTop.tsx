'use client';

/** Lien discret « remonter en haut », pensé pour le bas de page (footer). */
export function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Remonter en haut de la page"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 16px',
        borderRadius: 999,
        border: '1px solid rgba(245,241,234,0.2)',
        background: 'transparent',
        color: 'rgba(245,241,234,0.7)',
        fontFamily: 'var(--sans)',
        fontSize: 12,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        transition: 'color .3s, border-color .3s, background .3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--cream)';
        e.currentTarget.style.borderColor = 'rgba(245,241,234,0.5)';
        e.currentTarget.style.background = 'rgba(245,241,234,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(245,241,234,0.7)';
        e.currentTarget.style.borderColor = 'rgba(245,241,234,0.2)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M3 8L8 3L13 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Haut de page
    </button>
  );
}
