'use client';

import { useState } from 'react';
import { useCustomCursor } from './hooks';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { TrustBand } from './TrustBand';
import { Manifeste } from './Manifeste';
import { Services } from './Services';
import { Equipe, Lieu, Centres, Galerie, Journal } from './StaticSections';
import { Maladies } from './Maladies';
import { Boutique } from './Boutique';
import { Temoignages } from './Temoignages';
import { FAQ } from './FAQ';
import { Contact } from './Contact';
import { Newsletter } from './Newsletter';
import { Footer } from './Footer';
import { Booking } from './Booking';
import { StickyCTA } from './StickyCTA';
import { useConfig } from '@/lib/useConfig';

export function ClientApp() {
  const config = useConfig();
  const bookingEnabled = config.booking_enabled !== 'false';
  const boutiqueEnabled = config.boutique_enabled !== 'false';

  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefill, setPrefill] = useState('');
  useCustomCursor();

  const openBooking = (svc?: string) => {
    if (!bookingEnabled) return;
    setPrefill(svc || '');
    setBookingOpen(true);
  };

  return (
    <>
      <Nav onBook={() => openBooking()} />
      <Hero onBook={() => openBooking()} />
      <TrustBand />
      <Maladies />
      {boutiqueEnabled && <Boutique />}
      <Services onBook={openBooking} />
      <Temoignages />
      <Manifeste />
      <Equipe />
      <Lieu />
      <Centres />
      <Galerie />
      <Journal />
      <FAQ />
      <Contact />
      <Newsletter />
      <Footer />

      <StickyCTA onBook={() => openBooking()} />
      {bookingEnabled && <Booking open={bookingOpen} onClose={() => setBookingOpen(false)} prefilled={prefill} />}

      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
      `}</style>
    </>
  );
}
