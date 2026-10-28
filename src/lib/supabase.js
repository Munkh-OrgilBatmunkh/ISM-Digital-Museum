import { createClient } from '@supabase/supabase-js'

// Зөвхөн anon (public) түлхүүр ашиглана. service_role түлхүүрийг frontend-д ОРУУЛАХГҮЙ.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const BUCKET = 'museum'
