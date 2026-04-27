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
          <div className="max-w-5xl relative z-10">
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-8 block">BPB REAL ESTATE &amp; INFRAESTRUCTURA</p>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl text-white leading-[1.1] font-extralight tracking-tight mb-8">
              El fin del <span className="italic font-normal">"Costo Hundido"</span>: Monetizá la infraestructura eléctrica de tus desarrollos.
            </h1>
            <div className="mt-12 flex flex-col items-start border-t border-white/20 pt-8">
              <h2 className="font-body text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed mb-10">
                Vos financiaste la infraestructura; las distribuidoras capitalizan la rentabilidad. Obligamos a EDENOR y EDESUR a restituirte el <strong className="text-secondary font-bold text-2xl">100%</strong> de los gastos de construcción y a indemnizarte por los metros cuadrados cedidos.
              </h2>
              <Link href="/contacto" className="inline-flex items-center justify-center border border-white/30 px-8 py-4 font-label text-xs uppercase tracking-[0.15em] font-bold text-white hover:bg-secondary hover:border-secondary hover:text-primary transition-all duration-500 rounded-sm w-fit">
                Solicitar Evaluación Fast-Track (Viabilidad en 48hs)
              </Link>
            </div>
          </div>
        </section>

        {/* Marco Legal / Definición */}
        <section className="py-20 md:py-32 px-8 bg-surface-container-low border-b border-white/5">
          <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            <div className="lg:w-5/12 lg:sticky top-32">
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Fundamento Jurídico</p>
              <h2 className="font-headline text-4xl md:text-5xl text-white font-light italic leading-snug">
                ¿Qué es la recuperación de capital en infraestructura eléctrica?
              </h2>
            </div>
            <div className="lg:w-7/12">
              <div className="bg-surface-container p-8 md:p-14 border border-white/5 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="text-on-surface-variant font-body text-xl leading-relaxed relative z-10 text-justify-custom">
                  <p className="mb-8">
                    Es un derecho consagrado en la <strong className="text-white font-semibold">Ley 24.065</strong> y ratificado por la Corte Suprema de Justicia de la Nación (CSJN).
                  </p>
                  <p className="mb-8">
                    Obliga a las concesionarias (EDENOR y EDESUR) a restituir a las desarrolladoras inmobiliarias los gastos de obra civil y equipamiento de las cámaras transformadoras, además de pagar una indemnización por la restricción al dominio de las partes comunes (<em className="italic text-white/80">"Servidumbre Administrativa de Electroducto"</em>).
                  </p>
                  <div className="border-t border-white/10 pt-8 mt-8">
                    <p>
                      <strong className="text-secondary font-semibold">BPB Abogados</strong> audita, consolida el reclamo técnico ante el ENRE y gestiona la mediación para recuperar este capital inmovilizado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: Mitos vs Realidad */}
        <section className="py-20 md:py-32 px-8 bg-background">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">El Lado B y el Lado A</p>
              <h2 className="font-headline text-4xl md:text-5xl text-white font-light italic mb-8">
                La matriz de realidad comercial: Superando el miedo al monopolio.
              </h2>
              <p className="text-on-surface-variant font-body leading-relaxed text-lg mb-6">
                Históricamente, las distribuidoras han trasladado ilegalmente el costo de expansión de su propia red monopólica a los desarrollistas inmobiliarios. Muchas constructoras asumen erróneamente el espacio de la cámara como una "pérdida inevitable" del terreno y evitan reclamar por temor a que se paralice la entrega de unidades.
              </p>
              <p className="text-white font-body leading-relaxed text-lg font-semibold">
                En <span className="text-secondary">BPB Abogados</span> aportamos una visión integral de Real Estate. Entendemos tu timing crítico.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-surface-container-low p-8 border border-white/5 rounded-xl hover:border-secondary/30 transition-colors duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="text-secondary w-6 h-6 shrink-0" />
                  <h3 className="font-headline text-2xl text-white">Suministro garantizado</h3>
                </div>
                <p className="text-on-surface-variant font-body leading-relaxed pl-10">
                  Iniciamos las acciones de recupero estratégicamente <strong className="text-white font-medium">una vez asegurado el suministro y formalizada la transferencia de la obra</strong>. Recuperamos tu capital por vías paralelas seguras sin interferir en tus relaciones comerciales.
                </p>
              </div>
              <div className="bg-surface-container-low p-8 border border-white/5 rounded-xl hover:border-secondary/30 transition-colors duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="text-secondary w-6 h-6 shrink-0" />
                  <h3 className="font-headline text-2xl text-white">Fundamento Inamovible</h3>
                </div>
                <p className="text-on-surface-variant font-body leading-relaxed pl-10">
                  No es una aventura legal. Nos basamos en el Art. 19 de la Ley 24.065 (Abuso de Posición Dominante) y aprovechamos el actual escenario regulatorio, donde el ENRE ha aplicado multas recientes por más de $156 millones a las concesionarias por incumplimientos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 4: El Proceso y la Documentación */}
        <section className="py-20 md:py-32 px-8 bg-surface border-t border-white/5">
          <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/2">
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Eficiencia y Ejecución</p>
              <h2 className="font-headline text-4xl md:text-5xl text-white font-light italic mb-8">
                Cuatro fases de precisión para recuperar tu inversión.
              </h2>
              <p className="text-on-surface-variant font-body text-xl leading-relaxed text-justify-custom">
                Nuestro equipo hiper-especializado audita toda la evidencia material para blindar el expediente desde el día uno. Nos encargamos de la Auditoría Técnica y Legal, agotamos la Reclamación Administrativa ante el ENRE, ejecutamos la Presión Directa/Mediación con las gerencias legales y, solo de ser necesario, aplicamos litigio estratégico de máxima precisión.
              </p>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-primary p-8 md:p-12 border border-secondary/20 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
                <h3 className="font-headline text-3xl text-white mb-6 italic relative z-10">¿Qué insumos necesitamos de tu parte?</h3>
                <p className="text-white/90 font-body text-lg leading-relaxed relative z-10 mb-8">
                  Solo necesitamos los Contratos de Fideicomiso o Estatuto, la acreditación de personería y las facturas detalladas de la obra.
                </p>
                <div className="border-t border-white/10 pt-6 relative z-10">
                  <p className="text-on-primary-container font-body leading-relaxed">
                    Si el consorcio ya está conformado, sumaremos el <strong className="text-white">Reglamento de Copropiedad</strong>, el <strong className="text-white">Plano PH</strong> y el <strong className="text-white">acta de asamblea</strong>. Nosotros hacemos el resto.
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
              Evaluación Fast-Track de tu portafolio.
            </h2>
            <p className="font-body text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed mb-16">
              Transformá tus metros cuadrados inmovilizados y gastos hundidos en liquidez. El escrutinio regulatorio actual sobre las distribuidoras no tiene precedentes, volviéndolas altamente vulnerables ante reclamos técnicos bien fundamentados. Es el momento exacto para actuar.
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
                    Vas a recibir una estimación concreta del capital recuperable, sin ningún costo inicial ni compromiso vinculante.
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

        {/* Sección FAQ */}
        <section className="py-20 md:py-32 px-8 bg-background border-t border-white/5">
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-16 items-start">
            <div className="md:w-1/3">
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Claridad Absoluta</p>
              <h2 className="font-headline text-4xl md:text-5xl text-white font-light italic mb-8">
                Preguntas Frecuentes.
              </h2>
            </div>
            
            <div className="md:w-2/3 space-y-12">
              <div className="border-b border-white/10 pb-8">
                <h3 className="font-headline text-2xl text-white mb-4">¿El reclamo demorará la conexión eléctrica de mi desarrollo?</h3>
                <p className="text-on-surface-variant font-body text-lg leading-relaxed">
                  Absolutamente no. La conexión eléctrica y el reclamo de capital corren por vías diferentes. Nuestras acciones se inician estratégicamente después de asegurar el suministro, garantizando que puedas entregar tus unidades a tiempo.
                </p>
              </div>
              <div className="border-b border-white/10 pb-8">
                <h3 className="font-headline text-2xl text-white mb-4">¿Es legal que la distribuidora me obligue a pagar la obra para darme servicio?</h3>
                <p className="text-on-surface-variant font-body text-lg leading-relaxed">
                  Es una práctica habitual, pero contraria a la realidad legal. La obligación de abastecer e invertir es exclusiva de la distribuidora. Si el desarrollista asume la obra, la Ley 24.065 exige la restitución total del gasto.
                </p>
              </div>
              <div>
                <h3 className="font-headline text-2xl text-white mb-4">¿Por qué se reclama también por el espacio de la cámara?</h3>
                <p className="text-on-surface-variant font-body text-lg leading-relaxed">
                  Porque la afectación a perpetuidad de tus metros cuadrados constituye una "Servidumbre Administrativa de Electroducto". Esta limitación al uso y valor de tu propiedad común debe ser indemnizada económicamente.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
