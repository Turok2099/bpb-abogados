import { MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-24 py-20 pt-32 md:py-32 md:pt-48">
      <div className="absolute inset-0 z-0">
        <img alt="BPB Abogados Office" className="w-full h-full object-cover brightness-[0.35]" src="/renders/oficina-2.jpeg" />
      </div>
      <div className="max-w-4xl relative z-10">
        <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-8 block">Excelencia Jurídica &amp; Visión Estratégica</p>

        <div className="mt-16 flex flex-col md:flex-row md:items-center gap-8 border-t border-white/20 pt-12">

          <a href="#contacto" className="inline-flex items-center justify-center border border-white/30 px-8 py-4 font-label text-xs uppercase tracking-[0.2em] font-bold text-white hover:bg-secondary hover:border-secondary hover:text-primary transition-all duration-500 rounded-sm">
            Agendar sesión de diagnóstico estratégico
          </a>
        </div>
      </div>
    </section>
  );
}
