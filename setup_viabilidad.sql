-- 1. Agregar columnas para control de estado, gestor asignado y motivo de descarte
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'en_seguimiento', 'convertido', 'archivado')),
ADD COLUMN IF NOT EXISTS gestor_asignado_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS motivo_descarte TEXT;

-- 2. Actualizar políticas RLS de la tabla leads
-- Como los gestores y administradores necesitan leer y actualizar los leads desde la UI,
-- creamos políticas específicas para los usuarios autenticados con rol 'admin' o 'gestor'.

DROP POLICY IF EXISTS "Gestores y admins pueden ver todos los leads" ON public.leads;
CREATE POLICY "Gestores y admins pueden ver todos los leads" ON public.leads
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    );

DROP POLICY IF EXISTS "Gestores y admins pueden actualizar leads" ON public.leads;
CREATE POLICY "Gestores y admins pueden actualizar leads" ON public.leads
    FOR UPDATE TO authenticated
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

-- 3. Actualizar políticas del bucket documentos_viabilidad en storage.objects
-- Queremos permitir a los gestores y administradores leer los archivos subidos por los prospectos.
-- Nota: La inserción y lectura por parte del servidor público (cuando un prospecto sube archivos sin loguearse)
-- se sigue haciendo mediante el service_role, lo cual ya está cubierto por la política original.

DROP POLICY IF EXISTS "Gestores y admins pueden leer archivos de viabilidad" ON storage.objects;
CREATE POLICY "Gestores y admins pueden leer archivos de viabilidad" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'documentos_viabilidad' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    );

DROP POLICY IF EXISTS "Gestores y admins pueden subir archivos de viabilidad" ON storage.objects;
CREATE POLICY "Gestores y admins pueden subir archivos de viabilidad" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'documentos_viabilidad' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'gestor')
        )
    );
