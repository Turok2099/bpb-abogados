import { getPosts } from '@/app/actions/blog'
import { logout } from '@/app/actions/auth'
import { AdminPostList } from './AdminPostList'
import { LogOut, LayoutDashboard, User, Globe, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const postsRes = await getPosts(false)
  const posts = postsRes.data || []

  // Obtener información del administrador actual
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user 
    ? await supabase.from('profiles').select('nombre').eq('id', user.id).maybeSingle() 
    : { data: null }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Cabecera del Panel */}
      <header className="bg-surface border-b border-outline-variant/20 py-4 px-6 md:px-8">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center shrink-0">
              <img 
                src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" 
                alt="BPB Abogados Logo" 
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="h-6 w-[1px] bg-outline-variant/35 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-semibold">
              <LayoutDashboard className="w-4 h-4" />
              Panel de Control
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
              <User className="w-4 h-4 text-secondary" />
              <span>Hola, <strong className="text-white font-semibold">{profile?.nombre || 'Administrador'}</strong></span>
            </div>

            <Link 
              href="/gestor"
              className="h-10 px-4 border border-secondary/35 text-secondary hover:bg-secondary/5 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer font-semibold"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Gestión de Casos
            </Link>

            <Link 
              href="/"
              className="h-10 px-4 border border-outline-variant/30 hover:border-secondary hover:text-secondary text-white/70 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              Ver Sitio
            </Link>
            
            <form action={logout}>
              <button 
                type="submit" 
                className="h-10 px-4 border border-outline-variant/30 hover:border-error hover:text-error text-white/70 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Cuerpo del Tablero */}
      <main className="max-w-screen-2xl mx-auto p-6 md:p-8">
        <AdminPostList initialPosts={posts} />
      </main>
    </div>
  )
}
