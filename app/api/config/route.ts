import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT key, value FROM site_config ORDER BY key
    `);
    const config: Record<string, string> = {};
    result.rows.forEach((r: { key: string; value: string }) => { config[r.key] = r.value; });
    return NextResponse.json(config);
  } catch {
    // Fallback si la table n'existe pas encore
    return NextResponse.json({
      whatsapp_douala:    '237699114722',
      whatsapp_yaounde:   '237675321844',
      whatsapp_bafoussam: '237655789103',
      whatsapp_default:   '237699114722',
    });
  }
}
