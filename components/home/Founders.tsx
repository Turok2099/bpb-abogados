"use client";

import { useEffect, useRef, useState } from "react";

interface PartnerCardProps {
  name: string;
  role: string;
  imgUrl: string;
  altText: string;
}

function PartnerCard({ name, role, imgUrl, altText }: PartnerCardProps) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo aplicar la lógica de scroll activo en dispositivos móviles (pantalla < 768px)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        // Zona activa en el centro de la pantalla (corta 20% arriba y abajo)
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.3,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={cardRef} className="max-w-sm mx-auto w-full group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-8 border-b-2 border-transparent group-hover:border-secondary transition-colors duration-500">
        <img
          alt={altText}
          className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 ${
            isActive 
              ? "grayscale-0 scale-105" 
              : "grayscale group-hover:grayscale-0"
          }`}
          src={imgUrl}
        />
        <div 
          className={`absolute inset-0 bg-gray-500/40 mix-blend-multiply pointer-events-none transition-opacity duration-700 ${
            isActive ? "opacity-0" : "group-hover:opacity-0"
          }`}
        ></div>
      </div>
      <div className="flex items-baseline gap-3 mb-4">
        <h3 className="font-headline text-2xl text-white">
          {name}
        </h3>
        <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
          {role}
        </p>
      </div>
      <div className="editorial-line mb-4 opacity-40"></div>
    </div>
  );
}

export function Founders() {
  return (
    <section id="socios" className="py-20 md:py-32 px-8 bg-surface scroll-mt-24">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left mb-16 md:mb-24 gap-8 md:gap-12">
          <div className="max-w-md shrink-0 flex flex-col items-center md:items-start">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
              Liderazgo &amp; Visión
            </p>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-7xl text-white font-light">
              Socios Fundadores
            </h2>
          </div>
          <div className="max-w-2xl text-center md:text-left">
            <blockquote className="border-l-0 md:border-l-2 border-secondary/50 pl-0 md:pl-10">
              <p className="font-headline text-xl sm:text-2xl md:text-3xl text-white/90 leading-snug">
                "Nuestra filosofía de trabajo se sustenta en la seriedad profesional, la honestidad, la confidencialidad y el compromiso permanente con los intereses de quienes confían en nosotros."
              </p>
            </blockquote>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <PartnerCard
            name="Guillermo D. Betard"
            role="Socio"
            imgUrl="https://res.cloudinary.com/dxbtafe9u/image/upload/v1780111745/Gemini_Generated_Image_y1zur4y1zur4y1zu_dpjtza.jpg"
            altText="Retrato Profesional Dr. Guillermo Betard"
          />
          <PartnerCard
            name="Mariano A. Pacífico"
            role="Socio"
            imgUrl="https://res.cloudinary.com/dxbtafe9u/image/upload/v1780111809/Gemini_Generated_Image_1h9t6r1h9t6r1h9t_foo9f0.jpg"
            altText="Retrato Profesional Dr. Mariano Pacifico"
          />
          <PartnerCard
            name="Rodrigo E. Biondi"
            role="Socio"
            imgUrl="https://res.cloudinary.com/dxbtafe9u/image/upload/v1780111731/Gemini_Generated_Image_ijod61ijod61ijod_kogs4c.jpg"
            altText="Retrato Profesional Dr. Rodrigo Biondi"
          />
        </div>
      </div>
    </section>
  );
}
