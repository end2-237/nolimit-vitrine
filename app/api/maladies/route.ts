import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, slug, nom, couleur, description, message_wa, sort_order
       FROM maladies WHERE is_published = true ORDER BY sort_order, id`
    );
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error('[API /maladies]', err.message);
    // Fallback sur les 3 maladies de base si la table n'existe pas
    return NextResponse.json([
      { id: 1, slug: 'hepatite',     nom: 'Hépatite',     couleur: '#B8935A', description: 'Hépatite virale et chronique — solutions naturelles', message_wa: '2356 Hépatite - Je voudrais des informations sur le traitement naturel de l\'hépatite.', sort_order: 0 },
      { id: 2, slug: 'vih',          nom: 'VIH',          couleur: '#1E7B6A', description: 'Accompagnement naturel des personnes vivant avec le VIH', message_wa: '2356 VIH - Je voudrais des informations sur l\'accompagnement naturel pour le VIH.', sort_order: 1 },
      { id: 3, slug: 'hypertension', nom: 'Hypertension', couleur: '#4A6741', description: 'Gestion naturelle de la tension artérielle', message_wa: '2356 Hypertension - Je voudrais des informations sur le traitement naturel de l\'hypertension.', sort_order: 2 },
    ]);
  }
}
