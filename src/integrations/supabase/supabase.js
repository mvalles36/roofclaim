import { createClient } from '@supabase/supabase-js'

const SUPABASE_KEY = 'VITE_SUPABASE_CLIENT_ANON_KEY'
const SUPABASE_URL = 'https://kblvkvmblwomrwlscqfv.supabase.co'
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);
