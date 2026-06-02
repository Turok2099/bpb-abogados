import { Metadata } from 'next'
import Link from 'next/link'
import { getPostBySlug } from '@/app/actions/blog'
import { marked } from 'marked'

export const dynamic = 'force-dynamic'
import { Calendar, ArrowLeft, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const res = await getPostBySlug(slug)
  const post = res.data

  if (!post) {
    return {
      title: 'Artículo no encontrado | BPB Abogados',
    }
  }

  const cleanTitle = `${post.meta_title || post.titulo} | BPB Abogados`
  const cleanDesc = post.meta_description || post.extracto || 'Análisis legal y novedades normativas en Argentina.'

  return {
    title: cleanTitle,
    description: cleanDesc,
    openGraph: {
      title: cleanTitle,
      description: cleanDesc,
      type: 'article',
      publishedTime: post.fecha_publicacion || undefined,
      modifiedTime: post.updated_at || undefined,
      images: post.imagen_cabecera ? [{ url: post.imagen_cabecera }] : undefined,
    },
  }
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const res = await getPostBySlug(slug)
  
  if (res.error || !res.data) {
    return (
      <div className="pt-32 pb-20 md:pt-48 md:pb-32 px-8 min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md bg-surface-container border border-error/20 p-8 rounded-sm text-center space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-error mx-auto" />
          <h2 className="font-headline text-2xl font-light text-white">Publicación no encontrada</h2>
          <p className="font-body text-sm text-on-surface-variant">
            {res.error || 'El artículo solicitado no existe o no se encuentra publicado en este momento.'}
          </p>
          <Link
            href="/blog"
            className="inline-flex h-12 px-6 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all rounded-sm items-center gap-2 justify-center cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a publicaciones
          </Link>
        </div>
      </div>
    )
  }

  const post = res.data
  const htmlContent = marked.parse(post.contenido) as string

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Schema.org para Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titulo,
    "image": post.imagen_cabecera || "",
    "datePublished": post.fecha_publicacion || post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": {
      "@type": "Organization",
      "name": "BPB Abogados",
      "url": "https://bpbabogados.com.ar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BPB Abogados",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png"
      }
    },
    "description": post.extracto || post.meta_description || "Análisis legal de BPB Abogados."
  }

  return (
    <>
      {/* Inyección estructurada de JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-32 pb-20 md:pt-48 md:pb-32 px-8 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto">
          {/* Botón de Retorno */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-secondary hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-10 font-label cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            Volver al blog
          </Link>

          {/* Imagen de Cabecera */}
          {post.imagen_cabecera && (
            <div className="w-full aspect-[21/9] md:aspect-[21/10] border border-white/5 rounded-sm overflow-hidden mb-12 shadow-2xl">
              <img
                src={post.imagen_cabecera}
                alt={post.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Metadatos y Título */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-xs text-tertiary font-label uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              {formatDate(post.fecha_publicacion)}
              <span className="text-white/20">|</span>
              <span className="text-white/60">Por BPB Abogados</span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-light leading-tight">
              {post.titulo}
            </h1>
          </div>

          <div className="editorial-line mb-10"></div>

          {/* Cuerpo del Artículo (Markdown Renderizado) */}
          <article 
            className="prose-markdown text-justify-custom mb-16"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="editorial-line mb-16"></div>

          {/* Sección de Conversión (Llamado a la Acción - CTA) */}
          <div className="bg-surface-container border border-secondary/20 p-8 md:p-12 rounded-sm shadow-xl relative overflow-hidden text-center sm:text-left">
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 blur-2xl rounded-full"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <h3 className="font-headline text-2xl md:text-3xl text-white font-light">
                  ¿Tiene una consulta sobre este u otro caso legal?
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  Ofrecemos asesoramiento experto con estricto rigor y confidencialidad corporativa. Realice una evaluación inicial de viabilidad técnica o contáctenos hoy mismo.
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  href="/test-de-viabilidad"
                  className="h-12 px-6 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Evaluar mi caso
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contacto"
                  className="h-12 px-6 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contacto directo
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
