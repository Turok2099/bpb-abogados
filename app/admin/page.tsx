import { getPosts } from '@/app/actions/blog'
import { AdminPostList } from './AdminPostList'
import { createClient } from '@/lib/supabase/server'
import { SidebarAdmin } from '@/components/admin/SidebarAdmin'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  // Obtener información del administrador actual
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, role')
    .eq('id', user.id)
    .maybeSingle()

  // Si no tiene perfil o no es admin/gestor, redirigir
  if (!profile || (profile.role !== 'admin' && profile.role !== 'gestor')) {
    redirect('/login?error=unauthorized')
  }

  const postsRes = await getPosts(false)
  const posts = postsRes.data || []

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row">
      {/* Sidebar Izquierdo Unificado */}
      <SidebarAdmin 
        user={{ id: user.id, email: user.email! }} 
        profile={profile} 
      />

      {/* Cuerpo del Tablero (desplazado md:pl-64 por el sidebar fijo) */}
      <main className="flex-1 md:pl-64 p-6 md:p-8 w-full">
        <div className="mb-8 border-b border-outline-variant/20 pb-6">
          <h1 className="font-headline text-3xl md:text-4xl text-white font-light">Panel del Blog</h1>
          <p className="text-sm text-white/50 mt-1 font-body">Crea, edita y gestiona las publicaciones del blog y el SEO del despacho.</p>
        </div>

        <AdminPostList initialPosts={posts} />
      </main>
    </div>
  )
}
