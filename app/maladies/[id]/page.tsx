import { pool } from '@/lib/db';
import { notFound } from 'next/navigation';
import { MaladiePlaylist } from './MaladiePlaylist';

const MALADIES: Record<string, { nom: string; couleur: string; desc: string }> = {
  hepatite:     { nom: 'Hépatite',     couleur: '#B8935A', desc: 'Traitements naturels de l\'hépatite virale et chronique' },
  vih:          { nom: 'VIH',          couleur: '#1E7B6A', desc: 'Accompagnement naturel des personnes vivant avec le VIH' },
  hypertension: { nom: 'Hypertension', couleur: '#4A6741', desc: 'Gestion naturelle de la tension artérielle' },
};

export async function generateStaticParams() {
  return Object.keys(MALADIES).map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = MALADIES[id];
  if (!m) return { title: 'Not found' };
  return { title: `${m.nom} — Solutions naturelles | No Limit`, description: m.desc };
}

export default async function MaladiePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const maladie = MALADIES[id];
  if (!maladie) notFound();

  let videos: { id: number; url: string; thumbnail_url: string | null; title: string | null; description: string | null }[] = [];
  try {
    const res = await pool.query(
      `SELECT id, url, thumbnail_url, title, description FROM site_media
       WHERE section = 'maladies' AND subsection = $1 AND media_type = 'video' AND is_published = true
       ORDER BY sort_order, id`,
      [id]
    );
    videos = res.rows;
  } catch {}

  return <MaladiePlaylist id={id} maladie={maladie} initialVideos={videos} />;
}
