import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// .env дутуу үед апп цагаан дэлгэц болж унахгүй, main.jsx тайлбар харуулна.
// Зөвхөн anon (public) түлхүүр ашиглана. service_role түлхүүрийг frontend-д ОРУУЛАХГҮЙ.
export const envOk = Boolean(url && key)
export const supabase = createClient(
  url || 'https://missing.invalid',
  key || 'missing',
)
export const BUCKET = 'museum'
