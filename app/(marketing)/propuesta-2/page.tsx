import "./theme.css";

export default function Propuesta2() {
  return (
    <div className="propuesta-2">
      {/* TopAppBar */}
      <header className="fixed top-12 sm:top-10 lg:top-[40px] w-full z-40 glass-nav">
        <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
            <span className="text-xl font-bold tracking-widest text-slate-900 font-headline italic uppercase">BPB ABOGADOS</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a className="text-amber-700 font-semibold border-b-2 border-amber-700 py-1 transition-all" href="#">Inicio</a>
            <a className="text-slate-600 hover:text-slate-900 transition-all" href="#">Áreas de Práctica</a>
            <a className="text-slate-600 hover:text-slate-900 transition-all" href="#">Nuestro Equipo</a>
            <a className="text-slate-600 hover:text-slate-900 transition-all" href="#">Insights</a>
            <button aria-label="Contacto" className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-transform active:scale-95">CONTACTO</button>
          </nav>
          <button aria-label="Menu" className="md:hidden text-primary">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>
      
      <main className="pt-24 sm:pt-16 lg:pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[751px] flex items-center px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-bold mb-6 block">Aliados Estratégicos</span>
              <h1 className="font-headline text-5xl md:text-7xl text-primary leading-tight mb-8">
                Liderazgo Legal para <span className="italic">Negocios Ágiles</span>.
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed">
                En BPB Abogados transformamos la complejidad jurídica en ventajas competitivas. Especialistas en Derecho Corporativo y Laboral enfocados en la toma de decisiones eficiente.
              </p>
              <div className="flex flex-wrap gap-4">
                <button aria-label="Consultoría Senior" className="bg-secondary text-on-secondary px-10 py-4 rounded-lg font-semibold hover:opacity-95 transition-all">Consultoría Senior</button>
                <button aria-label="Ver Áreas de Práctica" className="bg-transparent border border-outline-variant text-primary px-10 py-4 rounded-lg font-semibold hover:bg-surface-container-low transition-all">Ver Áreas de Práctica</button>
              </div>
            </div>
            <div className="relative h-[600px] hidden lg:block">
              <div className="absolute inset-0 bg-surface-container-high rounded-full -z-10 scale-95 translate-x-10 translate-y-10 blur-3xl opacity-50"></div>
              <img alt="Vista premium de las oficinas corporativas" className="w-full h-full object-cover rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" src="/renders/oficina-1.jpeg" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-primary text-on-primary">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
              <div className="flex flex-col gap-2">
                <span className="font-headline text-5xl text-secondary-container italic">20+</span>
                <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Años de Trayectoria</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-headline text-5xl text-secondary-container italic">500+</span>
                <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Clientes Corporativos</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-headline text-5xl text-secondary-container italic">15k</span>
                <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Casos Resueltos</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-headline text-5xl text-secondary-container italic">98%</span>
                <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Tasa de Éxito Legal</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section: Premium Office Showcase */}
        <section className="py-32 px-8 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <span className="font-label text-sm uppercase tracking-[0.2em] text-secondary font-bold block mb-4">Nuestras Instalaciones</span>
              <h2 className="font-headline text-4xl md:text-5xl text-primary mb-6">Un entorno diseñado para la <span className="italic">excelencia estratégica</span>.</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Nuestras oficinas en Buenos Aires reflejan nuestro compromiso con la innovación, la transparencia y el rigor profesional que sus asuntos legales requieren.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
              <div className="md:col-span-8 h-full">
                <img alt="Sala de reuniones principal" className="w-full h-full object-cover rounded-xl shadow-lg grayscale hover:grayscale-0 transition-all duration-500" src="/renders/oficina-2.jpeg" />
              </div>
              <div className="md:col-span-4 grid grid-rows-2 gap-6 h-full">
                <img alt="Espacio de trabajo colaborativo" className="w-full h-full object-cover rounded-xl shadow-lg grayscale hover:grayscale-0 transition-all duration-500" src="/renders/oficina-3.jpeg" />
                <img alt="Detalle de diseño en oficina privada" className="w-full h-full object-cover rounded-xl shadow-lg grayscale hover:grayscale-0 transition-all duration-500" src="/renders/oficina-4.jpeg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="relative h-80">
                <img alt="Lounge de consultoría senior" className="w-full h-full object-cover rounded-xl shadow-lg grayscale hover:grayscale-0 transition-all duration-500" src="/renders/oficina-5.jpeg" />
                <div className="absolute bottom-6 left-6 bg-primary/90 backdrop-blur-md p-6 rounded-lg text-on-primary max-w-xs">
                  <p className="font-headline text-xl italic mb-2">Confort y Privacidad</p>
                  <p className="text-sm text-on-primary-container">Espacios pensados para el diálogo confidencial y la toma de decisiones críticas.</p>
                </div>
              </div>
              <div className="bg-primary p-12 rounded-xl flex flex-col justify-center text-on-primary">
                <h3 className="font-headline text-3xl mb-4">Presencia en el centro de las decisiones</h3>
                <p className="text-on-primary-container leading-relaxed mb-8">Nuestra infraestructura tecnológica y física está a la altura de los desafíos globales de nuestros clientes.</p>
                <button aria-label="Visitar Presencialmente" className="self-start border border-secondary text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-secondary hover:text-on-secondary transition-all">Visitar Presencialmente</button>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Areas */}
        <section className="py-32 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <span className="font-label text-sm uppercase tracking-[0.2em] text-secondary font-bold block mb-4">Nuestra Expertise</span>
              <h2 className="font-headline text-4xl md:text-5xl text-primary max-w-2xl">Soluciones legales diseñadas para la <span className="italic">velocidad del mercado</span>.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-surface-container-low p-12 rounded-xl group hover:bg-surface-container-lowest transition-all hover:shadow-xl">
                <span className="material-symbols-outlined text-secondary text-4xl mb-8">business_center</span>
                <h3 className="font-headline text-3xl text-primary mb-4">Derecho Corporativo y M&amp;A</h3>
                <p className="text-on-surface-variant max-w-md leading-relaxed mb-8">Estructuración de negocios, fusiones, adquisiciones y cumplimiento regulatorio con visión estratégica global.</p>
                <a className="inline-flex items-center gap-2 text-secondary font-semibold group-hover:gap-4 transition-all" href="#">
                  Saber más <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
              <div className="bg-primary-container p-12 rounded-xl text-on-primary flex flex-col justify-between hover:scale-[1.02] transition-transform">
                <div>
                  <span className="material-symbols-outlined text-secondary-container text-4xl mb-8">groups</span>
                  <h3 className="font-headline text-3xl mb-4">Derecho Laboral</h3>
                  <p className="text-on-primary-container leading-relaxed">Gestión proactiva del capital humano y litigio estratégico en el entorno laboral moderno.</p>
                </div>
              </div>
              <div className="bg-surface-container-highest p-12 rounded-xl hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-primary text-4xl mb-8">balance</span>
                <h3 className="font-headline text-2xl text-primary mb-4">Litigios Complejos</h3>
                <p className="text-on-surface-variant leading-relaxed">Defensa técnica especializada en controversias civiles, comerciales y administrativas.</p>
              </div>
              <div className="md:col-span-2 bg-white p-12 rounded-xl border border-outline-variant/20 flex flex-col md:flex-row gap-12 items-center hover:shadow-2xl transition-all">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-secondary text-4xl mb-8">rocket_launch</span>
                  <h3 className="font-headline text-2xl text-primary mb-4">Agilidad en Decisiones</h3>
                  <p className="text-on-surface-variant leading-relaxed">Asesoría jurídica de respuesta inmediata para startups y empresas de base tecnológica.</p>
                </div>
                <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden">
                  <img alt="Documentos legales modernos" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxhP1Sob_105EhlsJ9aNkJSgTmUS0MG2IFx1a1kRfPdTYp8CP_DTpdy5Y6qPDciIdqZIWphXPe6yqv43h5c4pSLa2nIt3AOgyDgDqon5nsnvEEi_Oj1ZdzPJ1m8IV_um2qVRrM04jzTrUnCOxaElwTu1T07wAW525eAXST7qBnZW4TPEsyJKepkpjaKkIcXlOZLD_8DhPiRL6ge423SYUlt39eCMq5Bl_kfP3EpAoRvfFRaYqL0GmKTyu_ufc-1Yu-Xl75tqPL0xdH" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-32 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div>
                <span className="font-label text-sm uppercase tracking-[0.2em] text-secondary font-bold block mb-4">Nuestro Equipo</span>
                <h2 className="font-headline text-4xl md:text-5xl text-primary">Socios de tu <span className="italic">crecimiento</span>.</h2>
              </div>
              <p className="max-w-md text-on-surface-variant mb-2">Profesionales con formación internacional y profundo conocimiento del mercado local.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-surface-container-highest">
                  <img alt="Dr. Bautista Pereyra" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzXGwQ9NUN2o9XP9FQ24MoxonYhqUTLSdEMbnivL_hA8D9BDemHpSnyLNZjmmV-0TYFWjxA-RVp01VIs_vtCpzudvlAgQ_pFsoiBItnVqGJ27RlPY7kntb-TyH9nNYVFI-rpTewnh6k9AfhDHpZAtOTOzdc6RfwjpOrO4GaNCTyNLde3UVm6Cz9zv2O1cu6-M16s36irXhqqknMDfZdqf9aB_XyWhTHnjXQiNXxUkiiJ-mrz98PKqRjmdRuH6AwBV-X0tzAIW4aHoT" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <span className="text-white font-label text-sm tracking-widest uppercase">Especialista en M&amp;A</span>
                  </div>
                </div>
                <h4 className="font-headline text-2xl text-primary">Dr. Bautista Pereyra</h4>
                <p className="text-secondary font-medium italic">Socio Fundador</p>
              </div>
              <div className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-surface-container-highest">
                  <img alt="Dra. Sofía Benítez" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDlfy9rIjItzA9M4SAhhh4Ctf9kH_UTR29bm5-hX2Gp5Ou-85_LpOdpkZcwTJDY_aX0rDZp_CW-oKXmK61vD27LD9flqWoq7fkPxrOZi2t8fUgbUB_TF68piQ52xTuWVQ1HV7jQ22renFtoV7qsBEiTJRG6RNXuhzPW-oLmv9KhDVd90cYzZglNhMLbufl5qXptBs3TecNtEKTB4OmZv9fD4tB0ur1vU8aRbF30XtJ6pwUIe5EesM2CG9oMM7nVSxEiCOKaBO_43Sc" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <span className="text-white font-label text-sm tracking-widest uppercase">Directora Laboral</span>
                  </div>
                </div>
                <h4 className="font-headline text-2xl text-primary">Dra. Sofía Benítez</h4>
                <p className="text-secondary font-medium italic">Socia Senior</p>
              </div>
              <div className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-surface-container-highest">
                  <img alt="Dr. Marcos Beltrán" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHpCKLlq-T_PF_4HUHJnW0c3MY_z9gxoEvzMyjrfjeNBwwoPyofc1dGJwIuJHe_zwrE6V2Kpm-2h6jpkhb1SSZg3duW-Tjur1lajhKwlMvUsO_Qz3UdW0utRnI5uZDEOpOcNTG0ALCpWl1tNWkf-lgodcsXuGFyrbLCHgznHxg8S7eWBlnhqMcl4IIknDGiu5Og4Z0xwt86glo3igglGPMgOiEQqRx-W7pM7O8ez6WnVEtRgLFpRLw7C84tGoHjnXRfzD7dXD3HKlx" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <span className="text-white font-label text-sm tracking-widest uppercase">Litigios Corporativos</span>
                  </div>
                </div>
                <h4 className="font-headline text-2xl text-primary">Dr. Marcos Beltrán</h4>
                <p className="text-secondary font-medium italic">Asociado Principal</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA / Consultation */}
        <section className="py-24 px-8 relative overflow-hidden">
          <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-12 md:p-24 text-center relative z-10">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[10rem]">gavel</span>
            </div>
            <h2 className="font-headline text-4xl md:text-6xl text-on-primary mb-8 leading-tight">¿Listo para blindar el <span className="italic">futuro de su empresa</span>?</h2>
            <p className="text-on-primary-container text-xl max-w-2xl mx-auto mb-12">Agende una consulta estratégica con nuestros expertos y reciba una evaluación preliminar de sus activos legales.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button aria-label="Iniciar Consulta" className="bg-secondary text-on-secondary px-12 py-5 rounded-lg font-bold text-lg hover:opacity-90 transition-all">Iniciar Consulta Ahora</button>
              <a className="text-on-primary font-semibold flex items-center gap-2 hover:text-secondary-container transition-colors" href="tel:+541100000000">
                <span className="material-symbols-outlined">call</span> +54 11 0000-0000
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-8">
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <span className="text-lg font-headline italic text-amber-600 mb-6 block">BPB Abogados</span>
              <p className="font-body text-sm tracking-tight text-slate-400 max-w-xs">Excelencia y autoridad jurídica en el centro financiero de Buenos Aires.</p>
            </div>
            <div>
              <h5 className="font-body text-sm uppercase tracking-widest text-slate-50 mb-6">Enlaces</h5>
              <ul className="flex flex-col gap-4">
                <li><a className="font-body text-sm uppercase tracking-widest text-slate-400 hover:text-slate-50 hover:underline decoration-amber-600 underline-offset-4 transition-all" href="#">Áreas de Práctica</a></li>
                <li><a className="font-body text-sm uppercase tracking-widest text-slate-400 hover:text-slate-50 hover:underline decoration-amber-600 underline-offset-4 transition-all" href="#">Nuestro Equipo</a></li>
                <li><a className="font-body text-sm uppercase tracking-widest text-slate-400 hover:text-slate-50 hover:underline decoration-amber-600 underline-offset-4 transition-all" href="#">Publicaciones</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-body text-sm uppercase tracking-widest text-slate-50 mb-6">Legal</h5>
              <ul className="flex flex-col gap-4">
                <li><a className="font-body text-sm uppercase tracking-widest text-slate-400 hover:text-slate-50 hover:underline decoration-amber-600 underline-offset-4 transition-all" href="#">Privacidad</a></li>
                <li><a className="font-body text-sm uppercase tracking-widest text-slate-400 hover:text-slate-50 hover:underline decoration-amber-600 underline-offset-4 transition-all" href="#">Términos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-body text-sm uppercase tracking-widest text-slate-50 mb-6">Contacto</h5>
              <p className="font-body text-sm tracking-widest text-slate-400 mb-4">Av. Libertador 1200, CABA<br/>Argentina</p>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-amber-500">alternate_email</span>
                <span className="material-symbols-outlined text-amber-500">share</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800/50">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-slate-500">© 2024 BPB Abogados. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="text-xs uppercase tracking-widest text-slate-500">Buenos Aires</span>
              <span className="text-xs uppercase tracking-widest text-slate-500">Madrid</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Consultation Hub (FAB) */}
      <button aria-label="Abrir WhatsApp" className="fixed bottom-8 right-8 px-6 py-4 rounded-full bg-green-600 shadow-2xl flex items-center gap-3 text-white justify-center group hover:bg-green-700 transition-all z-[60]">
        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">chat</span>
        <span className="font-bold tracking-wide">Asistencia Inmediata</span>
      </button>
    </div>
  );
}
