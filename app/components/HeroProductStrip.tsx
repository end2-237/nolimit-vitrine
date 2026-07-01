'use client';

import { useEffect, useState } from 'react';
import { fetchPublishedProducts, type PublishedProduct } from '@/lib/supabase';

function proxyImg(url?: string) {
  if (!url) return undefined;
  if (url.startsWith('data:')) return undefined;
  if (url.startsWith('/')) return url;
  return `/api/img-proxy?url=${encodeURIComponent(url)}`;
}

/**
 * Bandeau discret de miniatures produits (image + nom) qui défile en boucle,
 * placé dans le hero juste avant les boutons d'action. Compact : une seule
 * rangée, visible sans scroll même en responsive, sans saturer l'espace.
 */
export function HeroProductStrip() {
  const [items, setItems] = useState<PublishedProduct[]>([]);

  useEffect(() => {
    let alive = true;
    fetchPublishedProducts()
      .then(list => {
        if (!alive) return;
        const withImg = list.filter(p => proxyImg(p.image_url));
        setItems(withImg.slice(0, 12));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  if (items.length === 0) return null;

  // On duplique la liste pour un défilement en boucle sans couture.
  const loop = [...items, ...items];
  // Durée proportionnelle au nombre d'éléments (vitesse constante, jamais trop rapide).
  const duration = Math.max(18, items.length * 3.2);

  return (
    <div className="hps" aria-label="Aperçu de nos produits">
      <div className="hps-track" style={{ animationDuration: `${duration}s` }}>
        {loop.map((p, i) => (
          <div className="hps-item" key={`${p.id}-${i}`} aria-hidden={i >= items.length}>
            <span className="hps-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={proxyImg(p.image_url)} alt="" loading="lazy" />
            </span>
            <span className="hps-name">{p.name}</span>
          </div>
        ))}
      </div>

      <style>{`
        .hps {
          position: relative;
          margin-top: 22px;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
                  mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
          overflow: hidden;
        }
        .hps-track {
          display: flex;
          gap: 10px;
          width: max-content;
          animation-name: hps-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .hps:hover .hps-track { animation-play-state: paused; }
        .hps-item {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 6px 14px 6px 6px;
          background: var(--surface, #fff);
          border: 1px solid rgba(12,34,24,0.08);
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(12,34,24,0.05);
          flex: 0 0 auto;
        }
        .hps-thumb {
          width: 34px; height: 34px;
          border-radius: 50%;
          overflow: hidden;
          flex: 0 0 auto;
          background: var(--cream, #f2ede4);
        }
        .hps-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hps-name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink, #142a1e);
          white-space: nowrap;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.01em;
        }
        @keyframes hps-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hps-track { animation: none; flex-wrap: nowrap; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}
