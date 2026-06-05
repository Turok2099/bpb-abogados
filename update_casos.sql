-- 1. Añadir la columna gestor_id a la tabla casos si no existe
ALTER TABLE public.casos ADD COLUMN IF NOT EXISTS gestor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Modificar el constraint de estado de la tabla casos
-- Primero removemos el constraint existente. Como no le pusimos nombre explícito al crearlo inicialmente,
-- buscaremos su nombre. Por defecto PostgreSQL le pone "casos_estado_check".
DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.casos'::regclass
      AND contype = 'c'
      AND conname LIKE '%estado%';

    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.casos DROP CONSTRAINT ' || constraint_name;
    END IF;
END $$;

-- Volvemos a crear el constraint incluyendo 'archivado'
ALTER TABLE public.casos 
ADD CONSTRAINT casos_estado_check 
CHECK (estado IN ('en revision', 'en proceso', 'se requiere más informacion', 'completado', 'archivado'));
