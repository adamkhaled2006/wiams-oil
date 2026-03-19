import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "YOUR_URL";
const supabaseKey = "YOUR_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);
