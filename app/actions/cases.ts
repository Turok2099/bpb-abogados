"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. OBTENER INFORMACIÓN DE CLIENTES (Gestores / Admins)
export async function getClientes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, role, telefono, email, created_at")
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

  const { data, error } = await supabase
    .from("casos")
    .select("*, cliente:profiles!casos_cliente_id_fkey(nombre, telefono, email), documentos_casos(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

// 4. CASOS: OBTENER UN CASO POR ID
export async function getCasoPorId(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("casos")
    .select("*, cliente:profiles!casos_cliente_id_fkey(nombre, telefono, email, id), documentos_casos(*)")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

// 5. CASOS: CREAR CASO (Gestor / Admin)
export async function crearCaso(data: { clienteId: string; titulo: string; descripcion: string }) {
  const supabase = await createClient();

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
