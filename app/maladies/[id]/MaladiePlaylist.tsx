'use client';

import { useState, useRef, useEffect } from 'react';
import { useConfig, waLink } from '@/lib/useConfig';

type Video = {
  id: number;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
};

type MaladieInfo = { nom: string; couleur: string; desc: string };

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function MaladiePlaylist({ id, maladie, initialVideos }: { id: string; maladie: MaladieInfo; initialVideos: Video[] }) {
  const config = useConfig();
  const waNumber = config.whatsapp_default ?? '237699114722';
  const [videos] = useState<Video[]>(initialVideos);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = videos[active];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (playing) videoRef.current.play().catch(() => {});
    }
  }, [active]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1A0E', color: '#F5F1EA', fontFamily: 'var(--sans, sans-serif)' }}>
      {/* Header */}
      <div style={{ background: '#162414', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <a href="/" style={{ color: 'rgba(245,241,234,0.5)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Retour au site
        </a>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
        <div>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: maladie.couleur }}>{maladie.nom}</span>
          <div style={{ fontFamily: 'var(--serif, serif)', fontSize: 18, fontWeight: 300, marginTop: 2 }}>Solutions naturelles — Vidéos</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 'calc(100vh - 80px)' }} className="playlist-layout">

        {/* Player principal */}
        <div style={{ padding: 32 }}>
          {videos.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, opacity: 0.5, gap: 16 }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" /><path d="M26 22l16 10-16 10V22z" fill="currentColor" /></svg>
              <p style={{ fontFamily: 'var(--serif, serif)', fontSize: 20, fontStyle: 'italic' }}>Aucune vidéo disponible pour le moment.</p>
              <p style={{ fontSize: 13 }}>Revenez bientôt — du contenu est en cours d'ajout.</p>
            </div>
          ) : (
            <>
              {/* Vidéo */}
              <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', position: 'relative', aspectRatio: '16/9' }}>
                <video
                  ref={videoRef}
                  src={current.url}
                  poster={current.thumbnail_url ?? undefined}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  onTimeUpdate={e => setProgress((e.target as HTMLVideoElement).currentTime)}
                  onLoadedMetadata={e => setDuration((e.target as HTMLVideoElement).duration)}
                  onEnded={() => { setPlaying(false); if (active < videos.length - 1) { setActive(a => a + 1); setPlaying(true); } }}
                  onClick={toggle}
                />
                {!playing && (
                  <button onClick={toggle} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="#0F1A0E"><path d="M8 6l16 8-16 8V6z" /></svg>
                    </div>
                  </button>
                )}
              </div>

              {/* Contrôles */}
              <div style={{ marginTop: 16 }}>
                <div
                  onClick={seek}
                  style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 99, cursor: 'pointer', position: 'relative', marginBottom: 12 }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: maladie.couleur, borderRadius: 99, width: duration ? `${(progress / duration) * 100}%` : '0%', transition: 'width .1s linear' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {active > 0 && (
                      <button onClick={() => setActive(a => a - 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#F5F1EA', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    )}
                    <button onClick={toggle} style={{ background: 'white', border: 'none', color: '#0F1A0E', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {playing
                        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="2" width="4" height="10" rx="1" /><rect x="8" y="2" width="4" height="10" rx="1" /></svg>
                        : <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l10 5-10 5V2z" /></svg>
                      }
                    </button>
                    {active < videos.length - 1 && (
                      <button onClick={() => setActive(a => a + 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#F5F1EA', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    )}
                    <span style={{ fontSize: 12, color: 'rgba(245,241,234,0.5)', fontFamily: 'var(--mono, monospace)' }}>
                      {formatTime(progress)} / {formatTime(duration)}
                    </span>
                  </div>
                  <a
                    href={waLink(waNumber, `2356 Bonjour Docteur, j'ai visionné vos vidéos sur ${maladie.nom} et je voudrais en savoir plus sur le traitement naturel.`)}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, background: '#25D366', color: 'white', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 32 32" fill="white"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.508L4 29l7.697-1.808A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.04 13.86c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.045 1.292-.193.22-.385.248-.715.083-.33-.165-1.393-.513-2.654-1.637-.98-.875-1.643-1.955-1.836-2.285-.193-.33-.02-.508.145-.673.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.565l-.633-.011c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.75s1.183 3.19 1.347 3.41c.165.22 2.328 3.555 5.643 4.987.789.34 1.404.543 1.884.694.79.252 1.51.217 2.079.132.634-.095 1.953-.799 2.228-1.57.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z"/></svg>
                    Discuter avec le Dr
                  </a>
                </div>
              </div>

              {/* Titre & desc */}
              <div style={{ marginTop: 24 }}>
                <h1 style={{ fontFamily: 'var(--serif, serif)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300, letterSpacing: '-0.02em' }}>
                  {current.title ?? `${maladie.nom} — vidéo ${active + 1}`}
                </h1>
                {current.description && <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.75, color: 'rgba(245,241,234,0.65)', maxWidth: 640 }}>{current.description}</p>}
              </div>
            </>
          )}
        </div>

        {/* Playlist sidebar */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', maxHeight: 'calc(100vh - 80px)', padding: '20px 0' }}>
          <div style={{ padding: '0 20px 16px', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,241,234,0.4)' }}>
            {videos.length} vidéo{videos.length > 1 ? 's' : ''}
          </div>
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => { setActive(i); setPlaying(true); }}
              style={{
                width: '100%', display: 'flex', gap: 14, padding: '14px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: i === active ? 'rgba(255,255,255,0.06)' : 'transparent',
                borderLeft: i === active ? `3px solid ${maladie.couleur}` : '3px solid transparent',
                transition: 'background .2s',
              }}
            >
              <div style={{ width: 80, height: 52, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#1E2B1C', position: 'relative' }}>
                {v.thumbnail_url
                  ? <img src={v.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>▶</div>
                }
                {i === active && playing && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[0, 1, 2].map(j => <div key={j} style={{ width: 3, background: maladie.couleur, borderRadius: 2, height: 16, animation: 'eq .8s ease infinite', animationDelay: `${j * 0.2}s` }} />)}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: i === active ? 600 : 400, color: i === active ? '#F5F1EA' : 'rgba(245,241,234,0.65)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {v.title ?? `Vidéo ${i + 1}`}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(245,241,234,0.35)', marginTop: 4 }}>#{i + 1}</div>
              </div>
            </button>
          ))}

          {/* CTA WhatsApp bas de playlist */}
          <div style={{ margin: '20px 16px 0', padding: 16, borderRadius: 10, background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(245,241,234,0.7)', marginBottom: 12 }}>
              Vous avez des questions sur le traitement naturel de la <strong style={{ color: '#F5F1EA' }}>{maladie.nom}</strong> ?
            </p>
            <a
              href={waLink(waNumber, `2356 Bonjour Docteur, je vous contacte concernant ${maladie.nom} après avoir regardé vos vidéos.`)}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 999, background: '#25D366', color: 'white', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 32 32" fill="white"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.508L4 29l7.697-1.808A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.04 13.86c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.045 1.292-.193.22-.385.248-.715.083-.33-.165-1.393-.513-2.654-1.637-.98-.875-1.643-1.955-1.836-2.285-.193-.33-.02-.508.145-.673.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.565l-.633-.011c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.75s1.183 3.19 1.347 3.41c.165.22 2.328 3.555 5.643 4.987.789.34 1.404.543 1.884.694.79.252 1.51.217 2.079.132.634-.095 1.953-.799 2.228-1.57.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z"/></svg>
              Discuter avec le Docteur
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .playlist-layout { grid-template-columns: 1fr !important; }
        }
        @keyframes eq {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
