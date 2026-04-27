import { Gavel, Menu } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-lg border-b border-outline-variant/10 transition-all">
      <div className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <Gavel className="text-secondary transition-transform group-hover:-rotate-12" />
          <span className="text-xl font-bold tracking-widest text-on-surface font-headline uppercase italic">BPB ABOGADOS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10">

          <Link
            className="text-on-surface-variant hover:text-secondary text-sm tracking-widest transition-all duration-300"
            href="/infraestructura"
          >
            MONETIZACIÓN INFRAESTRUCTURA
          </Link>
          <Link
            className="text-on-surface-variant hover:text-secondary text-sm tracking-widest transition-all duration-300"
            href="/contacto"
          >
            CONTACTO
          </Link>

        </nav>
        <div className="md:hidden">
          <Menu className="text-white w-6 h-6" />
        </div>
      </div>
    </header>
  );
}
