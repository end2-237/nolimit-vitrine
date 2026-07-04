'use client';

import { Reveal } from './Reveal';
import { useConfig, waLink } from '@/lib/useConfig';
import { WhatsAppIcon } from './CtaPair';

const CENTRES: { key: string; label: string }[] = [
  { key: 'whatsapp_douala', label: 'Douala' },
  { key: 'whatsapp_yaounde', label: 'Yaoundé' },
  { key: 'whatsapp_bafoussam', label: 'Bafoussam' },
];

/**
 * Section « Parler à notre médecin » — sélection du centre → WhatsApp.
 * Déplacée en bas de page (CTA de conversion final), retirée du hero.
 */
export function DoctorCTA({ onBook }: { onBook: () => void }) {
  const config = useConfig();
  const number = config.whatsapp_default ?? '237699114722';
  const ratingLabel = config.hero_rating_label ?? 'Recommandé par nos patients';
  const ctaTitle = config.hero_cta_title ?? 'Parlez à notre médecin maintenant';
  const ctaSubtitle = config.hero_cta_subtitle ?? 'Choisissez votre centre, on vous répond sur WhatsApp en quelques minutes.';
  const bookLabel = config.hero_book_label ?? 'Ou réserver un bilan en centre';

  return (
    <section id="parler-medecin" style={{ padding: 'var(--sec-pad) 0', background: 'var(--cream-warm)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <Reveal>
          <div className="card-light" style={{ padding: 'clamp(26px, 3vw, 40px)', maxWidth: 560, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ color: 'var(--gold)', fontSize: 16, letterSpacing: 1 }}>★★★★★</span>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{ratingLabel}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 2.6vw, 34px)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.15, marginTop: 8 }}>
              {ctaTitle}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 10, lineHeight: 1.6 }}>
              {ctaSubtitle}
            </p>

            <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
              {CENTRES.map(c => (
                <a
                  key={c.key}
                  href={waLink(config[c.key] ?? number, `2356 Bonjour, je contacte le centre de ${c.label}. Je souhaite des informations.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                  style={{ justifyContent: 'space-between', padding: '14px 18px', fontSize: 13.5 }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><WhatsAppIcon size={17} /> Centre de {c.label}</span>
                  <span aria-hidden style={{ opacity: 0.85 }}>→</span>
                </a>
              ))}
            </div>

            {config.booking_enabled !== 'false' && (
              <button onClick={onBook} className="btn btn-outline" style={{ width: '100%', marginTop: 14, minHeight: 50 }}>
                {bookLabel}
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
