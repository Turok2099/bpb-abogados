'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Aquí se podría reportar el error a un servicio de telemetría (ej. Sentry, Logflare)
    console.error('Unhandled runtime error:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] bg-background text-white flex items-center justify-center px-6 py-24 md:py-32">
      <div className="max-w-xl w-full text-center space-y-8 relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-error/5 blur-3xl rounded-full -z-10"></div>
        
        <div className="space-y-4">
          <div className="inline-flex p-4 rounded-full bg-error/10 border border-error/20 mb-2">
            <AlertCircle className="w-12 h-12 text-error" />
          </div>
          <span className="block font-label text-xs uppercase tracking-widest text-error font-bold">
            Error del Servidor
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl font-light leading-tight">
            Algo salió mal
          </h1>
          <div className="editorial-line max-w-xs mx-auto opacity-30 my-4"></div>
          <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-md mx-auto">
            Ha ocurrido un error inesperado al procesar su solicitud en nuestra plataforma. El equipo técnico ha sido notificado del incidente.
          </p>
          {error.digest && (
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-2">
              ID de error: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex h-12 px-6 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex h-12 px-6 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all duration-300 rounded-sm items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
