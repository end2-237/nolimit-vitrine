'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Reveal, Arrow } from './Reveal';
import { formatXAF } from './hooks';
import { fetchPublishedProducts, type PublishedProduct } from '@/lib/supabase';
import { useConfig, waLink } from '@/lib/useConfig';

// SNL category → vitrine display mapping
const CAT_LABELS: Record<string, { label: string; vitrineCat: string }> = {
  plante:                { label: 'Phytothérapie',          vitrineCat: 'phyto' },
  huile:                 { label: 'Huiles essentielles',    vitrineCat: 'huile' },
  the:                   { label: 'Tisanes & infusions',    vitrineCat: 'tisane' },
  complement_alimentaire:{ label: 'Compléments',            vitrineCat: 'comp' },
  cosmetique:            { label: 'Cosmétique naturelle',   vitrineCat: 'cosmo' },
  creme:                 { label: 'Cosmétique naturelle',   vitrineCat: 'cosmo' },
  ampoule_buvable:       { label: 'Compléments',            vitrineCat: 'comp' },
  poudre:                { label: 'Compléments',            vitrineCat: 'comp' },
  boisson:               { label: 'Boissons',               vitrineCat: 'boisson' },
  materiel:              { label: 'Rituels & accessoires',  vitrineCat: 'access' },
  colis:                 { label: 'Autres',                 vitrineCat: 'other' },
  test:                  { label: 'Autres',                 vitrineCat: 'other' },
};

const TONE: Record<string, string> = {
  phyto: 'sage', huile: '', tisane: 'warm', comp: 'dark',
  cosmo: '', boisson: 'warm', access: 'dark', other: '',
};

function ProductCard({ p, onQuick, onAdd, waNumber }: { p: PublishedProduct & { vitrineCat: string }; onQuick: () => void; onAdd: () => void; waNumber: string }) {
  const [hover, setHover] = useState(false);
  const tone = TONE[p.vitrineCat] ?? '';
  const waText = p.image_url
    ? `Bonjour, je voudrais commander :\n\n*${p.name}*\nPrix : ${formatXAF(p.price)}\n\n${p.image_url}`
    : `Bonjour, je voudrais commander :\n\n*${p.name}*\nPrix : ${formatXAF(p.price)}`;
  const waMsg = waLink(waNumber, waText);
  return (
    <Reveal>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={onQuick}
      >
        <div className={`ph ${tone}`} style={{ aspectRatio: '4/5', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <ProductSilhouette cat={p.vitrineCat} />
          )}
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, display: 'flex', gap: 8, opacity: hover ? 1 : 0, transform: hover ? 'translateY(0)' : 'translateY(10px)', transition: 'all .4s ease' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 999, background: 'var(--cream)', color: 'var(--ink)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              + Panier
            </button>
            <a
              href={waMsg}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Commander sur WhatsApp"
              style={{ width: 44, height: 44, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="white"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.508L4 29l7.697-1.808A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22a10.94 10.94 0 01-5.565-1.516l-.398-.238-4.57 1.074 1.1-4.46-.26-.41A10.944 10.944 0 015 15c0-6.065 4.935-11 11-11s11 4.935 11 11-4.935 11-11 11zm6.04-8.14c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.045 1.292-.193.22-.385.248-.715.083-.33-.165-1.393-.513-2.654-1.637-.98-.875-1.643-1.955-1.836-2.285-.193-.33-.02-.508.145-.673.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.565l-.633-.011c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.75s1.183 3.19 1.347 3.41c.165.22 2.328 3.555 5.643 4.987.789.34 1.404.543 1.884.694.79.252 1.51.217 2.079.132.634-.095 1.953-.799 2.228-1.57.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z"/></svg>
            </a>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(15px, 1.4vw, 18px)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{p.name}</h3>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatXAF(p.price)}</span>
          </div>
          {p.description && <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{p.description}</p>}
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(26,26,26,0.12)', fontSize: 11, color: 'var(--muted)' }}>
              {CAT_LABELS[p.category]?.label ?? p.category}
            </span>
            <a
              href={waMsg}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: 11, fontWeight: 600, color: '#25D366', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
            >
              <svg width="13" height="13" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.508L4 29l7.697-1.808A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.04 13.86c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.045 1.292-.193.22-.385.248-.715.083-.33-.165-1.393-.513-2.654-1.637-.98-.875-1.643-1.955-1.836-2.285-.193-.33-.02-.508.145-.673.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.565l-.633-.011c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.75s1.183 3.19 1.347 3.41c.165.22 2.328 3.555 5.643 4.987.789.34 1.404.543 1.884.694.79.252 1.51.217 2.079.132.634-.095 1.953-.799 2.228-1.57.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z"/></svg>
              Commander
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProductSilhouette({ cat }: { cat: string }) {
  const icons: Record<string, string> = {
    phyto: '🌿', huile: '💧', tisane: '🍵', comp: '💊', cosmo: '🧴', access: '🫙', boisson: '🥤', other: '📦',
  };
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, opacity: 0.5 }}>
      {icons[cat] ?? '📦'}
    </div>
  );
}

