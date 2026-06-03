"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerClient } from "@/app/actions/auth";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, User, Phone, Check } from "lucide-react";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.", {
        style: {
          background: "var(--color-surface)",
          borderColor: "var(--color-error)",
          color: "var(--color-on-surface)",
        },
      });
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.", {
        style: {
          background: "var(--color-surface)",
          borderColor: "var(--color-error)",
          color: "var(--color-on-surface)",
        },
      });
      return;
    }

    setIsPending(true);

    try {
      const res = await registerClient({ nombre, email, telefono, password });
      if (res?.error) {
        toast.error(res.error, {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-error)",
            color: "var(--color-on-surface)",
          },
        });
      } else {
        toast.success("Registro completado con éxito.", {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-secondary)",
            color: "var(--color-on-surface)",
          },
        });
        setIsRegistered(true);
        // Esperamos 4 segundos antes de enviar al login
        setTimeout(() => {
          router.push("/login");
        }, 4000);
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-surface-container border border-secondary/20 p-8 md:p-10 rounded-sm shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <img
            src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png"
            alt="BPB Abogados"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-headline text-2xl font-light text-white tracking-wide">
            Crear Cuenta de Cliente
          </h1>
          <p className="font-body text-[10px] uppercase tracking-widest text-secondary mt-1">
            BPB Abogados - Portal de Seguimiento
          </p>
        </div>

        {isRegistered ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/30">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl text-white">¡Registro completado!</h3>
            <p className="text-sm text-white/70 font-body">
              Hemos enviado un enlace de confirmación a tu correo (si aplica) o puedes iniciar sesión de inmediato.
            </p>
            <p className="text-xs text-secondary font-label uppercase tracking-widest animate-pulse pt-2">
              Redirigiendo a iniciar sesión...
            </p>
            <Link
              href="/login"
              className="mt-4 px-6 py-2 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-sm block w-full text-center"
            >
              Ir al Acceso de inmediato
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={isPending}
                  placeholder="Juan Pérez"
                  className="w-full h-11 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-11 pr-4 text-white text-sm transition-colors rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  placeholder="ejemplo@correo.com"
                  className="w-full h-11 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-11 pr-4 text-white text-sm transition-colors rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">
                Teléfono de Contacto
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  disabled={isPending}
                  placeholder="+54 9 11 1234-5678"
                  className="w-full h-11 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-11 pr-4 text-white text-sm transition-colors rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  placeholder="••••••••"
                  className="w-full h-11 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-11 pr-11 text-white text-sm transition-colors rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  placeholder="••••••••"
                  className="w-full h-11 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-11 pr-11 text-white text-sm transition-colors rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-secondary text-primary font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center pt-0.5"
            >
              {isPending ? "PROCESANDO..." : "CREAR CUENTA"}
            </button>

            <div className="text-center pt-4 border-t border-outline-variant/30 mt-4 text-xs font-body text-white/50">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-secondary hover:underline ml-1">
                Iniciar Sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
