"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, resendConfirmation, sendPasswordRecovery } from "@/app/actions/auth";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, Send, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const verifiedParam = searchParams.get("verified");

  const [view, setView] = useState<"login" | "resend" | "recovery">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isResendPending, setIsResendPending] = useState(false);
  const [isRecoveryPending, setIsRecoveryPending] = useState(false);

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

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Por favor introduce tu correo electrónico.");
      return;
    }
    setIsResendPending(true);

    try {
      const res = await resendConfirmation(resendEmail);
      if (res?.error) {
        toast.error(res.error, {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-error)",
            color: "var(--color-on-surface)",
          },
        });
      } else {
        toast.success("Correo de confirmación reenviado. Revisa tu buzón.", {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-secondary)",
            color: "var(--color-on-surface)",
          },
        });
        setView("login");
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsResendPending(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast.error("Por favor introduce tu correo electrónico.");
      return;
    }
    setIsRecoveryPending(true);

    try {
      const res = await sendPasswordRecovery(recoveryEmail);
      if (res?.error) {
        toast.error(res.error, {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-error)",
            color: "var(--color-on-surface)",
          },
        });
      } else {
        toast.success("Enlace de recuperación enviado. Revisa tu correo.", {
          style: {
            background: "var(--color-surface)",
            borderColor: "var(--color-secondary)",
            color: "var(--color-on-surface)",
          },
        });
        setView("login");
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsRecoveryPending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container border border-secondary/20 p-8 md:p-10 rounded-sm shadow-2xl relative z-10">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block hover:opacity-85 transition-opacity">
          <img
            src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png"
            alt="BPB Abogados"
            className="h-16 w-auto mx-auto mb-6 object-contain"
          />
        </Link>
        <h1 className="font-headline text-3xl font-light text-white tracking-wide">
          {view === "login" ? "Portal de Acceso" : view === "resend" ? "Reenviar Confirmación" : "Recuperar Contraseña"}
        </h1>
        <p className="font-body text-[10px] uppercase tracking-widest text-secondary mt-2">
          {view === "login" ? "BPB Abogados - Clientes y Gestores" : view === "resend" ? "Recupera tu enlace de verificación" : "Te enviaremos un enlace de acceso"}
        </p>
      </div>

      {verifiedParam && verifiedParam === "true" && view === "login" && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-sm text-center font-body">
          <p className="font-bold uppercase tracking-wider mb-1">¡Cuenta Confirmada!</p>
          Tu dirección de correo ha sido verificada con éxito. Ya puedes iniciar sesión.
        </div>
      )}

      {errorParam && errorParam === "unauthorized" && view === "login" && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-sm text-center font-body uppercase tracking-wider">
          Acceso denegado. Se requieren permisos de administrador.
        </div>
      )}
      {errorParam && errorParam !== "unauthorized" && view === "login" && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-sm text-center font-body">
          <p className="font-bold uppercase tracking-wider mb-1">Error de Autenticación</p>
          {errorParam === "timeout" 
            ? "El inicio de sesión ha tardado demasiado. Por favor, intenta nuevamente." 
            : errorParam === "callback_error"
            ? "Hubo un error al procesar el inicio de sesión."
            : errorParam === "invalid_link" || errorParam === "Email link is invalid or has expired"
            ? "El enlace es inválido, ya fue utilizado o ha expirado. Por favor, solicita uno nuevo."
            : decodeURIComponent(errorParam)}
        </div>
      )}

      {view === "login" ? (
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
              <button
                type="button"
                onClick={() => setView("recovery")}
                className="text-secondary/80 hover:text-secondary text-[10px] uppercase tracking-wider mt-2 float-right hover:underline focus:outline-none"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-secondary text-primary font-bold text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            {isPending ? "AUTENTICANDO..." : "INICIAR SESIÓN"}
          </button>

          <div className="flex flex-col space-y-3 pt-4 border-t border-outline-variant/30 mt-6 text-xs text-center font-body text-white/50">
            <div>
              ¿No tienes una cuenta de cliente?{" "}
              <Link href="/registro" className="text-secondary hover:underline ml-1 font-semibold">
                Regístrate aquí
              </Link>
            </div>
            <div>
              ¿El correo de confirmación no funciona o no te llegó?{" "}
              <button
                type="button"
                onClick={() => setView("resend")}
                className="text-secondary hover:underline ml-1 font-semibold cursor-pointer focus:outline-none"
              >
                Reenviar correo
              </button>
            </div>
          </div>
        </form>
      ) : view === "resend" ? (
        <form onSubmit={handleResend} className="space-y-6">
          <p className="text-xs text-white/60 font-body leading-relaxed">
            Ingresa el correo electrónico con el que te registraste. Te enviaremos un nuevo enlace de confirmación para que puedas activar tu portal.
          </p>

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                disabled={isResendPending}
                placeholder="ejemplo@bpbabogados.com"
                className="w-full h-12 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-12 pr-4 text-white text-base transition-colors rounded-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isResendPending}
            className="w-full h-12 bg-secondary text-primary font-bold text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer gap-2"
          >
            {isResendPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                REENVIANDO...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                REENVIAR CORREO
              </>
            )}
          </button>

          <div className="pt-4 border-t border-outline-variant/30 mt-6 text-center">
            <button
              type="button"
              onClick={() => setView("login")}
              className="text-white/65 hover:text-white inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRecovery} className="space-y-6">
          <p className="text-xs text-white/60 font-body leading-relaxed">
            Ingresa tu correo electrónico registrado. Te enviaremos un enlace seguro para que puedas restablecer tu contraseña.
          </p>

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                required
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                disabled={isRecoveryPending}
                placeholder="ejemplo@bpbabogados.com"
                className="w-full h-12 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-12 pr-4 text-white text-base transition-colors rounded-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isRecoveryPending}
            className="w-full h-12 bg-secondary text-primary font-bold text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer gap-2"
          >
            {isRecoveryPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ENVIANDO...
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                ENVIAR ENLACE
              </>
            )}
          </button>

          <div className="pt-4 border-t border-outline-variant/30 mt-6 text-center">
            <button
              type="button"
              onClick={() => setView("login")}
              className="text-white/65 hover:text-white inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="text-white/60 hover:text-white inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-label border border-outline-variant/30 px-4 py-2 hover:border-secondary transition-all rounded-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al Inicio
        </Link>
      </div>
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
