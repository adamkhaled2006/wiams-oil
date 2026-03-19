import { supabase } from "./lib/supabase.js";

window.save = async () => {
  await supabase.from("store_settings").update({
    logo_url: document.getElementById("logo_url").value,
    hero_image_1_url: document.getElementById("hero1").value,
    hero_image_2_url: document.getElementById("hero2").value,
    hero_image_3_url: document.getElementById("hero3").value,
    hero_image_4_url: document.getElementById("hero4").value
  }).eq("id",1);

  alert("تم الحفظ");
};
