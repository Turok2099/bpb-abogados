import { MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[90vh] flex flex-col justify-center px-6 md:px-24 py-16 pt-28 md:py-32 md:pt-48">
      <div className="absolute inset-0 z-0">
        <img alt="BPB Abogados Office" className="w-full h-full object-cover brightness-[0.35]" src="/renders/oficina-2.jpeg" />
      </div>
      <div className="max-w-4xl relative z-10 flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
        <p className="font-label text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-secondary font-semibold mb-6 md:mb-8 block">Excelencia Jurídica &amp; Visión Estratégica</p>

        <h1 className="font-headline text-3xl sm:text-5xl md:text-7xl text-white font-light mb-6 md:mb-8 leading-tight md:leading-snug">
          Una sólida trayectoria orientada al asesoramiento integral.
        </h1>
        <p className="font-body text-sm md:text-xl text-white/90 max-w-3xl leading-relaxed mb-8 md:mb-10">
          BPB Abogados es un estudio jurídico fundado sobre una sólida trayectoria profesional y una visión moderna del ejercicio del derecho, orientada al asesoramiento integral de empresas, asociaciones y clientes particulares.
        </p>

        <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-center gap-8 w-full md:w-auto">
          <a href="#contacto" className="inline-flex items-center justify-center border border-white/30 px-8 py-4 font-label text-xs uppercase tracking-[0.2em] font-bold text-white hover:bg-secondary hover:border-secondary hover:text-primary transition-all duration-500 rounded-sm w-full md:w-auto">
            Agendar sesión de diagnóstico estratégico
          </a>
        </div>
      </div>
    </section>
  );
}
