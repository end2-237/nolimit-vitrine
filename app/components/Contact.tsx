'use client';

import { useState } from 'react';
import { Reveal } from './Reveal';
import { useConfig } from '@/lib/useConfig';

const CENTRES_BASE = [
  { id: 'douala',    name: 'Douala',    qty: '3+ conseillers', quartier: 'Logpom',        horaires: 'Lun–Sam, 09h–19h',   addr: 'Face Totale — Logpom',             email: 'douala@nolimit.cm',    cfgPhone: 'phone_douala',    cfgAddr: 'addr_douala',    cfgWa: 'whatsapp_douala' },
  { id: 'yaounde',   name: 'Yaoundé',   qty: '3+ conseillers', quartier: 'Santa Barbara', horaires: 'Lun–Sam, 09h–19h',   addr: 'Santa Barbara — Immeuble blanc',   email: 'yaounde@nolimit.cm',   cfgPhone: 'phone_yaounde',   cfgAddr: 'addr_yaounde',   cfgWa: 'whatsapp_yaounde' },
  { id: 'bafoussam', name: 'Bafoussam', qty: '3+ conseillers', quartier: 'Centre-ville',  horaires: 'Lun–Sam, 08h–17h30', addr: "Près de l'agence Général Express", email: 'bafoussam@nolimit.cm', cfgPhone: 'phone_bafoussam', cfgAddr: 'addr_bafoussam', cfgWa: 'whatsapp_bafoussam' },
];

function InfoCell({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--sage-light)', marginBottom: 6 }}>{label}</div>
      {lines.map((l, i) => <div key={i} style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(245,241,234,0.85)' }}>{l}</div>)}
    </div>
  );
}

export function Contact() {
  const config = useConfig();
  const CENTRES = CENTRES_BASE.map(c => ({
    ...c,
    tel:  config[c.cfgPhone] ?? (c.id === 'douala' ? '+237 6 99 11 47 22' : c.id === 'yaounde' ? '+237 6 75 32 18 44' : '+237 6 55 78 91 03'),
    addr: config[c.cfgAddr]  ?? c.addr,
    wa:   config[c.cfgWa]    ?? config['whatsapp_default'] ?? (c.id === 'douala' ? '237699114722' : c.id === 'yaounde' ? '237675321844' : '237655789103'),
  }));

  const [form, setForm] = useState({ name: '', email: '', phone: '', city: 'Douala', type: 'Information', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('douala');

  const selectedCentre = CENTRES.find(x => x.id === city)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Erreur ${res.status} — réessayez.`);
        return;
      }
      setSent(true);
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ padding: 'var(--sec-pad) 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 40, marginBottom: 80 }}>
          <div>
            <Reveal><span className="eyebrow">Contact</span></Reveal>
            <Reveal delay={100}>
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 84px)', marginTop: 28, fontWeight: 300, maxWidth: 900 }}>
                Trois adresses,<br />une <em>même équipe</em>.
              </h2>
            </Reveal>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '6fr 6fr', gap: 24 }} className="contact-grid">
          {/* City tabs */}
          <Reveal>
            <div style={{ background: 'var(--sage)', borderRadius: 12, overflow: 'hidden', padding: 40, color: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {CENTRES.map(c => (
                  <button key={c.id} onClick={() => { setCity(c.id); setForm(f => ({ ...f, city: c.name })); }}
                    style={{ padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500, background: city === c.id ? 'var(--cream)' : 'rgba(245,241,234,0.15)', color: city === c.id ? 'var(--sage)' : 'var(--cream)', border: 'none', transition: 'all .3s', cursor: 'pointer' }}>
                    {c.name}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <InfoCell label="Adresse" lines={[selectedCentre.addr, selectedCentre.quartier, selectedCentre.name]} />
                <InfoCell label="Horaires" lines={[selectedCentre.horaires]} />
                <InfoCell label="Téléphone" lines={[selectedCentre.tel]} />
                <InfoCell label="Email" lines={[selectedCentre.email]} />
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${selectedCentre.wa}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 999, background: '#25D366', color: 'white', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'opacity .2s' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.547 4.07 1.504 5.782L0 24l6.395-1.676A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.366l-.36-.214-3.713.973.99-3.618-.234-.373A9.817 9.817 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={`tel:${selectedCentre.tel}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 999, background: 'rgba(245,241,234,0.15)', color: 'var(--cream)', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,241,234,0.25)', transition: 'background .2s' }}
                >
                  📞 {selectedCentre.tel}
                </a>
              </div>
              <div style={{ padding: '20px 0 0', borderTop: '1px solid rgba(245,241,234,0.15)', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'rgba(245,241,234,0.7)' }}>
                {selectedCentre.qty} · Prise en charge dès votre arrivée
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={100}>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
                <div style={{ fontSize: 48 }}>✉️</div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400 }}>Message envoyé !</h3>
                <p style={{ color: 'var(--muted)', fontSize: 15, textAlign: 'center', maxWidth: 340 }}>Nous vous répondons sous 24h ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Votre nom" required style={{ padding: '14px 18px', borderRadius: 8, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream-warm)', fontSize: 14, outline: 'none', fontFamily: 'var(--sans)' }} />
                  <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="Email" type="email" required style={{ padding: '14px 18px', borderRadius: 8, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream-warm)', fontSize: 14, outline: 'none', fontFamily: 'var(--sans)' }} />
                </div>
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="Téléphone (optionnel)" style={{ padding: '14px 18px', borderRadius: 8, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream-warm)', fontSize: 14, outline: 'none', fontFamily: 'var(--sans)' }} />
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} style={{ padding: '14px 18px', borderRadius: 8, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream-warm)', fontSize: 14, outline: 'none', fontFamily: 'var(--sans)' }}>
                  <option>Information</option>
                  <option>Rendez-vous</option>
                  <option>Commande boutique</option>
                  <option>Partenariat</option>
                </select>
                <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Votre message" rows={5} required style={{ padding: '14px 18px', borderRadius: 8, border: '1px solid rgba(26,26,26,0.15)', background: 'var(--cream-warm)', fontSize: 14, outline: 'none', fontFamily: 'var(--sans)', resize: 'vertical' }} />
                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fee2e2', color: '#991b1b', fontSize: 13 }}>
                    ⚠️ {error}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={loading}>
                  {loading ? 'Envoi…' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
