import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
  throw new Error('Supabase configuration error')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
  realtime: {
    enabled: true
  }
})

// Test connection (non-blocking)
supabase.from('sinistros').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (!error) {
      console.log('✓ Supabase connected successfully')
    } else {
      console.warn('⚠ Supabase connection check: table may not exist yet')
    }
  })
  .catch((err) => {
    console.warn('⚠ Supabase connection check failed:', err.message)
  })