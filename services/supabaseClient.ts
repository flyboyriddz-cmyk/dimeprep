import { createClient } from '@supabase/supabase-js';

// These would typically be in environment variables, but for this specific request 
// where the user provided them directly, we'll use them if env vars aren't set, 
// or default to the provided ones to ensure immediate functionality as requested.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://npthcsrmewqjadezjxez.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BROsVHjAbU42PlxSVHVSeA_HawL9wI2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
