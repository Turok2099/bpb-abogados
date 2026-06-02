-- 1. Crear la tabla de leads
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    tipo_consulta TEXT NOT NULL, -- 'contacto_general' o 'test_viabilidad'
    archivo_url TEXT, -- Opcional, ruta del archivo en Storage
    leido BOOLEAN DEFAULT false
);

-- 2. Habilitar RLS (Row Level Security) en la tabla leads
-- La regla por defecto es que nadie puede hacer nada.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Crear una política estricta: Solo el rol de servicio puede insertar, actualizar o leer.
-- El cliente anónimo (navegador) NO puede hacer nada. Toda inserción se hará desde el Server Action con service_role_key.
CREATE POLICY "Servidor puede hacer todo" ON public.leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Crear el bucket privado para documentos
INSERT INTO storage.buckets (id, name, public) VALUES ('documentos_viabilidad', 'documentos_viabilidad', false);

-- 5. Crear políticas para el bucket
-- Solo el rol de servicio puede insertar, actualizar o leer objetos en este bucket.
CREATE POLICY "Servidor puede hacer todo en documentos_viabilidad" ON storage.objects
    FOR ALL
    TO service_role
    USING (bucket_id = 'documentos_viabilidad')
    WITH CHECK (bucket_id = 'documentos_viabilidad');
