import{h as x,s as i,a as c,D as w,c as B}from"./utils-qjOhc-Z4.js";document.querySelector("#adminApp").innerHTML=`
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
              <textarea class="input" name="slider_images" rows="6" placeholder="روابط صور السلايدر — كل رابط بسطر منفصل"></textarea>
              <div class="muted">حط كل رابط صورة بسطر لوحده، والسلايدر رح يقرأهم من الأدمن تلقائيًا. إذا تركتها فاضية رح يستخدم الصور الأربع القديمة.</div>
              <input class="input" name="hero_image_1_url" placeholder="رابط الصورة الرئيسية 1 الاحتياطية">
              <input class="input" name="hero_image_2_url" placeholder="رابط الصورة الرئيسية 2 الاحتياطية">
              <input class="input" name="hero_image_3_url" placeholder="رابط الصورة الرئيسية 3 الاحتياطية">
              <input class="input" name="hero_image_4_url" placeholder="رابط الصورة الرئيسية 4 الاحتياطية">
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
`;const o=a=>document.querySelector(a),e={authBox:o("#authBox"),dashboardBox:o("#dashboardBox"),loginForm:o("#loginForm"),logoutBtn:o("#logoutBtn"),productForm:o("#productForm"),deleteProductBtn:o("#deleteProductBtn"),newProductBtn:o("#newProductBtn"),imageUpload:o("#imageUpload"),uploadImageBtn:o("#uploadImageBtn"),productsList:o("#productsList"),ordersList:o("#ordersList"),contentForm:o("#contentForm"),themeForm:o("#themeForm"),contactForm:o("#contactForm"),statsProducts:o("#statsProducts"),statsOrders:o("#statsOrders"),toast:o("#toast")};let h=[],b=[],l={...w};const F=a=>Object.fromEntries(new FormData(a).entries());function u(a){e.authBox.classList.toggle("hidden",a),e.dashboardBox.classList.toggle("hidden",!a),e.logoutBtn.classList.toggle("hidden",!a)}function p(a){document.querySelectorAll(".admin-nav").forEach(t=>{t.classList.toggle("active",t.dataset.tab===a)}),document.querySelectorAll(".admin-tab").forEach(t=>{t.classList.toggle("hidden",t.dataset.panel!==a)})}function f(){e.productForm.reset(),e.productForm.querySelector('[name="id"]').value="",e.deleteProductBtn.classList.add("hidden")}function _(){["contentForm","themeForm","contactForm"].forEach(a=>{const t=document.getElementById(a);t&&Object.entries(l).forEach(([s,n])=>{const r=t.querySelector(`[name="${s}"]`);r&&(r.value=n??"")})}),B(l)}async function k(){var r;const a=(r=e.imageUpload.files)==null?void 0:r[0];if(!a)return i(e.toast,"اختر صورة أولًا");const t=`${Date.now()}-${a.name.replace(/\s+/g,"-")}`;if((await c.storage.from("product-images").upload(t,a,{cacheControl:"3600",upsert:!1})).error)return i(e.toast,"فشل رفع الصورة");const{data:n}=c.storage.from("product-images").getPublicUrl(t);e.productForm.querySelector('[name="image"]').value=n.publicUrl,i(e.toast,"تم رفع الصورة")}async function d(){const{data:a,error:t}=await c.from("products").select("*").order("created_at",{ascending:!1});if(t)throw t;h=a||[],e.statsProducts.textContent=String(h.length),S()}async function m(){const{data:a,error:t}=await c.from("orders").select("*").order("created_at",{ascending:!1});if(t)throw t;b=a||[],e.statsOrders.textContent=String(b.length),L()}async function g(){const{data:a}=await c.from("store_settings").select("*").limit(1).maybeSingle();a&&(l={...w,...a}),_()}function S(){e.productsList.innerHTML=h.length?"":'<div class="empty">لا يوجد منتجات بعد.</div>',h.forEach(a=>{const t=document.createElement("div");t.className="row-card",t.innerHTML=`<h4>${a.name}</h4><p>${a.category||""} — ${Number(a.price||0).toFixed(2)} ₪ — المخزون: ${a.stock??0}</p>`,t.onclick=()=>{Object.entries(a).forEach(([s,n])=>{const r=e.productForm.querySelector(`[name="${s}"]`);r&&(r.type==="checkbox"?r.checked=!!n:r.value=n??"")}),e.deleteProductBtn.classList.remove("hidden"),p("products"),window.scrollTo({top:0,behavior:"smooth"})},e.productsList.appendChild(t)})}function L(){e.ordersList.innerHTML=b.length?"":'<div class="empty">لا يوجد طلبات بعد.</div>',b.forEach(a=>{const t=document.createElement("div");t.className="row-card",t.innerHTML=`
      <h4>${a.customer_name}</h4>
      <p>${a.phone} — ${a.address}</p>
      <p>المجموع: ${Number(a.total_price||0).toFixed(2)} ₪</p>
      <span class="status ${a.status||"new"}">${a.status||"new"}</span>
      <div class="order-actions">
        <button class="ghost-btn" data-status="new">new</button>
        <button class="ghost-btn" data-status="processing">processing</button>
        <button class="ghost-btn" data-status="delivered">delivered</button>
      </div>
    `,t.querySelectorAll("[data-status]").forEach(s=>{s.onclick=async n=>{n.stopPropagation();const r=n.currentTarget.dataset.status;if((await c.from("orders").update({status:r}).eq("id",a.id)).error)return i(e.toast,"فشل تحديث الطلب");i(e.toast,"تم تحديث حالة الطلب"),await m()}}),e.ordersList.appendChild(t)})}async function P(a){a.preventDefault();const t=F(e.productForm),s={name:t.name,price:Number(t.price||0),old_price:t.old_price?Number(t.old_price):null,category:t.category,description:t.description||null,image:t.image||null,stock:Number(t.stock||0),sold_out:e.productForm.querySelector('[name="sold_out"]').checked},n=t.id,r=n?c.from("products").update(s).eq("id",n):c.from("products").insert(s),{error:y}=await r;if(y)return i(e.toast,"فشل حفظ المنتج");f(),await d(),i(e.toast,"تم حفظ المنتج")}async function q(){const a=e.productForm.querySelector('[name="id"]').value;if(!a||!confirm("متأكد من حذف المنتج؟"))return;const{error:t}=await c.from("products").delete().eq("id",a);if(t)return i(e.toast,"فشل حذف المنتج");f(),await d(),i(e.toast,"تم حذف المنتج")}async function v(a){const t={id:1,...l,...F(a)},{error:s}=await c.from("store_settings").upsert(t);if(s)return i(e.toast,s.message||"فشل حفظ الإعدادات");l=t,_(),i(e.toast,"تم حفظ الإعدادات")}async function T(){if(!x())return i(e.toast,"أضف مفاتيح Supabase أولًا");const{data:a}=await c.auth.getSession();u(!!a.session),document.querySelectorAll(".admin-nav").forEach(t=>t.onclick=()=>p(t.dataset.tab)),p("dashboard"),e.loginForm.onsubmit=async t=>{t.preventDefault();const s=new FormData(e.loginForm),{error:n}=await c.auth.signInWithPassword({email:s.get("email"),password:s.get("password")});if(n)return i(e.toast,"فشل تسجيل الدخول");await g(),await d(),await m(),u(!0),i(e.toast,"تم تسجيل الدخول")},e.logoutBtn.onclick=async()=>{await c.auth.signOut(),u(!1),i(e.toast,"تم تسجيل الخروج")},e.uploadImageBtn.onclick=k,e.productForm.onsubmit=P,e.deleteProductBtn.onclick=q,e.newProductBtn.onclick=()=>{f(),p("products")},e.contentForm.onsubmit=async t=>{t.preventDefault(),await v(e.contentForm)},e.themeForm.onsubmit=async t=>{t.preventDefault(),await v(e.themeForm)},e.contactForm.onsubmit=async t=>{t.preventDefault(),await v(e.contactForm)},c.auth.onAuthStateChange(async(t,s)=>{const n=!!s;u(n),n&&(await g(),await d(),await m())}),a.session&&(await g(),await d(),await m())}T();
