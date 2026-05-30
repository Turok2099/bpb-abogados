import { ArrowRight, FileText, CheckCircle, Clock, Shield } from "lucide-react";
import Link from "next/link";
import "../theme.css";
import { CalendlyWidget } from "../../components/CalendlyWidget";

export default function Infraestructura() {
  return (
    <div>
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col justify-center px-8 md:px-24 py-20 pt-32 md:py-32 md:pt-48">
          <div className="absolute inset-0 z-0">
            <img
              alt="Infraestructura y Real Estate"
              className="w-full h-full object-cover"
              src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1780114028/bpbabogados_sud2ah.png"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="max-w-5xl relative z-10">
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-8 block">
              BPB REAL ESTATE &amp; INFRAESTRUCTURA
            </p>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl text-white leading-[1.1] font-extralight tracking-tight mb-8">
              Monetice la infraestructura eléctrica de sus desarrollos.
            </h1>
            <div className="mt-12 flex flex-col items-start border-t border-white/20 pt-8">
              <h2 className="font-body text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed mb-10">
                En BPB Abogados asesoramos y representamos a desarrolladores
                inmobiliarios, fiduciarios, constructoras y consorcios de
                copropietarios en reclamos vinculados a instalaciones
                eléctricas, cámaras transformadoras, centros de transformación y
                servidumbres administrativas de electroducto impuestas por
                distribuidoras de energía eléctrica como Edesur y Edenor.
              </h2>
              <Link
                href="/test-de-viabilidad"
                className="inline-flex items-center justify-center border border-white/30 px-8 py-4 font-label text-xs uppercase tracking-[0.15em] font-bold text-white hover:bg-secondary hover:border-secondary hover:text-primary transition-all duration-500 rounded-sm w-fit"
              >
                Solicitar Test de Viabilidad (en 48hs)
              </Link>
            </div>
          </div>
        </section>

        {/* Ámbito de Actuación y Enfoque */}
        <section className="py-20 md:py-32 px-8 bg-background">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                Alcance de Intervención
              </p>
              <h2 className="font-headline text-3xl md:text-5xl text-white font-light leading-snug">
                Recupero integral de costos frente a imposiciones técnicas
                abusivas.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Card 1: Análisis Integral */}
              <div className="md:col-span-8 bg-surface-container p-10 md:p-14 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-secondary/30 transition-colors duration-500">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-secondary/10 transition-colors duration-700 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="font-headline text-2xl md:text-3xl text-white mb-6">
                    Análisis y Representación Integral
                  </h3>
                  <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-6">
                    Nuestra intervención comprende el análisis integral de la
                    legalidad y alcance de las exigencias técnicas y económicas
                    impuestas durante el desarrollo de emprendimientos
                    inmobiliarios.
                  </p>
                  <p className="font-body text-lg text-white/80 leading-relaxed">
                    Promovemos reclamos administrativos y judiciales destinados
                    al recupero de los costos de construcción, adecuación,
                    cesión de espacios, afectación de superficies y demás
                    erogaciones asumidas para la instalación de cámaras
                    transformadoras y tendidos eléctricos.
                  </p>
                </div>
              </div>

              {/* Card 2: Enfoque */}
              <div className="md:col-span-4 bg-primary p-10 rounded-2xl border border-secondary/20 relative overflow-hidden flex flex-col justify-center">
                <div className="relative z-10">
                  <Shield className="text-secondary w-10 h-10 mb-6" />
                  <h3 className="font-headline text-2xl text-white mb-4">
                    Enfoque Estratégico
                  </h3>
                  <p className="font-body text-on-primary-container leading-relaxed">
                    Brindamos un enfoque orientado tanto a la{" "}
                    <strong className="text-white font-semibold">
                      prevención de contingencias
                    </strong>{" "}
                    durante la etapa de desarrollo del proyecto como al{" "}
                    <strong className="text-white font-semibold">
                      recupero económico
                    </strong>{" "}
                    de los costos indebidamente trasladados.
                  </p>
                </div>
              </div>

              {/* Card 3: Ámbitos */}
              <div className="md:col-span-6 bg-surface-container-low p-10 rounded-2xl border border-white/5 hover:border-secondary/20 transition-colors">
                <h3 className="font-headline text-xl text-white mb-8">
                  Ámbitos de Actuación
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <ArrowRight className="text-secondary w-5 h-5 shrink-0 mt-1" />
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      Procedimientos ante el Ente Nacional Regulador de la
                      Electricidad (ENRE).
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <ArrowRight className="text-secondary w-5 h-5 shrink-0 mt-1" />
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      Negociaciones extrajudiciales y litigios vinculados a la
                      constitución y compensación de servidumbres de
                      electroducto.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <ArrowRight className="text-secondary w-5 h-5 shrink-0 mt-1" />
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      Indemnizaciones por afectación de partes comunes,
                      depreciación funcional y ocupaciones permanentes.
                    </p>
                  </li>
                </ul>
              </div>

              {/* Card 4: Sustento Normativo */}
              <div className="md:col-span-6 bg-surface-container-low p-10 rounded-2xl border border-white/5 hover:border-secondary/20 transition-colors">
                <h3 className="font-headline text-xl text-white mb-8">
                  Sustento Normativo
                </h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-label uppercase tracking-widest text-white/80 border border-white/10">
                    Ley N° 24.065
                  </span>
                  <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-label uppercase tracking-widest text-white/80 border border-white/10">
                    Ley N° 19.552
                  </span>
                  <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-label uppercase tracking-widest text-white/80 border border-white/10">
                    Código Civil y Comercial
                  </span>
                </div>
                <p className="font-body text-on-surface-variant leading-relaxed text-base">
                  La actuación se sustenta en la Ley Nacional de Energía
                  Eléctrica, la Ley de Servidumbre Administrativa de
                  Electroducto y el Código Civil y Comercial —particularmente en
                  materia de responsabilidad, restricciones al dominio y
                  reparación plena— junto con la normativa reglamentaria del
                  ENRE.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 4: El Proceso y la Documentación */}
        <section className="py-20 md:py-32 px-8 bg-surface border-t border-white/5">
          <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/2">
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                Eficiencia y Ejecución
              </p>
              <h2 className="font-headline text-4xl md:text-5xl text-white font-light mb-8">
                Cuatro fases de precisión para recuperar su inversión.
              </h2>
              <p className="text-on-surface-variant font-body text-xl leading-relaxed text-justify-custom">
                Nuestro equipo hiper-especializado audita toda la evidencia
                material para blindar el expediente desde el día uno. Nos
                encargamos de la Auditoría Técnica y Legal, agotamos la
                Reclamación Administrativa ante el ENRE, ejecutamos la Presión
                Directa/Mediación con las gerencias legales y, solo de ser
                necesario, aplicamos litigio estratégico de máxima precisión.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-primary p-8 md:p-12 border border-secondary/20 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
                <h3 className="font-headline text-3xl text-white mb-6 relative z-10">
                  ¿Qué insumos necesitamos de su parte?
                </h3>
                <p className="text-white/90 font-body text-lg leading-relaxed relative z-10 mb-8">
                  Solo necesitamos los Contratos de Fideicomiso o Estatuto, la
                  acreditación de personería y las facturas detalladas de la
                  obra.
                </p>
                <div className="border-t border-white/10 pt-6 relative z-10">
                  <p className="text-on-primary-container font-body leading-relaxed">
                    Si el consorcio ya está conformado, sumaremos el{" "}
                    <strong className="text-white">
                      Reglamento de Copropiedad
                    </strong>
                    , el <strong className="text-white">Plano PH</strong> y el{" "}
                    <strong className="text-white">acta de asamblea</strong>.
                    Nosotros hacemos el resto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 5: Urgencia y Llamada a la Acción */}
        <section className="py-20 md:py-32 px-8 bg-surface-bright border-t border-white/5">
          <div className="max-w-screen-xl mx-auto text-center">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-6">
              El momento de actuar
            </p>
            <h2 className="font-headline text-4xl md:text-6xl text-white font-light mb-8 max-w-4xl mx-auto leading-snug">
              Test de Viabilidad de su portafolio.
            </h2>
            <p className="font-body text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed mb-16">
              Transforme sus metros cuadrados inmovilizados y gastos hundidos en
              liquidez. El escrutinio regulatorio actual sobre las
              distribuidoras no tiene precedentes, volviéndolas altamente
              vulnerables ante reclamos técnicos bien fundamentados. Es el
              momento exacto para actuar.
            </p>

            <div className="bg-surface-container border border-white/10 text-white p-8 md:p-16 max-w-4xl mx-auto rounded-2xl shadow-2xl text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-2/3">
                  <h3 className="font-headline text-3xl mb-4 text-white">
                    Agende una evaluación técnica confidencial.
                  </h3>
                  <div className="flex items-center gap-3 text-white/80 mb-6">
                    <Clock className="w-5 h-5 text-secondary" />
                    <p className="font-body text-sm font-bold tracking-wide">
                      En 48 horas entregaremos un informe de viabilidad.
                    </p>
                  </div>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                    Recibirá una estimación concreta del capital recuperable,
                    sin ningún costo inicial ni compromiso vinculante.
                  </p>
                </div>
                <div className="md:w-1/3 w-full">
                  <Link
                    href="/test-de-viabilidad"
                    className="block w-full text-center bg-secondary text-surface-container py-5 px-6 text-xs font-bold tracking-[0.2em] hover:bg-white transition-all duration-300 rounded-sm"
                  >
                    INICIAR TEST DE
                    <br />
                    VIABILIDAD
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
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                Claridad Absoluta
              </p>
              <h2 className="font-headline text-4xl md:text-5xl text-white font-light mb-8">
                Preguntas Frecuentes.
              </h2>
            </div>

            <div className="md:w-2/3 space-y-12">
              <div className="border-b border-white/10 pb-8">
                <h3 className="font-headline text-2xl text-white mb-4">
                  ¿El reclamo demorará la conexión eléctrica de mi desarrollo?
                </h3>
                <p className="text-on-surface-variant font-body text-lg leading-relaxed">
                  Absolutamente no. La conexión eléctrica y el reclamo de
                  capital corren por vías diferentes. Nuestras acciones se
                  inician estratégicamente después de asegurar el suministro,
                  garantizando que pueda entregar sus unidades a tiempo.
                </p>
              </div>
              <div className="border-b border-white/10 pb-8">
                <h3 className="font-headline text-2xl text-white mb-4">
                  ¿Es legal que la distribuidora me obligue a pagar la obra para
                  darme servicio?
                </h3>
                <p className="text-on-surface-variant font-body text-lg leading-relaxed">
                  Es una práctica habitual, pero contraria a la realidad legal.
                  La obligación de abastecer e invertir es exclusiva de la
                  distribuidora. Si el desarrollista asume la obra, la Ley
                  24.065 exige la restitución total del gasto.
                </p>
              </div>
              <div>
                <h3 className="font-headline text-2xl text-white mb-4">
                  ¿Por qué se reclama también por el espacio de la cámara?
                </h3>
                <p className="text-on-surface-variant font-body text-lg leading-relaxed">
                  Porque la afectación a perpetuidad de sus metros cuadrados
                  constituye una "Servidumbre Administrativa de Electroducto".
                  Esta limitación al uso y valor de su propiedad común debe ser
                  indemnizada económicamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Calendly Section */}
        <section
          id="calendly"
          className="py-20 md:py-32 px-8 bg-surface-bright border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto text-center">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-6">
              Agendar Sesión
            </p>
            <h2 className="font-headline text-4xl md:text-5xl text-white font-light mb-12">
              Seleccione el horario de su preferencia.
            </h2>
            <div className="max-w-5xl mx-auto relative group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent opacity-100 blur-3xl pointer-events-none"></div>
              <CalendlyWidget url="https://calendly.com/bpb-abogados" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
