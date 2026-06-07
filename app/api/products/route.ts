import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name, sku, category, sub_type,
             description, unit, price,
             CASE
               WHEN image_url LIKE 'data:%' THEN NULL
               ELSE image_url
             END AS image_url
      FROM nolimit.products
      WHERE is_published = true
      ORDER BY name
    `);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error('[API /products]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
