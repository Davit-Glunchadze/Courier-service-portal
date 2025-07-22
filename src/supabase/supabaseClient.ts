import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnhirmemilziiojkhuwm.supabase.co'
const supabaseAnonKey = 'sb_publishable_lu91vXhpgtqXcRgxDXg9QA_lv3Qistb'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
