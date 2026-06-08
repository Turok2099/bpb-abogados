'use client'

import { useEffect, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  
  // Debug state to show exactly what's failing on screen
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [hasTimedOut, setHasTimedOut] = useState(false)

  useEffect(() => {
    const addLog = (msg: string) => setDebugLog(prev => [...prev, `${new Date().toISOString().split('T')[1]} - ${msg}`])
    
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    addLog(`Hash detectado: ${hash ? hash.substring(0, 30) + '...' : 'vacío'}`)
    
    const hasHashAuth = hash.includes('access_token=') || hash.includes('error_code=') || hash.includes('error=')
    const isSignupFlow = hash.includes('type=signup') || searchParams.get('type') === 'signup'
    const isResetFlow = hash.includes('type=recovery') || hash.includes('type=invite') || searchParams.get('type') === 'recovery' || searchParams.get('type') === 'invite'
    const hasCode = !!code
    
    addLog(`Condiciones: hasHashAuth=${hasHashAuth}, isResetFlow=${isResetFlow}, hasCode=${hasCode}`)

    const supabase = createClient()
    addLog('Supabase client instanciado.')

    const handleAuth = async () => {
      try {
        if (hash.includes('error=')) {
          const urlParams = new URLSearchParams(hash.substring(1))
          const errorDesc = urlParams.get('error_description') || 'invalid_link'
          addLog(`Hash contiene error explícito: ${errorDesc}`)
          router.push(`/login?error=${encodeURIComponent(errorDesc)}`)
          return
        }

        // Si se detecta un enlace de autenticación entrante (código PKCE o token en el hash) y existe
        // una sesión previa activa, cerramos la sesión actual para evitar colisiones en la BD.
        if (code || hash.includes('access_token=')) {
          addLog('Verificando si existe sesión activa previa...')
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          if (currentSession) {
            addLog(`Sesión previa activa encontrada (Usuario: ${currentSession.user.email}). Cerrando sesión...`)
            
            // Cerrar sesión oficialmente mediante el SDK de Supabase
            await supabase.auth.signOut()
            
            // Adicionalmente, limpiar manualmente localStorage y cookies de Supabase por seguridad
            if (typeof window !== 'undefined') {
              try {
                for (let i = localStorage.length - 1; i >= 0; i--) {
                  const key = localStorage.key(i)
                  if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
                    localStorage.removeItem(key)
                  }
                }
                document.cookie.split(";").forEach((c) => {
                  const eqPos = c.indexOf("=");
                  const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim();
                  if (name.startsWith("sb-")) {
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                  }
                });
                addLog('Limpieza manual de cookies y almacenamiento completada.')
              } catch (err: any) {
                addLog(`Advertencia en limpieza manual: ${err.message}`)
              }
            }
          } else {
            addLog('No se detectó sesión previa activa.')
          }
        }

        // 1. Manejo del flujo PKCE (con código en query)
        if (code) {
          addLog('Intercambiando código PKCE...')
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            addLog(`Error PKCE: ${error.message}`)
            router.push('/login?error=callback_error')
            return
          }
          
          addLog('Intercambio PKCE exitoso. Redirigiendo...')
          if (isResetFlow) {
            router.push('/restablecer-contrasena')
          } else if (isSignupFlow) {
            await supabase.auth.signOut()
            router.push('/login?verified=true')
          } else if (data.session) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.session.user.id).single()
            if (profile?.role === 'admin') router.push('/admin')
            else if (profile?.role === 'gestor') router.push('/gestor')
            else router.push('/dashboard')
          } else {
            router.push('/login')
          }
          return
        }

        // 2. Manejo del flujo Implícito (con token en hash)
        const cleanHash = hash.replace(/^#[/]?/, '')
        const hashParams = new URLSearchParams(cleanHash)
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken && refreshToken) {
          addLog('Token de acceso detectado en hash. Ejecutando setSession manual...')
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            addLog(`Error setSession manual: ${error.message}`)
            router.push(`/login?error=${encodeURIComponent('Token inválido o expirado')}`)
            return
          }

          addLog('setSession manual exitoso. Redirigiendo...')
          if (isResetFlow) {
            router.push('/restablecer-contrasena')
          } else if (isSignupFlow) {
            await supabase.auth.signOut()
            router.push('/login?verified=true')
          } else if (data.session) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.session.user.id).single()
            if (profile?.role === 'admin') router.push('/admin')
            else if (profile?.role === 'gestor') router.push('/gestor')
            else router.push('/dashboard')
          } else {
            router.push('/login')
          }
          return
        }

        // 3. Fallback: Si no hay código ni token, verificar sesión existente
        addLog('No hay código ni token en URL. Verificando sesión existente...')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          addLog('Sesión existente encontrada. Redirigiendo...')
          if (isResetFlow) {
            router.push('/restablecer-contrasena')
          } else if (isSignupFlow) {
            await supabase.auth.signOut()
            router.push('/login?verified=true')
          } else {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
            if (profile?.role === 'admin') router.push('/admin')
            else if (profile?.role === 'gestor') router.push('/gestor')
            else router.push('/dashboard')
          }
        } else {
          addLog('Ninguna sesión activa. Redirigiendo a login.')
          router.push('/login')
        }
        
      } catch (err: any) {
        addLog(`Excepción general en handleAuth: ${err.message}`)
        setHasTimedOut(true) // Mostramos el panel de debug
      }
    }

    handleAuth()
  }, [code, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white flex-col p-8">
      {!hasTimedOut ? (
        <>
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-label uppercase tracking-widest text-secondary">
            Procesando inicio de sesión...
          </p>
        </>
      ) : (
        <div className="bg-error/20 border border-error p-6 rounded-md max-w-2xl w-full">
          <h2 className="text-xl font-bold text-error mb-4 uppercase tracking-wider">Error de Timeout</h2>
          <p className="mb-4 text-sm text-white/80">
            El sistema no pudo completar el inicio de sesión. A continuación se muestran los registros de depuración:
          </p>
          <pre className="bg-surface-container p-4 rounded text-xs text-secondary overflow-auto max-h-64 whitespace-pre-wrap font-mono">
            {debugLog.join('\n')}
          </pre>
          <button 
            onClick={() => router.push('/login')}
            className="mt-6 px-6 py-2 bg-secondary text-background font-bold uppercase tracking-wider text-xs rounded hover:opacity-90"
          >
            Volver al Login
          </button>
        </div>
      )}
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
