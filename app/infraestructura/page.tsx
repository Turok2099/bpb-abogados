import { ArrowRight, FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import "../theme.css";

export default function Infraestructura() {
  return (
    <div>
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col justify-center px-8 md:px-24 py-20 pt-32 md:py-32 md:pt-48">
          <div className="absolute inset-0 z-0">
            <img alt="Infraestructura y Real Estate" className="w-full h-full object-cover" src="/prueba.jpg" />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="max-w-4xl relative z-10">
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-8 block">Real Estate &amp; Infraestructura</p>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl text-white leading-[1.1] font-extralight tracking-tight mb-8">
              Monetización de <span className="italic font-normal">activos ocultos</span> para desarrollistas.
            </h1>
            <div className="mt-12 border-t border-white/20 pt-8">
              <p className="font-body text-lg text-white/90 max-w-2xl leading-relaxed">
                Recupere hasta <strong className="text-secondary font-bold text-xl">80M ARS</strong> por infraestructura eléctrica (cámaras transformadoras) inmovilizada al finalizar sus desarrollos inmobiliarios. Sin juicios. Sin inversión inicial. A resultado.
              </p>
            </div>
          </div>
        </section>

        {/* Proceso y Requisitos */}
        <section className="py-20 md:py-32 px-8 bg-background">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Eficiencia Absoluta</p>
              <h2 className="font-headline text-4xl md:text-5xl text-white font-light italic mb-8">
                Usted aporta los documentos. Nosotros hacemos el resto.
              </h2>
              <p className="text-on-surface-variant font-body leading-relaxed text-lg mb-8">
                Nuestro proceso está diseñado para no consumir el tiempo de sus equipos internos. Gestionamos la totalidad del reclamo administrativo ante las distribuidoras. Solo necesitamos:
              </p>
              <ul className="space-y-6 border-l border-outline-variant/30 pl-6 ml-2">
                <li className="relative">
                  <div className="absolute -left-10 top-1 bg-background p-1 rounded-full"><FileText className="text-secondary w-5 h-5" /></div>
                  <h3 className="font-headline text-xl text-white mb-1">Reglamento de Copropiedad</h3>
                  <p className="font-body text-sm text-on-surface-variant">Documentación fundacional del consorcio.</p>
                </li>
                <li className="relative">
                  <div className="absolute -left-10 top-1 bg-background p-1 rounded-full"><FileText className="text-secondary w-5 h-5" /></div>
                  <h3 className="font-headline text-xl text-white mb-1">Plano PH</h3>
                  <p className="font-body text-sm text-on-surface-variant">Planos aprobados de subdivisión y mensura.</p>
                </li>
                <li className="relative">
                  <div className="absolute -left-10 top-1 bg-background p-1 rounded-full"><FileText className="text-secondary w-5 h-5" /></div>
                  <h3 className="font-headline text-xl text-white mb-1">Acta de Asamblea</h3>
                  <p className="font-body text-sm text-on-surface-variant">Autorización formal de los copropietarios.</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-surface-container-high/40 backdrop-blur-md p-10 md:p-12 shadow-2xl border border-white/5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
              <h3 className="font-headline text-3xl text-white mb-8 italic relative z-10">¿Por qué es viable?</h3>
              <div className="space-y-8 relative z-10">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="text-secondary shrink-0 mt-1" />
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Las distribuidoras eléctricas están obligadas a compensar la infraestructura cedida, pero evaden el pago escudándose en procesos burocráticos complejos.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="text-secondary shrink-0 mt-1" />
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Nuestro equipo técnico-legal estructura un reclamo impecable por vía administrativa que obliga a la empresa a liquidar en un promedio de 6 meses.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="text-secondary shrink-0 mt-1" />
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    <strong className="text-white font-semibold">Usted cobra directo de la distribuidora.</strong> Nosotros solo facturamos honorarios una vez que el capital está depositado en su cuenta bancaria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 5: Urgencia y Llamada a la Acción */}
        <section className="py-20 md:py-32 px-8 bg-surface-bright border-t border-white/5">
          <div className="max-w-screen-xl mx-auto text-center">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-6">El momento de actuar</p>
            <h2 className="font-headline text-4xl md:text-6xl text-white font-light italic mb-8 max-w-4xl mx-auto leading-snug">
              Evaluación Fast-Track de su portafolio.
            </h2>
            <p className="font-body text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed mb-16">
              Transforme sus metros cuadrados inmovilizados y gastos hundidos en liquidez. El escrutinio regulatorio actual sobre las distribuidoras no tiene precedentes, volviéndolas altamente vulnerables ante reclamos técnicos bien fundamentados. Es el momento exacto para actuar.
            </p>
            
            <div className="bg-surface-container border border-white/10 text-white p-8 md:p-16 max-w-4xl mx-auto rounded-2xl shadow-2xl text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-2/3">
                  <h3 className="font-headline text-3xl mb-4 text-white">Agende una evaluación técnica confidencial.</h3>
                  <div className="flex items-center gap-3 text-white/80 mb-6">
                    <Clock className="w-5 h-5 text-secondary" />
                    <p className="font-body text-sm font-bold tracking-wide">En 48 horas entregaremos un informe de viabilidad.</p>
                  </div>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                    Recibirá una estimación concreta del capital recuperable, sin ningún costo inicial ni compromiso vinculante.
                  </p>
                </div>
                <div className="md:w-1/3 w-full">
                  <Link href="/contacto" className="block w-full text-center bg-secondary text-surface-container py-5 px-6 text-xs font-bold tracking-[0.2em] hover:bg-white transition-all duration-300 rounded-sm">
                    AGENDAR REUNIÓN<br/>EJECUTIVA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
