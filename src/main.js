
import "./styles.css";
import { supabase, hasSupabaseConfig, DEFAULT_SETTINGS } from "./lib/supabase.js";
import { money, sanitizeWhatsapp, showToast, setTheme } from "./lib/utils.js";

document.querySelector("#app").innerHTML = `
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">
      <span class="brand-badge" id="brandBadge">W</span>
      <img class="brand-logo hidden" id="brandLogo" alt="شعار المتجر">
      <div>
        <h1 id="storeName">متجر ويام</h1>
        <p id="storeTagline">زيوت عطرية، عطور، مباخر ومزهريات بلمسة فاخرة</p>
      </div>
    </a>
    <div class="header-actions">
      <a class="ghost-btn" href="#products">المنتجات</a>
      <a class="ghost-btn" href="/admin.html">لوحة الأدمن</a>
      <button class="btn cart-pill" id="openCart">السلة <span class="count" id="cartCount">0</span></button>
    </div>
  </div>
</header>

<section class="hero hero-split">
  <div class="container">
    <div class="hero-shell">
      <div class="hero-copy-card">
        <div class="hero-copy-top">
          <span class="hero-badge">منتجات مختارة بعناية</span>
          <h2 class="hero-title-fixed">كل ما يحتاجه بيتك من روائح وأناقة</h2>
          <p class="hero-text-fixed">اكتشف تشكيلة من الزيوت العطرية، العطور، المباخر والمزهريات مع إمكانية الطلب السريع عبر واتساب.</p>
          <div class="hero-cta">
            <a class="btn" href="#products">تصفح المنتجات</a>
            <a class="ghost-btn" id="waTop" href="#" target="_blank" rel="noreferrer">اطلب عبر واتساب</a>
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat-box">
            <strong id="heroWhatsAppStat">100%</strong>
            <span>طلب عبر واتساب</span>
          </div>
          <div class="hero-stat-box">
            <strong>24/7</strong>
            <span>استقبال طلبات</span>
          </div>
          <div class="hero-stat-box">
            <strong id="heroProductsCount">0</strong>
            <span>منتج متنوع</span>
          </div>
        </div>
      </div>

      <div class="hero-slider-card split-slider-card">
        <div class="hero-slider" id="heroSlider"></div>
        <div class="hero-dots hero-dots-split" id="heroDots"></div>
      </div>
    </div>
  </div>
</section>

<section class="filters-wrap filters-floating" id="products">
  <div class="container">
    <div class="filters filters-card-floating">
      <input class="input" id="searchInput" placeholder="ابحث عن منتج..." />
      <select class="select" id="categoryFilter"><option value="all">كل الأقسام</option></select>
      <select class="select" id="sortFilter">
        <option value="newest">الأحدث</option>
        <option value="price-asc">السعر: الأقل</option>
        <option value="price-desc">السعر: الأعلى</option>
        <option value="stock">الأوفر بالمخزون</option>
      </select>
    </div>
  </div>
</section>

<main class="main-section">
  <div class="container">
    <div class="products-grid" id="productsGrid"></div>
    <div class="empty hidden" id="emptyBox">لا يوجد منتجات مطابقة.</div>
  </div>
</main>

<aside class="drawer" id="cartDrawer">
  <div class="drawer-head">
    <strong>سلة المشتريات</strong>
    <button class="icon-btn" id="closeCart">✕</button>
  </div>
  <div class="drawer-items" id="cartItems"></div>
  <div class="drawer-foot">
    <div><div class="muted">المجموع</div><strong id="cartTotal">0.00 ₪</strong></div>
    <button class="btn" id="toggleCheckout">إتمام الطلب</button>
  </div>
  <form class="checkout-form hidden" id="checkoutForm">
    <h4>بيانات الطلب</h4>
    <input class="input" name="customer_name" placeholder="الاسم الكامل" required />
    <input class="input" name="phone" placeholder="رقم الجوال" required />
    <input class="input" name="address" placeholder="العنوان" required />
    <textarea class="input" name="notes" placeholder="ملاحظات إضافية (اختياري)"></textarea>
    <button class="btn full" type="submit">تأكيد الطلب عبر واتساب</button>
  </form>
</aside>
<div class="overlay" id="overlay"></div>

<footer class="footer footer-clean">
  <div class="container footer-clean-wrap">
    <a class="ghost-btn" id="waFooter" href="#" target="_blank" rel="noreferrer">واتساب</a>
    <div class="social-links" id="socialLinks"></div>
  </div>
</footer>

<div class="toast" id="toast"></div>
`;

