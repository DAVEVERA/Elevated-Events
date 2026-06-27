'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const storageKey = 'elevated-cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(window.localStorage.getItem(storageKey) === null);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const accept = (value: 'necessary' | 'all') => {
    window.localStorage.setItem(storageKey, value);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-[760px] rounded-[22px] border border-border-soft bg-[#100b06]/95 p-5 text-dark-text shadow-[0_22px_70px_rgba(0,0,0,.34)] backdrop-blur-xl">
      <div className="grid gap-4 min-[720px]:grid-cols-[1fr_auto] min-[720px]:items-center">
        <div>
          <p className="mb-1 text-sm font-semibold text-dark-cream">
            Cookies op Elevated Eventmaker
          </p>
          <p className="text-sm leading-relaxed text-dark-muted">
            We gebruiken noodzakelijke cookies en, na toestemming, analytische
            cookies om de website te verbeteren. Lees meer in de{' '}
            <Link href="/cookieverklaring" className="text-dark-soft-gold underline underline-offset-4">
              cookieverklaring
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[420px]:flex-row">
          <button
            type="button"
            onClick={() => accept('necessary')}
            className="min-h-11 rounded-[10px] border border-dark-line px-4 text-sm font-semibold text-dark-muted transition hover:border-dark-gold hover:text-dark-cream"
          >
            Alleen nodig
          </button>
          <button
            type="button"
            onClick={() => accept('all')}
            className="btn-elevated !min-h-11 !px-4 !py-2 !text-sm"
          >
            <span>Accepteer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
