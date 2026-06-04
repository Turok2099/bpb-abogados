"use client";

import { InlineWidget } from "react-calendly";

export function CalendlyWidget({ url }: { url: string }) {
  return (
    <div className="w-full h-[960px] md:h-[700px] bg-[#14161B] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative z-10">
      <InlineWidget 
        url={url} 
        styles={{ height: "100%", width: "100%" }}
        pageSettings={{
          backgroundColor: '14161B',
          hideEventTypeDetails: true,
          hideLandingPageDetails: true,
          primaryColor: 'C5A46C',
          textColor: 'ffffff'
        }}
      />
    </div>
  );
}
