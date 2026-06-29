'use client';

const ITEMS: { icon: React.ReactNode; label: string }[] = [
  {
    icon: <span aria-hidden style={{ fontSize: 16 }}>👨‍⚕️</span>,
    label: 'Suivi par notre médecin',
  },
  {
    icon: <span aria-hidden style={{ fontSize: 16 }}>🌿</span>,
    label: '100 % naturel — sans chimie',
  },
  {
    icon: <span aria-hidden style={{ fontSize: 16 }}>📍</span>,
    label: '3 centres · Douala, Yaoundé, Bafoussam',
  },
  {
    icon: (
      <span aria-hidden style={{ color: 'var(--gold)', fontSize: 15, letterSpacing: 1 }}>★★★★★</span>
    ),
    label: 'Patients accompagnés chaque semaine',
  },
];

export function TrustBand() {
  return (
    <section className="trust-band" aria-label="Garanties de confiance">
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 40px)',
          paddingTop: 22,
          paddingBottom: 22,
        }}
      >
        {ITEMS.map((it, i) => (
          <div key={i} className="trust-item">
            {it.icon}
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
