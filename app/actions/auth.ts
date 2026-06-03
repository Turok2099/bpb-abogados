'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(data: { email: string; password: string }) {
  const { email, password } = data

  if (!email || !password) {
    return { error: 'El correo electrónico y la contraseña son obligatorios.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Credenciales inválidas. Verifique el correo electrónico y la contraseña.' }
    }
    return { error: error.message }
  }

  // Obtener el rol del usuario para redirección inteligente
  const { data: { user } } = await supabase.auth.getUser()
  let role = 'cliente'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile) {
      role = profile.role
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, role }
}

export async function registerClient(data: { nombre: string; email: string; telefono: string; password: string }) {
  const { nombre, email, telefono, password } = data

  if (!nombre || !email || !telefono || !password) {
    return { error: 'Todos los campos son obligatorios.' }
  }

  const supabase = await createClient()

  // Construir dinámicamente la URL del sitio desde los encabezados de la solicitud
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        nombre,
        role: 'cliente',
        telefono,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function resendConfirmation(email: string) {
  if (!email) {
    return { error: 'El correo electrónico es obligatorio.' }
  }

  const supabase = await createClient()

  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

