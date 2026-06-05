'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Resend } from "resend"

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

  // Construir dinámicamente la URL del sitio desde los encabezados de la solicitud
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  const adminSupabase = await createAdminClient()

  // Generamos el link de registro usando admin client para evitar que Supabase envíe el correo automático
  const { data: linkData, error } = await adminSupabase.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
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
  if (linkData.user) {
    try {
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .upsert({
          id: linkData.user.id,
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

  // Enviar el correo usando Resend con el link generado
  if (linkData.properties?.action_link) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const FROM_EMAIL = "Notificaciones BPB <sistema@bpbabogados.com.ar>"

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Confirma tu Cuenta - BPB Abogados",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" alt="BPB Abogados" style="height: 50px; width: auto;" />
            </div>
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: normal; text-align: center;">Verificación de Cuenta</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Gracias por registrarte en el portal de <strong>BPB Abogados</strong> para iniciar tu Test de Viabilidad.</p>
            <p>Para verificar tu cuenta y comenzar a subir tu documentación, por favor haz clic en el siguiente botón:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkData.properties.action_link}" style="background-color: #D4AF37; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Verificar Cuenta
              </a>
            </div>
            <p style="font-size: 12px; color: #666; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
              Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br />
              <a href="${linkData.properties.action_link}" style="color: #D4AF37; word-break: break-all;">${linkData.properties.action_link}</a>
            </p>
            <p>Si no has solicitado el registro de esta cuenta, por favor ignora este correo.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 11px; color: #999; text-align: center;">
              Este es un correo automático enviado por el sistema de BPB Abogados.
            </p>
          </div>
        `
      })
    } catch (emailErr: any) {
      console.error("Error al enviar correo de verificación con Resend:", emailErr)
      return { error: "Cuenta registrada pero falló el envío del correo: " + emailErr.message }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function sendPasswordRecovery(email: string) {
  if (!email) {
    return { error: 'El correo electrónico es obligatorio.' }
  }

  const supabase = await createClient()

  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  // Usar admin client para generar el link directamente
  const adminSupabase = await createAdminClient()
  const { data: linkData, error } = await adminSupabase.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback?type=recovery`,
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (linkData.properties?.action_link) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const FROM_EMAIL = "Notificaciones BPB <sistema@bpbabogados.com.ar>"

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Recuperación de Contraseña - BPB Abogados",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" alt="BPB Abogados" style="height: 50px; width: auto;" />
            </div>
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: normal; text-align: center;">Recuperación de Contraseña</h2>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña en el portal de <strong>BPB Abogados</strong>.</p>
            <p>Para crear una nueva contraseña, por favor haz clic en el siguiente botón:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkData.properties.action_link}" style="background-color: #D4AF37; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            <p style="font-size: 12px; color: #666; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
              Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br />
              <a href="${linkData.properties.action_link}" style="color: #D4AF37; word-break: break-all;">${linkData.properties.action_link}</a>
            </p>
            <p>Si no has solicitado este cambio, por favor ignora este correo.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 11px; color: #999; text-align: center;">
              Este es un correo automático enviado por el sistema de BPB Abogados.
            </p>
          </div>
        `
      })
    } catch (emailErr: any) {
      console.error("Error al enviar correo de recuperación:", emailErr)
      return { error: "Fallo al enviar correo: " + emailErr.message }
    }
  }

  return { success: true }
}

export async function resendConfirmation(email: string) {
  if (!email) {
    return { error: 'El correo electrónico es obligatorio.' }
  }

  const adminSupabase = await createAdminClient()

  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  // Obtener el perfil para personalizar el correo
  let nombre = 'Cliente'
  try {
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('nombre')
      .eq('email', email)
      .maybeSingle()
    if (profile?.nombre) {
      nombre = profile.nombre
    }
  } catch (err) {
    console.error("Error al obtener nombre de cliente para reenvío:", err)
  }

  // Generamos el link de confirmación usando generateLink con type: 'magiclink'
  const { data: linkData, error } = await adminSupabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Enviar el correo usando Resend
  if (linkData.properties?.action_link) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const FROM_EMAIL = "Notificaciones BPB <sistema@bpbabogados.com.ar>"

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Confirma tu Cuenta - BPB Abogados",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" alt="BPB Abogados" style="height: 50px; width: auto;" />
            </div>
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: normal; text-align: center;">Reenvío de Verificación de Cuenta</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Hemos recibido una solicitud para reenviar el enlace de verificación de tu cuenta de <strong>BPB Abogados</strong>.</p>
            <p>Para verificar tu cuenta y comenzar a subir tu documentación, por favor haz clic en el siguiente botón:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkData.properties.action_link}" style="background-color: #D4AF37; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Verificar Cuenta
              </a>
            </div>
            <p style="font-size: 12px; color: #666; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
              Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br />
              <a href="${linkData.properties.action_link}" style="color: #D4AF37; word-break: break-all;">${linkData.properties.action_link}</a>
            </p>
            <p>Si no has solicitado este reenvío, por favor ignora este correo.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 11px; color: #999; text-align: center;">
              Este es un correo automático enviado por el sistema de BPB Abogados.
            </p>
          </div>
        `
      })
    } catch (emailErr: any) {
      console.error("Error al reenviar correo de verificación con Resend:", emailErr)
      return { error: "Fallo al enviar correo: " + emailErr.message }
    }
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
  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return profile && profile.role === 'admin'
}

