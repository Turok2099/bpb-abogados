import { MapPin } from "lucide-react";
import "./theme.css";

export default function Home() {
  return (
    <div>

      <main>
        {/* Hero Section: Editorial & Minimalist */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-24 py-20 pt-32 md:py-32 md:pt-48">
          <div className="absolute inset-0 z-0">
            <img alt="BPB Abogados Office" className="w-full h-full object-cover brightness-[0.35]" src="/renders/oficina-2.jpeg" />
          </div>
          <div className="max-w-4xl relative z-10">
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-8 block">Excelencia Jurídica &amp; Visión Estratégica</p>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-8xl text-white leading-[1.1] font-extralight tracking-tight">
              Estrategias legales profundas para decisiones corporativas complejas.
            </h1>
            <div className="mt-16 flex flex-col md:flex-row md:items-center gap-8 border-t border-white/20 pt-12">
              <h2 className="font-body text-lg text-white/90 max-w-md leading-relaxed">
                Protegemos el capital y aseguramos el crecimiento de las empresas en Argentina. Más de 16 años de resultados silenciosos, ahora a tu disposición.
              </h2>
              <a href="#contacto" className="inline-flex items-center justify-center border border-white/30 px-8 py-4 font-label text-xs uppercase tracking-[0.2em] font-bold text-white hover:bg-secondary hover:border-secondary hover:text-primary transition-all duration-500 rounded-sm">
                Agendar sesión de diagnóstico estratégico
              </a>
            </div>
          </div>
        </section>

        {/* Signature Image Grid (Bento Style) */}
        <section className="px-8 pb-32 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-screen-2xl mx-auto">

            <div className="md:col-span-12 flex flex-col items-center justify-center text-center p-8 md:p-16 lg:p-24 bg-surface-container">
              <div className="max-w-4xl mx-auto">
                <p className="text-secondary font-semibold font-label text-xs uppercase tracking-[0.2em] mb-4">Autoridad &amp; Certidumbre</p>
                <h2 className="font-headline text-4xl md:text-5xl text-white font-light italic mb-8">¿Por qué elegir a BPB Abogados?</h2>
                <p className="text-on-surface-variant font-body text-lg leading-relaxed">
                  En el entorno empresarial B2B, las decisiones no admiten improvisaciones. En BPB Abogados diseñamos arquitectura jurídica. Nos especializamos en derecho comercial, societario y monetización de infraestructura, ofreciendo a los directorios y CEOs la certidumbre necesaria para escalar sus negocios con riesgo cero.
                </p>
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

        {/* The "Filosofía" Section */}
        <section className="py-20 md:py-32 px-8 bg-surface-bright flex justify-center text-center">
          <div className="max-w-4xl">
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-8 block">Nuestra filosofía</p>
            <h2 className="font-headline text-4xl md:text-6xl italic font-light leading-snug text-white mb-12">
              Nuestros resultados son nuestra mejor credencial.
            </h2>
            <div className="text-on-surface-variant font-body text-lg leading-relaxed text-justify-custom space-y-6">
              <p>
                Durante 16 años, los socios fundadores de BPB Abogados eligieron operar bajo un estricto perfil bajo. Nuestro crecimiento no se basó en publicidad, sino en la confianza inquebrantable de los clientes que nos confiaron la estructuración de sus sociedades y la resolución de sus conflictos más críticos.
              </p>
              <p>
                Hoy, el mercado exige transparencia y una mayor cercanía. La inauguración de nuestras nuevas oficinas marca el inicio de una nueva etapa: consolidamos nuestra presencia para poner nuestra metodología, nuestra red de contactos y nuestro rigor técnico al servicio de un grupo selecto de empresas e inversores que buscan un aliado estratégico a largo plazo.
              </p>
              <p className="font-semi bold text-white">
                En <strong className="text-secondary">BPB Abogados</strong> priorizamos un modelo de trabajo enfocado, en el que cada caso es liderado y ejecutado directamente por nuestros socios, garantizando alineación y seguimiento en cada etapa.
              </p>
            </div>
          </div>
        </section>

        {/* Services / Core Practices Section (Premium UI Cards) */}
        <section className="bg-surface py-24 md:py-32 px-4 md:px-8">
          <div className="max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 md:mb-24">
              <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Nuestra Expertise</p>
              <h2 className="font-headline text-3xl md:text-4xl text-white font-light italic mb-8">
                Arquitectura legal para el ciclo de vida de su empresa.
              </h2>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {/* Service 1 */}
              <div className="group relative bg-surface-container-low border border-white/5 hover:border-secondary/30 transition-all duration-700 p-10 md:p-16 overflow-hidden rounded-xl cursor-pointer">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-colors duration-700"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div>
                    <div className="flex items-center justify-between mb-12">
                      <span className="font-headline text-5xl md:text-6xl text-secondary opacity-30 group-hover:opacity-100 transition-opacity duration-700 font-light">01</span>
                      <span className="font-label text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white border border-white/10 group-hover:border-white/30 rounded-full px-4 py-2 transition-all duration-500">ESTRUCTURACIÓN</span>
                    </div>
                    <h3 className="font-headline text-3xl md:text-4xl text-white mb-6 group-hover:text-secondary group-hover:italic transition-all duration-500">Derecho Societario <br className="hidden lg:block" />y Corporativo</h3>
                    <div className="w-12 h-[1px] bg-secondary mb-8 transition-all duration-500 group-hover:w-24"></div>
                  </div>
                  <p className="text-on-surface-variant font-body text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-500 mb-10">
                    Diseñamos la estructura legal que su empresa necesita para operar, escalar o fusionarse con seguridad. Desde la constitución de sociedades hasta la resolución de conflictos societarios y la redacción de contratos comerciales blindados.
                  </p>

                </div>
              </div>

              {/* Service 2 */}
              <div className="group relative bg-surface-container-low border border-white/5 hover:border-secondary/30 transition-all duration-700 p-10 md:p-16 overflow-hidden rounded-xl cursor-pointer">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-secondary/10 transition-colors duration-700"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div>
                    <div className="flex items-center justify-between mb-12">
                      <span className="font-headline text-5xl md:text-6xl text-secondary opacity-30 group-hover:opacity-100 transition-opacity duration-700 font-light">02</span>
                      <span className="font-label text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white border border-white/10 group-hover:border-white/30 rounded-full px-4 py-2 transition-all duration-500">MONETIZACIÓN</span>
                    </div>
                    <h3 className="font-headline text-3xl md:text-4xl text-white mb-6 group-hover:text-secondary group-hover:italic transition-all duration-500">BPB Real Estate <br className="hidden lg:block" />&amp; Infraestructura</h3>
                    <div className="w-12 h-[1px] bg-secondary mb-8 transition-all duration-500 group-hover:w-24"></div>
                  </div>
                  <p className="text-on-surface-variant font-body text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-500 mb-10">
                    Monetización de activos ocultos para desarrollistas. Al finalizar un desarrollo inmobiliario, las empresas suelen dejar inmovilizadas sumas millonarias en infraestructura eléctrica (cámaras transformadoras) por evitar la burocracia. Nosotros recuperamos ese capital  por vía administrativa ágil en aproximadamente 6 meses, sin juicios y sin inversión inicial.
                  </p>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Socios Fundadores Section */}
        <section className="py-20 md:py-32 px-8 bg-surface">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
              <div className="max-w-2xl">
                <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Liderazgo &amp; Visión</p>
                <h2 className="font-headline text-5xl md:text-7xl text-white font-light">Socios Fundadores</h2>
              </div>
              <p className="font-body text-on-surface-variant max-w-xs text-sm uppercase tracking-widest leading-relaxed">
                Un equipo de élite comprometido con la excelencia absoluta en cada mandato.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Partner 1 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-8 border-b-2 border-transparent group-hover:border-secondary transition-colors duration-500">
                  <img alt="Retrato Profesional Dr. Alejandro Belgrano" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" src="/socios/1.png" />
                  <div className="absolute inset-0 bg-gray-500/40 mix-blend-multiply pointer-events-none"></div>
                </div>
                <h3 className="font-headline text-2xl text-white mb-1">Dr. Guillermo Betard</h3>
                <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio Senior - Corporate &amp; M&amp;A</p>
                <div className="editorial-line mb-4 opacity-40"></div>
              </div>
              {/* Partner 2 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-8 border-b-2 border-transparent group-hover:border-secondary transition-colors duration-500">
                  <img alt="Retrato Profesional Dra. Victoria Pellegrini" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" src="/socios/2.png" />
                  <div className="absolute inset-0 bg-gray-500/40 mix-blend-multiply pointer-events-none"></div>
                </div>
                <h3 className="font-headline text-2xl text-white mb-1">Dr. Mariano Pacifico</h3>
                <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio - Real Estate &amp; Infraestructura</p>
                <div className="editorial-line mb-4 opacity-40"></div>
              </div>
              {/* Partner 3 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-8 border-b-2 border-transparent group-hover:border-secondary transition-colors duration-500">
                  <img alt="Retrato Profesional Dr. Manuel Benavídez" className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" src="/socios/3.png" />
                  <div className="absolute inset-0 bg-gray-500/40 mix-blend-multiply pointer-events-none"></div>
                </div>
                <h3 className="font-headline text-2xl text-white mb-1">Dr. Rodrigo Biondi</h3>
                <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio - Wealth Management</p>
                <div className="editorial-line mb-4 opacity-40"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter / Contact Minimalist Hub */}
        <section id="contacto" className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-screen-xl mx-auto bg-surface-container border border-secondary/20 text-white p-8 md:p-24 relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary opacity-5 -rotate-12 translate-x-12 translate-y-12"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-headline text-4xl mb-6">Inicie una consulta.</h2>
                <p className="font-body text-white/70 leading-relaxed">
                  Analizamos cada caso bajo los más estrictos estándares de confidencialidad y rigor analítico. Permítanos ser su socio estratégico en la toma de decisiones.
                </p>
              </div>
              <form className="space-y-8">
                <div className="relative">
                  <input aria-label="Nombre Completo" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-xs font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="NOMBRE COMPLETO" type="text" />
                </div>
                <div className="relative">
                  <input aria-label="Correo Electrónico" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-xs font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="CORREO ELECTRÓNICO" type="email" />
                </div>
                <div className="relative">
                  <input aria-label="Empresa" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-xs font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="EMPRESA / ORGANIZACIÓN" type="text" />
                </div>
                <div className="relative">
                  <input aria-label="WhatsApp o Teléfono" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-xs font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="WHATSAPP / TELÉFONO" type="tel" />
                </div>
                <div className="relative">
                  <textarea aria-label="Asunto" rows={3} className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-xs font-label tracking-wide outline-none focus:ring-0 text-white placeholder-white/40 resize-none" placeholder="Breve descripción del caso o consulta..."></textarea>
                </div>
                <button aria-label="Solicitar Reunión" className="w-full bg-secondary text-primary py-6 text-xs font-bold tracking-[0.3em] hover:bg-white hover:text-primary transition-all duration-300 rounded-sm mt-4" type="submit">SOLICITAR REUNIÓN</button>
              </form>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
