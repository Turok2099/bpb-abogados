"use client";

import { useEffect, useState } from 'react';

export function WhatsAppWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-3 group">
      {/* Label tooltip that shows on hover */}
      <span className="bg-surface border border-secondary/30 text-white font-label text-xs uppercase tracking-widest py-2 px-4 rounded-full shadow-2xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-md">
        Consulta por WhatsApp
      </span>
      
      {/* WhatsApp Link Button */}
      <a
        href="https://wa.me/5491176310531?text=Hola!%20Me%20contacto%20desde%20la%20web%20para%20realizar%20una%20consulta."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.7)] transition-all duration-300 hover:scale-110 active:scale-95 relative"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping -z-10 duration-1000"></span>
        
        {/* WhatsApp Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-7 h-7"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.48 4.961 1.482 5.426.002 9.843-4.414 9.846-9.843.002-2.63-1.023-5.102-2.886-6.968-1.862-1.865-4.334-2.89-6.969-2.891-5.43 0-9.85 4.417-9.854 9.848-.002 1.703.447 3.37 1.304 4.854L1.97 22.03l4.677-1.876zm13.155-8.232c-.302-.15-1.787-.882-2.064-.982-.278-.1-.48-.15-.68.15-.2.3-.775.982-.95 1.183-.175.2-.35.225-.652.075-.302-.15-1.275-.47-2.43-1.502-.897-.8-1.502-1.79-1.278-2.19.224-.38.1-.58.05-.68-.05-.1-.2-.8-.275-1.026-.075-.223-.153-.19-.224-.19-.07 0-.15 0-.225 0-.075 0-.2.03-.3.15-.1.12-1.002 1.002-1.002 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.068 3.16 5.012 4.43.7.3 1.25.48 1.67.61.7.22 1.34.19 1.85.11.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.075-.125-.275-.2-.575-.35z"/>
        </svg>
      </a>
    </div>
  );
}