const $ = (s) => document.querySelector(s);
const els = {
  storeName: $("#storeName"),
  storeTagline: $("#storeTagline"),
  brandBadge: $("#brandBadge"),
  brandLogo: $("#brandLogo"),
  heroSlider: $("#heroSlider"),
  heroDots: $("#heroDots"),
  heroProductsCount: $("#heroProductsCount"),
  waTop: $("#waTop"),
  waFooter: $("#waFooter"),
  socialLinks: $("#socialLinks"),
  productsGrid: $("#productsGrid"),
  emptyBox: $("#emptyBox"),
  searchInput: $("#searchInput"),
  categoryFilter: $("#categoryFilter"),
  sortFilter: $("#sortFilter"),
  openCart: $("#openCart"),
  closeCart: $("#closeCart"),
  cartDrawer: $("#cartDrawer"),
  overlay: $("#overlay"),
  cartItems: $("#cartItems"),
  cartTotal: $("#cartTotal"),
  cartCount: $("#cartCount"),
  toggleCheckout: $("#toggleCheckout"),
  checkoutForm: $("#checkoutForm"),
  toast: $("#toast")
};

let products = [];
let settings = { ...DEFAULT_SETTINGS };
let cart = JSON.parse(localStorage.getItem("wiams-cart") || "[]");
let heroSlides = [];
let heroIndex = 0;
let heroTimer = null;