function ProductModal({ p, onClose, onAdd }: { p: PublishedProduct & { vitrineCat: string }; onClose: () => void; onAdd: () => void }) {
  const tone = TONE[p.vitrineCat] ?? '';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(26,26,26,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: 'var(--cream)', borderRadius: 16, maxWidth: 680, width: '100%', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', animation: 'slideUp .4s ease' }} className="modal-grid" onClick={e => e.stopPropagation()}>
        <div className={`ph ${tone}`} style={{ minHeight: 360, position: 'relative' }}>
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <ProductSilhouette cat={p.vitrineCat} />
          )}
        </div>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <button onClick={onClose} style={{ marginBottom: 20, fontSize: 20, color: 'var(--muted)' }}>✕</button>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(26,26,26,0.15)', color: 'var(--muted)' }}>
              {CAT_LABELS[p.category]?.label ?? p.category}
            </span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 400, marginTop: 16, letterSpacing: '-0.02em' }}>{p.name}</h2>
            {p.sub_type && <p style={{ marginTop: 8, fontSize: 14, color: 'var(--muted)' }}>{p.sub_type}</p>}
            {p.description && <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{p.description}</p>}
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
              <span>Unité : {p.unit}</span>
              {p.sku && <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>SKU : {p.sku}</span>}
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em' }}>{formatXAF(p.price)}</div>
            <button onClick={onAdd} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
              Ajouter au panier <Arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, products, updateQty, onOrderDone }: {
  open: boolean; onClose: () => void;
  cart: { id: number; qty: number }[];
  products: (PublishedProduct & { vitrineCat: string })[];
  updateQty: (id: number, d: number) => void;
  onOrderDone: () => void;
}) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [sending, setSending] = useState(false);
  const [orderError, setOrderError] = useState('');

  const total = cart.reduce((s, x) => {
    const p = products.find(pr => pr.id === x.id);
    return s + (p ? p.price * x.qty : 0);
  }, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setOrderError('');
    const items = cart.map(x => {
      const p = products.find(pr => pr.id === x.id);
      return { product_id: x.id, name: p?.name, qty: x.qty, price: p?.price };
    });
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total, customer_name: form.name, customer_phone: form.phone, customer_email: form.email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setOrderError(data.error || `Erreur ${res.status} — réessayez.`);
        setSending(false);
        return;
      }
    } catch {
      setOrderError('Impossible de joindre le serveur. Vérifiez votre connexion.');
      setSending(false);
      return;
    }
    setSending(false);
    setStep('done');
    onOrderDone();
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream-warm)', fontSize: 14, fontFamily: 'var(--sans)', boxSizing: 'border-box' };

  return (
    <>
      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 399, background: 'rgba(0,0,0,0.3)' }} onClick={onClose} />}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(420px, 100vw)', background: 'var(--cream)', zIndex: 400, transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .4s cubic-bezier(.2,.7,.2,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid rgba(26,26,26,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>
            {step === 'cart' ? `Panier (${cart.reduce((s, x) => s + x.qty, 0)})` : step === 'checkout' ? 'Vos coordonnées' : 'Commande reçue !'}
          </span>
          <button onClick={onClose} style={{ fontSize: 20, color: 'var(--muted)' }}>✕</button>
        </div>

        {step === 'done' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 16 }}>
            <div style={{ fontSize: 64 }}>🌿</div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 300 }}>Merci pour votre commande !</h3>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>Notre équipe vous contacte sous 24h pour confirmer et organiser la livraison.</p>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={onClose}>Fermer <Arrow /></button>
          </div>
        ) : step === 'checkout' ? (
          <form onSubmit={handleOrder} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 28px', gap: 14, overflowY: 'auto' }}>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 4 }}>Total : <strong style={{ color: 'var(--ink)' }}>{formatXAF(total)}</strong></div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nom complet *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Votre nom" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Téléphone *</label>
              <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+237 6 XX XX XX XX" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email (optionnel)</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="votre@email.com" style={inputStyle} />
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orderError && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fee2e2', color: '#991b1b', fontSize: 13 }}>
                  ⚠️ {orderError}
                </div>
              )}
              <button type="submit" disabled={sending} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.7 : 1 }}>
                {sending ? 'Envoi…' : 'Confirmer la commande'} <Arrow />
              </button>
              <button type="button" onClick={() => setStep('cart')} style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>← Retour au panier</button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {cart.length === 0 ? (
                <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--muted)', fontSize: 18, marginTop: 40, textAlign: 'center' }}>Votre panier est vide.</p>
              ) : cart.map(x => {
                const p = products.find(pr => pr.id === x.id);
                if (!p) return null;
                return (
                  <div key={x.id} style={{ display: 'flex', gap: 16, paddingBottom: 20, borderBottom: '1px solid rgba(26,26,26,0.08)', marginBottom: 20 }}>
                    <div className={`ph ${TONE[p.vitrineCat] ?? ''}`} style={{ width: 64, height: 64, borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{formatXAF(p.price)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                        <button onClick={() => updateQty(x.id, -1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(26,26,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>−</button>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 14, minWidth: 20, textAlign: 'center' }}>{x.qty}</span>
                        <button onClick={() => updateQty(x.id, 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(26,26,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>+</button>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600 }}>{formatXAF(p.price * x.qty)}</div>
                  </div>
                );
              })}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(26,26,26,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>Total</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 600 }}>{formatXAF(total)}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep('checkout')}>
                  Commander <Arrow />
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>Livraison sous 48h · Paiement à la livraison</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function BoutiqueVideoBanner() {
  const [video, setVideo] = useState<{ url: string; title: string | null } | null>(null);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch('/api/site-media?section=boutique')
      .then(r => r.ok ? r.json() : [])
      .then((items: { media_type: string; url: string; title: string | null }[]) => {
        const v = items.find(i => i.media_type === 'video');
        if (v) setVideo(v);
      })
      .catch(() => {});
  }, []);

  if (!video) return null;

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  return (
    <Reveal delay={120}>
      <div style={{ marginBottom: 64, borderRadius: 16, overflow: 'hidden', position: 'relative', background: '#0F1A0E', cursor: 'pointer' }} onClick={toggle}>
        <video
          ref={ref}
          src={video.url}
          style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }}
          playsInline
          loop
          onEnded={() => setPlaying(false)}
        />
        {/* Overlay gradient + play */}
        <div style={{
          position: 'absolute', inset: 0,
          background: playing ? 'transparent' : 'linear-gradient(to top, rgba(15,26,14,0.7) 0%, rgba(15,26,14,0.1) 60%, transparent 100%)',
          transition: 'background .4s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          {!playing && (
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.5)', marginBottom: 'auto', marginTop: 'auto' }}>
              <svg width="22" height="24" viewBox="0 0 22 24" fill="none"><path d="M2 2l18 10L2 22V2z" fill="#1A1A1A"/></svg>
            </div>
          )}
        </div>
        {/* Titre + badge */}
        {!playing && video.title && (
          <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,241,234,0.55)', display: 'block', marginBottom: 6 }}>Découvrez notre herboristerie</span>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 300, color: 'rgba(245,241,234,0.95)', lineHeight: 1.2 }}>{video.title}</p>
          </div>
        )}
        {!playing && !video.title && (
          <div style={{ position: 'absolute', bottom: 24, left: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,241,234,0.55)' }}>Découvrez notre herboristerie</span>
          </div>
        )}
      </div>
    </Reveal>
  );
}

