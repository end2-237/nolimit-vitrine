import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    const result = await pool.query(`SELECT key, value FROM nolimit.site_config ORDER BY key`);
    const cfg: Record<string, string> = { ...FALLBACK };
    result.rows.forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });
    return NextResponse.json(cfg);
  } catch (err: any) {
    console.error('[API /config]', err.message);
    return NextResponse.json(FALLBACK);
  }
}