function saveCart() {
  localStorage.setItem("wiams-cart", JSON.stringify(cart));
  els.cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
}
function totalCart() {
  return cart.reduce((a, b) => a + Number(b.price) * b.quantity, 0);
}
function waLink() {
  const n = sanitizeWhatsapp(settings.whatsapp_number);
  return n ? `https://wa.me/${n}` : "#";
}
function getHeroImages() {
  const sliderImages = String(settings.slider_images || "")
    .split(/\r?\n|,/)
    .map(v => String(v || "").trim())
    .filter(Boolean);

  if (sliderImages.length) return sliderImages;

  return [
    settings.hero_image_1_url || settings.hero_image_url || DEFAULT_SETTINGS.hero_image_1_url,
    settings.hero_image_2_url || DEFAULT_SETTINGS.hero_image_2_url,
    settings.hero_image_3_url || DEFAULT_SETTINGS.hero_image_3_url,
    settings.hero_image_4_url || DEFAULT_SETTINGS.hero_image_4_url
  ].map(v => String(v || "").trim()).filter(Boolean);
}
function renderHeroDots() {
  els.heroDots.innerHTML = "";
  heroSlides.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `hero-dot${idx === heroIndex ? " is-active" : ""}`;
    btn.setAttribute("aria-label", `الصورة ${idx + 1}`);
    btn.onclick = () => setHeroSlide(idx, true);
    els.heroDots.appendChild(btn);
  });
}
function setHeroSlide(index, restart = false) {
  if (!heroSlides.length) return;
  heroIndex = ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, idx) => slide.classList.toggle("is-active", idx === heroIndex));
  [...els.heroDots.children].forEach((dot, idx) => dot.classList.toggle("is-active", idx === heroIndex));
  if (restart) startHeroSlider();
}
function startHeroSlider() {
  if (heroTimer) clearInterval(heroTimer);
  if (heroSlides.length <= 1) return;
  heroTimer = setInterval(() => setHeroSlide(heroIndex + 1), 3500);
}
function applyHeroImages() {
  const images = getHeroImages();
  els.heroSlider.innerHTML = images.map((src, idx) => `
    <img class="hero-image hero-slide${idx === 0 ? " is-active" : ""}" src="${src}" alt="صورة سلايدر ${idx + 1}">
  `).join("");
  heroSlides = Array.from(els.heroSlider.querySelectorAll(".hero-slide"));
  heroIndex = 0;
  renderHeroDots();
  startHeroSlider();
}
function renderSocialLinks() {
  const links = [
    { key: "instagram_url", label: "Instagram", icon: "📸" },
    { key: "snapchat_url", label: "Snapchat", icon: "👻" },
    { key: "tiktok_url", label: "TikTok", icon: "🎵" },
    { key: "facebook_url", label: "Facebook", icon: "f" },
    { key: "telegram_url", label: "Telegram", icon: "✈️" }
  ].filter(item => String(settings[item.key] || "").trim());

  els.socialLinks.innerHTML = "";
  links.forEach(item => {
    const a = document.createElement("a");
    a.className = "social-link";
    a.href = settings[item.key];
    a.target = "_blank";
    a.rel = "noreferrer";
    a.innerHTML = `<span class="social-icon">${item.icon}</span><span>${item.label}</span>`;
    els.socialLinks.appendChild(a);
  });
}
function applyLogo() {
  const logo = String(settings.logo_url || "").trim();
  if (logo) {
    els.brandLogo.src = logo;
    els.brandLogo.classList.remove("hidden");
    els.brandBadge.classList.add("hidden");
  } else {
    els.brandLogo.classList.add("hidden");
    els.brandBadge.classList.remove("hidden");
  }
}
function applySettings() {
  setTheme(settings);
  document.title = settings.store_name || DEFAULT_SETTINGS.store_name;
  els.storeName.textContent = settings.store_name || DEFAULT_SETTINGS.store_name;
  els.storeTagline.textContent = settings.tagline || DEFAULT_SETTINGS.tagline;
  applyLogo();
  applyHeroImages();
  els.waTop.href = waLink();
  els.waFooter.href = waLink();
  renderSocialLinks();
}
function updateHeroStats() {
  els.heroProductsCount.textContent = String(products.length);
}
function openDrawer() {
  els.cartDrawer.classList.add("open");
  els.overlay.classList.add("show");
}
function closeDrawer() {
  els.cartDrawer.classList.remove("open");
  els.overlay.classList.remove("show");
}
function buildWAOrder(order, items) {
  const rows = [
    `🛒 طلب جديد من ${order.customer_name}`,
    `📞 الهاتف: ${order.phone}`,
    `📍 العنوان: ${order.address}`,
    order.notes ? `📝 ملاحظات: ${order.notes}` : null,
    `💰 المجموع: ${Number(order.total_price).toFixed(2)} ₪`,
    "",
    "📦 المنتجات:"
  ].filter(Boolean);
  items.forEach(i => rows.push(`- ${i.product_name} × ${i.quantity} = ${(Number(i.price) * Number(i.quantity)).toFixed(2)} ₪`));
  return encodeURIComponent(rows.join("\n"));
}
function renderProducts() {
  const search = els.searchInput.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const sort = els.sortFilter.value;
  let list = products.filter(p => {
    const okSearch = !search || [p.name, p.description, p.category].filter(Boolean).join(" ").toLowerCase().includes(search);
    const okCat = category === "all" || p.category === category;
    return okSearch && okCat;
  });
  list.sort((a,b) => {
    if (sort === "price-asc") return Number(a.price)-Number(b.price);
    if (sort === "price-desc") return Number(b.price)-Number(a.price);
    if (sort === "stock") return Number(b.stock||0)-Number(a.stock||0);
    return new Date(b.created_at||0)-new Date(a.created_at||0);
  });

  els.productsGrid.innerHTML = "";
  els.emptyBox.classList.toggle("hidden", list.length > 0);
  list.forEach(p => {
    const sold = p.sold_out || Number(p.stock || 0) <= 0;
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <img src="${p.image || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80"}" alt="${p.name}">
        <div class="badges">
          <span class="badge">${p.category || "منتج"}</span>
          ${sold ? `<span class="badge sold">Sold Out</span>` : ""}
        </div>
      </div>
      <div class="product-body">
        <div>
          <h3 class="product-title">${p.name}</h3>
          <div class="product-cat">${p.category || ""}</div>
        </div>
        <div class="product-desc">${p.description || ""}</div>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          ${p.old_price ? `<span class="old-price">${money(p.old_price)}</span>` : ""}
        </div>
        <div class="stock-line">
          <span>المتوفر: ${Number(p.stock || 0)}</span>
          <span>${sold ? "غير متوفر" : "جاهز للطلب"}</span>
        </div>
        <div class="qty-wrap">
          <button type="button" data-minus>-</button>
          <input value="1" min="1" max="${Math.max(1, Number(p.stock || 1))}" ${sold ? "disabled" : ""}>
          <button type="button" data-plus>+</button>
        </div>
        <button class="btn full add" ${sold ? "disabled" : ""}>أضف للسلة</button>
      </div>
    `;
    const input = card.querySelector("input");
    card.querySelector("[data-minus]").onclick = ()=> input.value = Math.max(1, Number(input.value)-1);
    card.querySelector("[data-plus]").onclick = ()=> input.value = Math.min(Number(p.stock || 1), Number(input.value)+1);
    card.querySelector(".add").onclick = () => {
      const qty = Math.max(1, Math.min(Number(p.stock || 1), Number(input.value)));
      const exists = cart.find(i => i.id === p.id);
      if (exists) exists.quantity = Math.min(exists.quantity + qty, Number(p.stock || 0));
      else cart.push({ id:p.id, name:p.name, price:Number(p.price), quantity:qty, stock:Number(p.stock || 0) });
      saveCart();
      renderCart();
      showToast(els.toast, "تمت إضافة المنتج");
      openDrawer();
    };
    els.productsGrid.appendChild(card);
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const prev = els.categoryFilter.value;
  els.categoryFilter.innerHTML = `<option value="all">كل الأقسام</option>` + categories.map(c=>`<option value="${c}">${c}</option>`).join("");
  if (categories.includes(prev)) els.categoryFilter.value = prev;
  updateHeroStats();
}
function renderCart() {
  saveCart();
  els.cartItems.innerHTML = "";
  if (!cart.length) {
    els.cartItems.innerHTML = `<div class="empty">السلة فارغة.</div>`;
    els.cartTotal.textContent = money(0);
    return;
  }
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-top">
        <div><strong>${item.name}</strong><div class="muted">${money(item.price)} للقطعة</div></div>
        <button class="icon-btn">✕</button>
      </div>
      <div class="qty-wrap" style="margin-top:12px">
        <button type="button" data-minus>-</button>
        <input value="${item.quantity}" min="1" max="${Math.max(1, item.stock || 1)}">
        <button type="button" data-plus>+</button>
      </div>
    `;
    row.querySelector(".icon-btn").onclick = () => {
      cart = cart.filter(x => x.id !== item.id);
      renderCart();
    };
    const input = row.querySelector("input");
    row.querySelector("[data-minus]").onclick = ()=>{ item.quantity = Math.max(1, item.quantity-1); renderCart(); };
    row.querySelector("[data-plus]").onclick = ()=>{ item.quantity = Math.min(item.stock || 1, item.quantity+1); renderCart(); };
    input.onchange = ()=>{ item.quantity = Math.max(1, Math.min(item.stock || 1, Number(input.value))); renderCart(); };
    els.cartItems.appendChild(row);
  });
  els.cartTotal.textContent = money(totalCart());
}
async function loadSettings() {
  if (!hasSupabaseConfig()) return;
  const { data } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  if (data) settings = { ...DEFAULT_SETTINGS, ...data };
  applySettings();
}
async function loadProducts() {
  if (!hasSupabaseConfig()) {
    showToast(els.toast, "أضف مفاتيح Supabase أولًا");
    return;
  }
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending:false });
  if (error) {
    console.error(error);
    showToast(els.toast, "فشل تحميل المنتجات");
    return;
  }
  products = data || [];
  renderProducts();
}

