import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if is_active column exists (added in migration 002, may not exist in all envs)
    const colCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'nolimit' AND table_name = 'products' AND column_name = 'is_active'
    `);
    const hasIsActive = colCheck.rows.length > 0;

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
