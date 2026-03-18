import "./styles.css";
import { supabase, hasSupabaseConfig, DEFAULT_SETTINGS } from "./lib/supabase.js";
import { showToast, applyTheme } from "./lib/utils.js";

const els = {
  authSection: document.getElementById("authSection"),
  dashboardSection: document.getElementById("dashboardSection"),
  loginForm: document.getElementById("loginForm"),
  logoutButton: document.getElementById("logoutButton"),
  productForm: document.getElementById("productForm"),
  deleteProductBtn: document.getElementById("deleteProductBtn"),
  resetProductForm: document.getElementById("resetProductForm"),
  productsTable: document.getElementById("productsTable"),
  ordersTable: document.getElementById("ordersTable"),
  settingsForm: document.getElementById("settingsForm"),
  uploadImageBtn: document.getElementById("uploadImageBtn"),
  imageUpload: document.getElementById("imageUpload"),
  toast: document.getElementById("toast")
};

let products = [];
let orders = [];
let settings = { ...DEFAULT_SETTINGS };

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function resetProductForm() {
  els.productForm.reset();
  els.productForm.querySelector('[name="id"]').value = "";
  els.deleteProductBtn.classList.add("hidden");
}

function ensureReady() {
  if (!hasSupabaseConfig()) {
    showToast(els.toast, "أضف VITE_SUPABASE_URL و VITE_SUPABASE_KEY في Vercel أولًا");
    return false;
  }
  return true;
}

async function uploadImage() {
  if (!ensureReady()) return;
  const file = els.imageUpload.files?.[0];
  if (!file) {
    showToast(els.toast, "اختر صورة أولًا");
    return;
  }
  const filePath = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase.storage.from("product-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) {
    console.error(error);
    showToast(els.toast, "فشل رفع الصورة. تأكد من وجود bucket باسم product-images");
    return;
  }
  const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
  els.productForm.querySelector('[name="image"]').value = data.publicUrl;
  showToast(els.toast, "تم رفع الصورة");
}

async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  products = data || [];
  renderProductsTable();
}

async function loadOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  orders = data || [];
  renderOrdersTable();
}

async function loadSettings() {
  const { data, error } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  if (!error && data) {
    settings = { ...DEFAULT_SETTINGS, ...data };
  }
  applyTheme(settings);
  for (const [key, value] of Object.entries(settings)) {
    const field = els.settingsForm.querySelector(`[name="${key}"]`);
    if (field) field.value = value ?? "";
  }
}