export function Boutique() {
  const config = useConfig();
  const waNumber = config.whatsapp_default ?? '237699114722';
  const [products, setProducts] = useState<(PublishedProduct & { vitrineCat: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [limit, setLimit] = useState(24);
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState<(PublishedProduct & { vitrineCat: string }) | null>(null);

  useEffect(() => {
    fetchPublishedProducts().then(data => {
      const enriched = data.map(p => ({
        ...p,
        vitrineCat: CAT_LABELS[p.category]?.vitrineCat ?? 'other',
      }));
      setProducts(enriched);
      setLoading(false);
    });
  }, []);

  // Derive categories from actual products
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => { counts[p.vitrineCat] = (counts[p.vitrineCat] ?? 0) + 1; });
    const cats = [{ id: 'all', label: 'Tout', count: products.length }];
    const catOrder = ['phyto', 'huile', 'tisane', 'comp', 'cosmo', 'boisson', 'access', 'other'];
    const catNames: Record<string, string> = { phyto: 'Phytothérapie', huile: 'Huiles essentielles', tisane: 'Tisanes & infusions', comp: 'Compléments', cosmo: 'Cosmétique', boisson: 'Boissons', access: 'Accessoires', other: 'Autres' };
    catOrder.forEach(id => { if (counts[id]) cats.push({ id, label: catNames[id], count: counts[id] }); });
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    let r = products.filter(p => cat === 'all' || p.vitrineCat === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q));
    }
    if (sort === 'priceAsc') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'name') r = [...r].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    return r;
  }, [products, cat, search, sort]);

  const visible = filtered.slice(0, limit);

  const addToCart = (p: PublishedProduct) => {
    setCart(c => {
      const f = c.find(x => x.id === p.id);
      if (f) return c.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { id: p.id, qty: 1 }];
    });
    setCartOpen(true);
  };
  const updateQty = (id: number, d: number) =>
    setCart(c => c.map(x => x.id === id ? { ...x, qty: Math.max(0, x.qty + d) } : x).filter(x => x.qty > 0));
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  return (
    <section id="boutique" style={{ padding: 'var(--sec-pad) 0', borderTop: '1px solid rgba(26,26,26,0.08)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 40, marginBottom: 60 }}>
          <div>
            <Reveal><span className="eyebrow">La boutique</span></Reveal>
            <Reveal delay={100}>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 96px)', marginTop: 28, fontWeight: 300 }}>
                Une <em>herboristerie</em><br />ouverte à tous.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <p style={{ maxWidth: 380, fontSize: 15, lineHeight: 1.75, color: 'var(--muted)' }}>
              {loading ? 'Chargement…' : `${products.length} référence${products.length > 1 ? 's' : ''} sélectionnée${products.length > 1 ? 's' : ''} par nos praticiens.`}
              {!loading && ' Disponibles au centre et en livraison sous 48 h.'}
            </p>
          </Reveal>
        </div>

        {/* Vidéo herboristerie */}
        <BoutiqueVideoBanner />

        {/* Toolbar */}
        <Reveal>
          <div className="shop-toolbar" style={{ position: 'sticky', top: 70, zIndex: 30, background: 'rgba(245,241,234,0.92)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(26,26,26,0.08)', borderBottom: '1px solid rgba(26,26,26,0.08)', padding: '14px 0', margin: '0 -24px 40px', paddingLeft: 24, paddingRight: 24 }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, WebkitOverflowScrolling: 'touch' }} className="shop-cats-row">
              {categories.map(c => (
                <button key={c.id} className={`tag ${cat === c.id ? 'active' : ''}`} onClick={() => { setCat(c.id); setLimit(24); }} style={{ flexShrink: 0 }}>
                  {c.label}
                  <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.55 }}>{c.count}</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream)', flex: 1, minWidth: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ opacity: 0.6, flexShrink: 0 }}><circle cx="6" cy="6" r="4.5" stroke="currentColor" fill="none" /><path d="M9.5 9.5L13 13" stroke="currentColor" strokeLinecap="round" /></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher" style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--sans)', fontSize: 13, width: '100%', minWidth: 0 }} />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '10px 14px', borderRadius: 999, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream)', fontFamily: 'var(--sans)', fontSize: 13, outline: 'none', cursor: 'pointer', flexShrink: 0 }} className="shop-sort">
                <option value="default">Trier</option>
                <option value="priceAsc">Prix ↑</option>
                <option value="priceDesc">Prix ↓</option>
                <option value="name">Nom A–Z</option>
              </select>
              <button onClick={() => setCartOpen(true)} aria-label="Panier" style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream)', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ display: 'block', margin: 'auto' }}><path d="M3 4H13L12 12H4L3 4Z M3 4L2 1H0.5" stroke="currentColor" fill="none" strokeWidth="1.1" strokeLinejoin="round" /></svg>
                {cartCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 22, height: 22, padding: '0 6px', borderRadius: 11, background: 'var(--terracotta)', color: 'var(--cream)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Result count */}
        <div style={{ marginBottom: 24, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--muted)', fontWeight: 300 }}>
          {loading ? 'Chargement des produits…' : `${filtered.length} référence${filtered.length > 1 ? 's' : ''}`}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }} className="shop-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: '4/5', borderRadius: 4, background: 'var(--cream-warm)', animation: 'pulse 1.5s ease infinite', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }} className="shop-grid">
            {visible.map(p => (
              <ProductCard key={p.id} p={p} onQuick={() => setQuick(p)} onAdd={() => addToCart(p)} waNumber={waNumber} />
            ))}
          </div>
        )}

        {!loading && visible.length < filtered.length && (
          <div style={{ marginTop: 60, textAlign: 'center' }}>
            <button className="btn btn-outline" onClick={() => setLimit(l => l + 24)}>
              Voir 24 références de plus <Arrow />
            </button>
            <p style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>{visible.length} sur {filtered.length} affichés</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--muted)' }}>
            {products.length === 0
              ? 'La boutique est en cours de mise à jour — revenez bientôt.'
              : 'Aucune référence ne correspond — essayez d\'autres mots-clés.'}
          </div>
        )}
      </div>

      {quick && <ProductModal p={quick} onClose={() => setQuick(null)} onAdd={() => { addToCart(quick); setQuick(null); }} />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} products={products} updateQty={updateQty} onOrderDone={() => setCart([])} />

      <style>{`
        @media (max-width: 1100px) { .shop-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 780px)  { .shop-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .shop-grid { grid-template-columns: 1fr !important; } }
        .shop-cats-row::-webkit-scrollbar { display: none; }
        .shop-cats-row { scrollbar-width: none; }
        @media (min-width: 900px) {
          .shop-toolbar { display: block !important; }
          .shop-cats-row { overflow-x: visible; flex-wrap: wrap; padding-bottom: 0; }
        }
        @media (max-width: 480px) { .shop-sort { display: none !important; } }
      `}</style>
    </section>
  );
}
