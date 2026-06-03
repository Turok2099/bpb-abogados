import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: No escribir lógica entre createServerClient y supabase.auth.getUser()
  // para evitar problemas comunes de seguridad con sesiones en Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 1. Proteger rutas por rol
  if (path.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
      await supabase.auth.signOut()
      return response
    }
  }

  if (path.startsWith('/gestor')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'gestor' && profile.role !== 'admin')) {
      const response = NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
      await supabase.auth.signOut()
      return response
    }
  }

  if (path.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'cliente' && profile.role !== 'gestor' && profile.role !== 'admin')) {
      const response = NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
      await supabase.auth.signOut()
      return response
    }
  }

  // 2. Redirigir si ya está autenticado e intenta acceder a /login o /registro
  if (path.startsWith('/login') || path.startsWith('/registro')) {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile) {
        const url = request.nextUrl.clone()
        if (profile.role === 'admin') {
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        } else if (profile.role === 'gestor') {
          url.pathname = '/gestor'
          return NextResponse.redirect(url)
        } else if (profile.role === 'cliente') {
          url.pathname = '/dashboard'
          return NextResponse.redirect(url)
        }
      }
    }
  }

  return supabaseResponse
}