function renderProductsTable() {
  els.productsTable.innerHTML = "";
  if (!products.length) {
    els.productsTable.innerHTML = `<div class="empty-state">لا يوجد منتجات بعد.</div>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "table-card";
    card.innerHTML = `
      <h4>${product.name}</h4>
      <p>${product.category || ""} — ${Number(product.price || 0).toFixed(2)} ₪ — المخزون: ${product.stock ?? 0}</p>
    `;
    card.onclick = () => {
      for (const [key, value] of Object.entries(product)) {
        const field = els.productForm.querySelector(`[name="${key}"]`);
        if (!field) continue;
        if (field.type === "checkbox") field.checked = Boolean(value);
        else field.value = value ?? "";
      }
      els.deleteProductBtn.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    els.productsTable.appendChild(card);
  });
}

function renderOrdersTable() {
  els.ordersTable.innerHTML = "";
  if (!orders.length) {
    els.ordersTable.innerHTML = `<div class="empty-state">لا يوجد طلبات بعد.</div>`;
    return;
  }
  orders.forEach((order) => {
    const statusClass = order.status === "delivered" ? "status-delivered" : order.status === "processing" ? "status-processing" : "status-new";
    const card = document.createElement("div");
    card.className = "table-card";
    card.innerHTML = `
      <h4>${order.customer_name}</h4>
      <p>${order.phone} — ${order.address}</p>
      <p>المجموع: ${Number(order.total_price || 0).toFixed(2)} ₪</p>
      <span class="status-chip ${statusClass}">${order.status || "new"}</span>
      <div class="order-actions">
        <button class="ghost-btn" data-status="new">new</button>
        <button class="ghost-btn" data-status="processing">processing</button>
        <button class="ghost-btn" data-status="delivered">delivered</button>
      </div>
    `;
    card.querySelectorAll("[data-status]").forEach((btn) => {
      btn.onclick = async (e) => {
        const status = e.currentTarget.dataset.status;
        const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
        if (error) {
          console.error(error);
          showToast(els.toast, "فشل تحديث حالة الطلب");
          return;
        }
        showToast(els.toast, "تم تحديث حالة الطلب");
        await loadOrders();
      };
    });
    els.ordersTable.appendChild(card);
  });
}

async function saveProduct(e) {
  e.preventDefault();
  const raw = formToObject(els.productForm);
  const payload = {
    name: raw.name,
    price: Number(raw.price || 0),
    old_price: raw.old_price ? Number(raw.old_price) : null,
    category: raw.category,
    description: raw.description || null,
    image: raw.image || null,
    stock: Number(raw.stock || 0),
    sold_out: els.productForm.querySelector('[name="sold_out"]').checked
  };

  const id = raw.id;
  const query = id
    ? supabase.from("products").update(payload).eq("id", id)
    : supabase.from("products").insert(payload);

  const { error } = await query;
  if (error) {
    console.error(error);
    showToast(els.toast, "فشل حفظ المنتج");
    return;
  }
  showToast(els.toast, "تم حفظ المنتج");
  resetProductForm();
  await loadProducts();
}

async function deleteProduct() {
  const id = els.productForm.querySelector('[name="id"]').value;
  if (!id) return;
  const ok = window.confirm("متأكد أنك تريد حذف المنتج؟");
  if (!ok) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error(error);
    showToast(els.toast, "فشل حذف المنتج");
    return;
  }
  showToast(els.toast, "تم حذف المنتج");
  resetProductForm();
  await loadProducts();
}

async function saveSettings(e) {
  e.preventDefault();
  const payload = {
    ...DEFAULT_SETTINGS,
    ...formToObject(els.settingsForm),
    id: 1
  };
  const { error } = await supabase.from("store_settings").upsert(payload);
  if (error) {
    console.error(error);
    showToast(els.toast, "فشل حفظ الإعدادات. شغّل ملف SQL أولًا لإنشاء جدول store_settings");
    return;
  }
  settings = payload;
  applyTheme(settings);
  showToast(els.toast, "تم حفظ الإعدادات");
}

async function refreshDashboard() {
  await Promise.all([loadProducts(), loadOrders(), loadSettings()]);
}

function setAuthUI(loggedIn) {
  els.authSection.classList.toggle("hidden", loggedIn);
  els.dashboardSection.classList.toggle("hidden", !loggedIn);
  els.logoutButton.classList.toggle("hidden", !loggedIn);
}

async function login(e) {
  e.preventDefault();
  if (!ensureReady()) return;
  const formData = new FormData(els.loginForm);
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (error) {
    console.error(error);
    showToast(els.toast, "فشل تسجيل الدخول");
    return;
  }
  showToast(els.toast, "تم تسجيل الدخول");
  await refreshDashboard();
  setAuthUI(true);
}

async function init() {
  if (!ensureReady()) return;
  const { data } = await supabase.auth.getSession();
  const loggedIn = Boolean(data.session);
  setAuthUI(loggedIn);
  if (loggedIn) await refreshDashboard();

  els.loginForm.addEventListener("submit", login);
  els.productForm.addEventListener("submit", saveProduct);
  els.settingsForm.addEventListener("submit", saveSettings);
  els.resetProductForm.onclick = resetProductForm;
  els.deleteProductBtn.onclick = deleteProduct;
  els.uploadImageBtn.onclick = uploadImage;
  els.logoutButton.onclick = async () => {
    await supabase.auth.signOut();
    setAuthUI(false);
    showToast(els.toast, "تم تسجيل الخروج");
  };

  supabase.auth.onAuthStateChange(async (_event, session) => {
    const loggedInNow = Boolean(session);
    setAuthUI(loggedInNow);
    if (loggedInNow) await refreshDashboard();
  });
}

init();
