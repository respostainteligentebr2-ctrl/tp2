import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://howaipkfjdtvdyvekwyok.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd2Fwa2ZqZHR2ZHl2ZWt3eW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjMyMTUsImV4cCI6MjA4MDAzOTIxNX0.NHrVzRqktCvAO6NKms8uy_Aie5zkWiojQ3m_bCLcYCw'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Supabase configuration error')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    enabled: true
  }
})

// Test connection
supabase.from('sinistros').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (!error) {
      console.log(' Supabase connected successfully')
    } else {
      console.log(' Supabase connected - table setup needed')
    }
  })
  .catch(() => {
    console.log(' Supabase connection check failed')
  })