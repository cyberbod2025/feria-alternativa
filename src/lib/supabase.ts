import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabase) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY no definidas. ' +
    'Feedback y funciones de base de datos no estarán disponibles.'
  );
}

export const supabase = hasSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isSupabaseReady(): boolean {
  return hasSupabase && supabase !== null;
}