async function submitOrder(fd) {
  const notes = fd.get("notes")?.trim() || "";
  const payload = {
    customer_name: fd.get("customer_name"),
    phone: fd.get("phone"),
    address: fd.get("address"),
    total_price: totalCart(),
    status: "new"
  };
  const { data: order, error } = await supabase.from("orders").insert(payload).select().single();
  if (error) throw error;
  const items = cart.map(i => ({ order_id: order.id, product_name: i.name, price: i.price, quantity: i.quantity }));
  const ins = await supabase.from("order_items").insert(items);
  if (ins.error) throw ins.error;
  const w = sanitizeWhatsapp(settings.whatsapp_number);
  if (!w) throw new Error("WhatsApp number is missing");
  const waUrl = `https://wa.me/${w}?text=${buildWAOrder({ ...payload, notes }, items)}`;

  cart = [];
  saveCart();
  renderCart();
  closeDrawer();
  await loadProducts();

  window.open(waUrl, "_blank", "noopener,noreferrer");
  showToast(els.toast, "تم حفظ الطلب وفتح واتساب ✅");
}
els.openCart.onclick = openDrawer;
els.closeCart.onclick = closeDrawer;
els.overlay.onclick = closeDrawer;
els.toggleCheckout.onclick = () => els.checkoutForm.classList.toggle("hidden");
els.searchInput.oninput = renderProducts;
els.categoryFilter.onchange = renderProducts;
els.sortFilter.onchange = renderProducts;
els.checkoutForm.onsubmit = async (e) => {
  e.preventDefault();
  if (!cart.length) return showToast(els.toast, "السلة فارغة");
  try {
    await submitOrder(new FormData(e.currentTarget));
    e.currentTarget.reset();
  } catch (err) {
    console.error(err);
    showToast(els.toast, err?.message || "فشل حفظ الطلب");
  }
};
(async function init(){
  applySettings();
  renderCart();
  updateHeroStats();
  await loadSettings();
  await loadProducts();
})();
