import { Briefcase, Newspaper } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary w-full py-20 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto border-t border-white/10 pt-16">
        <div className="col-span-1 md:col-span-1">
          <span className="text-2xl font-headline italic text-secondary block mb-6">BPB Abogados</span>
          <p className="font-body text-xs uppercase tracking-widest text-white/70 leading-relaxed">
            BUENOS AIRES
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-white text-xs font-bold tracking-widest mb-6">NAVEGACIÓN</p>
          <ul className="space-y-3">
            <li>
              <Link className="font-body text-sm uppercase tracking-widest text-white/70 hover:text-white hover:underline decoration-secondary underline-offset-4 transition-colors" href="/">
                El Estudio
              </Link>
            </li>
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
            <Briefcase className="text-white/70 hover:text-secondary cursor-pointer transition-colors" />
            <Newspaper className="text-white/70 hover:text-secondary cursor-pointer transition-colors" />
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
