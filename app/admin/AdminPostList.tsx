'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deletePost } from '@/app/actions/blog'
import { toast } from 'sonner'
import { Edit, Trash2, Plus, Globe, FileText, ExternalLink } from 'lucide-react'

interface Post {
  id: string
  titulo: string
  slug: string
  extracto: string | null
  imagen_cabecera: string | null
  publicado: boolean
  fecha_publicacion: string | null
  created_at: string
}

interface AdminPostListProps {
  initialPosts: Post[]
}

export function AdminPostList({ initialPosts }: AdminPostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Está seguro de que desea eliminar el artículo "${titulo}"?`)) {
      return
    }

    setIsDeleting(id)
    try {
      const res = await deletePost(id)
      if (res?.error) {
        toast.error(`Error al eliminar: ${res.error}`, {
          style: {
            background: 'var(--color-surface)',
            borderColor: 'var(--color-error)',
            color: 'var(--color-on-surface)'
          }
        })
      } else {
        toast.success('Artículo eliminado correctamente', {
          style: {
            background: 'var(--color-surface)',
            borderColor: 'var(--color-secondary)',
            color: 'var(--color-on-surface)'
          }
        })
        setPosts(posts.filter(p => p.id !== id))
      }
    } catch (err) {
      toast.error('Ocurrió un error inesperado.')
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline text-2xl text-white font-light">
            Publicaciones del Blog
          </h2>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            Gestión de artículos informativos y de opinión legal para Argentina.
          </p>
        </div>
        <Link
          href="/admin/nuevo"
          className="h-12 px-6 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Publicación
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-surface-container border border-outline-variant/20 p-12 text-center rounded-sm">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="font-headline text-lg text-white font-light">No hay publicaciones escritas aún</p>
          <p className="font-body text-sm text-on-surface-variant mt-1 mb-6">
            Comience a redactar artículos informativos para mejorar el posicionamiento SEO.
          </p>
          <Link
            href="/admin/nuevo"
            className="inline-flex h-12 px-6 border border-secondary text-secondary font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all duration-300 rounded-sm items-center"
          >
            Redactar mi primer post
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container border border-outline-variant/20 rounded-sm overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low font-label text-xs uppercase tracking-widest text-white/50">
                  <th className="p-4 pl-6">Imagen</th>
                  <th className="p-4">Título</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-body text-sm text-white/95">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="w-16 h-12 bg-surface border border-white/10 rounded-sm overflow-hidden aspect-[4/3] relative">
                        {post.imagen_cabecera ? (
                          <img
                            src={post.imagen_cabecera}
                            alt={post.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-container/20">
                            <FileText className="w-4 h-4 text-white/20" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold block text-base leading-snug">{post.titulo}</span>
                      <span className="text-xs text-white/50 block mt-0.5">/{post.slug}</span>
                    </td>
                    <td className="p-4">
                      {post.publicado ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-1/20 text-green-400 border border-accent-1/30">
                          <Globe className="w-3.5 h-3.5" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary/10 text-tertiary border border-tertiary/20">
                          <FileText className="w-3.5 h-3.5" />
                          Borrador
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-white/70">
                      <span className="block text-xs uppercase tracking-wider text-white/40">
                        {post.publicado ? 'Publicado el' : 'Creado el'}
                      </span>
                      <span className="text-sm block mt-0.5">
                        {formatDate(post.publicado ? post.fecha_publicacion : post.created_at)}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.publicado && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            title="Ver en el sitio"
                            className="w-10 h-10 border border-outline-variant/30 hover:border-secondary hover:text-secondary text-white/70 transition-all rounded-sm flex items-center justify-center"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/editar/${post.id}`}
                          title="Editar"
                          className="w-10 h-10 border border-outline-variant/30 hover:border-secondary hover:text-secondary text-white/70 transition-all rounded-sm flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.titulo)}
                          disabled={isDeleting === post.id}
                          title="Eliminar"
                          className="w-10 h-10 border border-outline-variant/30 hover:border-error hover:text-error text-white/70 transition-all rounded-sm flex items-center justify-center disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
