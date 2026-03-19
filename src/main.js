import "./styles.css";
import { supabase, hasSupabaseConfig, DEFAULT_SETTINGS } from "./lib/supabase.js";
import { money, sanitizeWhatsapp, showToast, setTheme } from "./lib/utils.js";

document.querySelector("#app").innerHTML = `
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">
      <span class="brand-badge">W</span>
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

<section class="showcase">
  <div class="container">
    <div class="showcase-grid">
      <div class="showcase-media">
        <div class="showcase-slider" id="heroSlider"></div>
      </div>

      <div class="showcase-copy">
        <span class="showcase-badge">منتجات مختارة بعناية</span>
        <h2 id="heroTitle">كل ما يحتاجه بيتك من روائح وأناقة</h2>
        <p id="heroSubtitle">اكتشف تشكيلة من الزيوت العطرية، العطور والمباخر مع إمكانية الطلب السريع عبر واتساب.</p>
        <div class="showcase-actions">
          <a class="btn" href="#products">تصفح المنتجات</a>
          <a class="ghost-btn" id="waTop" href="#" target="_blank" rel="noreferrer">اطلب عبر واتساب</a>
        </div>

        <div class="showcase-stats">
          <div class="show-stat">
            <strong id="productsCount">0</strong>
            <span>منتج متنوع</span>
          </div>
          <div class="show-stat">
            <strong>24/7</strong>
            <span>استقبال طلبات</span>
          </div>
          <div class="show-stat">
            <strong>100%</strong>
            <span>طلب عبر واتساب</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="filters-wrap" id="products">
  <div class="container">
    <div class="filters">
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

<footer class="footer">
  <div class="container">
    <div class="glass-card footer-bar">
      <div class="footer-brand">
        <strong id="footerStore">متجر ويام</strong>
        <div class="muted" id="footerTagline">زيوت عطرية، عطور، مباخر ومزهريات بلمسة فاخرة</div>
      </div>
      <div class="footer-actions">
        <a class="ghost-btn" id="waFooter" href="#" target="_blank" rel="noreferrer">واتساب</a>
        <div class="social-links" id="socialLinks"></div>
      </div>
    </div>
  </div>
</footer>

<div class="toast" id="toast"></div>
`;

const $ = (s) => document.querySelector(s);
const els = {
  storeName: $("#storeName"),
  footerStore: $("#footerStore"),
  storeTagline: $("#storeTagline"),
  heroTitle: $("#heroTitle"),
  heroSubtitle: $("#heroSubtitle"),
  waTop: $("#waTop"),
  waFooter: $("#waFooter"),
  socialLinks: $("#socialLinks"),
  footerTagline: $("#footerTagline"),
  heroSlider: $("#heroSlider"),
  productsGrid: $("#productsGrid"),
  emptyBox: $("#emptyBox"),
  searchInput: $("#searchInput"),
  categoryFilter: $("#categoryFilter"),
  sortFilter: $("#sortFilter"),
  productsCount: $("#productsCount"),
  categoriesCount: $("#categoriesCount"),
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

function renderSocialLinks() {
  const links = [
    { key: "instagram_url", label: "Instagram" },
    { key: "snapchat_url", label: "Snapchat" },
    { key: "tiktok_url", label: "TikTok" },
    { key: "facebook_url", label: "Facebook" },
    { key: "telegram_url", label: "Telegram" }
  ].filter(item => String(settings[item.key] || "").trim());

  els.socialLinks.innerHTML = "";
  els.socialLinks.style.display = links.length ? "flex" : "none";
  links.forEach(item => {
    const a = document.createElement("a");
    a.className = "social-link";
    a.href = settings[item.key];
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = item.label;
    els.socialLinks.appendChild(a);
  });
}


const FALLBACK_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1601295452898-7dfe8a9d7fc3?auto=format&fit=crop&w=1200&q=80"
];
let heroTimer = null;
function getHeroImages() {
  const fromProducts = products.map(p => p.image).filter(Boolean).slice(0,4);
  return (fromProducts.length ? fromProducts : FALLBACK_HERO_IMAGES).slice(0,4);
}
function renderHeroSlider() {
  if (!els.heroSlider) return;
  const images = getHeroImages();
  els.heroSlider.innerHTML = images.map(src => `<div class="hero-slide" style="background-image:url('${src}')"></div>`).join("");
  let index = 0;
  const update = () => {
    els.heroSlider.style.transform = `translateX(-${index * 100}%)`;
  };
  update();
  if (heroTimer) clearInterval(heroTimer);
  if (images.length > 1) {
    heroTimer = setInterval(() => {
      index = (index + 1) % images.length;
      update();
    }, 3500);
  }
}

function applySettings() {
  setTheme(settings);
  document.title = settings.store_name || DEFAULT_SETTINGS.store_name;
  els.storeName.textContent = settings.store_name || DEFAULT_SETTINGS.store_name;
  els.footerStore.textContent = settings.store_name || DEFAULT_SETTINGS.store_name;
  els.storeTagline.textContent = settings.tagline || DEFAULT_SETTINGS.tagline;
  els.footerTagline.textContent = settings.tagline || DEFAULT_SETTINGS.tagline;
  els.heroTitle.textContent = settings.hero_title || DEFAULT_SETTINGS.hero_title;
  els.heroSubtitle.textContent = settings.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle;
  els.waTop.href = waLink();
  els.waFooter.href = waLink();
  renderSocialLinks();
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
  els.productsCount.textContent = products.length;
  els.categoriesCount.textContent = categories.length;
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
  els.productsCount.textContent = products.length;
  renderHeroSlider();
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
  // لا نحدّث مخزون المنتجات من واجهة الزبون لأن سياسات Supabase تمنع ذلك للمستخدم العام.
  // الطلب ينحفظ هنا، وتعديل المخزون يتم من لوحة الأدمن لاحقًا أو عبر باك إند آمن.
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
  renderHeroSlider();
  await loadSettings();
  await loadProducts();
})();
