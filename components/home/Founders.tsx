export function Founders() {
  return (
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
              <img alt="Retrato Profesional Dr. Guillermo Betard" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" src="/socios/1.png" />
              <div className="absolute inset-0 bg-gray-500/40 mix-blend-multiply pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
            </div>
            <h3 className="font-headline text-2xl text-white mb-1">Dr. Guillermo Betard</h3>
            <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio Senior - Corporate &amp; M&amp;A</p>
            <div className="editorial-line mb-4 opacity-40"></div>
          </div>
          {/* Partner 2 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-8 border-b-2 border-transparent group-hover:border-secondary transition-colors duration-500">
              <img alt="Retrato Profesional Dr. Mariano Pacifico" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" src="/socios/2.png" />
              <div className="absolute inset-0 bg-gray-500/40 mix-blend-multiply pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
            </div>
            <h3 className="font-headline text-2xl text-white mb-1">Dr. Mariano Pacifico</h3>
            <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio - Real Estate &amp; Infraestructura</p>
            <div className="editorial-line mb-4 opacity-40"></div>
          </div>
          {/* Partner 3 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-8 border-b-2 border-transparent group-hover:border-secondary transition-colors duration-500">
              <img alt="Retrato Profesional Dr. Rodrigo Biondi" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560047/rodrigo_cbqo2r.jpg" />
              <div className="absolute inset-0 bg-gray-500/40 mix-blend-multiply pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
            </div>
            <h3 className="font-headline text-2xl text-white mb-1">Dr. Rodrigo Biondi</h3>
            <p className="font-label text-xs uppercase tracking-widest text-secondary font-bold mb-4">Socio - Wealth Management</p>
            <div className="editorial-line mb-4 opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
