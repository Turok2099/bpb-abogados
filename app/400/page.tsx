import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'

export const metadata = {
  title: 'Solicitud Incorrecta (400) | BPB Abogados',
  description: 'La solicitud no pudo ser procesada por el servidor.',
}

export default function BadRequestPage() {
  return (
    <div className="min-h-[80vh] bg-background text-white flex items-center justify-center px-6 py-24 md:py-32">
      <div className="max-w-xl w-full text-center space-y-8 relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/5 blur-3xl rounded-full -z-10"></div>
        
        <div className="space-y-4">
          <div className="inline-flex p-4 rounded-full bg-secondary/10 border border-secondary/20 mb-2">
            <AlertTriangle className="w-12 h-12 text-secondary" />
          </div>
          <span className="block font-label text-xs uppercase tracking-widest text-secondary font-bold">
            Error 400
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl font-light leading-tight">
            Petición Incorrecta
          </h1>
          <div className="editorial-line max-w-xs mx-auto opacity-30 my-4"></div>
          <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-md mx-auto">
            El servidor no pudo interpretar o procesar la solicitud debido a un formato no válido o a un error en la transferencia de datos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex h-12 px-6 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
          <Link
            href="/contacto"
            className="w-full sm:w-auto inline-flex h-12 px-6 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all duration-300 rounded-sm items-center justify-center gap-2 cursor-pointer"
          >
            Reportar error
          </Link>
        </div>
      </div>
    </div>
  )
}
