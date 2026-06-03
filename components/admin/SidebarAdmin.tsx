"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { 
  Briefcase, LayoutDashboard, Globe, LogOut, 
  Menu, X, User, ShieldAlert 
} from "lucide-react";

interface SidebarAdminProps {
  user: { id: string; email: string };
  profile: { nombre: string; role?: string } | null;
}

export function SidebarAdmin({ user, profile }: SidebarAdminProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    {
      name: "Gestión de Casos",
      href: "/gestor",
      icon: Briefcase,
      active: pathname.startsWith("/gestor"),
    },
    {
      name: "Publicaciones Blog",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname.startsWith("/admin"),
    },
    {
      name: "Ver Sitio Público",
      href: "/",
      icon: Globe,
      active: pathname === "/",
    },
  ];

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* HEADER MÓVIL (Visible solo en mobile) */}
      <header className="flex md:hidden items-center justify-between bg-surface border-b border-outline-variant/20 px-6 py-4 sticky top-0 z-40 w-full">
        <Link href="/" className="flex items-center shrink-0">
          <img 
            src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" 
            alt="BPB Abogados Logo" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        <button
          onClick={handleToggle}
          className="p-2 border border-outline-variant/20 rounded-sm text-white hover:text-secondary hover:border-secondary transition-colors cursor-pointer"
          aria-label="Abrir Menú"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* BACKDROP MÓVIL (Cierra el sidebar al dar clic fuera) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* SIDEBAR CONTAINER (Fijo en desktop, desplegable en mobile) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface border-r border-outline-variant/20 flex flex-col justify-between transition-transform duration-300 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:top-0 md:h-screen
      `}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo superior en Sidebar */}
          <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
            <Link href="/" className="flex items-center shrink-0" onClick={handleClose}>
              <img 
                src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" 
                alt="BPB Abogados Logo" 
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
            <button 
              onClick={handleClose} 
              className="md:hidden p-1 text-white/50 hover:text-white border border-outline-variant/10 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Información del perfil del Administrador / Gestor */}
          <div className="p-6 border-b border-outline-variant/15 bg-surface/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary/15 border border-secondary/20 flex items-center justify-center text-secondary">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{profile?.nombre || "Administrador"}</div>
                <div className="text-[10px] text-secondary font-label uppercase tracking-wider truncate">
                  {profile?.role || "Personal"}
                </div>
              </div>
            </div>
          </div>

          {/* Enlaces de Navegación */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="text-[10px] uppercase font-label tracking-widest text-white/40 px-3 mb-4">Navegación</div>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleClose}
                  className={`
                    flex items-center gap-3.5 px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-200 cursor-pointer
                    ${item.active 
                      ? "bg-secondary text-primary font-bold shadow-md shadow-secondary/10" 
                      : "text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent"}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Botón de Cerrar Sesión al final */}
        <div className="p-4 border-t border-outline-variant/15 bg-surface-container-low/20">
          <form action={logout}>
            <button
              type="submit"
              className="w-full h-11 px-4 border border-outline-variant/30 hover:border-error hover:text-error text-white/70 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer font-label"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
