'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
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

  const { data: signUpData, error } = await supabase.auth.signUp({
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

  // Inserción manual de resiliencia en la tabla profiles
  if (signUpData.user) {
    try {
      const adminSupabase = await createAdminClient()
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .upsert({
          id: signUpData.user.id,
          nombre,
          role: 'cliente',
          telefono,
          email
        }, { onConflict: 'id' })

      if (profileError) {
        console.error("Error al upsertar perfil en el registro:", profileError)
      }
    } catch (err) {
      console.error("Excepción al insertar perfil en registro:", err)
    }
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

async function checkIsAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return profile && profile.role === 'admin'
}
export async function crearGestor(data: { nombre: string; email: string; telefono: string }) {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    return { error: 'No autorizado.' }
  }

  const { nombre, email, telefono } = data
  if (!nombre || !email || !telefono) {
    return { error: 'Todos los campos son obligatorios.' }
  }

  const adminSupabase = await createAdminClient()

  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  const { data: inviteData, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback`,
    data: {
      nombre,
      role: 'gestor',
      telefono,
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (inviteData.user) {
    try {
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .upsert({
          id: inviteData.user.id,
          nombre,
          role: 'gestor',
          telefono,
          email
        }, { onConflict: 'id' })

      if (profileError) {
        console.error("Error al upsertar perfil de gestor:", profileError)
      }
    } catch (err) {
      console.error("Excepción al insertar perfil de gestor:", err)
    }
  }

  revalidatePath('/gestor')
  return { success: true }
}

export async function getGestores() {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    return { error: 'No autorizado.' }
  }

  const adminSupabase = await createAdminClient()
  const { data, error } = await adminSupabase
    .from('profiles')
    .select('id, nombre, role, telefono, email, created_at')
    .eq('role', 'gestor')
    .order('nombre', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

