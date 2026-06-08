'use client';

import { useState, useEffect } from 'react';

export type SiteConfig = Record<string, string>;

const DEFAULT_CONFIG: SiteConfig = {
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

export function useConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  useEffect(() => {
    fetch('/api/config')
      .then(r => r.ok ? r.json() : DEFAULT_CONFIG)
      .then(cfg => {
        const merged = { ...DEFAULT_CONFIG, ...cfg };
        // Si whatsapp_default absent, dériver depuis contact_phone
        if (!cfg.whatsapp_default && cfg.contact_phone) {
          merged.whatsapp_default = cfg.contact_phone;
          merged.whatsapp_douala = cfg.contact_phone;
        }
        setConfig(merged);
      })
      .catch(() => {});
  }, []);
  return config;
}

export function waLink(number: string, message: string) {
  const clean = number.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
