-- 1. Crear tabla de perfiles de usuario vinculada a auth.users
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    nombre TEXT,
    role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para perfiles
CREATE POLICY "Usuarios pueden leer su propio perfil" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Servidor puede hacer todo en perfiles" ON public.profiles
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. Trigger para crear automáticamente el perfil de un usuario registrado en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nombre, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'nombre', 'Administrador'),
        COALESCE(new.raw_user_meta_data->>'role', 'admin')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger disparador
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Crear la tabla de posts para el blog
CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    contenido TEXT NOT NULL, -- Contenido en Markdown
    extracto TEXT, -- Breve descripción para la vista de listado
    imagen_cabecera TEXT, -- URL de Cloudinary
    publicado BOOLEAN DEFAULT false NOT NULL,
    fecha_publicacion TIMESTAMP WITH TIME ZONE,
    autor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    meta_title TEXT, -- Metadatos SEO específicos
    meta_description TEXT, -- Metadatos SEO específicos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para posts
CREATE POLICY "Cualquiera puede leer posts publicados" ON public.posts
    FOR SELECT USING (publicado = true);

CREATE POLICY "Admins tienen control total sobre posts" ON public.posts
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Servidor tiene control total sobre posts" ON public.posts
    FOR ALL TO service_role USING (true) WITH CHECK (true);
