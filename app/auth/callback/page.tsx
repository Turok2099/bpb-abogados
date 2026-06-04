'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    // Leemos el hash antes de que Supabase pueda procesarlo y borrarlo
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const hasHashAuth = hash.includes('access_token=') || hash.includes('error_code=')
    // También verificamos searchParams por si viene el type ahí
    const isResetFlow = hash.includes('type=recovery') || hash.includes('type=invite') || hash.includes('type=signup') || searchParams.get('type') === 'recovery' || searchParams.get('type') === 'invite'
    const invitedEmail = searchParams.get('email')

    // Si es un flujo de invitación o recuperación, y hay un email invitado,
    // cerramos la sesión local actual de forma síncrona si pertenece a otro usuario.
    if (isResetFlow && invitedEmail && typeof window !== 'undefined') {
      try {
        let currentEmail = null
        let tokenKey = null
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            tokenKey = key
            const val = localStorage.getItem(key)
            if (val) {
              const data = JSON.parse(val)
              currentEmail = data?.currentSession?.user?.email || data?.user?.email
            }
            break
          }
        }

        if (currentEmail && currentEmail !== invitedEmail) {
          console.log(`Limpiando sesión local de ${currentEmail} en favor de ${invitedEmail}`)
          if (tokenKey) {
            localStorage.removeItem(tokenKey)
          }
          // Borrar cookies de supabase
          document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim();
            if (name.startsWith("sb-")) {
              document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
              document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            }
          });
        }
      } catch (err) {
        console.error("Error al limpiar sesión local conflictiva:", err)
      }
    }

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

      // 2. Escuchamos el cambio de estado de Supabase Auth
      let processed = false

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Si hay un hash de autenticación, IGNORAMOS la sesión inicial, ya que puede ser
        // una sesión antigua de otro usuario que estaba logueado.
        // Esperamos explícitamente el evento SIGNED_IN o PASSWORD_RECOVERY que Supabase emitirá tras procesar el hash.
        
        if (
          event === 'SIGNED_IN' || 
          event === 'PASSWORD_RECOVERY' || 
          event === 'TOKEN_REFRESHED' || 
          event === 'USER_UPDATED' || 
          (event === 'INITIAL_SESSION' && session && !hasHashAuth)
        ) {
          processed = true
          subscription.unsubscribe()
          
          if (isResetFlow) {
            router.push('/restablecer-contrasena')
          } else if (session) {
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
          } else {
            router.push('/login')
          }
        } else if (event === 'INITIAL_SESSION' && !session && !hasHashAuth) {
          processed = true
          subscription.unsubscribe()
          router.push('/login')
        }
      })

      // 3. Fallback de seguridad por si Supabase falla silenciosamente al procesar el hash
      if (hasHashAuth) {
        setTimeout(() => {
          if (!processed) {
            subscription.unsubscribe()
            router.push('/login?error=timeout')
          }
        }, 5000)
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
