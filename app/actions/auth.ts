'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
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

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

