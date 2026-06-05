"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
