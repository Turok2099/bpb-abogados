"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const servicesData = [
  {
    num: "01",
    tag: "EMPRESAS",
    title: "Asesoramiento Integral a Empresas",
    text: [
      "Brindamos asesoramiento jurídico integral a empresas y emprendimientos, acompañando el desarrollo de cada negocio desde una perspectiva estratégica y multidisciplinaria.",
      "Nuestro equipo trabaja de manera coordinada con contadores, administradores de empresas, escribanos y gestores especializados, permitiendo ofrecer soluciones eficientes y adaptadas a las necesidades particulares de cada cliente.",
      "Asistimos a nuestros clientes en la prevención y resolución de conflictos, planificación empresarial, contratación, estructuras societarias, relaciones laborales, recupero de créditos, negociaciones comerciales y representación judicial.",
      "Asimismo, contamos con sistemas de abonos y asesoramiento permanente para empresas, diseñados para brindar respuestas ágiles, previsibilidad de costos y acompañamiento continuo en la gestión diaria."
    ]
  },
  {
    num: "02",
    tag: "CORPORATIVO",
    title: "Derecho Societario y Empresarial",
    text: [
      "El área de Derecho Societario y Empresarial brinda asesoramiento integral en la constitución, organización, desarrollo y reorganización de estructuras empresarias, acompañando operaciones comerciales complejas y procesos de crecimiento corporativo.",
      "Nuestros servicios comprenden, entre otros, constitución, inscripción y reorganización de sociedades; fusiones, adquisiciones y transferencia de empresas; auditorías legales y procesos de due diligence; convenios de accionistas y acuerdos de colaboración empresaria; joint ventures y uniones transitorias de empresas; planeamiento contractual y estructuración de negocios; conflictos societarios y responsabilidad de administradores; representación de sociedades nacionales y extranjeras; asesoramiento en inversiones locales e internacionales; y participación en procesos licitatorios y contratación empresarial."
    ]
  },
  {
    num: "03",
    tag: "LABORAL",
    title: "Derecho Laboral y Relaciones del Trabajo",
    text: [
      "Nuestra práctica en Derecho Laboral asesora a empresas y empleadores en todas las cuestiones vinculadas a las relaciones individuales y colectivas del trabajo, tanto en el ámbito preventivo como contencioso.",
      "Contamos con experiencia en la representación de empresas de distintos sectores industriales y comerciales, incluyendo actividades manufactureras, de construcción y servicios.",
      "Entre nuestros principales servicios se destacan el asesoramiento laboral integral y auditorías de cumplimiento; redacción de contratos de trabajo y políticas internas; régimen disciplinario y desvinculaciones; reestructuraciones empresarias y reorganización de personal; negociaciones colectivas y conflictos sindicales; programas preventivos de crisis y retiros voluntarios; asistencia ante organismos administrativos y conciliatorios; litigios laborales y representación judicial; capacitación para áreas de recursos humanos y legales; asesoramiento en seguridad e higiene laboral; y cuestiones migratorias y estructuras compensatorias."
    ]
  },
  {
    num: "04",
    tag: "CIVIL & COMERCIAL",
    title: "Derecho Civil y Comercial",
    text: [
      "Brindamos asesoramiento y representación en asuntos civiles y comerciales, tanto en instancia judicial como extrajudicial, interviniendo en conflictos patrimoniales, contractuales y de responsabilidad civil.",
      "Nuestra práctica comprende la redacción y negociación de contratos civiles y comerciales; cobro judicial y extrajudicial de créditos; ejecuciones y medidas cautelares; conflictos derivados de contratos y obligaciones; daños y perjuicios; responsabilidad contractual y extracontractual; mediación y negociación de controversias; y asesoramiento en operaciones comerciales y patrimoniales."
    ]
  },
  {
    num: "05",
    tag: "ADMINISTRATIVO",
    title: "Derecho Administrativo",
    text: [
      "Asesoramos y representamos a empresas y particulares en sus relaciones con organismos públicos nacionales, provinciales y municipales.",
      "Intervenimos en procedimientos administrativos, licitaciones, reclamos regulatorios y contencioso administrativo, brindando asistencia integral en cuestiones vinculadas al ejercicio de la actividad estatal y regulatoria.",
      "Nuestra práctica incluye reclamos y recursos administrativos; contrataciones públicas y licitaciones; servicios públicos y entes reguladores; responsabilidad del Estado; habilitaciones y procedimientos municipales; y defensa judicial en procesos contencioso administrativos."
    ]
  },
  {
    num: "06",
    tag: "PENAL",
    title: "Derecho Penal y Penal Tributario",
    text: [
      "El Estudio cuenta con alianzas estratégicas con estudios jurídicos especializados en Derecho Penal y Penal Tributario, permitiendo brindar asistencia integral en investigaciones y procesos de alta complejidad.",
      "Intervenimos en delitos económicos y empresariales; derecho penal tributario y aduanero; defraudaciones y delitos societarios; asistencia en investigaciones penales; y representación en procesos judiciales y administrativos."
    ]
  },
  {
    num: "07",
    tag: "CONSUMIDOR",
    title: "Defensa del Consumidor",
    text: [
      "Asesoramos y representamos a empresas y consumidores en conflictos vinculados a relaciones de consumo, actuando tanto ante organismos administrativos como judiciales.",
      "Nuestra práctica incluye reclamos derivados de consumo y contratación; defensa en procedimientos administrativos; representación ante organismos de control; litigios judiciales en materia de consumo; y asesoramiento preventivo para empresas y comercios."
    ]
  },
  {
    num: "08",
    tag: "FAMILIA",
    title: "Familia y Sucesiones",
    text: [
      "El área de Familia y Sucesiones brinda asesoramiento integral en asuntos patrimoniales y personales de alta sensibilidad, priorizando soluciones eficientes y preservando los vínculos familiares cuando ello resulta posible.",
      "Nuestros servicios incluyen divorcios y liquidación de bienes; régimen patrimonial del matrimonio; convenios y acuerdos familiares; compensaciones económicas y alimentos; responsabilidad parental y cuidado personal; pactos de convivencia; planificación patrimonial y sucesoria; testamentos y particiones; procesos sucesorios nacionales e internacionales; empresas familiares y protocolos de actuación; y determinación de capacidad y actos de autoprotección."
    ]
  }
];

