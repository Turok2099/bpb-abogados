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
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isRealStateOpen, setIsRealStateOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setIsServicesOpen(false);
      setIsRealStateOpen(false);
    }
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
            <button className="flex items-center gap-1 text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300 uppercase focus:outline-none cursor-pointer">
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

          {/* REAL STATE Dropdown */}
          <div className="relative group">
            <Link
              href="/infraestructura"
              className="flex items-center gap-1 text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300 uppercase focus:outline-none cursor-pointer"
            >
              REAL STATE
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </Link>
            <div className="absolute top-full left-0 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
              <div className="bg-surface border border-outline-variant/10 shadow-xl rounded-sm py-2 w-64 flex flex-col">
                <Link
                  href="/test-de-viabilidad"
                  className="px-6 py-3 text-base tracking-wider text-white/70 hover:text-secondary hover:bg-white/5 transition-colors"
                >
                  Test de Viabilidad
                </Link>
              </div>
            </div>
          </div>

          <Link
            className="text-on-surface-variant hover:text-secondary text-base tracking-widest transition-all duration-300"
            href="/contacto"
          >
            CONTACTO
          </Link>

          <Link
            className="h-10 px-4 border border-secondary/35 text-secondary hover:bg-secondary/5 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center justify-center font-semibold cursor-pointer"
            href="/dashboard"
          >
            PORTAL CLIENTES
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

          {/* Mobile Servicios Dropdown */}
          <div className="border-b border-white/10 pb-4">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex justify-between items-center w-full text-white text-sm font-bold tracking-widest uppercase focus:outline-none text-left cursor-pointer"
            >
              <span>SERVICIOS</span>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`} />
            </button>
            {isServicesOpen && (
              <div className="flex flex-col pl-4 gap-3.5 mt-4 transition-all duration-300">
                {servicesList.map((srv) => (
                  <Link
                    key={srv.num}
                    href={`/#servicio-${srv.num}`}
                    onClick={() => {
                      toggleMobileMenu();
                      setTimeout(() => window.dispatchEvent(new Event('hashchange')), 100);
                      setTimeout(() => window.dispatchEvent(new Event('hashchange')), 500);
                    }}
                    className="text-xs text-white/70 hover:text-secondary tracking-wider uppercase transition-colors"
                  >
                    {srv.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            className="text-white text-sm font-bold tracking-widest border-b border-white/10 pb-4 transition-colors hover:text-secondary"
            href="/#socios"
            onClick={toggleMobileMenu}
          >
            SOCIOS
          </Link>

          {/* Mobile REAL STATE Dropdown */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex justify-between items-center w-full">
              <Link
                href="/infraestructura"
                onClick={toggleMobileMenu}
                className="text-white text-sm font-bold tracking-widest uppercase transition-colors hover:text-secondary"
              >
                REAL STATE
              </Link>
              <button
                onClick={() => setIsRealStateOpen(!isRealStateOpen)}
                className="p-2 focus:outline-none cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-300 ${isRealStateOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {isRealStateOpen && (
              <div className="flex flex-col pl-4 gap-3.5 mt-4 transition-all duration-300">
                <Link
                  href="/test-de-viabilidad"
                  onClick={toggleMobileMenu}
                  className="text-xs text-white/70 hover:text-secondary tracking-wider uppercase transition-colors"
                >
                  Test de Viabilidad
                </Link>
              </div>
            )}
          </div>

          <Link
            className="text-white text-sm font-bold tracking-widest border-b border-white/10 pb-4 transition-colors hover:text-secondary"
            href="/contacto"
            onClick={toggleMobileMenu}
          >
            CONTACTO
          </Link>

          <Link
            className="w-full h-11 border border-secondary/35 text-secondary hover:bg-secondary/5 text-xs uppercase tracking-widest font-semibold rounded-sm flex items-center justify-center cursor-pointer"
            href="/dashboard"
            onClick={toggleMobileMenu}
          >
            PORTAL CLIENTES
          </Link>
        </div>
      )}
    </header>
  );
}
