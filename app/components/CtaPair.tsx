'use client';

import { useConfig, waLink } from '@/lib/useConfig';
import { Arrow } from './Reveal';

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.508L4 29l7.697-1.808A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.04 13.86c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.045 1.292-.193.22-.385.248-.715.083-.33-.165-1.393-.513-2.654-1.637-.98-.875-1.643-1.955-1.836-2.285-.193-.33-.02-.508.145-.673.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.565l-.633-.011c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.75s1.183 3.19 1.347 3.41c.165.22 2.328 3.555 5.643 4.987.789.34 1.404.543 1.884.694.79.252 1.51.217 2.079.132.634-.095 1.953-.799 2.228-1.57.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" />
    </svg>
  );
}

/**
 * Duo CTA réutilisé partout : WhatsApp (action prioritaire) + Réserver (secondaire).
 * Le numéro WhatsApp est lu depuis la config (whatsapp_default).
 */
export function CtaPair({
  waMessage,
  onBook,
  waLabel = 'Parler au docteur',
  bookLabel = 'Réserver un bilan',
  align = 'flex-start',
  bookVariant = 'btn-outline',
}: {
  waMessage: string;
  onBook?: () => void;
  waLabel?: string;
  bookLabel?: string;
  align?: 'flex-start' | 'center';
  bookVariant?: 'btn-outline' | 'btn-ghost' | 'btn-dark';
}) {
  const config = useConfig();
  const number = config.whatsapp_default ?? '237699114722';
  const bookingEnabled = config.booking_enabled !== 'false';

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: align }}>
      <a
        href={waLink(number, waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-wa"
      >
        <WhatsAppIcon /> {waLabel}
      </a>
      {bookingEnabled && onBook && (
        <button onClick={onBook} className={`btn ${bookVariant}`}>
          {bookLabel} <Arrow />
        </button>
      )}
    </div>
  );
}
