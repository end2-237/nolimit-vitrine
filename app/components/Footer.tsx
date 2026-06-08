import React from 'react';

function FooterCol({ title, items }: { title: string; items: (string | React.ReactNode)[] }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, fontWeight: 300, color: 'var(--sage-light)', marginBottom: 18 }}>— {title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 14, lineHeight: 1.6 }}>
            {typeof it === 'string' ? (
              <a href="#" style={{ color: 'rgba(245,241,234,0.78)', transition: 'color .3s' }}>{it}</a>
            ) : (
              <span style={{ color: 'rgba(245,241,234,0.78)' }}>{it}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '100px 0 40px' }}>
      <div className="container">

        {/* ── Branding principal ──────────────────────────────────── */}
        <div style={{ paddingBottom: 60, borderBottom: '1px solid rgba(245,241,234,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 40px)', flexWrap: 'wrap' }}>
            <img
              src="/nol.png"
              alt="No Limit logo"
              style={{ width: 'clamp(56px, 7vw, 96px)', height: 'clamp(56px, 7vw, 96px)', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9, flexShrink: 0 }}
            />
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(52px, 12vw, 200px)', letterSpacing: '-0.04em', lineHeight: 0.9, fontWeight: 300, color: 'var(--cream)' }}>
                No&nbsp;Limit<span style={{ color: 'var(--terracotta)' }}>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(13px, 1.4vw, 18px)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage-light)' }}>
                  Solution Santé Nature
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(245,241,234,0.3)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(11px, 1.1vw, 14px)', color: 'rgba(245,241,234,0.55)', letterSpacing: '0.06em' }}>
                  Douala · Yaoundé · Bafoussam
                </span>
              </div>
            </div>
          </div>

          {/* Bandeau disponibilité */}
          <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 24, background: 'rgba(245,241,234,0.06)', border: '1px solid rgba(245,241,234,0.12)', borderRadius: 12, padding: '16px 28px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sage-light)', flexShrink: 0, display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--cream)' }}>
                <strong>Détail</strong>
                <span style={{ color: 'rgba(245,241,234,0.65)', fontWeight: 400 }}> — disponible pour les consommateurs</span>
              </span>
            </div>
            <span style={{ width: 1, height: 20, background: 'rgba(245,241,234,0.15)', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--cream)' }}>
                <strong>Gros</strong>
                <span style={{ color: 'rgba(245,241,234,0.65)', fontWeight: 400 }}> — disponible pour les revendeurs</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Colonnes liens ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, paddingTop: 60 }} className="footer-grid">
          <FooterCol title="Liens rapides" items={['Accueil', 'Manifeste', 'Nos centres', 'Notre équipe', 'Produits & services', 'Journal', 'Réserver un bilan', <a href="/almanach" style={{ color: 'var(--terracotta)', fontStyle: 'italic', transition: 'color .3s' }}>L&apos;Almanach</a>]} />
          <FooterCol title="Produits & services" items={['Compléments alimentaires', 'Ampoules buvables', 'Phytothérapie naturelle', 'Massage des méridiens', 'Bilan de santé (Check-up)', 'Alcalinisation']} />
          <FooterCol title="Informations" items={['Lun–Sam : 09h–19h (Douala/Yaoundé)', 'Lun–Sam : 08h–17h30 (Bafoussam)', 'Médecin : 09h–18h', 'Recrutement de jeunes', 'No Limit Group — Holding', 'Contact & commandes']} />
          <FooterCol
            title="Nos centres"
            items={[
              <><strong style={{ color: 'var(--cream)' }}>Douala</strong> — Cameroun</>,
              <><strong style={{ color: 'var(--cream)' }}>Yaoundé</strong> — Cameroun</>,
              <><strong style={{ color: 'var(--cream)' }}>Bafoussam</strong> — Cameroun</>,
            ]}
          />
        </div>

        {/* ── Copyright ──────────────────────────────────────────── */}
        <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px solid rgba(245,241,234,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 20 }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'rgba(245,241,234,0.55)' }}>
            © 2026 No Limit Solutions Santé Nature — Tous droits réservés · No Limit Group
          </span>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'rgba(245,241,234,0.78)' }}>
            La nature a une réponse. Nous aidons à la trouver.
          </span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'rgba(245,241,234,0.55)' }}>
            Direction artistique &nbsp;·&nbsp; Studio No&nbsp;Limit
          </span>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) { .footer-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
