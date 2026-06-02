"use server";

import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase";
import { Resend } from "resend";

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
