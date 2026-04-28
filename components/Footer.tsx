import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary w-full py-20 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto border-t border-white/10 pt-16">
        <div className="col-span-1 md:col-span-1">
          <img src="/favicon.png" alt="BPB Abogados Logo" className="h-24 w-auto object-contain mb-6 opacity-90" />
          <p className="font-body text-xs uppercase tracking-widest text-white/70 leading-relaxed">
            BUENOS AIRES
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-white text-xs font-bold tracking-widest mb-6">NAVEGACIÓN</p>
          <ul className="space-y-3">

            <li>
              <Link className="font-body text-sm uppercase tracking-widest text-white/70 hover:text-white hover:underline decoration-secondary underline-offset-4 transition-colors" href="/infraestructura">
                Monetización Infraestructura
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="text-white text-xs font-bold tracking-widest mb-6">CONTACTO</p>
          <ul className="space-y-3">
            <li><Link className="font-body text-sm uppercase tracking-widest text-white/70 hover:text-white hover:underline decoration-secondary underline-offset-4 transition-colors" href="/contacto">Contacto Directo</Link></li>
            <li><a className="font-body text-sm uppercase tracking-widest text-white/70 hover:text-white hover:underline decoration-secondary underline-offset-4 transition-colors" href="#">Privacidad</a></li>
          </ul>
        </div>
        <div className="space-y-6">
          <p className="text-white text-xs font-bold tracking-widest mb-4">SÍGUENOS</p>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/bpb.abogados?igsh=MXZhdmN4YmJxZnZ0" target="_blank" rel="noopener noreferrer" aria-label="Instagram de BPB Abogados">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70 hover:text-secondary cursor-pointer transition-colors w-6 h-6"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 text-center border-t border-white/10 pt-8">
        <p className="font-body text-xs uppercase tracking-widest text-white/60">
          © 2024 BPB Abogados. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
