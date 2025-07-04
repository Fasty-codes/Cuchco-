import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqvogdritdgszlakrepg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxdm9nZHJpdGRnc3psYWtyZXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODU4MjgsImV4cCI6MjA2Njk2MTgyOH0.sSQYXGUblOFXEbRrq8coSbUaRLDT43uZnrZg2umAwCE';

export const supabase = createClient(supabaseUrl, supabaseKey); 