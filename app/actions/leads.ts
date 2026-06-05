"use server";

import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase";
import { Resend } from "resend";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";


const resend = new Resend(process.env.RESEND_API_KEY);
const DESTINATION_EMAIL = "contacto@bpbabogados.com.ar";

// NOTA: Si el dominio aún no está verificado en Resend, 
// puedes cambiar temporalmente el 'from' a 'onboarding@resend.dev'
const FROM_EMAIL = "Notificaciones BPB <sistema@bpbabogados.com.ar>"; 

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Correo electrónico inválido"),
  empresa: z.string().optional(),
  telefono: z.string().min(5, "El teléfono es requerido"),
  mensaje: z.string().min(10, "El mensaje debe ser más largo"),
});

export async function submitContact(prevState: any, formData: FormData) {
  try {
    const rawData = {
      nombre: formData.get("nombre") as string,
      email: formData.get("email") as string,
      empresa: formData.get("empresa") as string,
      telefono: formData.get("telefono") as string,
      mensaje: formData.get("mensaje") as string,
    };

    const parsed = contactSchema.parse(rawData);
    const supabase = getServiceSupabase();

    // 1. Guardar en Supabase
    const { error: dbError } = await supabase.from("leads").insert({
      nombre: parsed.nombre,
      email: parsed.email,
      telefono: parsed.telefono,
      mensaje: `[Empresa: ${parsed.empresa || "N/A"}] - ${parsed.mensaje}`,
      tipo_consulta: "contacto_general",
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return { success: false, error: "Ocurrió un error al guardar los datos." };
    }

    // 2. Enviar notificación por correo con Resend
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: DESTINATION_EMAIL,
        subject: `Nuevo Prospecto: ${parsed.nombre} - BPB Abogados`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Nuevo Contacto General</h2>
            <p><strong>Nombre:</strong> ${parsed.nombre}</p>
            <p><strong>Correo Electrónico:</strong> <a href="mailto:${parsed.email}">${parsed.email}</a></p>
            <p><strong>Teléfono / WhatsApp:</strong> ${parsed.telefono}</p>
            <p><strong>Empresa:</strong> ${parsed.empresa || "No especificada"}</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; margin-top: 20px;">
              <h3 style="margin-top: 0; color: #666;">Mensaje:</h3>
              <p style="white-space: pre-wrap;">${parsed.mensaje}</p>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
              Notificación automática del sistema web BPB Abogados.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Error al enviar email con Resend:", emailError);
      // No retornamos error al usuario porque el lead sí se guardó en la base de datos.
    }

    return { success: true };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map(e => e.message).join(", ") };
    }
    console.error("Action error:", err);
    return { success: false, error: "Error de servidor. Intente más tarde." };
  }
}

const viabilidadSchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  cargo: z.string().min(2, "El cargo o empresa es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(5, "El teléfono es requerido"),
});

