"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const servicesList = [
  { num: "01", title: "Asesoramiento Integral a Empresas" },
  { num: "02", title: "Derecho Societario y Empresarial" },
  { num: "03", title: "Derecho Laboral" },
  { num: "04", title: "Derecho Civil y Comercial" },
  { num: "05", title: "Derecho Administrativo" },
  { num: "06", title: "Derecho Penal" },
  { num: "07", title: "Defensa del Consumidor" },
  { num: "08", title: "Familia y Sucesiones" }
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-lg border-b border-outline-variant/10 transition-all">
      <div className="flex justify-between items-center px-6 md:px-8 py-6 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center group">
          <img src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" alt="BPB Abogados Logo" className="h-[72px] w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">

          <div className="relative group">
            <button className="flex items-center gap-1 text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300 uppercase focus:outline-none">
              SERVICIOS
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
              <div className="bg-surface border border-outline-variant/10 shadow-xl rounded-sm py-2 w-72 flex flex-col">
                {servicesList.map((srv) => (
                  <Link
                    key={srv.num}
                    href={`/#servicio-${srv.num}`}
                    onClick={() => {
                      setTimeout(() => window.dispatchEvent(new Event('hashchange')), 100);
                      setTimeout(() => window.dispatchEvent(new Event('hashchange')), 500);
                    }}
                    className="px-6 py-3 text-base tracking-wider text-white/70 hover:text-secondary hover:bg-white/5 transition-colors"
                  >
                    {srv.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            className="text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300"
            href="/#socios"
          >
            SOCIOS
          </Link>
          <Link
            className="text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300"
            href="/infraestructura"
          >
            REAL STATE
          </Link>
          <Link
            className="text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300"
            href="/test-de-viabilidad"
          >
            TEST DE VIABILIDAD
          </Link>
          <Link
            className="text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300"
            href="/contacto"
          >
            CONTACTO
          </Link>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none"
          aria-label="Alternar menú"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 text-secondary" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full max-h-[85vh] overflow-y-auto bg-surface border-b border-outline-variant/10 shadow-xl flex flex-col py-6 px-6 gap-6">

          <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
            <span className="text-white text-base font-bold tracking-widest">SERVICIOS</span>
            <div className="flex flex-col pl-4 gap-4 mt-2">
              {servicesList.map((srv) => (
                <Link
                  key={srv.num}
                  href={`/#servicio-${srv.num}`}
                  onClick={() => {
                    toggleMobileMenu();
                    setTimeout(() => window.dispatchEvent(new Event('hashchange')), 100);
                    setTimeout(() => window.dispatchEvent(new Event('hashchange')), 500);
                  }}
                  className="text-base text-white/70 hover:text-secondary tracking-widest uppercase"
                >
                  {srv.title}
                </Link>
              ))}
            </div>
          </div>

          <Link
            className="text-white text-base font-bold tracking-widest border-b border-white/10 pb-4"
            href="/#socios"
            onClick={toggleMobileMenu}
          >
            SOCIOS
          </Link>
          <Link
            className="text-white text-base font-bold tracking-widest border-b border-white/10 pb-4"
            href="/test-de-viabilidad"
            onClick={toggleMobileMenu}
          >
            TEST DE VIABILIDAD
          </Link>
          <Link
            className="text-white text-base font-bold tracking-widest border-b border-white/10 pb-4"
            href="/infraestructura"
            onClick={toggleMobileMenu}
          >
            REAL STATE
          </Link>
          <Link
            className="text-white text-base font-bold tracking-widest border-b border-white/10 pb-4"
            href="/contacto"
            onClick={toggleMobileMenu}
          >
            CONTACTO
          </Link>
        </div>
      )}
    </header>
  );
}
