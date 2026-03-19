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
        <p>إدارة المنتجات والطلبات والمحتوى والثيم والتواصل</p>
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
      <div class="admin-grid" style="grid-template-columns:260px 1fr">
        <aside class="panel">
          <div class="stack">
            <button class="ghost-btn admin-nav active" data-tab="dashboard">الواجهة الرئيسية</button>
            <button class="ghost-btn admin-nav" data-tab="products">المنتجات</button>
            <button class="ghost-btn admin-nav" data-tab="orders">الطلبات</button>
            <button class="ghost-btn admin-nav" data-tab="content">النصوص والمحتوى</button>
            <button class="ghost-btn admin-nav" data-tab="theme">الألوان والثيم</button>
            <button class="ghost-btn admin-nav" data-tab="contact">التواصل</button>
          </div>
        </aside>

        <section class="stack" style="gap:18px">
          <section class="panel admin-tab" data-panel="dashboard">
            <div class="panel-head"><h3>لوحة سريعة</h3></div>
            <div class="grid-2">
              <div class="note-card"><strong>عدد المنتجات</strong><div class="muted" id="statsProducts">0</div></div>
              <div class="note-card"><strong>عدد الطلبات</strong><div class="muted" id="statsOrders">0</div></div>
            </div>
            <div class="note-card" style="margin-top:14px">
              <strong>ماذا تقدر تعدل؟</strong>
              <div class="muted">المنتجات، الطلبات، نصوص الواجهة، الألوان، الواتساب، وروابط السوشال ميديا.</div>
            </div>
          </section>

          <section class="panel admin-tab hidden" data-panel="products">
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

          <section class="panel admin-tab hidden" data-panel="orders">
            <div class="panel-head"><h3>الطلبات</h3></div>
            <div class="note-card" style="margin-bottom:14px">
              <strong>الطلبات والواتساب</strong>
              <div class="muted">كل طلب ينحفظ هنا، وبعده ينفتح واتساب مباشرة للزبون حتى يؤكد الطلب.</div>
            </div>
            <div class="table-list" id="ordersList"></div>
          </section>

          <section class="panel admin-tab hidden" data-panel="content">
            <div class="panel-head"><h3>الصور الرئيسية والهوية</h3></div>
            <form class="stack" id="contentForm">
              <input class="input" name="store_name" placeholder="اسم المتجر">
              <input class="input" name="tagline" placeholder="الجملة القصيرة تحت اسم المتجر">
              <input class="input" name="logo_url" placeholder="رابط اللوجو">
              <input class="input" name="hero_image_1_url" placeholder="رابط الصورة الرئيسية 1">
              <input class="input" name="hero_image_2_url" placeholder="رابط الصورة الرئيسية 2">
              <input class="input" name="hero_image_3_url" placeholder="رابط الصورة الرئيسية 3">
              <input class="input" name="hero_image_4_url" placeholder="رابط الصورة الرئيسية 4">
              <div class="muted">الصور الأربع ستظهر مكان الصورة الكبيرة أعلى الصفحة وتلف تلقائيًا، والمنتجات تبقى تحتها كما هي.</div>
              <button class="btn" type="submit">حفظ المحتوى</button>
            </form>
          </section>

          <section class="panel admin-tab hidden" data-panel="theme">
            <div class="panel-head"><h3>الألوان والثيم</h3></div>
            <form class="stack" id="themeForm">
              <div class="grid-2">
                <input class="input" name="primary_color" placeholder="اللون الأساسي مثال #6f4e37">
                <input class="input" name="accent_color" placeholder="اللون الإضافي مثال #d8c1a8">
              </div>
              <button class="btn" type="submit">حفظ الألوان</button>
            </form>
          </section>

          <section class="panel admin-tab hidden" data-panel="contact">
            <div class="panel-head"><h3>التواصل</h3></div>
            <form class="stack" id="contactForm">
              <input class="input" name="whatsapp_number" placeholder="رقم واتساب مثال 97059...">
              <div class="muted">اكتب رقم الواتساب بصيغة دولية بدون + مثل: 97059xxxxxxx أو 97259xxxxxxx</div>
              <input class="input" name="instagram_url" placeholder="رابط Instagram الكامل">
              <input class="input" name="snapchat_url" placeholder="رابط Snapchat الكامل">
              <input class="input" name="tiktok_url" placeholder="رابط TikTok الكامل">
              <input class="input" name="facebook_url" placeholder="رابط Facebook الكامل">
              <input class="input" name="telegram_url" placeholder="رابط Telegram الكامل">
              <div class="muted">ضع الرابط كاملًا مثل https://instagram.com/username وإذا تركته فارغًا لن يظهر في المتجر.</div>
              <button class="btn" type="submit">حفظ التواصل والسوشال</button>
            </form>
          </section>
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
  contentForm: $("#contentForm"),
  themeForm: $("#themeForm"),
  contactForm: $("#contactForm"),
  statsProducts: $("#statsProducts"),
  statsOrders: $("#statsOrders"),
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

