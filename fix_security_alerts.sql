-- =====================================================================
-- CORRECCIÓN DE ALERTAS DE SEGURIDAD EN FUNCIONES DE SUPABASE / POSTGRES
-- =====================================================================

-- 1. CORREGIR public.handle_new_user()
--   - Establece un search_path explícito y seguro para evitar secuestros (search_path hijacking)
--   - Revoca privilegios de ejecución para roles públicos (anon, authenticated) para evitar llamadas RPC maliciosas
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_catalog;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- 2. CORREGIR public.rls_auto_enable()
--   - Usamos un bloque anónimo DO para comprobar la existencia de la función y evitar errores al ejecutar el script
--   - Establece search_path seguro y revoca privilegios de ejecución
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid 
        WHERE proname = 'rls_auto_enable' AND nspname = 'public'
    ) THEN
        EXECUTE 'ALTER FUNCTION public.rls_auto_enable() SET search_path = public, pg_catalog;';
        EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;';
        EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;';
        EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;';
    END IF;
END
$$;
