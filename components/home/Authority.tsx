import { MapPin } from "lucide-react";

export function Authority() {
  return (
    <section className="px-8 pb-32 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-screen-2xl mx-auto">
        <div className="md:col-span-12 p-8 md:p-16 lg:p-24 bg-surface-container">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-5">
              <p className="text-secondary font-semibold font-label text-xs uppercase tracking-[0.2em] mb-4">El Estudio</p>
              <h2 className="font-headline text-3xl md:text-5xl text-white font-light mb-8 leading-snug">
                Una sólida trayectoria orientada al asesoramiento integral.
              </h2>
              <div className="w-16 h-[1px] bg-secondary mb-8"></div>
              <p className="text-white/90 font-body text-lg leading-relaxed">
                BPB Abogados es un estudio jurídico fundado sobre una sólida trayectoria profesional y una visión moderna del ejercicio del derecho, orientada al asesoramiento integral de empresas, asociaciones y clientes particulares.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-6 text-on-surface-variant font-body text-base md:text-lg leading-relaxed">
              <p>
                Desde sus orígenes, el Estudio ha desarrollado una práctica basada en la cercanía con el cliente, la atención personalizada y la búsqueda de soluciones jurídicas eficientes, combinando experiencia, dinamismo y compromiso profesional.
              </p>
              <p>
                Nuestra estructura interdisciplinaria nos permite brindar un servicio integral, articulando el trabajo de abogados con profesionales especializados en áreas complementarias, tales como ciencias económicas, administración de empresas, escribanía, gestoría y consultoría técnica. Ello nos permite acompañar al cliente no sólo en la resolución de conflictos, sino también en la toma de decisiones estratégicas vinculadas a la gestión y desarrollo de sus actividades.
              </p>
              <p>
                El Estudio asesora y representa a pequeñas, medianas y grandes empresas, así como a particulares, interviniendo tanto en asuntos preventivos y extrajudiciales como en litigios complejos en sede judicial y administrativa.
              </p>
              <div className="p-6 mt-8 bg-surface-container-low border-l-2 border-secondary italic text-white/80 text-base">
                Nuestra filosofía de trabajo se sustenta en la seriedad profesional, la honestidad, la confidencialidad y el compromiso permanente con los intereses de quienes confían en nosotros.
              </div>
            </div>
          </div>
        </div>

        {/* Office Render 2 */}
        <div className="md:col-span-4 overflow-hidden aspect-[4/3] md:aspect-square bg-surface-container-low">
          <img alt="Espacios de Consulta Privada" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" src="/renders/oficina-1.jpeg" />
        </div>

        {/* Office Render 3 & 4 (Bento Mini) */}
        <div className="md:col-span-4 overflow-hidden aspect-[4/3] md:aspect-square bg-surface-container-low">
          <img alt="Workstation Suite" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" src="/renders/oficina-4.jpeg" />
        </div>
        <div className="md:col-span-4 overflow-hidden aspect-[4/3] md:aspect-square bg-surface-container-low">
          <img alt="Lounge Area" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" src="/renders/oficina-5.jpeg" />
        </div>

        {/* Main Lobby Render */}
        <div className="md:col-span-12 overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-surface-container-low mt-4">
          <img alt="Main Office Gallery" className="w-full h-full object-cover transition-all duration-1000 hover:scale-105" src="/renders/oficina-3.jpeg" />
        </div>

        {/* Ubicación Legend */}
        <div className="md:col-span-12 mt-8 flex justify-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-3 text-center border border-white/10 rounded-full px-6 py-3 bg-surface-container-low/50 backdrop-blur-sm">
            <MapPin className="text-secondary w-4 h-4 shrink-0" />
            <p className="font-body text-xs md:text-sm text-on-surface-variant tracking-widest uppercase">
              Visite nuestras oficinas en <strong className="text-white font-medium">Bertoia Tower, Polo Hudson</strong>, Au. Buenos Aires - La Plata Km. 30, Buenos Aires, Argentina
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
