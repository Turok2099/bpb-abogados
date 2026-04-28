"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-lg border-b border-outline-variant/10 transition-all">
      <div className="flex justify-between items-center px-6 md:px-8 py-6 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center group">
          <img src="/favicon.png" alt="BPB Abogados Logo" className="h-[72px] w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">

          <Link
            className="text-on-surface-variant hover:text-secondary text-sm tracking-widest transition-all duration-300"
            href="/infraestructura"
          >
            MONETIZACIÓN INFRAESTRUCTURA
          </Link>
          <Link
            className="text-on-surface-variant hover:text-secondary text-sm tracking-widest transition-all duration-300"
            href="/fast-track"
          >
            FAST-TRACK
          </Link>
          <Link
            className="text-on-surface-variant hover:text-secondary text-sm tracking-widest transition-all duration-300"
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
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/10 shadow-xl flex flex-col py-6 px-6 gap-6">

          <Link
            className="text-white text-sm font-bold tracking-widest border-b border-white/10 pb-4"
            href="/fast-track"
            onClick={toggleMobileMenu}
          >
            EVALUACIÓN FAST-TRACK
          </Link>
          <Link
            className="text-white text-sm font-bold tracking-widest border-b border-white/10 pb-4"
            href="/infraestructura"
            onClick={toggleMobileMenu}
          >
            MONETIZACIÓN INFRAESTRUCTURA
          </Link>
          <Link
            className="text-white text-sm font-bold tracking-widest border-b border-white/10 pb-4"
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
