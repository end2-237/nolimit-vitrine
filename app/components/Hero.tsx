'use client';

import { useScrollY } from './hooks';
import { Reveal, WordsReveal } from './Reveal';
import { useConfig } from '@/lib/useConfig';
import { CtaPair } from './CtaPair';
import { HeroProductStrip } from './HeroProductStrip';

function FoliageLayer({ scrollY, opacity, offset = 0, blur = 2 }: { scrollY: number; opacity: number; offset?: number; blur?: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      transform: `translateY(${scrollY * 0.03}px)`,
      filter: blur ? `blur(${blur}px)` : undefined,
    }}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ width: '110%', height: '110%', marginLeft: '-5%', opacity }}>
        {[0, 1, 2, 3, 4, 5].map(i => {
          const cx = ((i * 247 + offset) % 1440);
          const cy = ((i * 163 + offset * 0.6) % 900) - 100;
          const r = 80 + (i % 3) * 60;
          // Teintes claires : verts lumineux, faible saturation pour un fond aéré
          const sat = 45 + (i % 3) * 8;
          const light = 70 + i * 3;
          return (
            <g key={i} transform={`translate(${cx},${cy}) rotate(${i * 37})`} style={{ animation: `pulse ${4 + i}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>
              <ellipse rx={r} ry={r * 1.6} fill={`hsl(${148 + (i % 3) * 6}, ${sat}%, ${light}%)`} />
              <ellipse rx={r * 0.6} ry={r * 1.2} fill={`hsl(${155 + (i % 2) * 8}, ${sat + 8}%, ${light + 6}%)`} cx={r * 0.3} cy={-r * 0.2} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}


export function Hero({ onBook }: { onBook: () => void }) {
  const y = useScrollY();
  const config = useConfig();

  const heroTitle = config.hero_title ?? 'Votre santé, naturellement.';
  const heroSubtitle = config.hero_subtitle ?? 'Compléments alimentaires & soins naturels — Douala, Yaoundé, Bafoussam';
  const heroDescription = config.hero_description ?? 'Produits de santé 100 % naturels et accompagnement par notre médecin. Parlez-nous de votre besoin, on vous répond tout de suite.';

  const titleParts = heroTitle.split(',');
  const titleLine1 = titleParts[0] ? titleParts[0].trim() + (titleParts.length > 1 ? ',' : '') : heroTitle;
  const titleLine2 = titleParts.slice(1).join(',').trim();

  // Textes pilotables depuis site_config (avec valeurs par défaut)
  const heroEyebrow = config.hero_eyebrow ?? 'Médecine naturelle · Cameroun';
  const heroImage = config.hero_image_url ?? '/hero-green.jpg';

  return (
    <section id="top" style={{ position: 'relative', color: 'var(--ink)', background: 'var(--cream)', padding: 'clamp(10px, 1.6vw, 20px)', paddingTop: 'clamp(84px, 11vh, 120px)' }}>
      {/* Cadre arrondi façon Med4Med, fond santé vert */}
      <div className="hero-frame" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'clamp(22px, 2.6vw, 40px)', border: '1px solid rgba(12,34,24,0.10)', boxShadow: '0 30px 80px -40px rgba(12,34,24,0.35)' }}>

        {/* Image de fond (santé naturelle verte) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'right center', transform: `translateY(${y * 0.04}px) scale(1.05)` }} />
        {/* Voile de lisibilité : clair à gauche (texte), image visible à droite */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(102deg, rgba(255,255,255,0.97) 0%, rgba(252,250,245,0.9) 34%, rgba(250,248,242,0.55) 56%, rgba(63,184,115,0.10) 100%)' }} />
        {/* Teinte verte de marque + accents lumineux */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <FoliageLayer scrollY={y} opacity={0.28} />
          <div style={{ position: 'absolute', top: '-12%', right: '-6%', width: '46vw', height: '46vw', background: 'radial-gradient(circle, rgba(63,184,115,0.22) 0%, transparent 65%)', filter: 'blur(22px)' }} />
          <div style={{ position: 'absolute', bottom: '-14%', left: '-8%', width: '42vw', height: '42vw', background: 'radial-gradient(circle, rgba(240,168,0,0.10) 0%, transparent 65%)', filter: 'blur(26px)' }} />
        </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 'clamp(56px, 9vh, 110px)', paddingBottom: 'clamp(48px, 7vw, 96px)' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'center', maxWidth: 860 }}>

          {/* ── Colonne gauche : message + CTA ── */}
          <div style={{ minWidth: 0 }}>
            <Reveal>
              <span className="eyebrow">{heroEyebrow}</span>
            </Reveal>
            <h1 style={{ fontSize: 'clamp(44px, 7vw, 104px)', fontWeight: 300, color: 'var(--ink)', marginTop: 22, letterSpacing: '-0.035em', lineHeight: 0.98 }}>
              <WordsReveal text={titleLine1} />
              {titleLine2 && (
                <>
                  <br />
                  <em style={{ fontWeight: 300, color: 'var(--sage)' }}>
                    <WordsReveal text={titleLine2} as="span" />
                  </em>
                </>
              )}
            </h1>

            <Reveal delay={400}>
              <p style={{ maxWidth: 520, fontSize: 17, lineHeight: 1.65, color: 'var(--muted)', marginTop: 26 }}>
                {heroDescription}
              </p>
            </Reveal>

            <Reveal delay={500}>
              <HeroProductStrip />
            </Reveal>

            <Reveal delay={550}>
              <div style={{ marginTop: 22 }}>
                <CtaPair
                  waMessage="2356 Bonjour Docteur, je souhaite des informations sur vos solutions naturelles."
                  onBook={onBook}
                  bookVariant="btn-outline"
                />
              </div>
            </Reveal>

            {/* Stats */}
            <div className="hero-stats" style={{ marginTop: 'clamp(36px, 5vw, 56px)', display: 'flex', gap: 'clamp(28px,4vw,64px)', flexWrap: 'wrap', borderTop: '1px solid rgba(12,34,24,0.1)', paddingTop: 28 }}>
              {[['2024', 'Fondé'], ['3', 'Centres'], ['10+', 'Collaborateurs'], ['100 %', 'Naturel']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px,3.6vw,46px)', fontWeight: 300, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)', marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      </div>{/* /hero-frame */}

      <style>{`
        @media (max-width: 920px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-action { max-width: 560px; margin-top: 8px; }
        }
        @media (max-width: 560px) {
          .hero-frame { border-radius: 20px; }
        }
      `}</style>
    </section>
  );
}
