import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

const FALLBACK = {
  whatsapp_default:   '237699114722',
  whatsapp_douala:    '237699114722',
  whatsapp_yaounde:   '237675321844',
  whatsapp_bafoussam: '237655789103',
  phone_douala:       '+237 6 99 11 47 22',
  phone_yaounde:      '+237 6 75 32 18 44',
  phone_bafoussam:    '+237 6 55 78 91 03',
  contact_email:      'bonjour@nolimit.cm',
  contact_phone:      '+237 6 99 11 47 22',
  hero_title:         'Le bien-être, sans limite.',
  hero_subtitle:      'Établi en 2019 — médecine naturelle à Douala, Yaoundé, Bafoussam',
  hero_description:   'Un centre de soins qui réunit naturopathie, acupuncture, sophrologie et thérapies manuelles.',
  booking_enabled:    'true',
  boutique_enabled:   'true',
};

async function queryConfig(table: string) {
  const res = await pool.query(`SELECT key, value FROM ${table} ORDER BY key`);
  const cfg: Record<string, string> = {};
  res.rows.forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });
  return cfg;
}

export async function GET() {
  // Try site_settings first (existing prod table), then site_config (our migration)
  for (const table of ['nolimit.site_settings', 'nolimit.site_config']) {
    try {
      const cfg = await queryConfig(table);
      return NextResponse.json({ ...FALLBACK, ...cfg });
    } catch {}
  }
  return NextResponse.json(FALLBACK);
}
