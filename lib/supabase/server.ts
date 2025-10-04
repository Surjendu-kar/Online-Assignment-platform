import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Server-side client with service role key (full access)
export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Disable auth for server client
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  }
})