async function enviarEmailInvitacion(email: string, nombre: string, actionLink: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const FROM_EMAIL = "Notificaciones BPB <sistema@bpbabogados.com.ar>"

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Invitación para acceder como Gestor - BPB Abogados",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" alt="BPB Abogados" style="height: 50px; width: auto;" />
        </div>
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: normal; text-align: center;">Invitación al Portal de Gestión</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Has sido invitado a formar parte del equipo de <strong>BPB Abogados</strong> como Gestor.</p>
        <p>Para activar tu cuenta y configurar tu contraseña de acceso, por favor haz clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionLink}" style="background-color: #D4AF37; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Configurar mi Cuenta
          </a>
        </div>
        <p style="font-size: 12px; color: #666; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
          Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br />
          <a href="${actionLink}" style="color: #D4AF37; word-break: break-all;">${actionLink}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 11px; color: #999; text-align: center;">
          Este es un correo automático enviado por el sistema de BPB Abogados.
        </p>
      </div>
    `
  })
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

  const { data: linkData, error } = await adminSupabase.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback?type=invite&email=${encodeURIComponent(email)}`,
      data: {
        nombre,
        role: 'gestor',
        telefono,
      }
    }
  })

  if (error) {
    const errMsg = error.message.toLowerCase()
    if (errMsg.includes("register") || errMsg.includes("exist") || errMsg.includes("taken")) {
      return { error: 'Este correo electrónico ya está registrado. Si necesitas enviarle un nuevo acceso, usa el botón "Reenviar Invitación" en la lista de gestores.' }
    }
    return { error: error.message }
  }

  if (linkData.properties?.action_link) {
    try {
      await enviarEmailInvitacion(email, nombre, linkData.properties.action_link)
    } catch (emailErr: any) {
      console.error("Error al enviar correo por Resend:", emailErr)
      return { error: "Se creó el usuario pero falló el envío del correo por Resend: " + emailErr.message }
    }
  }

  if (linkData.user) {
    try {
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .upsert({
          id: linkData.user.id,
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

export async function reenviarInvitacion(data: { email: string; nombre: string; telefono: string }) {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    return { error: 'No autorizado.' }
  }

  const { email, nombre, telefono } = data
  const adminSupabase = await createAdminClient()

  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const siteUrl = `${protocol}://${host}`

  const { data: linkData, error } = await adminSupabase.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback?type=invite&email=${encodeURIComponent(email)}`,
      data: {
        nombre,
        role: 'gestor',
        telefono,
      }
    }
  })

  let actionLink = linkData?.properties?.action_link

  if (error) {
    const errMsg = error.message.toLowerCase()
    if (errMsg.includes("register") || errMsg.includes("exist") || errMsg.includes("taken")) {
      const { data: recoveryData, error: recoveryError } = await adminSupabase.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
          redirectTo: `${siteUrl}/auth/callback?type=recovery&email=${encodeURIComponent(email)}`
        }
      })

      if (recoveryError) {
        return { error: recoveryError.message }
      }

      actionLink = recoveryData.properties?.action_link
    } else {
      return { error: error.message }
    }
  }

  if (actionLink) {
    try {
      await enviarEmailInvitacion(email, nombre, actionLink)
    } catch (emailErr: any) {
      console.error("Error al enviar correo por Resend en reenvío:", emailErr)
      return { error: "Fallo al enviar correo por Resend: " + emailErr.message }
    }
  }

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

export async function eliminarGestorCompleto(gestorId: string) {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    return { error: 'No autorizado.' }
  }

  const adminSupabase = await createAdminClient()

  // 1. Desasignar casos asignados a este gestor
  try {
    const { error: casosError } = await adminSupabase
      .from("casos")
      .update({ gestor_id: null })
      .eq("gestor_id", gestorId)
    if (casosError) {
      console.error("Error al desasignar casos del gestor:", casosError)
    }
  } catch (err) {
    console.error("Excepción al desasignar casos:", err)
  }

  // 2. Desasignar leads asignados a este gestor
  try {
    const { error: leadsError } = await adminSupabase
      .from("leads")
      .update({ gestor_asignado_id: null })
      .eq("gestor_asignado_id", gestorId)
    if (leadsError) {
      console.error("Error al desasignar leads del gestor:", leadsError)
    }
  } catch (err) {
    console.error("Excepción al desasignar leads:", err)
  }

  // 3. Eliminar el perfil de profiles
  const { error: profileError } = await adminSupabase
    .from("profiles")
    .delete()
    .eq("id", gestorId)

  if (profileError) {
    console.error("Error al eliminar perfil de gestor de la base de datos:", profileError)
  }

  // 4. Eliminar el usuario de Supabase Auth
  const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(gestorId)
  if (deleteAuthError) {
    console.error("Error al eliminar gestor de auth.users:", deleteAuthError)
    return { error: "Error al eliminar gestor del sistema: " + deleteAuthError.message }
  }

  revalidatePath('/gestor')
  return { success: true }
}

