"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Resend } from "resend";


// Helper para verificar si el usuario es gestor o admin
async function checkIsGestorOrAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminSupabase = await createAdminClient();
  const { data: profile } = await adminSupabase.from("profiles").select("role").eq("id", user.id).single();
  return profile && (profile.role === "gestor" || profile.role === "admin");
}

// 1. OBTENER INFORMACIÓN DE CLIENTES (Gestores / Admins)
export async function getClientes() {
  const supabase = await createClient();
  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const adminSupabase = await createAdminClient();

  const { data, error } = await adminSupabase
    .from("profiles")
    .select("id, nombre, role, telefono, email, created_at, nota_cliente")
    .eq("role", "cliente")
    .order("nombre", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

// 2. CASOS: OBTENER CASOS DEL CLIENTE AUTENTICADO (Cliente)
export async function getMisCasos() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const { data, error } = await supabase
    .from("casos")
    .select("*, documentos_casos(*)")
    .eq("cliente_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

// 3. CASOS: OBTENER TODOS LOS CASOS (Gestor / Admin)
export async function getTodosCasos() {
  const supabase = await createClient();
  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const adminSupabase = await createAdminClient();

  const { data, error } = await adminSupabase
    .from("casos")
    .select("*, cliente:profiles!casos_cliente_id_fkey(nombre, telefono, email), gestor:profiles!casos_gestor_id_fkey(nombre, email), documentos_casos(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

// 4. CASOS: OBTENER UN CASO POR ID
export async function getCasoPorId(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const adminSupabase = await createAdminClient();

  const { data, error } = await adminSupabase
    .from("casos")
    .select("*, cliente:profiles!casos_cliente_id_fkey(nombre, telefono, email, id), documentos_casos(*)")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  const isOwner = data.cliente_id === user.id;
  const isAuthorized = await checkIsGestorOrAdmin(supabase);

  if (!isOwner && !isAuthorized) {
    return { error: "No autorizado." };
  }

  return { data };
}

// 5. CASOS: CREAR CASO (Gestor / Admin)
export async function crearCaso(data: { clienteId: string; titulo: string; descripcion: string }) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const { clienteId, titulo, descripcion } = data;

  if (!clienteId || !titulo) {
    return { error: "El cliente y el título son obligatorios." };
  }

  const { data: nuevoCaso, error } = await supabase
    .from("casos")
    .insert({
      cliente_id: clienteId,
      titulo,
      descripcion,
      estado: "en revision",
      gestor_id: user.id, // Auto-asignamos al gestor que lo crea
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/gestor");
  revalidatePath("/admin");
  return { success: true, data: nuevoCaso };
}

// 6. CASOS: ACTUALIZAR ESTADO DEL CASO (Gestor / Admin)
export async function actualizarEstadoCaso(casoId: string, estado: "en revision" | "en proceso" | "se requiere más informacion" | "completado") {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("casos")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", casoId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/gestor`);
  revalidatePath(`/dashboard`);
  return { success: true, data };
}

// 7. DOCUMENTOS: REGISTRAR DOCUMENTO SUBIDO (Cliente)
export async function registrarDocumento(data: { casoId: string; nombreArchivo: string; urlArchivo: string }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const { casoId, nombreArchivo, urlArchivo } = data;

  if (!casoId || !nombreArchivo || !urlArchivo) {
    return { error: "Información del archivo incompleta." };
  }

  const { data: nuevoDoc, error } = await supabase
    .from("documentos_casos")
    .insert({
      caso_id: casoId,
      cliente_id: user.id,
      nombre_archivo: nombreArchivo,
      url_archivo: urlArchivo,
      estado: "pendiente",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Al subir un documento, actualizamos el estado del caso a "en revision" por defecto
  await supabase
    .from("casos")
    .update({ estado: "en revision", updated_at: new Date().toISOString() })
    .eq("id", casoId);

  revalidatePath(`/dashboard`);
  revalidatePath(`/gestor`);
  return { success: true, data: nuevoDoc };
}

// 8. DOCUMENTOS: VALIDAR O RECHAZAR DOCUMENTO (Gestor / Admin)
export async function validarDocumento(data: { docId: string; casoId: string; estado: "validado" | "rechazado"; comentarios?: string }) {
  const supabase = await createClient();

  const { docId, casoId, estado, comentarios } = data;

  const { data: docActualizado, error } = await supabase
    .from("documentos_casos")
    .update({
      estado,
      comentarios: comentarios || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", docId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/gestor`);
  revalidatePath(`/dashboard`);
  return { success: true, data: docActualizado };
}

// 9. CASOS: CREAR CASO DESDE EL CLIENTE (Test de Viabilidad)
export async function crearCasoCliente() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  // Verificar si ya tiene un caso de "Test de Viabilidad"
  const { data: casosExistentes, error: errorBusqueda } = await supabase
    .from("casos")
    .select("id")
    .eq("cliente_id", user.id)
    .eq("titulo", "Test de Viabilidad");

  if (errorBusqueda) {
    return { error: errorBusqueda.message };
  }

  // Si ya tiene un test de viabilidad iniciado, no creamos otro
  if (casosExistentes && casosExistentes.length > 0) {
    return { error: "Ya has iniciado un Test de Viabilidad." };
  }

  const adminSupabase = await createAdminClient();

  const { data: nuevoCaso, error } = await adminSupabase
    .from("casos")
    .insert({
      cliente_id: user.id,
      titulo: "Test de Viabilidad",
      descripcion: "Análisis técnico y legal de infraestructura eléctrica e historial de facturación para evaluar viabilidad de recupero.",
      estado: "en revision",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/gestor");
  
  return { success: true, data: nuevoCaso };
}

// 10. CASOS: ASIGNAR GESTOR A UN CASO (Gestor)
export async function asignarGestorCaso(casoId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const { data, error } = await supabase
    .from("casos")
    .update({ gestor_id: user.id, updated_at: new Date().toISOString() })
    .eq("id", casoId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/gestor");
  return { success: true, data };
}

// 11. CASOS: ARCHIVAR UN CASO (Gestor / Admin)
export async function archivarCaso(casoId: string) {
  const supabase = await createClient();

  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const { data, error } = await supabase
    .from("casos")
    .update({ estado: "archivado", updated_at: new Date().toISOString() })
    .eq("id", casoId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/gestor");
  return { success: true, data };
}

// 12. DOCUMENTOS: REGISTRAR DOCUMENTO SUBIDO POR GESTOR (Gestor / Admin)
export async function registrarDocumentoGestor(data: { 
  casoId: string; 
  clienteId: string; 
  nombreArchivo: string; 
  urlArchivo: string; 
}) {
  const supabase = await createClient();

  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const { casoId, clienteId, nombreArchivo, urlArchivo } = data;

  if (!casoId || !clienteId || !nombreArchivo || !urlArchivo) {
    return { error: "Información del archivo incompleta." };
  }

  const adminSupabase = await createAdminClient();

  // Insertar documento para el cliente
  const { data: nuevoDoc, error } = await adminSupabase
    .from("documentos_casos")
    .insert({
      caso_id: casoId,
      cliente_id: clienteId,
      nombre_archivo: nombreArchivo,
      url_archivo: urlArchivo,
      estado: "validado", // Como lo sube el gestor, se marca como validado automáticamente
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Al subir un documento el gestor, actualizamos la fecha de modificación del caso
  await adminSupabase
    .from("casos")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", casoId);

  revalidatePath(`/dashboard`);
  revalidatePath(`/gestor`);
  return { success: true, data: nuevoDoc };
}

// 13. CLIENTES: GUARDAR NOTA DE SU CASO
export async function guardarNotaCliente(nota: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const adminSupabase = await createAdminClient();
  const { error } = await adminSupabase
    .from("profiles")
    .update({ nota_cliente: nota })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/gestor");
  return { success: true };
}

// 14. GESTOR: CREAR CLIENTE Y EXPEDIENTE
export async function crearClienteYExpediente(data: {
  nombre: string;
  email: string;
  telefono: string;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const { nombre, email, telefono } = data;
  if (!nombre || !email || !telefono) {
    return { error: "Todos los campos son obligatorios." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  const adminSupabase = await createAdminClient();

  // Generamos el link de registro usando admin client para evitar que Supabase envíe el correo automático
  const { data: linkData, error: signupError } = await adminSupabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback?type=invite&email=${encodeURIComponent(email)}`,
      data: {
        nombre,
        role: "cliente",
        telefono,
      },
    },
  });

  if (signupError) {
    return { error: signupError.message };
  }

  if (!linkData.user) {
    return { error: "No se pudo crear el usuario en el sistema de autenticación." };
  }

  // Upsertar perfil en la tabla profiles
  try {
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .upsert({
        id: linkData.user.id,
        nombre,
        role: "cliente",
        telefono,
        email,
      }, { onConflict: "id" });

    if (profileError) {
      console.error("Error al upsertar perfil de cliente en gestor:", profileError);
      return { error: "Se creó el usuario pero falló la creación del perfil: " + profileError.message };
    }
  } catch (err: any) {
    console.error("Excepción al insertar perfil de cliente en gestor:", err);
    return { error: "Excepción al crear perfil: " + err.message };
  }

  // Crear expediente del caso "Test de Viabilidad" asignado al gestor creador
  const { data: nuevoCaso, error: casoError } = await adminSupabase
    .from("casos")
    .insert({
      cliente_id: linkData.user.id,
      titulo: "Test de Viabilidad",
      descripcion: "Análisis técnico y legal de infraestructura eléctrica e historial de facturación para evaluar viabilidad de recupero.",
      estado: "en revision",
      gestor_id: user.id, // Auto-asignado al gestor que lo crea
    })
    .select()
    .single();

  if (casoError) {
    console.error("Error al crear caso de viabilidad:", casoError);
    return { error: "Se creó el cliente pero falló la creación del expediente: " + casoError.message };
  }

  // Enviar correo de invitación usando Resend con el link de verificación generado
  if (linkData.properties?.action_link) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const FROM_EMAIL = "Notificaciones BPB <sistema@bpbabogados.com.ar>";

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Confirma tu Cuenta y Expediente - BPB Abogados",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" alt="BPB Abogados" style="height: 50px; width: auto;" />
            </div>
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: normal; text-align: center;">Tu Expediente de Test de Viabilidad</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Se ha iniciado un expediente de <strong>Test de Viabilidad</strong> para ti en el portal de <strong>BPB Abogados</strong> por parte de un gestor.</p>
            <p>Para verificar tu cuenta, configurar tu contraseña de acceso y comenzar a subir tu documentación, por favor haz clic en el siguiente botón:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkData.properties.action_link}" style="background-color: #D4AF37; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Verificar Cuenta
              </a>
            </div>
            <p style="font-size: 12px; color: #666; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
              Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br />
              <a href="${linkData.properties.action_link}" style="color: #D4AF37; word-break: break-all;">${linkData.properties.action_link}</a>
            </p>
            <p>Si no estabas al tanto de este trámite, por favor ponte en contacto con nosotros.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 11px; color: #999; text-align: center;">
              Este es un correo automático enviado por el sistema de BPB Abogados.
            </p>
          </div>
        `,
      });
    } catch (emailErr: any) {
      console.error("Error al enviar correo de verificación con Resend:", emailErr);
      return {
        success: true,
        warning: "Se creó el cliente y el expediente, pero falló el envío del correo de confirmación: " + emailErr.message,
        data: nuevoCaso,
      };
    }
  }

  revalidatePath("/gestor");
  revalidatePath("/admin");
  return { success: true, data: nuevoCaso };
}

// 15. GESTOR / ADMIN: ELIMINAR CLIENTE EN SU TOTALIDAD CON SU STORAGE
export async function eliminarClienteCompleto(clienteId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autenticado." };
  }

  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const adminSupabase = await createAdminClient();

  // 1. Limpiar físicamente los archivos del bucket 'documentos_casos' correspondientes a este cliente
  try {
    // Listamos primero las subcarpetas del cliente (los caso_id)
    const { data: subfolders, error: listError } = await adminSupabase.storage
      .from("documentos_casos")
      .list(clienteId);

    if (listError) {
      console.error("Error al listar subcarpetas de almacenamiento del cliente:", listError);
    } else if (subfolders && subfolders.length > 0) {
      for (const folder of subfolders) {
        const folderPath = `${clienteId}/${folder.name}`;
        
        // Listamos archivos dentro de cada caso_id
        const { data: filesInFolder, error: filesError } = await adminSupabase.storage
          .from("documentos_casos")
          .list(folderPath);

        if (filesError) {
          console.error(`Error al listar archivos en subcarpeta ${folderPath}:`, filesError);
          continue;
        }

        if (filesInFolder && filesInFolder.length > 0) {
          const filesToDelete = filesInFolder.map(f => `${folderPath}/${f.name}`);
          const { error: removeError } = await adminSupabase.storage
            .from("documentos_casos")
            .remove(filesToDelete);

          if (removeError) {
            console.error(`Error al eliminar archivos de ${folderPath}:`, removeError);
          } else {
            console.log(`Archivos de carpeta ${folderPath} eliminados con éxito.`);
          }
        }
      }
    }

    // Listamos e intentamos eliminar archivos en la raíz del cliente también
    const { data: rootFiles, error: rootFilesError } = await adminSupabase.storage
      .from("documentos_casos")
      .list(clienteId);

    if (!rootFilesError && rootFiles && rootFiles.length > 0) {
      const filesToDelete = rootFiles
        .filter(f => f.id !== null)
        .map(f => `${clienteId}/${f.name}`);
      
      if (filesToDelete.length > 0) {
        await adminSupabase.storage.from("documentos_casos").remove(filesToDelete);
      }
    }
  } catch (storageErr) {
    console.error("Excepción al limpiar archivos del cliente en storage:", storageErr);
  }

  // 2. Eliminar el perfil explícitamente para desencadenar el cascade de BD (casos, documentos_casos)
  const { error: profileError } = await adminSupabase
    .from("profiles")
    .delete()
    .eq("id", clienteId);

  if (profileError) {
    console.error("Error al eliminar perfil de la base de datos:", profileError);
    // Continuamos intentando eliminar al usuario de auth de todos modos
  }

  // 3. Eliminar el usuario de Supabase Auth
  const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(clienteId);
  if (deleteAuthError) {
    console.error("Error al eliminar usuario de auth.users:", deleteAuthError);
    return { error: "Error al eliminar usuario del sistema: " + deleteAuthError.message };
  }

  revalidatePath("/gestor");
  revalidatePath("/admin");
  return { success: true };
}

