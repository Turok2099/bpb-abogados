import "./theme.css";

export default function Propuesta1() {
  return (
    <div className="propuesta-1 min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-12 sm:top-10 lg:top-[40px] left-0 right-0 z-40 bg-[#f8f9fa] dark:bg-[#001b44] border-none transition-all duration-300">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-20 w-full">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl text-[#001b44] dark:text-[#f8f9fa]">gavel</span>
            <span className="text-2xl font-black text-[#001b44] dark:text-[#ffffff] tracking-widest font-newsreader uppercase">BPB ABOGADOS</span>
          </div>
          <nav className="hidden md:flex gap-10 items-center">
            <a className="font-newsreader tracking-tighter uppercase text-[#001b44] dark:text-[#ffffff] border-b-2 border-[#845400] pb-1" href="#home">Inicio</a>
            <a className="font-newsreader tracking-tighter uppercase text-[#001b44]/60 dark:text-[#f8f9fa]/60 hover:bg-[#f3f4f5] dark:hover:bg-[#002f6c] transition-colors duration-300" href="#practice">Práctica</a>
            <a className="font-newsreader tracking-tighter uppercase text-[#001b44]/60 dark:text-[#f8f9fa]/60 hover:bg-[#f3f4f5] dark:hover:bg-[#002f6c] transition-colors duration-300" href="#about">Nosotros</a>
            <button aria-label="Consulta" className="bg-primary text-on-primary px-8 py-3 text-xs tracking-widest font-bold hover:bg-primary-container transition-all active:scale-95 duration-150">
              CONSULTA
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-10 sm:pt-0">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="Modern luxury law office interior" className="w-full h-full object-cover" src="/renders/oficina-1.jpeg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[2px] bg-secondary"></div>
                  <span className="text-secondary tracking-[0.3em] font-bold text-xs uppercase">Estrategia Legal de Vanguardia</span>
                </div>
                <h1 className="text-6xl md:text-8xl text-white font-newsreader leading-[0.9] tracking-tighter mb-8 italic">
                  Excellence in <br/><span className="not-italic text-secondary-container">Legal Strategy.</span>
                </h1>
                <p className="text-on-primary-container text-xl max-w-xl leading-relaxed mb-12 font-light">
                  Definiendo el estándar de la práctica jurídica corporativa a través de una arquitectura legal robusta y una visión estratégica impecable.
                </p>
                <div className="flex flex-wrap gap-6">
                  <button aria-label="Explorar Servicios" className="bg-secondary-container text-on-secondary-container px-10 py-5 font-bold tracking-widest text-sm hover:brightness-110 transition-all active:scale-95">
                    EXPLORAR SERVICIOS
                  </button>
                  <button aria-label="Nuestra Firma" className="border border-white/20 text-white px-10 py-5 font-bold tracking-widest text-sm backdrop-blur-md hover:bg-white/10 transition-all">
                    NUESTRA FIRMA
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Vertical Slat Detail */}
          <div className="absolute right-0 bottom-0 top-20 hidden xl:flex gap-1 opacity-20 pointer-events-none">
            <div className="w-4 bg-secondary-container h-full"></div>
            <div className="w-4 bg-secondary-container/50 h-full"></div>
            <div className="w-4 bg-secondary-container/20 h-full"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-surface-container-low py-24 relative overflow-hidden border-b border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            <div className="flex flex-col">
              <span className="text-6xl font-newsreader text-primary mb-4">250+</span>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-secondary"></div>
                <span className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">Casos High-Stake Ganados</span>
              </div>
            </div>
            <div className="flex flex-col md:mt-12">
              <span className="text-6xl font-newsreader text-primary mb-4">15MM+</span>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-secondary"></div>
                <span className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">Activos Protegidos</span>
              </div>
            </div>
            <div className="flex flex-col md:mt-24">
              <span className="text-6xl font-newsreader text-primary mb-4">98%</span>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-secondary"></div>
                <span className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">Ratio de Retención Anual</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery / Office Showcase */}
        <section className="bg-surface py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-6xl text-primary font-newsreader mb-6 leading-none">Arquitectura de nuestra Sede.</h2>
                <p className="text-on-surface-variant text-lg">Espacios diseñados para fomentar la precisión y el pensamiento estratégico de alto nivel.</p>
              </div>
              <div className="h-[2px] flex-grow bg-surface-container-highest mx-12 hidden lg:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 overflow-hidden aspect-video group">
                <img alt="Executive meeting space" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/renders/oficina-2.jpeg" />
              </div>
              <div className="md:col-span-4 overflow-hidden aspect-[4/5] md:aspect-auto group">
                <img alt="Premium workstations" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/renders/oficina-3.jpeg" />
              </div>
              <div className="md:col-span-4 overflow-hidden aspect-[4/5] md:aspect-auto group">
                <img alt="Minimalist office corridor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/renders/oficina-4.jpeg" />
              </div>
              <div className="md:col-span-8 group relative bg-surface-container-lowest p-12 hover:bg-primary transition-all duration-500 overflow-hidden flex flex-col justify-center">
                <h3 className="text-4xl font-newsreader mb-4 group-hover:text-white transition-colors">Diseño que Proyecta Autoridad.</h3>
                <p className="text-on-surface-variant group-hover:text-white/70 max-w-md transition-colors text-lg">Cada rincón de nuestra oficina refleja los valores de rigor, modernidad y confidencialidad que nuestros clientes internacionales demandan.</p>
                <div className="absolute right-0 bottom-0 opacity-0 group-hover:opacity-10 transition-opacity translate-x-1/4 translate-y-1/4">
                  <span className="material-symbols-outlined text-[200px]">architecture</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Areas */}
        <section id="practice" className="bg-surface-container-low py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-6xl text-primary font-newsreader mb-6 leading-none">Áreas de Especialidad Profesional.</h2>
                <p className="text-on-surface-variant text-lg">Soluciones legales diseñadas con precisión arquitectónica para los desafíos corporativos más complejos.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
              <div className="md:col-span-8 group relative bg-surface-container-lowest p-12 hover:bg-primary transition-all duration-500 overflow-hidden">
                <span className="material-symbols-outlined text-5xl text-secondary mb-8 group-hover:text-secondary-container transition-colors">corporate_fare</span>
                <h3 className="text-3xl font-newsreader mb-4 group-hover:text-white transition-colors">Derecho Corporativo &amp; M&amp;A</h3>
                <p className="text-on-surface-variant group-hover:text-white/70 max-w-md transition-colors">Estructuración de fusiones, adquisiciones y gobernanza corporativa de alto nivel.</p>
              </div>
              <div className="md:col-span-4 group bg-surface-container p-12 hover:bg-secondary transition-all duration-500">
                <span className="material-symbols-outlined text-5xl text-primary mb-8 group-hover:text-white">gavel</span>
                <h3 className="text-3xl font-newsreader mb-4 group-hover:text-white transition-colors">Litigios Estratégicos</h3>
                <p className="text-on-surface-variant group-hover:text-white/80 transition-colors">Representación en disputas comerciales complejas y arbitraje internacional.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us / Architectural Detail */}
        <section className="relative py-32 bg-primary overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-tertiary opacity-50 skew-x-[-12deg] -translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                <div className="aspect-[4/5] bg-surface-container-lowest relative overflow-hidden group">
                  <img alt="Detail of our architectural office" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" src="/renders/oficina-5.jpeg" />
                  <div className="absolute inset-0 border-[24px] border-primary/20 pointer-events-none"></div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-5xl md:text-7xl text-white font-newsreader leading-none mb-12 italic">The Architect of your <br/><span className="not-italic text-secondary-container">legal future.</span></h2>
                <div className="space-y-12">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">precision_manufacturing</span>
                    </div>
                    <div>
                      <h4 className="text-white text-xl font-bold mb-2">Precisión Absoluta</h4>
                      <p className="text-on-primary-container leading-relaxed">Cada caso es tratado como una obra de ingeniería única, con atención milimétrica a los detalles legales.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">speed</span>
                    </div>
                    <div>
                      <h4 className="text-white text-xl font-bold mb-2">Agilidad Ejecutiva</h4>
                      <p className="text-on-primary-container leading-relaxed">Respuestas inmediatas en un entorno legal que nunca descansa.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section & Partners */}
        <section id="about" className="bg-surface py-32 overflow-hidden border-t border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-6xl text-primary font-newsreader mb-6 leading-none">Socios Fundadores.</h2>
                <p className="text-on-surface-variant text-lg">Liderazgo visionario con décadas de experiencia en la arquitectura legal corporativa.</p>
              </div>
              <div className="h-[2px] flex-grow bg-surface-container-highest mx-12 hidden lg:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Partner 1 */}
              <div className="group">
                <div className="aspect-[3/4] overflow-hidden bg-surface-container-low mb-6">
                  <img alt="Ricardo Bermúdez" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYy_anWz_4Gxjky-shkUbswOwzt6Kdd3S_tDYTNWNytVKhMw5cUnDbY-fQYdimbT_pdqa0dGqissiskXPb8QLn2dnO_drMjYm_hTEXL3ECUx8S7g6vZDoZNdcigF29wWeQkfC_T_ClJTwkVMU-fgi5evR8uB8BELbI6pb-aybZ5oQ7D0zWbz71vbiRMVectUQ2jALWDBWgGVdUpkk1dHx0o6EiHI9_kJ1sKRmyM6sv1r864gOtARNhW27ZkRVZ0yuFHocnHjd59txr" />
                </div>
                <h3 className="text-2xl font-newsreader text-primary mb-1">Ricardo Bermúdez</h3>
                <p className="text-secondary text-sm font-bold tracking-widest uppercase">Socio Fundador</p>
                <div className="w-8 h-[2px] bg-secondary mt-4 group-hover:w-16 transition-all duration-500"></div>
              </div>
              {/* Partner 2 */}
              <div className="group md:mt-12">
                <div className="aspect-[3/4] overflow-hidden bg-surface-container-low mb-6">
                  <img alt="Elena S. Benítez" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByGfel_rFMVhxjILzfkt6g5RxS_SqaxV7FogN5CbNTySxyxap5m4vZ45uhn0V8RwkJOZEn0XcCufCcrWahYI3wFptDNnCl5-dH2jobv3Ag2875IpB8jjeesqLOfslOz8i0GeXFBNPaL_S0O22GcEL52TQsyPlfAnkjAti_9mzvMisjxmcbkPVKtkVC1AP5dHfSIkvLtPTFtfc9wq1OXkR4xEYRk6vrkP7cxogDBI7eYsmtisQCsMlQX6Ult6Zr3KwfZoktzK5BFHg8" />
                </div>
                <h3 className="text-2xl font-newsreader text-primary mb-1">Elena S. Benítez</h3>
                <p className="text-secondary text-sm font-bold tracking-widest uppercase">Socia Senior</p>
                <div className="w-8 h-[2px] bg-secondary mt-4 group-hover:w-16 transition-all duration-500"></div>
              </div>
              {/* Partner 3 */}
              <div className="group md:mt-24">
                <div className="aspect-[3/4] overflow-hidden bg-surface-container-low mb-6">
                  <img alt="Javier V. Toledo" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoo9fWAF7ndlMG2WdVq2hrCs4DukKjHDf4D6WzpIy3Nv9EsQZkWruPIi7dRIceg39MIOPjrlBmwPnn_IipF2ZOX7BR06Inof-ixK82Hy-lry85IElYwbp6hym3eTTwrxT1gltpaqyqqXq7FUn8jKJn_d48YhFfUcDBNgCEHa1Ia3kJDwS4x4ZKT2qXpC4Hq2QBj9vQXYtyksUOP6_6FmWvF8vlyAfNkI6PrQVH3MHZ0dyagXiD-L7DTZ1I1VyWudiwVkCA1lqCwntI" />
                </div>
                <h3 className="text-2xl font-newsreader text-primary mb-1">Javier V. Toledo</h3>
                <p className="text-secondary text-sm font-bold tracking-widest uppercase">Socio Principal</p>
                <div className="w-8 h-[2px] bg-secondary mt-4 group-hover:w-16 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-surface-container-lowest border-none relative overflow-hidden flex flex-col lg:flex-row">
              <div className="w-2 bg-secondary absolute left-0 top-0 bottom-0"></div>
              <div className="p-12 lg:p-20 lg:w-1/2">
                <h2 className="text-5xl font-newsreader text-primary mb-8">Inicie una <br/>Consulta Estratégica.</h2>
                <p className="text-on-surface-variant mb-12 text-lg">Permita que nuestro equipo de expertos analice su situación y diseñe la mejor ruta de acción legal.</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                    <span className="text-on-surface font-bold tracking-tight">Av. Reforma 450, Piso 22, CDMX</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">mail</span>
                    <span className="text-on-surface font-bold tracking-tight">contacto@bpbabogados.com</span>
                  </div>
                </div>
              </div>
              <div className="p-12 lg:p-20 lg:w-1/2 bg-surface-container-low">
                <form className="space-y-8">
                  <div className="relative group">
                    <input aria-label="Nombre Completo" className="w-full bg-transparent border-none border-b-2 border-outline-variant py-4 focus:ring-0 focus:border-primary transition-colors placeholder:text-outline/50 text-sm font-bold tracking-widest uppercase" placeholder="NOMBRE COMPLETO" type="text" />
                  </div>
                  <div className="relative group">
                    <input aria-label="WhatsApp o Teléfono" className="w-full bg-transparent border-none border-b-2 border-outline-variant py-4 focus:ring-0 focus:border-primary transition-colors placeholder:text-outline/50 text-sm font-bold tracking-widest uppercase" placeholder="WHATSAPP / TELÉFONO" type="tel" />
                  </div>
                  <div className="relative group">
                    <textarea aria-label="Asunto" className="w-full bg-transparent border-none border-b-2 border-outline-variant py-4 focus:ring-0 focus:border-primary transition-colors placeholder:text-outline/50 text-sm font-bold tracking-widest uppercase resize-none" placeholder="BREVE DESCRIPCIÓN DEL ASUNTO" rows={3}></textarea>
                  </div>
                  <button aria-label="Solicitar Evaluación" className="w-full bg-primary text-on-primary py-6 font-bold tracking-[0.2em] text-sm hover:bg-primary-container transition-all active:scale-[0.98]">
                    SOLICITAR EVALUACIÓN
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#001b44] dark:bg-[#002215] border-none">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 w-full max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-1">
            <span className="text-xl font-bold text-[#ffffff] font-newsreader tracking-widest uppercase mb-6 block">BPB ABOGADOS</span>
            <p className="text-[#f8f9fa]/70 font-manrope text-xs tracking-[0.1em] leading-relaxed uppercase">
              Estrategia, Precisión y Autoridad en cada acción jurídica.
            </p>
          </div>
          <div>
            <h5 className="text-[#ffffff] font-bold text-xs tracking-[0.2em] uppercase mb-8">NAVEGACIÓN</h5>
            <ul className="space-y-4">
              <li><a className="text-[#f8f9fa]/70 font-manrope text-xs tracking-[0.1em] uppercase hover:text-[#ffffff] transition-all opacity-80" href="#">Sede Central</a></li>
              <li><a className="text-[#f8f9fa]/70 font-manrope text-xs tracking-[0.1em] uppercase hover:text-[#ffffff] transition-all opacity-80" href="#">Práctica Corporativa</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#ffffff] font-bold text-xs tracking-[0.2em] uppercase mb-8">LEGAL</h5>
            <ul className="space-y-4">
              <li><a className="text-[#f8f9fa]/70 font-manrope text-xs tracking-[0.1em] uppercase hover:text-[#ffffff] transition-all opacity-80" href="#">Propiedad Intelectual</a></li>
              <li><a className="text-[#f8f9fa]/70 font-manrope text-xs tracking-[0.1em] uppercase hover:text-[#ffffff] transition-all opacity-80" href="#">Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#ffffff] font-bold text-xs tracking-[0.2em] uppercase mb-8">BOLETÍN ESTRATÉGICO</h5>
            <div className="flex gap-2">
              <input aria-label="Email para boletín" className="bg-white/10 border-none text-white text-xs p-3 w-full focus:ring-1 focus:ring-secondary-container" placeholder="EMAIL" type="email" />
              <button aria-label="Suscribirse" className="bg-secondary-container p-3 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 py-8 border-t border-white/5 flex justify-between items-center">
          <p className="text-[#f8f9fa]/50 font-manrope text-[10px] tracking-[0.2em] uppercase">
            © 2024 BPB ABOGADOS. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-6">
            <span aria-label="Red Mundial" className="material-symbols-outlined text-white/40 text-sm hover:text-white transition-colors cursor-pointer">public</span>
            <span aria-label="Seguridad Certificada" className="material-symbols-outlined text-white/40 text-sm hover:text-white transition-colors cursor-pointer">verified_user</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
