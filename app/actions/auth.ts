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
    // Traducción de errores comunes para el usuario
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Credenciales inválidas. Verifique el correo electrónico y la contraseña.' }
    }
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
