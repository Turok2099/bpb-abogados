const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Parse .env.local manually
let supabaseUrl = '';
let serviceRoleKey = '';

try {
  const envContent = fs.readFileSync('./.env.local', 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('#')) continue;
    const parts = cleanLine.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceRoleKey = val;
    }
  }
} catch (err) {
  console.error("Error al leer .env.local:", err.message);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Faltan las variables de entorno de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Función recursiva para listar y eliminar archivos en un directorio de Supabase Storage
async function deleteFolderRecursive(bucketName, folderPath) {
  console.log(`Buscando archivos en bucket "${bucketName}" bajo la ruta "${folderPath}"...`);
  
  const { data: items, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath);

  if (error) {
    console.error(`Error al listar archivos en ${bucketName}/${folderPath}:`, error.message);
    return;
  }

  if (!items || items.length === 0) {
    console.log(`Directorio vacío o no encontrado en ${bucketName}/${folderPath}.`);
    return;
  }

  const filesToDelete = [];
  
  for (const item of items) {
    const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name;
    
    // Si no tiene ID ni metadata de archivo, lo tratamos como subdirectorio
    if (!item.id && !item.metadata) {
      await deleteFolderRecursive(bucketName, itemPath);
    } else {
      filesToDelete.push(itemPath);
    }
  }

  if (filesToDelete.length > 0) {
    console.log(`Eliminando ${filesToDelete.length} archivos de "${bucketName}":`, filesToDelete);
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(filesToDelete);

    if (deleteError) {
      console.error(`❌ Error al eliminar archivos:`, deleteError.message);
    } else {
      console.log(`✅ Archivos eliminados de "${bucketName}" exitosamente.`);
    }
  }
}

async function deleteUserAuth(id, description) {
  console.log(`Eliminando usuario de Auth: ${description} (ID: ${id})...`);
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) {
    if (error.message.includes("User not found") || error.status === 404) {
      console.log(`ℹ️ El usuario ${description} ya no existe en Auth.`);
    } else {
      console.error(`❌ Error al eliminar usuario de Auth:`, error.message);
    }
  } else {
    console.log(`✅ Usuario de Auth ${description} eliminado.`);
  }
}

async function main() {
  const gestorId = 'e045f79c-90db-4802-8048-5203d2b00426';
  const clienteId = 'e92a64d4-1973-4e44-b6e4-4c5eb0c114eb';

  console.log("=================================================");
  console.log("INICIANDO LIMPIEZA DE BASE DE DATOS Y STORAGE");
  console.log("=================================================\n");

  // 1. Limpiar archivos del Storage del Cliente en documentos_casos
  console.log("--- Limpieza de Storage ---");
  await deleteFolderRecursive('documentos_casos', clienteId);

  // 2. Limpiar usuarios de Auth (esto desencadena borrado en cascada en profiles, casos, documentos)
  console.log("\n--- Limpieza de Usuarios Auth ---");
  await deleteUserAuth(gestorId, 'Gestor (jcthechampishere@gmail.com)');
  await deleteUserAuth(clienteId, 'Cliente (jorge.castro.cruz@hotmail.com)');

  console.log("\n=================================================");
  console.log("LIMPIEZA FINALIZADA");
  console.log("=================================================");
}

main();
