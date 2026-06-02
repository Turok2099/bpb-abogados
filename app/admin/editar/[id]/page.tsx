import { getPostById } from '@/app/actions/blog'
import { PostForm } from '../../PostForm'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const res = await getPostById(id)

  if (res.error || !res.data) {
    return (
      <div className="min-h-screen bg-background text-white p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-md bg-surface-container border border-error/20 p-8 rounded-sm text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-error mx-auto" />
          <h2 className="font-headline text-2xl font-light">Artículo No Encontrado</h2>
          <p className="font-body text-sm text-on-surface-variant">
            {res.error || 'No se pudo recuperar la información de la publicación solicitada.'}
          </p>
          <Link
            href="/admin"
            className="inline-flex h-12 px-6 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all rounded-sm items-center gap-2 justify-center cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al panel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <PostForm initialData={res.data} isEditing={true} />
      </div>
    </div>
  )
}
