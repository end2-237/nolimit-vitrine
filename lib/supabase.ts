export interface PublishedProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  sub_type?: string;
  description?: string;
  unit: string;
  price: number;
  image_url?: string;
}

export async function fetchPublishedProducts(): Promise<PublishedProduct[]> {
  const MAX = 3;
  const DELAYS = [0, 2000, 5000];
  for (let attempt = 0; attempt < MAX; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, DELAYS[attempt]));
    try {
      const res = await fetch('/api/products', { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        console.error('[Boutique] /api/products error:', res.status);
        if (res.status >= 400 && res.status < 500) return [];
        continue;
      }
      return res.json();
    } catch (err: any) {
      if (attempt === MAX - 1) console.error('[Boutique] /api/products échec après', MAX, 'tentatives:', err?.message);
    }
  }
  return [];
}
