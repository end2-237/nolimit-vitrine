'use client';

import { useState, useEffect } from 'react';

export type SiteConfig = Record<string, string>;

const DEFAULT_CONFIG: SiteConfig = {
  whatsapp_douala:    '237699114722',
  whatsapp_yaounde:   '237675321844',
  whatsapp_bafoussam: '237655789103',
  whatsapp_default:   '237699114722',
};

let _cache: SiteConfig | null = null;
let _promise: Promise<SiteConfig> | null = null;

async function loadConfig(): Promise<SiteConfig> {
  if (_cache) return _cache;
  if (!_promise) {
    _promise = fetch('/api/config')
      .then(r => r.ok ? r.json() : DEFAULT_CONFIG)
      .then(cfg => { _cache = { ...DEFAULT_CONFIG, ...cfg }; return _cache!; })
      .catch(() => DEFAULT_CONFIG);
  }
  return _promise;
}

export function useConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  useEffect(() => { loadConfig().then(setConfig); }, []);
  return config;
}

export function waLink(number: string, message: string) {
  const clean = number.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
