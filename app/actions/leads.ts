"use server";

import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase";

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

    // Insert into Supabase
    const { error } = await supabase.from("leads").insert({
      nombre: parsed.nombre,
      email: parsed.email,
      telefono: parsed.telefono,
      mensaje: `[Empresa: ${parsed.empresa || "N/A"}] - ${parsed.mensaje}`,
      tipo_consulta: "contacto_general",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "Ocurrió un error al guardar los datos." };
    }

    return { success: true };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors.map(e => e.message).join(", ") };
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

    // Handle files (multiple files can be appended to FormData with the same key "archivos")
    const files = formData.getAll("archivos") as File[];
    
    if (files.length > 0) {
      for (const file of files) {
        if (file.size === 0) continue;
        
        // Ensure size <= 20MB
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

    const { error } = await supabase.from("leads").insert({
      nombre: parsed.nombre,
      email: parsed.email,
      telefono: parsed.telefono,
      mensaje: `Cargo/Empresa: ${parsed.cargo}`,
      tipo_consulta: "test_viabilidad",
      archivo_url: fileUrls.length > 0 ? JSON.stringify(fileUrls) : null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "Ocurrió un error al guardar los datos." };
    }

    return { success: true };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors.map(e => e.message).join(", ") };
    }
    console.error("Action error:", err);
    return { success: false, error: "Error de servidor. Intente más tarde." };
  }
}
