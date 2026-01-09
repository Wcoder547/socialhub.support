// components/AdsenseRect.tsx
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdsenseRect() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore in dev
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "inline-block", width: 336, height: 280 }}
      data-ad-client="ca-pub-6395341448311243"
      data-ad-slot="2307430682"
    />
  );
}
