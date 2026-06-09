import { pool } from '@/lib/db';
import { notFound } from 'next/navigation';
import { MaladiePlaylist } from './MaladiePlaylist';

// Force dynamic rendering so videos are fetched fresh on every request
export const dynamic = 'force-dynamic';

async function getMaladie(slug: string) {
  try {
    const res = await pool.query(
      `SELECT slug, nom, couleur, description FROM nolimit.maladies WHERE slug = $1 AND is_published = true LIMIT 1`,
      [slug]
    );
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return { nom: r.nom, couleur: r.couleur, desc: r.description ?? '' };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await getMaladie(id);
  if (!m) return { title: 'Not found' };
  return { title: `${m.nom} — Solutions naturelles | No Limit`, description: m.desc };
}

export default async function MaladiePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const maladie = await getMaladie(id);
  if (!maladie) notFound();

  let videos: { id: number; url: string; thumbnail_url: string | null; title: string | null; description: string | null }[] = [];
  try {
    const res = await pool.query(
      `SELECT id, url, thumbnail_url, title, description FROM nolimit.site_media
       WHERE section = 'maladies' AND subsection = $1 AND media_type = 'video' AND is_published = true
       ORDER BY sort_order, id`,
      [id]
    );
    videos = res.rows;
  } catch {}

  return <MaladiePlaylist id={id} maladie={maladie} initialVideos={videos} />;
}
