import { supabase } from "./lib/supabase.js";

async function load() {
  const { data } = await supabase.from("store_settings").select("*").eq("id",1).single();

  document.getElementById("logo").src = data.logo_url;

  const images = [
    data.hero_image_1_url,
    data.hero_image_2_url,
    data.hero_image_3_url,
    data.hero_image_4_url
  ];

  const slider = document.getElementById("slider");

  images.forEach(img=>{
    const d=document.createElement("div");
    d.className="slide";
    d.style.backgroundImage=`url(${img})`;
    slider.appendChild(d);
  });

  let i=0;
  setInterval(()=>{
    i=(i+1)%images.length;
    slider.style.transform=`translateX(-${i*100}%)`;
  },4000);
}

load();