function showTab(tab) {
  document.querySelectorAll(".admin-nav").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".admin-tab").forEach(panel => {
    panel.classList.toggle("hidden", panel.dataset.panel !== tab);
  });
}

function resetProductForm() {
  els.productForm.reset();
  els.productForm.querySelector('[name="id"]').value = "";
  els.deleteProductBtn.classList.add("hidden");
}

function fillSettingsForms() {
  ["contentForm","themeForm","contactForm"].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    Object.entries(settings).forEach(([k,v]) => {
      const field = form.querySelector(`[name="${k}"]`);
      if (field) field.value = v ?? "";
    });
  });
  setTheme(settings);
}

async function uploadImage() {
  const file = els.imageUpload.files?.[0];
  if (!file) return showToast(els.toast, "اختر صورة أولًا");
  const path = `${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
  const up = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
  if (up.error) return showToast(els.toast, "فشل رفع الصورة");
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  els.productForm.querySelector('[name="image"]').value = data.publicUrl;
  showToast(els.toast, "تم رفع الصورة");
}

async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending:false });
  if (error) throw error;
  products = data || [];
  els.statsProducts.textContent = String(products.length);
  renderProductsList();
}

async function loadOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending:false });
  if (error) throw error;
  orders = data || [];
  els.statsOrders.textContent = String(orders.length);
  renderOrders();
}

async function loadSettings() {
  const { data } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  if (data) settings = { ...DEFAULT_SETTINGS, ...data };
  fillSettingsForms();
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
      showTab("products");
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
  if (error) return showToast(els.toast, "فشل حفظ المنتج");
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

async function saveSettingsPartial(form) {
  const payload = { id: 1, ...settings, ...formObject(form) };
  const { error } = await supabase.from("store_settings").upsert(payload);
  if (error) return showToast(els.toast, error.message || "فشل حفظ الإعدادات");
  settings = payload;
  fillSettingsForms();
  showToast(els.toast, "تم حفظ الإعدادات");
}

async function init() {
  if (!hasSupabaseConfig()) return showToast(els.toast, "أضف مفاتيح Supabase أولًا");
  const { data } = await supabase.auth.getSession();
  setAuthView(Boolean(data.session));

  document.querySelectorAll(".admin-nav").forEach(btn => btn.onclick = () => showTab(btn.dataset.tab));
  showTab("dashboard");

  els.loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(els.loginForm);
    const { error } = await supabase.auth.signInWithPassword({ email: fd.get("email"), password: fd.get("password") });
    if (error) return showToast(els.toast, "فشل تسجيل الدخول");
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
  els.newProductBtn.onclick = () => { resetProductForm(); showTab("products"); };
  els.contentForm.onsubmit = async (e) => { e.preventDefault(); await saveSettingsPartial(els.contentForm); };
  els.themeForm.onsubmit = async (e) => { e.preventDefault(); await saveSettingsPartial(els.themeForm); };
  els.contactForm.onsubmit = async (e) => { e.preventDefault(); await saveSettingsPartial(els.contactForm); };

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