export async function submitViabilidad(prevState: any, formData: FormData) {
  try {
    const rawData = {
      nombre: formData.get("nombre") as string,
      cargo: formData.get("cargo") as string,
      email: formData.get("email") as string,
      telefono: formData.get("telefono") as string,
    };

    const parsed = viabilidadSchema.parse(rawData);
    const supabase = getServiceSupabase();
    let fileUrls: string[] = [];

    // Manejo de archivos
    const files = formData.getAll("archivos") as File[];
    
    if (files.length > 0) {
      for (const file of files) {
        if (file.size === 0) continue;
        
        if (file.size > 20 * 1024 * 1024) {
          return { success: false, error: "Un archivo excede el límite de 20MB." };
        }

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data, error } = await supabase.storage
          .from("documentos_viabilidad")
          .upload(fileName, file);

        if (error) {
          console.error("Upload error:", error);
          return { success: false, error: "Error al subir el documento." };
        }
        
        if (data) {
          fileUrls.push(data.path);
        }
      }
    }

    // 1. Guardar en Supabase
    const { error: dbError } = await supabase.from("leads").insert({
      nombre: parsed.nombre,
      email: parsed.email,
      telefono: parsed.telefono,
      mensaje: `Cargo/Empresa: ${parsed.cargo}`,
      tipo_consulta: "test_viabilidad",
      archivo_url: fileUrls.length > 0 ? JSON.stringify(fileUrls) : null,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return { success: false, error: "Ocurrió un error al guardar los datos." };
    }

    // 2. Enviar notificación por correo con Resend
    try {
      // Generar enlaces para descargar archivos desde el dashboard
      const fileLinksHtml = fileUrls.map(url => 
        `<li><code style="background:#eee; padding:2px 4px; border-radius:3px;">${url}</code></li>`
      ).join('');

      await resend.emails.send({
        from: FROM_EMAIL,
        to: DESTINATION_EMAIL,
        subject: `Test de Viabilidad: ${parsed.nombre} - BPB Abogados`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Nuevo Test de Viabilidad</h2>
            <p><strong>Nombre:</strong> ${parsed.nombre}</p>
            <p><strong>Correo Electrónico:</strong> <a href="mailto:${parsed.email}">${parsed.email}</a></p>
            <p><strong>Teléfono / WhatsApp:</strong> ${parsed.telefono}</p>
            <p><strong>Cargo / Empresa:</strong> ${parsed.cargo}</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; margin-top: 20px;">
              <h3 style="margin-top: 0; color: #666;">Documentación Adjunta:</h3>
              ${fileUrls.length > 0 
                ? `<p>El cliente adjuntó <strong>${fileUrls.length}</strong> archivo(s). Búscalos en el panel de Supabase (Storage > documentos_viabilidad) con los siguientes nombres:</p><ul>${fileLinksHtml}</ul>` 
                : `<p>El cliente NO adjuntó archivos en este formulario.</p>`
              }
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
              Notificación automática del sistema web BPB Abogados.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Error al enviar email con Resend:", emailError);
    }

    return { success: true };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map(e => e.message).join(", ") };
    }
    console.error("Action error:", err);
    return { success: false, error: "Error de servidor. Intente más tarde." };
  }
}

// NUEVAS ACCIONES PARA GESTIÓN DE VIABILIDAD Y LEADS

async function checkIsGestorOrAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const adminSupabase = await createAdminClient();
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
    
  return profile && (profile.role === "gestor" || profile.role === "admin");
}

export async function getTestsViabilidad() {
  const supabase = await createClient();
  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const adminSupabase = await createAdminClient();
  const { data, error } = await adminSupabase
    .from("leads")
    .select("*, gestor:profiles!leads_gestor_asignado_id_fkey(nombre)")
    .eq("tipo_consulta", "test_viabilidad")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    return { error: error.message };
  }

  return { data };
}

export async function asignarGestorLead(leadId: string) {
  const supabase = await createClient();
  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const adminSupabase = await createAdminClient();
  const { data, error } = await adminSupabase
    .from("leads")
    .update({
      gestor_asignado_id: user.id,
      estado: "en_seguimiento"
    })
    .eq("id", leadId)
    .select()
    .single();

  if (error) {
    console.error("Error assigning gestor to lead:", error);
    return { error: error.message };
  }

  revalidatePath("/gestor");
  return { success: true, data };
}

export async function archivarLead(leadId: string, motivo: string) {
  const supabase = await createClient();
  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  if (!motivo || !motivo.trim()) {
    return { error: "El motivo de descarte es obligatorio para archivar un lead." };
  }

  const adminSupabase = await createAdminClient();
  const { data, error } = await adminSupabase
    .from("leads")
    .update({
      estado: "archivado",
      motivo_descarte: motivo
    })
    .eq("id", leadId)
    .select()
    .single();

  if (error) {
    console.error("Error archiving lead:", error);
    return { error: error.message };
  }

  revalidatePath("/gestor");
  return { success: true, data };
}

