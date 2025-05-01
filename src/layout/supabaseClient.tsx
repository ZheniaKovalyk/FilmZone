import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://oppoqieldjzjfknpxkin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcG9xaWVsZGp6amZrbnB4a2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODM1MzEsImV4cCI6MjA2MDM1OTUzMX0.ogqXSNAPEpAPwlJs_6PdiKXk7dOPFhWkhTFK-4ekOXs'; // ❗ Раджу не включати ключі прямо в код

export const supabase = createClient(supabaseUrl, supabaseKey);