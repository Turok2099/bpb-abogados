import { Metadata } from 'next'
import Link from 'next/link'
import { getPosts } from '@/app/actions/blog'
import { FileText, Calendar, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog y Opinión Legal | BPB Abogados Argentina',
  description: 'Análisis jurídicos, novedades normativas y guías sobre sucesiones, derecho de empresas e infraestructura en Argentina redactados por nuestros socios.',
}

export default async function BlogListPage() {
  const postsRes = await getPosts(true)
  const posts = postsRes.data || []

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="pt-32 pb-20 md:pt-48 md:pb-32 px-8 min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto">
        {/* Encabezado */}
        <div className="mb-16 flex flex-col items-center lg:items-start text-center lg:text-left">
          <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-6">
            Novedades y Análisis
          </p>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl text-white font-light mb-8">
            Blog & Opinión Legal
          </h1>
          <p className="font-body text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Artículos informativos, análisis de doctrina y actualizaciones legislativas redactados por nuestros socios. Un recurso clave para la toma de decisiones corporativas y particulares en Argentina.
          </p>
        </div>

        <div className="editorial-line mb-16"></div>

        {/* Listado */}
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-surface-container border border-white/5 rounded-sm">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="font-headline text-2xl font-light text-white">Próximamente más publicaciones</p>
            <p className="font-body text-sm text-on-surface-variant mt-2">
              Estamos preparando nuevos análisis jurídicos para compartir con usted.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="group flex flex-col bg-surface-container border border-white/5 hover:border-secondary/20 rounded-sm overflow-hidden shadow-lg transition-all duration-300"
              >
                {/* Imagen con Aspect Ratio constante */}
                <Link href={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/10] relative bg-primary-container/10">
                  {post.imagen_cabecera ? (
                    <img
                      src={post.imagen_cabecera}
                      alt={post.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-white/10" />
                    </div>
                  )}
                </Link>

                {/* Contenido tarjeta */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between min-h-[250px]">
                  <div>
                    {/* Fecha */}
                    <div className="flex items-center gap-2 text-xs text-tertiary font-label uppercase tracking-widest mb-4">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      {formatDate(post.fecha_publicacion)}
                    </div>

                    {/* Título */}
                    <h2 className="font-headline text-2xl text-white font-light mb-4 group-hover:text-secondary transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.titulo}
                      </Link>
                    </h2>

                    {/* Extracto */}
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                      {post.extracto || 'Haga clic para leer el análisis completo redactado por nuestro equipo.'}
                    </p>
                  </div>

                  {/* Enlace de lectura */}
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-secondary hover:text-white text-xs font-bold uppercase tracking-widest transition-colors font-label mt-auto"
                  >
                    Leer artículo
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
