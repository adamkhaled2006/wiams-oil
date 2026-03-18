import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const hasSupabaseConfig = () => Boolean(supabaseUrl && supabaseKey);

export const supabase = hasSupabaseConfig()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

export const DEFAULT_SETTINGS = {
  store_name: "متجر ويام",
  tagline: "زيوت عطرية، عطور، مباخر ومزهريات بلمسة فاخرة",
  hero_title: "روائح فاخرة ومنتجات مميزة تصل لزبونك بسهولة",
  hero_subtitle: "متجر احترافي مع سلة، طلبات، مخزون، حالة Sold Out، ولوحة تحكم بسيطة.",
  whatsapp_number: "",
  primary_color: "#6f4e37",
  accent_color: "#d8c1a8",
  hero_note: "شحن أنيق وتجربة فاخرة"
};
