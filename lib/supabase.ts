import { createClient } from '@supabase/supabase-js'

// Para uso general en el cliente o llamadas no privilegiadas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton instace for client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Para operaciones privilegiadas que se ejecutan EXCLUSIVAMENTE en el servidor (Server Actions)
// como insertar un lead saltándose el RLS.
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no está definida')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
