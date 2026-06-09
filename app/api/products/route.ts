import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

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
             description, unit, price, image_url
      FROM products
      ${hasIsActive ? 'WHERE is_active = true' : ''}
      ORDER BY name
    `);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error('[API /products]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