function ServiceCard({ service, index }: { service: any; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="group relative bg-surface-container-low border border-white/5 hover:border-secondary/30 transition-all duration-700 p-8 md:p-12 overflow-hidden rounded-xl cursor-pointer flex flex-col h-full"
      onClick={() => setExpanded(!expanded)}
    >
      <div className={`absolute ${index % 2 === 0 ? 'top-0 right-0' : 'bottom-0 left-0'} w-64 h-64 bg-secondary/5 rounded-full blur-3xl ${index % 2 === 0 ? '-translate-y-1/2 translate-x-1/2' : 'translate-y-1/2 -translate-x-1/2'} group-hover:bg-secondary/10 transition-colors duration-700`}></div>

      <div className="relative z-10 flex flex-col flex-grow">
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="font-headline text-4xl md:text-5xl text-secondary opacity-30 group-hover:opacity-100 transition-opacity duration-700 font-light">{service.num}</span>
            <span className="font-label text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white border border-white/10 group-hover:border-white/30 rounded-full px-4 py-2 transition-all duration-500">{service.tag}</span>
          </div>
          <h3 className="font-headline text-2xl md:text-3xl text-white mb-6 group-hover:text-secondary group-hover:italic transition-all duration-500 pr-8">{service.title}</h3>
          <div className="w-12 h-[1px] bg-secondary mb-6 transition-all duration-500 group-hover:w-24"></div>
        </div>
        
        <div className="text-on-surface-variant font-body text-base md:text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-500">
          <p>{service.text[0]}</p>
          
          <div className={`grid transition-all duration-500 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden space-y-4">
              {service.text.slice(1).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-6 flex items-center gap-2 text-secondary/70 group-hover:text-secondary transition-colors text-sm font-label uppercase tracking-widest font-semibold">
           {expanded ? 'Ocultar detalles' : 'Leer más'}
           <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section className="bg-surface py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Nuestra Expertise</p>
          <h2 className="font-headline text-3xl md:text-4xl text-white font-light italic mb-8">
            Áreas de Práctica.
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {servicesData.map((service, idx) => (
            <ServiceCard key={idx} service={service} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
