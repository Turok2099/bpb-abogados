"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

export function CookieAlert() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if consent has already been given or rejected
    const consent = localStorage.getItem("bpb-cookie-consent");
    if (!consent) {
      // Small delay to make the entrance look more natural
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("bpb-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("bpb-cookie-consent", "rejected");
    setIsVisible(false);
  };

  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-8 md:bottom-8 z-45 max-w-md w-auto bg-surface-container-high/95 border border-secondary/20 rounded-sm shadow-2xl p-6 backdrop-blur-md transition-all duration-500 transform translate-y-0 animate-fade-in-up">
      <div className="flex flex-col gap-4">
        {/* Header with Title and Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-sm">
            <Cookie className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
              POLÍTICA DE COOKIES
            </h3>
          </div>
          <button
            onClick={handleReject}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Cerrar aviso de cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description Text */}
        <p className="font-body text-xs md:text-sm text-white/70 leading-relaxed text-justify-custom">
          Utilizamos cookies para optimizar la navegación de nuestro sitio web y analizar el tráfico de forma segura. Al hacer clic en &quot;Aceptar&quot;, consiente su uso.
        </p>

        {/* Action Buttons (Height 48px for Touch Targets) */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleReject}
            className="flex-1 h-12 border border-white/20 hover:border-white/40 text-white/70 hover:text-white hover:bg-white/5 active:scale-[0.98] text-[10px] md:text-xs uppercase tracking-widest font-semibold font-label transition-all duration-300 rounded-sm flex items-center justify-center cursor-pointer"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 h-12 bg-secondary hover:bg-secondary-fixed text-primary active:scale-[0.98] text-[10px] md:text-xs uppercase tracking-widest font-bold font-label transition-all duration-300 rounded-sm flex items-center justify-center cursor-pointer shadow-lg shadow-secondary/15"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
