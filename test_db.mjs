import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
const env = fs.readFileSync('.env.local', 'utf8');
const getVar = name => env.split('\n').find(l => l.startsWith(name + '=')).split('=')[1].replace(/"/g, '').trim();
const supabase = createClient(getVar('NEXT_PUBLIC_SUPABASE_URL'), getVar('SUPABASE_SERVICE_ROLE_KEY'));
supabase.from('profiles').select('id, nombre, role, telefono, email, created_at').then(r => console.log(r));
