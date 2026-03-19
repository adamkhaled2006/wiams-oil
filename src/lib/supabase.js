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
  hero_note: "شحن أنيق وتجربة فاخرة",
  instagram_url: "",
  snapchat_url: "",
  tiktok_url: "",
  facebook_url: "",
  telegram_url: "",
  logo_url: "",
  slider_images: "",
  hero_image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80",
  hero_image_1_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80",
  hero_image_2_url: "https://images.unsplash.com/photo-1615634262417-0f2d4f16c93c?auto=format&fit=crop&w=1600&q=80",
  hero_image_3_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1600&q=80",
  hero_image_4_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80"
};
