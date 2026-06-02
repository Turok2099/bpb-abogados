'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/app/actions/blog'
import { PostSchema } from '@/lib/schemas/blog'
import { CldUploadWidget } from 'next-cloudinary'
import { marked } from 'marked'
import { toast } from 'sonner'
import { 
  ArrowLeft, Save, Eye, Edit3, Image as ImageIcon, 
  HelpCircle, Globe, FileText, Settings, Link as LinkIcon 
} from 'lucide-react'
import Link from 'next/link'

interface PostData {
  id?: string
  titulo: string
  slug: string
  contenido: string
  extracto: string | null
  imagen_cabecera: string | null
  publicado: boolean
  meta_title: string | null
  meta_description: string | null
}

interface PostFormProps {
  initialData?: PostData
  isEditing?: boolean
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [previewHtml, setPreviewHtml] = useState('')

  // Form states
  const [titulo, setTitulo] = useState(initialData?.titulo || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [contenido, setContenido] = useState(initialData?.contenido || '')
  const [extracto, setExtracto] = useState(initialData?.extracto || '')
  const [imagenCabecera, setImagenCabecera] = useState(initialData?.imagen_cabecera || '')
  const [publicado, setPublicado] = useState(initialData?.publicado || false)
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '')
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '')

  const [autoSlug, setAutoSlug] = useState(!isEditing) // Autogenerar slug por defecto solo si es nuevo

  // Autogenerar slug desde el título
  useEffect(() => {
    if (autoSlug && !isEditing) {
      const generated = titulo
        .toLowerCase()
        .normalize('NFD') // Quitar acentos
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '') // Quitar caracteres raros
        .trim()
        .replace(/\s+/g, '-') // Cambiar espacios por guiones
        .replace(/-+/g, '-') // Quitar guiones duplicados
      setSlug(generated)
    }
  }, [titulo, autoSlug, isEditing])

  // Compilar Markdown a HTML en tiempo real cuando cambia el contenido o la pestaña
  useEffect(() => {
    if (activeTab === 'preview') {
      try {
        const html = marked.parse(contenido) as string
        setPreviewHtml(html)
      } catch (err) {
        setPreviewHtml('<p class="text-error">Error al procesar el Markdown</p>')
      }
    }
  }, [contenido, activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)

    const payload = {
      titulo,
      slug,
      contenido,
      extracto: extracto || null,
      imagen_cabecera: imagenCabecera || null,
      publicado,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null
    }

    // Validar en el cliente con Zod para mostrar feedback rápido
    const validation = PostSchema.safeParse(payload)
    if (!validation.success) {
      toast.error(validation.error.issues[0].message, {
        style: {
          background: 'var(--color-surface)',
          borderColor: 'var(--color-error)',
          color: 'var(--color-on-surface)'
        }
      })
      setIsPending(false)
      return
    }

    try {
      let res
      if (isEditing && initialData?.id) {
        res = await updatePost(initialData.id, payload)
      } else {
        res = await createPost(payload)
      }

      if (res.error) {
        toast.error(res.error, {
          style: {
            background: 'var(--color-surface)',
            borderColor: 'var(--color-error)',
            color: 'var(--color-on-surface)'
          }
        })
      } else {
        toast.success(
          isEditing 
            ? 'Artículo actualizado correctamente' 
            : 'Artículo creado correctamente',
          {
            style: {
              background: 'var(--color-surface)',
              borderColor: 'var(--color-secondary)',
              color: 'var(--color-on-surface)'
            }
          }
        )
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      toast.error('Ocurrió un error al guardar el artículo.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header Barra */}
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="w-10 h-10 border border-outline-variant/30 hover:border-secondary hover:text-secondary text-white/70 transition-all rounded-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-headline text-2xl text-white font-light">
              {isEditing ? 'Editar Publicación' : 'Nueva Publicación'}
            </h2>
            <p className="font-body text-xs text-on-surface-variant">
              {isEditing ? 'Modifique el contenido y configure los metadatos.' : 'Redacte una nueva publicación de blog.'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-12 px-6 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? 'GUARDANDO...' : 'GUARDAR ARTÍCULO'}
        </button>
      </div>

      {/* Grid Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Principal (Contenido) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título del Post */}
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
              Título del Post *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={isPending}
              placeholder="Ej. Cómo iniciar una sucesión en Provincia de Buenos Aires"
              className="w-full h-12 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none px-4 text-white text-base transition-colors rounded-sm"
            />
          </div>

          {/* Slug (URL) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
                Enlace permanente (Slug) *
              </label>
              {!isEditing && (
                <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(e) => setAutoSlug(e.target.checked)}
                    className="accent-secondary"
                  />
                  Autogenerar slug
                </label>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono">
                /blog/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setAutoSlug(false)
                }}
                disabled={isPending}
                placeholder="ej-como-iniciar-sucesion"
                className="w-full h-12 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-16 pr-4 text-white text-base font-mono transition-colors rounded-sm"
              />
            </div>
          </div>

          {/* Editor Markdown / Preview Container */}
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`h-9 px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'write'
                      ? 'bg-secondary text-primary rounded-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Redactar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`h-9 px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'preview'
                      ? 'bg-secondary text-primary rounded-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Vista Previa
                </button>
              </div>

              {/* Guía Rápida */}
              <div className="relative group">
                <button
                  type="button"
                  className="text-white/40 hover:text-secondary flex items-center gap-1 text-xs focus:outline-none"
                >
                  <HelpCircle className="w-4 h-4" />
                  Sintaxis Markdown
                </button>
                <div className="absolute right-0 top-full mt-2 w-72 bg-surface border border-outline-variant/30 p-4 rounded-sm shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20 space-y-2 text-xs">
                  <p className="font-bold text-secondary uppercase tracking-widest border-b border-outline-variant/10 pb-1 mb-2">Ayuda de Markdown</p>
                  <div className="grid grid-cols-2 gap-2 text-white/80 font-mono">
                    <div>{"## Título"}</div>
                    <div className="text-white/50">H2 Titulo</div>
                    <div>{"**Negrita**"}</div>
                    <div className="text-white/50"><strong>Negrita</strong></div>
                    <div>{"*Cursiva*"}</div>
                    <div className="text-white/50"><em>Cursiva</em></div>
                    <div>{"[Texto](url)"}</div>
                    <div className="text-white/50">Enlace</div>
                    <div>{"- Elemento"}</div>
                    <div className="text-white/50">Lista</div>
                    <div>{"> Cita"}</div>
                    <div className="text-white/50">Bloque cita</div>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                disabled={isPending}
                required
                rows={18}
                placeholder="Escriba el artículo en Markdown aquí..."
                className="w-full bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none p-4 text-white text-base font-mono transition-colors rounded-sm resize-y leading-relaxed"
              ></textarea>
            ) : (
              <div className="bg-surface-container-high border border-outline-variant/30 p-6 rounded-sm min-h-[450px] overflow-y-auto max-h-[600px] text-justify-custom">
                {contenido.trim() === '' ? (
                  <p className="text-white/30 italic">No hay contenido escrito para previsualizar.</p>
                ) : (
                  <article 
                    className="prose-markdown"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Extracto */}
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-white/70 block">
              Extracto / Resumen corto
            </label>
            <textarea
              value={extracto}
              onChange={(e) => setExtracto(e.target.value)}
              disabled={isPending}
              rows={3}
              maxLength={250}
              placeholder="Un resumen de 2 o 3 líneas que aparecerá en el listado del blog para llamar la atención del lector..."
              className="w-full bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none p-4 text-white text-base transition-colors rounded-sm resize-none leading-normal"
            ></textarea>
            <span className="text-[10px] text-white/40 text-right block mt-1">
              Máximo 250 caracteres ({extracto.length}/250)
            </span>
          </div>
        </div>

        {/* Columna Lateral (Configuraciones y SEO) */}
        <div className="space-y-6">
          
          {/* Publicación y Estado */}
          <div className="bg-surface-container border border-outline-variant/20 p-6 rounded-sm space-y-4">
            <h3 className="font-headline text-lg text-white font-light border-b border-outline-variant/10 pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-secondary" />
              Estado y Publicación
            </h3>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-sm">
              <span className="font-body text-sm text-white/80">Publicado</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={publicado}
                  onChange={(e) => setPublicado(e.target.checked)}
                  disabled={isPending}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-1"></div>
              </label>
            </div>

            <div className="text-xs text-white/50 flex items-start gap-2 bg-secondary/5 p-3 rounded-sm">
              <Globe className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <p>
                {publicado 
                  ? 'Este post estará visible de inmediato en la sección pública del blog.' 
                  : 'Guardado como borrador. Solo es visible por administradores.'}
              </p>
            </div>
          </div>

          {/* Imagen de Cabecera */}
          <div className="bg-surface-container border border-outline-variant/20 p-6 rounded-sm space-y-4">
            <h3 className="font-headline text-lg text-white font-light border-b border-outline-variant/10 pb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-secondary" />
              Imagen de Cabecera
            </h3>

            {/* Preview de la imagen */}
            <div className="w-full aspect-[16/9] border border-outline-variant/30 rounded-sm bg-surface flex items-center justify-center overflow-hidden relative">
              {imagenCabecera ? (
                <img
                  src={imagenCabecera}
                  alt="Cabecera del post"
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <span className="text-xs text-white/30 block">Sin imagen seleccionada</span>
                </div>
              )}
            </div>

            {/* Upload Widget y Entrada de URL */}
            <div className="space-y-3">
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                onSuccess={(result: any) => {
                  if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                    setImagenCabecera(result.info.secure_url)
                    toast.success('Imagen cargada correctamente')
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full h-12 border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-all duration-300 font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Cargar desde mi PC
                  </button>
                )}
              </CldUploadWidget>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <LinkIcon className="w-3.5 h-3.5 text-white/40" />
                </div>
                <input
                  type="text"
                  value={imagenCabecera}
                  onChange={(e) => setImagenCabecera(e.target.value)}
                  placeholder="O pegue la URL directa de la imagen..."
                  className="w-full h-10 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none pl-9 pr-4 text-xs font-mono transition-colors rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Configuración SEO */}
          <div className="bg-surface-container border border-outline-variant/20 p-6 rounded-sm space-y-4">
            <h3 className="font-headline text-lg text-white font-light border-b border-outline-variant/10 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-secondary" />
              SEO (Google Argentina)
            </h3>

            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-white/50 block">
                Título SEO (Meta Title)
              </label>
              <input
                type="text"
                maxLength={70}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Título optimizado (Máx 70 car.)"
                className="w-full h-10 bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none px-3 text-sm transition-colors rounded-sm"
              />
              <span className="text-[10px] text-white/30 text-right block">
                Recomendado: 50-60 car. ({metaTitle.length}/70)
              </span>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-white/50 block">
                Descripción SEO (Meta Description)
              </label>
              <textarea
                rows={3}
                maxLength={160}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Descripción para el fragmento de Google (Máx 160 car.)"
                className="w-full bg-surface-container-high border border-outline-variant/30 focus:border-secondary focus:outline-none p-3 text-sm transition-colors rounded-sm resize-none"
              ></textarea>
              <span className="text-[10px] text-white/30 text-right block">
                Recomendado: 120-150 car. ({metaDescription.length}/160)
              </span>
            </div>
          </div>

        </div>
      </div>
    </form>
  )
}