export async function uploadDocumentoLead(leadId: string, formData: FormData) {
  const supabase = await createClient();
  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const files = formData.getAll("archivos") as File[];
  if (files.length === 0) {
    return { error: "No se seleccionaron archivos." };
  }

  const adminSupabase = await createAdminClient();

  const { data: lead, error: fetchError } = await adminSupabase
    .from("leads")
    .select("archivo_url")
    .eq("id", leadId)
    .single();

  if (fetchError || !lead) {
    return { error: "No se encontró el caso de viabilidad." };
  }

  let fileUrls: string[] = [];
  if (lead.archivo_url) {
    try {
      fileUrls = JSON.parse(lead.archivo_url);
      if (!Array.isArray(fileUrls)) {
        fileUrls = [];
      }
    } catch {
      fileUrls = [];
    }
  }

  for (const file of files) {
    if (file.size === 0) continue;

    if (file.size > 20 * 1024 * 1024) {
      return { error: "Un archivo excede el límite de 20MB." };
    }

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from("documentos_viabilidad")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Error al subir el documento ${file.name}.` };
    }

    if (uploadData) {
      fileUrls.push(uploadData.path);
    }
  }

  const { error: dbUpdateError } = await adminSupabase
    .from("leads")
    .update({
      archivo_url: JSON.stringify(fileUrls),
      estado: "en_seguimiento"
    })
    .eq("id", leadId);

  if (dbUpdateError) {
    return { error: dbUpdateError.message };
  }

  revalidatePath("/gestor");
  return { success: true };
}

async function enviarEmailInvitacionCliente(email: string, nombre: string, actionLink: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const FROM_EMAIL = "Notificaciones BPB <sistema@bpbabogados.com.ar>"

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Bienvenido a BPB Abogados - Crea tu cuenta de cliente",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" alt="BPB Abogados" style="height: 50px; width: auto;" />
        </div>
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-weight: normal; text-align: center;">Acceso al Portal del Cliente</h2>
        <p>Hola <strong>\${nombre}</strong>,</p>
        <p>Tu caso ha sido formalmente registrado en <strong>BPB Abogados</strong>.</p>
        <p>Hemos creado una cuenta de acceso para ti en nuestro portal, donde podrás realizar el seguimiento de tu caso, subir documentación y comunicarte con tu gestor.</p>
        <p>Para activar tu cuenta y configurar tu contraseña de acceso, por favor haz clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="\${actionLink}" style="background-color: #D4AF37; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Configurar mi Contraseña
          </a>
        </div>
        <p style="font-size: 12px; color: #666; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
          Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:<br />
          <a href="\${actionLink}" style="color: #D4AF37; word-break: break-all;">\${actionLink}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 11px; color: #999; text-align: center;">
          Este es un correo automático enviado por el sistema de BPB Abogados.
        </p>
      </div>
    `
  })
}

