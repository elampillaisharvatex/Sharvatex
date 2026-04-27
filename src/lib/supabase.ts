import { createClient } from '@supabase/supabase-js';

// Get these from Supabase -> Project Settings -> API
// Use environment variables in Vite: import.meta.env.VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_PROJECT_URL";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
