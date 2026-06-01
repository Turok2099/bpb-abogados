import { MapPin } from "lucide-react";

export function Authority() {
  return (
    <section className="px-8 pb-32 pt-20 bg-background">
      <div className="max-w-screen-2xl mx-auto">
        {/* Editorial Text Block */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <p className="text-secondary font-semibold font-label text-xs uppercase tracking-[0.3em] mb-4">El Estudio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-on-surface-variant font-body text-base md:text-lg leading-relaxed">
            {/* Left Column: First Paragraph with Drop Cap */}
            <div className="text-justify-custom md:text-left">
              <p className="first-letter:text-7xl first-letter:font-headline first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-2 text-white">
                Desde sus orígenes, el Estudio ha desarrollado una práctica basada en la cercanía con el cliente, la atención personalizada y la búsqueda de soluciones jurídicas eficientes, combinando experiencia, dinamismo y compromiso profesional.
              </p>
            </div>
            {/* Right Column: Other Paragraphs */}
            <div className="space-y-6 text-justify-custom md:text-left">
              <p>
                Nuestra estructura interdisciplinaria nos permite brindar un servicio integral, articulando el trabajo de abogados con profesionales especializados en áreas complementarias, tales como ciencias económicas, administración de empresas, escribanía, gestoría y consultoría técnica. Ello nos permite acompañar al cliente no sólo en la resolución de conflictos, sino también en la toma de decisiones estratégicas vinculadas a la gestión y desarrollo de sus actividades.
              </p>
              <p>
                El Estudio asesora y representa a pequeñas, medianas y grandes empresas, así como a particulares, interviniendo tanto en asuntos preventivos y extrajudiciales como en litigios complejos en sede judicial y administrativa.
              </p>
            </div>
          </div>
        </div>

        {/* Asymmetric Gallery (Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mt-24">
          {/* Large Hero Image */}
          <div className="md:col-span-8 overflow-hidden rounded-sm group relative aspect-video md:aspect-auto md:h-[600px] bg-surface-container">
            <img alt="Main Office Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="/renders/oficina-3.jpeg" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60"></div>
          </div>
          
          {/* Side Stack */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6 md:h-[600px]">
            <div className="overflow-hidden rounded-sm group relative bg-surface-container aspect-video md:aspect-auto md:flex-1">
              <img alt="Espacios de Consulta Privada" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/renders/oficina-1.jpeg" />
            </div>
            <div className="overflow-hidden rounded-sm group relative bg-surface-container aspect-video md:aspect-auto md:flex-1">
              <img alt="Lounge Area" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/renders/oficina-5.jpeg" />
            </div>
          </div>

          {/* Bottom Wide */}
          <div className="md:col-span-12 overflow-hidden rounded-sm group relative aspect-video md:aspect-[21/9] md:h-[400px] bg-surface-container">
            <img alt="Workstation Suite" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 object-bottom" src="/renders/oficina-4.jpeg" />
          </div>
        </div>

        {/* Location Badge Below Gallery */}
        <div className="flex justify-center mt-12 md:mt-16 px-4">
          <div className="flex items-center gap-6 text-left border border-white/5 rounded-2xl px-8 md:px-10 py-6 bg-surface-container shadow-2xl w-full md:w-auto hover:border-secondary/30 transition-colors">
            <div className="bg-secondary/10 p-4 rounded-full shrink-0">
              <MapPin className="text-secondary w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <p className="font-label text-xs md:text-sm tracking-[0.2em] uppercase text-white/60 mb-1 font-semibold">
                Sede Central
              </p>
              <p className="font-headline text-lg md:text-2xl text-white font-light tracking-wide">
                Bertoia Tower, Polo Hudson
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
