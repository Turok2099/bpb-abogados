'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    const supabase = createClient()

    const handleAuth = async () => {
      // 1. Si es flujo PKCE, intercambiamos el código por sesión
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error("Error exchanging code:", error)
          router.push('/login?error=callback_error')
          return
        }
      }

      // 2. Obtener sesión activa
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const hash = window.location.hash
        const isResetFlow = hash.includes('type=recovery') || hash.includes('type=invite') || hash.includes('type=signup') || searchParams.get('type') === 'recovery' || searchParams.get('type') === 'invite'
        
        if (isResetFlow) {
          router.push('/restablecer-contrasena')
        } else {
          // Redirección por rol
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (profile?.role === 'admin') {
            router.push('/admin')
          } else if (profile?.role === 'gestor') {
            router.push('/gestor')
          } else {
            router.push('/dashboard')
          }
        }
      } else {
        // 3. Si no hay sesión inmediata, escuchamos el cambio de estado de Supabase Auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            subscription.unsubscribe()
            const hash = window.location.hash
            const isReset = hash.includes('type=recovery') || hash.includes('type=invite') || searchParams.get('type') === 'recovery' || searchParams.get('type') === 'invite'
            
            if (isReset) {
              router.push('/restablecer-contrasena')
            } else {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

              if (profile?.role === 'admin') {
                router.push('/admin')
              } else if (profile?.role === 'gestor') {
                router.push('/gestor')
              } else {
                router.push('/dashboard')
              }
            }
          } else if (event === 'INITIAL_SESSION' && !session) {
            subscription.unsubscribe()
            router.push('/login')
          }
        })
      }
    }

    handleAuth()
  }, [code, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white flex-col">
      <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-xs font-label uppercase tracking-widest text-secondary">
        Procesando inicio de sesión...
      </p>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-white flex-col">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-label uppercase tracking-widest text-secondary">Cargando...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
