-- 1. Alterar tabla profiles para permitir nuevos roles y agregar telefono y email
-- Primero remover el check constraint antiguo si existe
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Añadir el nuevo check constraint (permite admin, editor, cliente, gestor)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'editor', 'cliente', 'gestor'));

-- Añadir telefono a profiles si no existe
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telefono TEXT;

-- Añadir email a profiles si no existe
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Actualizar trigger handle_new_user para guardar el telefono y email también desde auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nombre, role, telefono, email)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'nombre', 'Usuario'),
        COALESCE(new.raw_user_meta_data->>'role', 'cliente'), -- Por defecto cliente
        new.raw_user_meta_data->>'telefono',
        new.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;


-- 2. Crear tabla de casos
CREATE TABLE IF NOT EXISTS public.casos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT DEFAULT 'en revision' NOT NULL CHECK (estado IN ('en revision', 'en proceso', 'se requiere más informacion', 'completado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en casos
ALTER TABLE public.casos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para casos
DROP POLICY IF EXISTS "Clientes pueden ver sus propios casos" ON public.casos;
CREATE POLICY "Clientes pueden ver sus propios casos" ON public.casos
    FOR SELECT TO authenticated
    USING (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "Gestores y admins pueden hacer todo en casos" ON public.casos;
CREATE POLICY "Gestores y admins pueden hacer todo en casos" ON public.casos
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    );

DROP POLICY IF EXISTS "Servidor tiene control total sobre casos" ON public.casos;
CREATE POLICY "Servidor tiene control total sobre casos" ON public.casos
    FOR ALL TO service_role USING (true) WITH CHECK (true);


-- 3. Crear la tabla de documentos de casos
CREATE TABLE IF NOT EXISTS public.documentos_casos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    caso_id UUID REFERENCES public.casos(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    nombre_archivo TEXT NOT NULL,
    url_archivo TEXT NOT NULL, -- Ruta en storage
    estado TEXT DEFAULT 'pendiente' NOT NULL CHECK (estado IN ('pendiente', 'validado', 'rechazado')),
    comentarios TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en documentos_casos
ALTER TABLE public.documentos_casos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para documentos_casos
DROP POLICY IF EXISTS "Clientes pueden ver sus propios documentos" ON public.documentos_casos;
CREATE POLICY "Clientes pueden ver sus propios documentos" ON public.documentos_casos
    FOR SELECT TO authenticated
    USING (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "Clientes pueden insertar sus propios documentos" ON public.documentos_casos;
CREATE POLICY "Clientes pueden insertar sus propios documentos" ON public.documentos_casos
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = cliente_id);

DROP POLICY IF EXISTS "Gestores y admins pueden hacer todo en documentos" ON public.documentos_casos;
CREATE POLICY "Gestores y admins pueden hacer todo en documentos" ON public.documentos_casos
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    );

DROP POLICY IF EXISTS "Servidor tiene control total sobre documentos" ON public.documentos_casos;
CREATE POLICY "Servidor tiene control total sobre documentos" ON public.documentos_casos
    FOR ALL TO service_role USING (true) WITH CHECK (true);


-- 4. Crear el bucket privado para documentos_casos en storage si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documentos_casos', 'documentos_casos', false)
ON CONFLICT (id) DO NOTHING;

-- Crear políticas para el bucket documentos_casos
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir archivos a su propia carpeta" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir archivos a su propia carpeta" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'documentos_casos' AND 
        (owner = auth.uid() OR (substring(name from '^([^/]+)') = auth.uid()::text))
    );

DROP POLICY IF EXISTS "Clientes pueden leer sus propios archivos" ON storage.objects;
CREATE POLICY "Clientes pueden leer sus propios archivos" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'documentos_casos' AND 
        (owner = auth.uid() OR (substring(name from '^([^/]+)') = auth.uid()::text))
    );

DROP POLICY IF EXISTS "Gestores y admins pueden leer todos los archivos" ON storage.objects;
CREATE POLICY "Gestores y admins pueden leer todos los archivos" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'documentos_casos' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    );

DROP POLICY IF EXISTS "Gestores y admins pueden actualizar archivos" ON storage.objects;
CREATE POLICY "Gestores y admins pueden actualizar archivos" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'documentos_casos' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    );

DROP POLICY IF EXISTS "Servidor puede hacer todo en documentos_casos" ON storage.objects;
CREATE POLICY "Servidor puede hacer todo en documentos_casos" ON storage.objects
    FOR ALL TO service_role
    USING (bucket_id = 'documentos_casos')
    WITH CHECK (bucket_id = 'documentos_casos');