export async function convertirLeadEnCaso(data: {
  leadId: string;
  tipoConversion: "new_client_new_case" | "existing_client_new_case" | "existing_client_existing_case";
  clienteId?: string;
  casoId?: string;
  tituloCaso?: string;
  descripcionCaso?: string;
}) {
  const supabase = await createClient();
  const isAuthorized = await checkIsGestorOrAdmin(supabase);
  if (!isAuthorized) {
    return { error: "No autorizado." };
  }

  const { leadId, tipoConversion, clienteId, casoId, tituloCaso, descripcionCaso } = data;
  const adminSupabase = await createAdminClient();

  const { data: lead, error: leadError } = await adminSupabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    return { error: "No se encontró el Lead en el sistema." };
  }

  let finalClienteId = clienteId;
  let finalCasoId = casoId;

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  if (tipoConversion === "new_client_new_case") {
    const { data: linkData, error: inviteError } = await adminSupabase.auth.admin.generateLink({
      type: "invite",
      email: lead.email,
      options: {
        redirectTo: `${siteUrl}/auth/callback?type=invite&email=${encodeURIComponent(lead.email)}`,
        data: {
          nombre: lead.nombre,
          role: "cliente",
          telefono: lead.telefono,
        }
      }
    });

    if (inviteError) {
      const errMsg = inviteError.message.toLowerCase();
      if (errMsg.includes("registered") || errMsg.includes("exist") || errMsg.includes("taken")) {
        return { error: "El correo electrónico ya está registrado en el sistema. Asócialo como Cliente Existente o actualiza su expediente." };
      }
      return { error: `Error de invitación: ${inviteError.message}` };
    }

    finalClienteId = linkData.user.id;

    const { error: profileError } = await adminSupabase
      .from("profiles")
      .upsert({
        id: finalClienteId,
        nombre: lead.nombre,
        role: "cliente",
        telefono: lead.telefono,
        email: lead.email
      }, { onConflict: "id" });

    if (profileError) {
      console.error("Error creating client profile:", profileError);
      return { error: `Error al crear el perfil de cliente: ${profileError.message}` };
    }

    if (linkData.properties?.action_link) {
      try {
        await enviarEmailInvitacionCliente(lead.email, lead.nombre, linkData.properties.action_link);
      } catch (emailErr) {
        console.error("Error sending Resend invitation:", emailErr);
      }
    }

    const { data: nuevoCaso, error: casoError } = await adminSupabase
      .from("casos")
      .insert({
        cliente_id: finalClienteId,
        titulo: tituloCaso || "Test de Viabilidad",
        descripcion: descripcionCaso || `Expediente creado a partir del Test de Viabilidad de ${lead.nombre}`,
        estado: "en revision"
      })
      .select()
      .single();

    if (casoError || !nuevoCaso) {
      return { error: `Error al crear el caso: ${casoError?.message}` };
    }

    finalCasoId = nuevoCaso.id;
  } 
  else if (tipoConversion === "existing_client_new_case") {
    if (!finalClienteId) {
      return { error: "Debes seleccionar un cliente existente." };
    }

    const { data: nuevoCaso, error: casoError } = await adminSupabase
      .from("casos")
      .insert({
        cliente_id: finalClienteId,
        titulo: tituloCaso || "Test de Viabilidad",
        descripcion: descripcionCaso || `Expediente creado a partir del Test de Viabilidad de ${lead.nombre}`,
        estado: "en revision"
      })
      .select()
      .single();

    if (casoError || !nuevoCaso) {
      return { error: `Error al crear el caso: ${casoError?.message}` };
    }

    finalCasoId = nuevoCaso.id;
  }
  else if (tipoConversion === "existing_client_existing_case") {
    if (!finalClienteId || !finalCasoId) {
      return { error: "Debes seleccionar un cliente y un expediente existente." };
    }
  }

  if (lead.archivo_url) {
    let fileUrls: string[] = [];
    try {
      fileUrls = JSON.parse(lead.archivo_url);
    } catch {
      fileUrls = [];
    }

    if (Array.isArray(fileUrls) && fileUrls.length > 0) {
      for (const filePath of fileUrls) {
        const fileName = filePath.split("/").pop() || "archivo_viabilidad";
        const newPath = `${finalClienteId}/${finalCasoId}/${Date.now()}_${fileName}`;

        const { data: fileData, error: downloadError } = await adminSupabase.storage
          .from("documentos_viabilidad")
          .download(filePath);

        if (downloadError || !fileData) {
          console.error(`Error downloading file ${filePath}:`, downloadError);
          continue;
        }

        const { error: uploadError } = await adminSupabase.storage
          .from("documentos_casos")
          .upload(newPath, fileData, {
            contentType: fileData.type,
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading file ${fileName} to casos:`, uploadError);
          continue;
        }

        const { error: docInsertError } = await adminSupabase
          .from("documentos_casos")
          .insert({
            caso_id: finalCasoId,
            cliente_id: finalClienteId,
            nombre_archivo: fileName,
            url_archivo: newPath,
            estado: "pendiente"
          });

        if (docInsertError) {
          console.error(`Error inserting doc registry for ${fileName}:`, docInsertError);
        }
      }

      await adminSupabase
        .from("casos")
        .update({ estado: "en revision", updated_at: new Date().toISOString() })
        .eq("id", finalCasoId);
    }
  }

  const { error: leadUpdateError } = await adminSupabase
    .from("leads")
    .update({
      estado: "convertido",
      leido: true
    })
    .eq("id", leadId);

  if (leadUpdateError) {
    console.error("Error updating lead status to convertido:", leadUpdateError);
  }

  revalidatePath("/gestor");
  revalidatePath("/admin");
  return { success: true, clienteId: finalClienteId, casoId: finalCasoId };
}

