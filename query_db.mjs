import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  console.log('Profiles:', profiles, error);

  const { data: casos } = await supabase.from('casos').select('*');
  console.log('Casos:', casos);
}

main();
