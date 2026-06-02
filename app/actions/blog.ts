'use server'

import { createClient } from '@/lib/supabase/server'
import { PostSchema, type PostInput } from '@/lib/schemas/blog'
import { revalidatePath } from 'next/cache'

// Helper para verificar si el usuario actual es administrador
async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, nombre')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') return null
  return { id: user.id, nombre: profile.nombre }
}

export async function getPosts(onlyPublished = true) {
  try {
    const supabase = await createClient()
    let query = supabase.from('posts').select(`
      id,
      titulo,
      slug,
      extracto,
      imagen_cabecera,
      publicado,
      fecha_publicacion,
      created_at
    `)

    if (onlyPublished) {
      query = query.eq('publicado', true).order('fecha_publicacion', { ascending: false })
    } else {
      // Si quiere ver borradores, primero verificamos si es admin
      const isAdmin = await checkAdmin(supabase)
      if (!isAdmin) {
        // Si no es admin, solo devolvemos los publicados
        query = query.eq('publicado', true).order('fecha_publicacion', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }
    }

    const { data, error } = await query
    if (error) throw error
    return { data: data || [] }
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return { error: error.message, data: [] }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    if (!data) return { data: null }

    if (!data.publicado) {
      // Si no está publicado, verificar si es admin
      const isAdmin = await checkAdmin(supabase)
      if (!isAdmin) {
        return { error: 'No autorizado para ver este borrador', data: null }
      }
    }

    return { data }
  } catch (error: any) {
    console.error('Error fetching post by slug:', error)
    return { error: error.message, data: null }
  }
}

export async function getPostById(id: string) {
  try {
    const supabase = await createClient()
    const isAdmin = await checkAdmin(supabase)
    if (!isAdmin) return { error: 'No autorizado', data: null }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data }
  } catch (error: any) {
    console.error('Error fetching post by id:', error)
    return { error: error.message, data: null }
  }
}

export async function createPost(input: PostInput) {
  try {
    const supabase = await createClient()
    const admin = await checkAdmin(supabase)
    if (!admin) return { error: 'No autorizado' }

    const validation = PostSchema.safeParse(input)
    if (!validation.success) {
      return { error: validation.error.issues[0].message }
    }

    const { data: validatedData } = validation
    
    // Si se publica ahora, asignamos la fecha de publicación actual
    const fecha_publicacion = validatedData.publicado ? new Date().toISOString() : null

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...validatedData,
        fecha_publicacion,
        autor_id: admin.id
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return { error: 'Ya existe un artículo con ese mismo slug (dirección web).' }
      }
      throw error
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${validatedData.slug}`)
    return { data, success: true }
  } catch (error: any) {
    console.error('Error creating post:', error)
    return { error: error.message }
  }
}

export async function updatePost(id: string, input: PostInput) {
  try {
    const supabase = await createClient()
    const admin = await checkAdmin(supabase)
    if (!admin) return { error: 'No autorizado' }

    const validation = PostSchema.safeParse(input)
    if (!validation.success) {
      return { error: validation.error.issues[0].message }
    }

    const { data: validatedData } = validation

    // Obtener el post anterior para comprobar si cambia de borrador a publicado
    const { data: oldPost } = await supabase
      .from('posts')
      .select('publicado, fecha_publicacion, slug')
      .eq('id', id)
      .single()

    let fecha_publicacion = oldPost?.fecha_publicacion
    if (validatedData.publicado && !oldPost?.publicado) {
      // Se publica por primera vez
      fecha_publicacion = new Date().toISOString()
    } else if (!validatedData.publicado) {
      // Se despublica
      fecha_publicacion = null
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        ...validatedData,
        fecha_publicacion,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return { error: 'Ya existe un artículo con ese mismo slug (dirección web).' }
      }
      throw error
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${validatedData.slug}`)
    if (oldPost?.slug && oldPost.slug !== validatedData.slug) {
      revalidatePath(`/blog/${oldPost.slug}`)
    }

    return { data, success: true }
  } catch (error: any) {
    console.error('Error updating post:', error)
    return { error: error.message }
  }
}

export async function deletePost(id: string) {
  try {
    const supabase = await createClient()
    const admin = await checkAdmin(supabase)
    if (!admin) return { error: 'No autorizado' }

    const { data: post } = await supabase
      .from('posts')
      .select('slug')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/blog')
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return { error: error.message }
  }
}
