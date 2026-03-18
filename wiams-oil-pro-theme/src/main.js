import "./styles.css";
import { supabase, hasSupabaseConfig, DEFAULT_SETTINGS } from "./lib/supabase.js";
import { money, showToast, sanitizeWhatsapp, buildOrderWhatsappText, applyTheme } from "./lib/utils.js";

const els = {
  productsGrid: document.getElementById("productsGrid"),
  emptyState: document.getElementById("emptyState"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  sortFilter: document.getElementById("sortFilter"),
  cartButton: document.getElementById("cartButton"),
  cartCount: document.getElementById("cartCount"),
  cartDrawer: document.getElementById("cartDrawer"),
  overlay: document.getElementById("overlay"),
  closeCart: document.getElementById("closeCart"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  checkoutToggle: document.getElementById("checkoutToggle"),
  checkoutForm: document.getElementById("checkoutForm"),
  checkoutWhatsapp: document.getElementById("checkoutWhatsapp"),
  toast: document.getElementById("toast"),
  storeName: document.getElementById("storeName"),
  storeTagline: document.getElementById("storeTagline"),
  heroTitle: document.getElementById("heroTitle"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  footerStoreName: document.getElementById("footerStoreName"),
  footerText: document.getElementById("footerText"),
  whatsappLink: document.getElementById("whatsappLink"),
  footerWhatsapp: document.getElementById("footerWhatsapp"),
  productsStat: document.getElementById("productsStat"),
  categoriesStat: document.getElementById("categoriesStat")
};

let products = [];
let settings = { ...DEFAULT_SETTINGS };
let cart = JSON.parse(localStorage.getItem("wiams-cart") || "[]");

function saveCart() {
  localStorage.setItem("wiams-cart", JSON.stringify(cart));
  els.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
}

function openCart() {
  els.cartDrawer.classList.add("open");
  els.overlay.classList.add("show");
}
function closeCart() {
  els.cartDrawer.classList.remove("open");
  els.overlay.classList.remove("show");
}

function whatsappUrl() {
  const number = sanitizeWhatsapp(settings.whatsapp_number);
  return number ? `https://wa.me/${number}` : "#";
}

function applySettings() {
  applyTheme(settings);
  document.title = settings.store_name || "متجر ويام";
  els.storeName.textContent = settings.store_name || DEFAULT_SETTINGS.store_name;
  els.footerStoreName.textContent = settings.store_name || DEFAULT_SETTINGS.store_name;
  els.storeTagline.textContent = settings.tagline || DEFAULT_SETTINGS.tagline;
  els.heroTitle.textContent = settings.hero_title || DEFAULT_SETTINGS.hero_title;
  els.heroSubtitle.textContent = settings.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle;
  els.footerText.textContent = "نسخة متجر مرتبطة بقاعدة بيانات وقابلة للتعديل من لوحة الأدمن.";
  els.whatsappLink.href = whatsappUrl();
  els.footerWhatsapp.href = whatsappUrl();
}

function renderProducts() {
  const search = els.searchInput.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const sort = els.sortFilter.value;

  let filtered = products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search);

    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  filtered.sort((a, b) => {
    if (sort === "price-asc") return Number(a.price) - Number(b.price);
    if (sort === "price-desc") return Number(b.price) - Number(a.price);
    if (sort === "stock") return Number(b.stock || 0) - Number(a.stock || 0);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  els.productsGrid.innerHTML = "";
  els.emptyState.classList.toggle("hidden", filtered.length > 0);

  filtered.forEach((product) => {
    const soldOut = product.sold_out || Number(product.stock || 0) <= 0;
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80"}" alt="${product.name}" />
        <div class="badge-row">
          <span class="badge">${product.category || "منتج"}</span>
          ${soldOut ? '<span class="badge sold">Sold Out</span>' : ""}
        </div>
      </div>
      <div class="product-content">
        <div>
          <h3 class="product-title">${product.name}</h3>
          <div class="product-category">${product.category || ""}</div>
        </div>
        <p class="product-desc">${product.description || ""}</p>
        <div class="price-row">
          <span class="price">${money(product.price)}</span>
          ${product.old_price ? `<span class="old-price">${money(product.old_price)}</span>` : ""}
        </div>
        <div class="stock-row">
          <span>المتوفر: ${Number(product.stock || 0)}</span>
          <span>${soldOut ? "غير متوفر" : "جاهز للطلب"}</span>
        </div>
        <div class="qty-controls">
          <button type="button" data-action="minus">-</button>
          <input type="number" min="1" max="${Math.max(Number(product.stock || 1), 1)}" value="1" ${soldOut ? "disabled" : ""} />
          <button type="button" data-action="plus">+</button>
        </div>
        <button class="primary-btn full-width add-to-cart" ${soldOut ? "disabled" : ""}>أضف للسلة</button>
      </div>
    `;
    const qtyInput = card.querySelector("input");
    card.querySelector('[data-action="minus"]').onclick = () => {
      qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
    };
    card.querySelector('[data-action="plus"]').onclick = () => {
      qtyInput.value = Math.min(Number(product.stock || 1), Number(qtyInput.value) + 1);
    };
    card.querySelector(".add-to-cart").onclick = () => {
      const quantity = Math.max(1, Math.min(Number(product.stock || 1), Number(qtyInput.value)));
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, Number(product.stock || 0));
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity,
          stock: Number(product.stock || 0)
        });
      }
      saveCart();
      renderCart();
      showToast(els.toast, "تمت إضافة المنتج إلى السلة");
      openCart();
    };
    els.productsGrid.appendChild(card);
  });

  const categories = [...new Set(products.map((item) => item.category).filter(Boolean))];
  const currentValue = els.categoryFilter.value;
  els.categoryFilter.innerHTML = `<option value="all">كل الأقسام</option>` +
    categories.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
  if (categories.includes(currentValue)) {
    els.categoryFilter.value = currentValue;
  }
  els.productsStat.textContent = String(products.length);
  els.categoriesStat.textContent = String(categories.length);
}

function renderCart() {
  saveCart();
  els.cartItems.innerHTML = "";
  if (!cart.length) {
    els.cartItems.innerHTML = `<div class="empty-state">السلة فارغة.</div>`;
    els.cartTotal.textContent = money(0);
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-top">
        <div>
          <strong>${item.name}</strong>
          <div class="muted">${money(item.price)} للقطعة</div>
        </div>
        <button class="icon-btn" type="button">✕</button>
      </div>
      <div class="qty-controls" style="margin-top:12px">
        <button type="button" data-action="minus">-</button>
        <input type="number" min="1" max="${item.stock || 1}" value="${item.quantity}" />
        <button type="button" data-action="plus">+</button>
      </div>
    `;
    row.querySelector(".icon-btn").onclick = () => {
      cart = cart.filter((x) => x.id !== item.id);
      renderCart();
    };
    const input = row.querySelector("input");
    row.querySelector('[data-action="minus"]').onclick = () => {
      item.quantity = Math.max(1, item.quantity - 1);
      input.value = item.quantity;
      renderCart();
    };
    row.querySelector('[data-action="plus"]').onclick = () => {
      item.quantity = Math.min(item.stock || 1, item.quantity + 1);
      input.value = item.quantity;
      renderCart();
    };
    input.onchange = () => {
      item.quantity = Math.max(1, Math.min(Number(item.stock || 1), Number(input.value)));
      renderCart();
    };
    els.cartItems.appendChild(row);
  });

  els.cartTotal.textContent = money(cartTotal());
}

async function loadSettings() {
  if (!hasSupabaseConfig()) return;
  const { data, error } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  if (!error && data) {
    settings = { ...DEFAULT_SETTINGS, ...data };
  }
  applySettings();
}

async function loadProducts() {
  if (!hasSupabaseConfig()) {
    showToast(els.toast, "أضف مفاتيح Supabase أولًا");
    return;
  }
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    showToast(els.toast, "تعذر تحميل المنتجات");
    return;
  }
  products = data || [];
  renderProducts();
}

async function createOrder(formData) {
  const orderPayload = {
    customer_name: formData.get("customer_name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    total_price: cartTotal(),
    status: "new"
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) throw orderError;

  const itemsPayload = cart.map((item) => ({
    order_id: order.id,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
  if (itemsError) throw itemsError;

  for (const item of cart) {
    const product = products.find((p) => p.id === item.id);
    if (!product) continue;
    const nextStock = Math.max(0, Number(product.stock || 0) - Number(item.quantity));
    const { error: updateError } = await supabase
      .from("products")
      .update({ stock: nextStock, sold_out: nextStock <= 0 ? true : product.sold_out })
      .eq("id", item.id);
    if (updateError) throw updateError;
  }

  const number = sanitizeWhatsapp(settings.whatsapp_number);
  if (number) {
    els.checkoutWhatsapp.href = `https://wa.me/${number}?text=${buildOrderWhatsappText(settings, orderPayload, itemsPayload)}`;
    els.checkoutWhatsapp.classList.remove("hidden");
  }
  cart = [];
  saveCart();
  renderCart();
  closeCart();
  await loadProducts();
  return order;
}

function bindEvents() {
  els.searchInput.addEventListener("input", renderProducts);
  els.categoryFilter.addEventListener("change", renderProducts);
  els.sortFilter.addEventListener("change", renderProducts);

  els.cartButton.onclick = openCart;
  els.closeCart.onclick = closeCart;
  els.overlay.onclick = closeCart;
  els.checkoutToggle.onclick = () => els.checkoutForm.classList.toggle("hidden");

  els.checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!cart.length) {
      showToast(els.toast, "السلة فارغة");
      return;
    }
    try {
      const formData = new FormData(e.currentTarget);
      await createOrder(formData);
      e.currentTarget.reset();
      showToast(els.toast, "تم حفظ الطلب بنجاح");
    } catch (error) {
      console.error(error);
      showToast(els.toast, "فشل حفظ الطلب. تأكد من إعدادات Supabase والجداول");
    }
  });
}

async function init() {
  applySettings();
  renderCart();
  bindEvents();
  await loadSettings();
  await loadProducts();
}

init();
