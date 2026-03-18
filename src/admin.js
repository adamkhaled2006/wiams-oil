import "./styles.css";
import { supabase, hasSupabaseConfig, DEFAULT_SETTINGS } from "./lib/supabase.js";
import { showToast, setTheme } from "./lib/utils.js";

document.querySelector("#adminApp").innerHTML = `
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">
      <span class="brand-badge">W</span>
      <div>
        <h1>لوحة الأدمن</h1>
        <p>إدارة المنتجات والطلبات وإعدادات المتجر</p>
      </div>
    </a>
    <div class="header-actions">
      <a class="ghost-btn" href="/">المتجر</a>
      <button class="ghost-btn hidden" id="logoutBtn">تسجيل خروج</button>
    </div>
  </div>
</header>

<main class="admin-shell">
  <div class="container">
    <section class="auth-shell" id="authBox">
      <h2>دخول الأدمن</h2>
      <p class="muted">ادخل بالإيميل والباسورد الذي أضفته في Supabase Authentication.</p>
      <form class="stack" id="loginForm">
        <input class="input" name="email" type="email" placeholder="الإيميل" required>
        <input class="input" name="password" type="password" placeholder="الباسورد" required>
        <button class="btn full" type="submit">دخول</button>
      </form>
    </section>

    <section class="hidden" id="dashboardBox">
      <div class="admin-grid">
        <section class="panel">
          <div class="panel-head">
            <h3>المنتجات</h3>
            <button class="ghost-btn" id="newProductBtn">منتج جديد</button>
          </div>

          <form class="stack" id="productForm">
            <input type="hidden" name="id">
            <input class="input" name="name" placeholder="اسم المنتج" required>
            <div class="grid-2">
              <input class="input" name="price" type="number" min="0" step="0.01" placeholder="السعر" required>
              <input class="input" name="old_price" type="number" min="0" step="0.01" placeholder="السعر قبل الخصم">
            </div>
            <input class="input" name="category" placeholder="القسم" required>
            <textarea class="input" name="description" placeholder="الوصف"></textarea>
            <input class="input" name="image" placeholder="رابط الصورة">
            <div class="inline">
              <input class="input" id="imageUpload" type="file" accept="image/*">
              <button type="button" class="ghost-btn" id="uploadImageBtn">رفع الصورة إلى Supabase</button>
            </div>
            <div class="grid-2">
              <input class="input" name="stock" type="number" min="0" step="1" placeholder="الكمية" required>
              <label class="checkbox">
                <input type="checkbox" name="sold_out">
                <span>Sold Out يدوي</span>
              </label>
            </div>
            <div class="inline">
              <button class="btn" type="submit">حفظ المنتج</button>
              <button class="danger-btn hidden" id="deleteProductBtn" type="button">حذف المنتج</button>
            </div>
          </form>

          <div class="table-list" id="productsList"></div>
        </section>

        <section class="panel">
          <div class="panel-head"><h3>إعدادات المتجر</h3></div>
          <form class="stack" id="settingsForm">
            <input class="input" name="store_name" placeholder="اسم المتجر">
            <input class="input" name="tagline" placeholder="الجملة القصيرة">
            <input class="input" name="hero_title" placeholder="عنوان الواجهة">
            <textarea class="input" name="hero_subtitle" placeholder="وصف الواجهة"></textarea>
            <input class="input" name="hero_note" placeholder="ملاحظة أعلى الواجهة">
            <input class="input" name="whatsapp_number" placeholder="رقم واتساب مثال 97059...">
            <div class="grid-2">
              <input class="input" name="primary_color" placeholder="اللون الأساسي مثال #6f4e37">
              <input class="input" name="accent_color" placeholder="لون إضافي مثال #d8c1a8">
            </div>
            <button class="btn" type="submit">حفظ الإعدادات</button>
          </form>

          <div class="panel-head" style="margin-top:24px"><h3>الطلبات</h3></div>
          <div class="table-list" id="ordersList"></div>
        </section>
      </div>
    </section>
  </div>
</main>

<div class="toast" id="toast"></div>
`;

const $ = (s) => document.querySelector(s);
const els = {
  authBox: $("#authBox"),
  dashboardBox: $("#dashboardBox"),
  loginForm: $("#loginForm"),
  logoutBtn: $("#logoutBtn"),
  productForm: $("#productForm"),
  deleteProductBtn: $("#deleteProductBtn"),
  newProductBtn: $("#newProductBtn"),
  imageUpload: $("#imageUpload"),
  uploadImageBtn: $("#uploadImageBtn"),
  productsList: $("#productsList"),
  ordersList: $("#ordersList"),
  settingsForm: $("#settingsForm"),
  toast: $("#toast")
};

let products = [];
let orders = [];
let settings = { ...DEFAULT_SETTINGS };

const formObject = (form) => Object.fromEntries(new FormData(form).entries());

