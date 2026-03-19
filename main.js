// Replace this with your Supabase settings
const settings = {
  hero_image_1_url: "",
  hero_image_1_title: "",
  hero_image_1_text: "",

  hero_image_2_url: "",
  hero_image_2_title: "",
  hero_image_2_text: "",

  hero_image_3_url: "",
  hero_image_3_title: "",
  hero_image_3_text: "",

  hero_image_4_url: "",
  hero_image_4_title: "",
  hero_image_4_text: ""
};

function startHeroSlider(settings) {
  const slides = [
    { img: settings.hero_image_1_url, title: settings.hero_image_1_title, text: settings.hero_image_1_text },
    { img: settings.hero_image_2_url, title: settings.hero_image_2_title, text: settings.hero_image_2_text },
    { img: settings.hero_image_3_url, title: settings.hero_image_3_title, text: settings.hero_image_3_text },
    { img: settings.hero_image_4_url, title: settings.hero_image_4_title, text: settings.hero_image_4_text }
  ].filter(s => s.img);

  const slider = document.getElementById("slider");
  const title = document.getElementById("heroTitle");
  const text = document.getElementById("heroText");

  slider.innerHTML = "";

  slides.forEach(slide => {
    const div = document.createElement("div");
    div.className = "slide";
    div.style.backgroundImage = `url(${slide.img})`;
    slider.appendChild(div);
  });

  let index = 0;

  function update() {
    slider.style.transform = `translateX(-${index * 100}%)`;
    title.textContent = slides[index].title || "";
    text.textContent = slides[index].text || "";
  }

  update();

  setInterval(() => {
    index = (index + 1) % slides.length;
    update();
  }, 4000);
}

startHeroSlider(settings);
