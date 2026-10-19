// Supabase project for Mission RRB. The anon key is designed to be public: the database rules in
// supabase/schema.sql are what protect people's data. Never put the service_role key here.
export const SUPABASE_URL = 'https://dadvdkqlvqsutabpaliy.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZHZka3FsdnFzdXRhYnBhbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTczMTEsImV4cCI6MjEwNzk5MzMxMX0.N-3JDuat1x8dblW5yrIC6GckYUsPoZPFTLIPpv3k2_Q'

// Show the "Continue with Google" button only after Google sign-in is enabled in Supabase (Authentication > Providers).
export const ENABLE_GOOGLE = false
