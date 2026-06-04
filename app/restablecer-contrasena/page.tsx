'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RestablecerContrasenaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isValidating, setIsValidating] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Validar si hay una sesión activa. Si no la hay (ej: entraron directo sin token), redirige a login
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Sesión no válida o expirada. Por favor inicia el proceso de nuevo.")
        router.push('/login')
      } else {
        setIsValidating(false)
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.")
      return
    }

    setIsPending(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        throw new Error(error.message)
      }

      toast.success("Contraseña configurada correctamente. Redirigiendo...", {
        style: {
          background: "var(--color-surface)",
          borderColor: "var(--color-secondary)",
          color: "var(--color-on-surface)",
        }
      })

      // Obtener perfil para redirigir de forma inteligente
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setTimeout(() => {
          if (profile?.role === 'admin') {
            router.push('/admin')
          } else if (profile?.role === 'gestor') {
            router.push('/gestor')
          } else {
            router.push('/dashboard')
          }
          router.refresh()
        }, 1500)
      } else {
        router.push('/login')
      }
    } catch (err: any) {
      toast.error(err.message || "Ocurrió un error al actualizar la contraseña.")
    } finally {
      setIsPending(false)
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white flex-col">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-label uppercase tracking-widest text-secondary">
          Verificando sesión segura...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full"></div>
      </div>

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
            Configurar Contraseña
          </h1>
          <p className="font-body text-[10px] uppercase tracking-widest text-secondary mt-2">
            BPB Abogados - Acceso Seguro
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-xs text-white/60 font-body leading-relaxed text-center">
            Para finalizar la configuración de tu cuenta, introduce una contraseña segura de al menos 6 caracteres.
          </p>

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                placeholder="Mínimo 6 caracteres"
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

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
                placeholder="Repite la contraseña"
                className="w-full h-12 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-12 pr-12 text-white text-base transition-colors rounded-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-secondary text-primary font-bold text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                CONFIGURANDO...
              </>
            ) : (
              "ESTABLECER CONTRASEÑA"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
