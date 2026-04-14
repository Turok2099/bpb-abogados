import { Gavel, Menu, ArrowRight, Quote, Briefcase, Newspaper } from "lucide-react";
import { WhatsAppWrapper } from "../../../components/WhatsAppWrapper";
import "./theme.css";

export default function Propuesta3() {
  return (
    <div className="propuesta-3">
      {/* Header Navigation Shell */}
      <header className="fixed top-12 sm:top-10 lg:top-[40px] w-full z-40 bg-surface/90 backdrop-blur-lg border-b border-outline-variant/10 transition-all">
        <div className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Gavel className="text-primary" />
            <span className="text-xl font-bold tracking-widest text-on-surface font-headline uppercase italic">BPB ABOGADOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a className="text-secondary font-bold border-b-2 border-secondary text-sm tracking-widest transition-all duration-300" href="#">ESTUDIO</a>
            <a className="text-on-surface-variant hover:text-secondary text-sm tracking-widest transition-all duration-300" href="#">ÁREAS</a>
            <a className="text-on-surface-variant hover:text-secondary text-sm tracking-widest transition-all duration-300" href="#">EQUIPO</a>
            <a className="px-5 py-2 bg-primary text-on-primary text-xs font-bold tracking-widest hover:bg-primary-container transition-transform scale-95 active:opacity-80" href="#">CONTACTO</a>
          </nav>
          <div className="md:hidden">
            <Menu className="text-primary" />
          </div>
        </div>
      </header>

      <main className="pt-28">
        {/* Hero Section: Editorial & Minimalist */}
        <section className="min-h-[707px] flex flex-col justify-center px-8 md:px-24 py-20">
          <div className="max-w-4xl">
            <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary mb-8 block">Excelencia Jurídica &amp; Visión Estratégica</p>
            <h1 className="font-headline text-5xl md:text-8xl text-primary leading-[1.1] font-extralight tracking-tight">
              Arquitectura Legal para el <span className="italic font-normal">Patrimonio Global</span>.
            </h1>
            <div className="mt-16 flex flex-col md:flex-row md:items-center gap-8 border-t border-outline-variant/15 pt-12">
              <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed">
                En BPB Abogados, transformamos la complejidad jurídica en soluciones estratégicas. Un enfoque multidisciplinar dedicado a la protección y expansión de sus intereses.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-500 group cursor-pointer">
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="font-label text-xs uppercase tracking-widest font-bold">Explorar Servicios</span>
              </div>
            </div>
          </div>
        </section>

        {/* Signature Image Grid (Bento Style) */}
        <section className="px-8 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-screen-2xl mx-auto">
            {/* Large Office Render 1 */}
            <div className="md:col-span-8 overflow-hidden aspect-[16/9] bg-surface-container-low">
              <img alt="Nuestras Oficinas - Diseño Vanguardista" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" src="/renders/oficina-2.jpeg" />
            </div>
            <div className="md:col-span-4 flex flex-col justify-between p-12 bg-primary text-white">
              <div>
                <span className="text-secondary font-headline italic text-2xl">01</span>
                <h3 className="font-headline text-3xl mt-4 font-light">Derecho <br/>Corporativo</h3>
              </div>
              <p className="text-sm opacity-60 leading-loose uppercase tracking-widest mt-8">Transacciones complejas, fusiones y adquisiciones con rigor técnico excepcional.</p>
            </div>

            {/* Office Render 2 */}
            <div className="md:col-span-4 overflow-hidden aspect-square bg-surface-container-low">
              <img alt="Espacios de Consulta Privada" className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" src="/renders/oficina-1.jpeg" />
            </div>
            <div className="md:col-span-8 flex flex-col justify-center p-12 bg-surface-container">
              <div className="max-w-xl">
                <p className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-4">Un Legado de Confianza</p>
                <h2 className="font-headline text-4xl text-primary font-light italic mb-8">Family Offices &amp; Estrategia Patrimonial</h2>
                <p className="text-on-surface-variant font-body leading-relaxed text-justify-custom">
                  Entendemos que el patrimonio familiar es el resultado de generaciones de esfuerzo. Proporcionamos una estructura legal sólida que garantiza la continuidad, la eficiencia fiscal y el cumplimiento normativo internacional, permitiendo que su legado prospere sin fronteras.
                </p>
              </div>
            </div>

            {/* Office Render 3 & 4 (Bento Mini) */}
            <div className="md:col-span-6 overflow-hidden aspect-[16/9] bg-surface-container-low">
              <img alt="Workstation Suite" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="/renders/oficina-4.jpeg" />
            </div>
            <div className="md:col-span-6 overflow-hidden aspect-[16/9] bg-surface-container-low">
              <img alt="Lounge Area" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="/renders/oficina-5.jpeg" />
            </div>

            {/* Main Lobby Render */}
            <div className="md:col-span-12 overflow-hidden aspect-[21/9] bg-surface-container-low mt-4">
              <img alt="Main Office Gallery" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" src="/renders/oficina-3.jpeg" />
            </div>
          </div>
        </section>

        {/* Core Practices Section (Asymmetric List) */}
        <section className="bg-primary text-white py-32 px-8">
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-20">
            <div className="md:w-1/3">
              <h2 className="font-headline text-5xl italic font-light sticky top-32">Nuestras <br/>Especialidades</h2>
            </div>
            <div className="md:w-2/3 space-y-24">
              <div className="group cursor-pointer">
                <div className="flex justify-between items-baseline mb-6">
                  <h3 className="font-headline text-3xl group-hover:italic transition-all">Contratos Estratégicos</h3>
                  <span className="font-label text-xs tracking-widest opacity-40">01 / CORPORATE</span>
                </div>
                <p className="text-on-primary-container text-lg max-w-lg leading-relaxed group-hover:text-white transition-colors">
                  Redacción y negociación de acuerdos comerciales complejos que blindan sus operaciones y minimizan riesgos en mercados volátiles.
                </p>
              </div>
              <div className="editorial-line"></div>
              <div className="group cursor-pointer">
                <div className="flex justify-between items-baseline mb-6">
                  <h3 className="font-headline text-3xl group-hover:italic transition-all">Gobierno Corporativo</h3>
                  <span className="font-label text-xs tracking-widest opacity-40">02 / STRUCTURE</span>
                </div>
                <p className="text-on-primary-container text-lg max-w-lg leading-relaxed group-hover:text-white transition-colors">
                  Diseño de protocolos de dirección y administración que aseguran la transparencia y la toma de decisiones eficiente en la empresa moderna.
                </p>
              </div>
              <div className="editorial-line"></div>
              <div className="group cursor-pointer">
                <div className="flex justify-between items-baseline mb-6">
                  <h3 className="font-headline text-3xl group-hover:italic transition-all">Litigios de Alta Complejidad</h3>
                  <span className="font-label text-xs tracking-widest opacity-40">03 / DISPUTES</span>
                </div>
                <p className="text-on-primary-container text-lg max-w-lg leading-relaxed group-hover:text-white transition-colors">
                  Representación de élite ante tribunales y arbitrajes nacionales e internacionales, con un historial probado de resoluciones favorables.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The "Editorial" Quote Section */}
        <section className="py-40 px-8 bg-surface-bright flex justify-center text-center">
          <div className="max-w-3xl">
            <Quote className="text-secondary text-5xl mb-8" />
            <blockquote className="font-headline text-3xl md:text-5xl italic font-light leading-snug text-primary">
              "La verdadera distinción en el derecho no reside solo en el conocimiento de la norma, sino en la <span className="font-normal not-italic">inteligencia aplicada</span> para crear caminos donde otros ven obstáculos."
            </blockquote>
            <cite className="block mt-12 font-label text-xs uppercase tracking-[0.4em] text-on-surface-variant">— DIRECTOR ASOCIADO</cite>
          </div>
        </section>

        {/* Socios Fundadores Section */}
        <section className="py-32 px-8 bg-white">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary mb-4">Liderazgo &amp; Visión</p>
                <h2 className="font-headline text-5xl md:text-7xl text-primary font-light">Socios Fundadores</h2>
              </div>
              <p className="font-body text-on-surface-variant max-w-xs text-sm uppercase tracking-widest leading-relaxed">
                Un equipo de élite comprometido con la excelencia absoluta en cada mandato.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Partner 1 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 mb-8">
                  <img alt="Retrato Profesional Dr. Alejandro Belgrano" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7Q8feONBrdR24FBlu51mj3PhTEwgmNNbvDRj3zMYND8K2UkJPs0CakiX3V8CtrZuv3oiUZKEE1j3PtbTlBtLk0oXmiELbCdBImnzvzVkkuhzp8tzkA6nYkSinp8Pogj6H0enHj5fiSiZrwHxD8TO0-6JrB4-3E7PxQet8ZO3VS4c6hBQHBtp52F_hrEM5nhxYBO139lnIqX0nZDG_0kLBJWteQ2sZxjmTOi2c5r6wum0NYZWEqtwca9e0X8PDnBhAFTPcBetSjER9" />
                </div>
                <h3 className="font-headline text-2xl text-primary mb-1">Dr. Alejandro Belgrano</h3>
                <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio Senior - Corporate &amp; M&amp;A</p>
                <div className="editorial-line mb-4 opacity-40"></div>
              </div>
              {/* Partner 2 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 mb-8">
                  <img alt="Retrato Profesional Dra. Victoria Pellegrini" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIv_La1ln6SegIh5uVnr3F6hp9N2uXdFyGDZr5VbixvwHoyV-tlmFYylhI_u4GhmkRBhRW7xoA7d1aItGCLxLMSvXnWrt-xdWELuXPJykzA1exfgy8RXc-jhV_pGdVeEvkcr7GH1KiNZw5d2oqrospizFJMs41XYNPWTAktLTqeSqoeIukwXvPmfo69C22Jo-8vZ8QPxfcEQD07HqgAJOJyA7miumCjd2f6-jr4CbAyydY5WsaBGX-yq00U7UB18rkaGMqEVLU2DmA" />
                </div>
                <h3 className="font-headline text-2xl text-primary mb-1">Dra. Victoria Pellegrini</h3>
                <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socia Directora - Litigios Estratégicos</p>
                <div className="editorial-line mb-4 opacity-40"></div>
              </div>
              {/* Partner 3 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 mb-8">
                  <img alt="Retrato Profesional Dr. Manuel Benavídez" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXAcvF9LvQMdW1bs__FJWCjocciwqxuSsDEA7XMFxy-Oz-2kKJNdoxBSkbmsWdIjPpafDZXvi_uV8vsDylY7bJXWRFvrNy3jt-WbwT1gOHz7zXBu-Vpa8qTl2YsztfNy0YbNLnvdr95daZvj6jvAiqXayAxneBvojPGT-MN-GS7w0xMmfuaMN9cfWVUXQ0YphOC0oHIsyHhCu52yIm4hHvLyH-D3upUndiLZACmCW8DwkC74Zq1bo5Stk1xOF0G0VY0GgjZiXXvACp" />
                </div>
                <h3 className="font-headline text-2xl text-primary mb-1">Dr. Manuel Benavídez</h3>
                <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio - Wealth Management</p>
                <div className="editorial-line mb-4 opacity-40"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter / Contact Minimalist Hub */}
        <section className="pb-32 px-8">
          <div className="max-w-screen-xl mx-auto bg-surface-container-low p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100 opacity-50 -rotate-12 translate-x-12 translate-y-12"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-headline text-4xl mb-6">Inicie una consulta discreta.</h2>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  Analizamos cada caso bajo los más estrictos estándares de confidencialidad y rigor analítico. Permítanos ser su socio estratégico en la toma de decisiones.
                </p>
              </div>
              <form className="space-y-8">
                <div className="relative">
                  <input aria-label="Nombre Completo" className="w-full bg-transparent border-b-2 border-outline-variant focus:border-secondary transition-colors py-4 px-0 text-xs font-label uppercase tracking-widest outline-none focus:ring-0" placeholder="NOMBRE COMPLETO" type="text" />
                </div>
                <div className="relative">
                  <input aria-label="WhatsApp o Teléfono" className="w-full bg-transparent border-b-2 border-outline-variant focus:border-secondary transition-colors py-4 px-0 text-xs font-label uppercase tracking-widest outline-none focus:ring-0" placeholder="WHATSAPP / TELÉFONO" type="tel" />
                </div>
                <button aria-label="Solicitar Reunión" className="w-full bg-secondary text-primary py-6 text-xs font-bold tracking-[0.3em] hover:bg-on-secondary-fixed-variant hover:text-white transition-all duration-300" type="submit">SOLICITAR REUNIÓN</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppWrapper />

      {/* Footer Shell */}
      <footer className="bg-primary  w-full py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto border-t border-white/10 pt-16">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-headline italic text-secondary block mb-6">BPB Abogados</span>
            <p className="font-body text-xs uppercase tracking-widest text-on-primary-container leading-relaxed">
              BUENOS AIRES<br/>
              MADRID<br/>
              NEW YORK
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-white text-xs font-bold tracking-widest mb-6">NAVEGACIÓN</p>
            <ul className="space-y-3">
              <li><a className="font-body text-sm uppercase tracking-widest text-on-primary-container hover:text-on-primary hover:underline decoration-secondary underline-offset-4 transition-colors" href="#">Áreas de Práctica</a></li>
              <li><a className="font-body text-sm uppercase tracking-widest text-on-primary-container hover:text-on-primary hover:underline decoration-secondary underline-offset-4 transition-colors" href="#">Nuestro Equipo</a></li>
              <li><a className="font-body text-sm uppercase tracking-widest text-on-primary-container hover:text-on-primary hover:underline decoration-secondary underline-offset-4 transition-colors" href="#">Publicaciones</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-white text-xs font-bold tracking-widest mb-6">CONTACTO</p>
            <ul className="space-y-3">
              <li><a className="font-body text-sm uppercase tracking-widest text-on-primary-container hover:text-on-primary hover:underline decoration-secondary underline-offset-4 transition-colors" href="#">Contacto</a></li>
              <li><a className="font-body text-sm uppercase tracking-widest text-on-primary-container hover:text-on-primary hover:underline decoration-secondary underline-offset-4 transition-colors" href="#">Privacidad</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <p className="text-white text-xs font-bold tracking-widest mb-4">SÍGUENOS</p>
            <div className="flex gap-6">
              <Briefcase className="text-on-primary-container hover:text-secondary-container cursor-pointer transition-colors" />
              <Newspaper className="text-on-primary-container hover:text-secondary-container cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 text-center border-t border-white/10 pt-8">
          <p className="font-body text-xs uppercase tracking-widest text-on-primary/60">
            © 2024 BPB Abogados. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      
    </div>
  );
}
