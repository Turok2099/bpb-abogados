"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await login({ email, password });
      if (res?.error) {
        toast.error(res.error, {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-error)",
            color: "var(--color-on-surface)",
          },
        });
      } else {
        toast.success("Sesión iniciada correctamente", {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-secondary)",
            color: "var(--color-on-surface)",
          },
        });
        if (res?.role === "admin") {
          router.push("/admin");
        } else if (res?.role === "gestor") {
          router.push("/gestor");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container border border-secondary/20 p-8 md:p-10 rounded-sm shadow-2xl relative z-10">
      <div className="text-center mb-10">
        <img
          src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png"
          alt="BPB Abogados"
          className="h-16 w-auto mx-auto mb-6 object-contain"
        />
        <h1 className="font-headline text-3xl font-light text-white tracking-wide">
          Portal de Acceso
        </h1>
      </div>

      {errorParam === "unauthorized" && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-sm text-center font-body uppercase tracking-wider">
          Acceso denegado. Se requieren permisos de administrador.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="ejemplo@bpbabogados.com"
              className="w-full h-12 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-12 pr-4 text-white text-base transition-colors rounded-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              placeholder="••••••••"
              className="w-full h-12 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-12 pr-12 text-white text-base transition-colors rounded-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-secondary text-primary font-bold text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPending ? "AUTENTICANDO..." : "INICIAR SESIÓN"}
        </button>

        <div className="text-center pt-4 border-t border-outline-variant/30 mt-6 text-xs font-body text-white/50">
          ¿No tienes una cuenta de cliente?{" "}
          <Link
            href="/registro"
            className="text-secondary hover:underline ml-1 font-semibold"
          >
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full"></div>
      </div>
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-surface-container border border-secondary/20 p-8 md:p-10 rounded-sm shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-xs font-label uppercase tracking-widest text-secondary">
              Cargando...
            </span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