function setAuthView(logged) {
  els.authBox.classList.toggle("hidden", logged);
  els.dashboardBox.classList.toggle("hidden", !logged);
  els.logoutBtn.classList.toggle("hidden", !logged);
}
function resetProductForm() {
  els.productForm.reset();
  els.productForm.querySelector('[name="id"]').value = "";
  els.deleteProductBtn.classList.add("hidden");
}
async function uploadImage() {
  const file = els.imageUpload.files?.[0];
  if (!file) return showToast(els.toast, "اختر صورة أولًا");
  const path = `${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
  const up = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
  if (up.error) {
    console.error(up.error);
    return showToast(els.toast, "فشل رفع الصورة");
  }
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  els.productForm.querySelector('[name="image"]').value = data.publicUrl;
  showToast(els.toast, "تم رفع الصورة");
}
async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending:false });
  if (error) throw error;
  products = data || [];
  renderProductsList();
}
async function loadOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending:false });
  if (error) throw error;
  orders = data || [];
  renderOrders();
}
async function loadSettings() {
  const { data } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  if (data) settings = { ...DEFAULT_SETTINGS, ...data };
  setTheme(settings);
  Object.entries(settings).forEach(([k,v]) => {
    const field = els.settingsForm.querySelector(`[name="${k}"]`);
    if (field) field.value = v ?? "";
  });
}
function renderProductsList() {
  els.productsList.innerHTML = products.length ? "" : `<div class="empty">لا يوجد منتجات بعد.</div>`;
  products.forEach(p => {
    const row = document.createElement("div");
    row.className = "row-card";
    row.innerHTML = `<h4>${p.name}</h4><p>${p.category || ""} — ${Number(p.price||0).toFixed(2)} ₪ — المخزون: ${p.stock ?? 0}</p>`;
    row.onclick = () => {
      Object.entries(p).forEach(([k,v]) => {
        const field = els.productForm.querySelector(`[name="${k}"]`);
        if (!field) return;
        if (field.type === "checkbox") field.checked = Boolean(v);
        else field.value = v ?? "";
      });
      els.deleteProductBtn.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    els.productsList.appendChild(row);
  });
}
function renderOrders() {
  els.ordersList.innerHTML = orders.length ? "" : `<div class="empty">لا يوجد طلبات بعد.</div>`;
  orders.forEach(o => {
    const row = document.createElement("div");
    row.className = "row-card";
    row.innerHTML = `
      <h4>${o.customer_name}</h4>
      <p>${o.phone} — ${o.address}</p>
      <p>المجموع: ${Number(o.total_price||0).toFixed(2)} ₪</p>
      <span class="status ${o.status || "new"}">${o.status || "new"}</span>
      <div class="order-actions">
        <button class="ghost-btn" data-status="new">new</button>
        <button class="ghost-btn" data-status="processing">processing</button>
        <button class="ghost-btn" data-status="delivered">delivered</button>
      </div>
    `;
    row.querySelectorAll("[data-status]").forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const status = e.currentTarget.dataset.status;
        const upd = await supabase.from("orders").update({ status }).eq("id", o.id);
        if (upd.error) return showToast(els.toast, "فشل تحديث الطلب");
        showToast(els.toast, "تم تحديث حالة الطلب");
        await loadOrders();
      };
    });
    els.ordersList.appendChild(row);
  });
}
async function saveProduct(e) {
  e.preventDefault();
  const raw = formObject(els.productForm);
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
  const q = id ? supabase.from("products").update(payload).eq("id", id) : supabase.from("products").insert(payload);
  const { error } = await q;
  if (error) {
    console.error(error);
    return showToast(els.toast, "فشل حفظ المنتج");
  }
  resetProductForm();
  await loadProducts();
  showToast(els.toast, "تم حفظ المنتج");
}
async function deleteProduct() {
  const id = els.productForm.querySelector('[name="id"]').value;
  if (!id) return;
  if (!confirm("متأكد من حذف المنتج؟")) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return showToast(els.toast, "فشل حذف المنتج");
  resetProductForm();
  await loadProducts();
  showToast(els.toast, "تم حذف المنتج");
}
async function saveSettings(e) {
  e.preventDefault();
  const payload = { id:1, ...DEFAULT_SETTINGS, ...formObject(els.settingsForm) };
  const { error } = await supabase.from("store_settings").upsert(payload);
  if (error) {
    console.error(error);
    return showToast(els.toast, "فشل حفظ الإعدادات");
  }
  settings = payload;
  setTheme(settings);
  showToast(els.toast, "تم حفظ الإعدادات");
}
async function init() {
  if (!hasSupabaseConfig()) return showToast(els.toast, "أضف مفاتيح Supabase أولًا");
  const { data } = await supabase.auth.getSession();
  setAuthView(Boolean(data.session));

  els.loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(els.loginForm);
    const { error } = await supabase.auth.signInWithPassword({ email: fd.get("email"), password: fd.get("password") });
    if (error) {
      console.error(error);
      return showToast(els.toast, "فشل تسجيل الدخول");
    }
    await loadSettings(); await loadProducts(); await loadOrders();
    setAuthView(true);
    showToast(els.toast, "تم تسجيل الدخول");
  };
  els.logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    setAuthView(false);
    showToast(els.toast, "تم تسجيل الخروج");
  };
  els.uploadImageBtn.onclick = uploadImage;
  els.productForm.onsubmit = saveProduct;
  els.deleteProductBtn.onclick = deleteProduct;
  els.newProductBtn.onclick = resetProductForm;
  els.settingsForm.onsubmit = saveSettings;

  supabase.auth.onAuthStateChange(async (_event, session) => {
    const logged = Boolean(session);
    setAuthView(logged);
    if (logged) {
      await loadSettings();
      await loadProducts();
      await loadOrders();
    }
  });

  if (data.session) {
    await loadSettings();
    await loadProducts();
    await loadOrders();
  }
}
init();
