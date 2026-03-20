import{s as y,m as _,a as w,b as x,c as P,D as m,h as T}from"./utils-qjOhc-Z4.js";document.querySelector("#app").innerHTML=`
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
`;const s=t=>document.querySelector(t),e={storeName:s("#storeName"),storeTagline:s("#storeTagline"),brandBadge:s("#brandBadge"),brandLogo:s("#brandLogo"),heroSlider:s("#heroSlider"),heroDots:s("#heroDots"),heroProductsCount:s("#heroProductsCount"),waTop:s("#waTop"),waFooter:s("#waFooter"),socialLinks:s("#socialLinks"),productsGrid:s("#productsGrid"),emptyBox:s("#emptyBox"),searchInput:s("#searchInput"),categoryFilter:s("#categoryFilter"),sortFilter:s("#sortFilter"),openCart:s("#openCart"),closeCart:s("#closeCart"),cartDrawer:s("#cartDrawer"),overlay:s("#overlay"),cartItems:s("#cartItems"),cartTotal:s("#cartTotal"),cartCount:s("#cartCount"),toggleCheckout:s("#toggleCheckout"),checkoutForm:s("#checkoutForm"),toast:s("#toast")};let S=[],u={...m},l=JSON.parse(localStorage.getItem("wiams-cart")||"[]"),h=[],b=0,q=null;function $(){localStorage.setItem("wiams-cart",JSON.stringify(l)),e.cartCount.textContent=l.reduce((t,o)=>t+o.quantity,0)}function M(){return l.reduce((t,o)=>t+Number(o.price)*o.quantity,0)}function N(){const t=x(u.whatsapp_number);return t?`https://wa.me/${t}`:"#"}function G(){const t=String(u.slider_images||"").split(/\r?\n|,/).map(o=>String(o||"").trim()).filter(Boolean);return t.length?t:[u.hero_image_1_url||u.hero_image_url||m.hero_image_1_url,u.hero_image_2_url||m.hero_image_2_url,u.hero_image_3_url||m.hero_image_3_url,u.hero_image_4_url||m.hero_image_4_url].map(o=>String(o||"").trim()).filter(Boolean)}function O(){e.heroDots.innerHTML="",h.forEach((t,o)=>{const a=document.createElement("button");a.type="button",a.className=`hero-dot${o===b?" is-active":""}`,a.setAttribute("aria-label",`الصورة ${o+1}`),a.onclick=()=>F(o,!0),e.heroDots.appendChild(a)})}function F(t,o=!1){h.length&&(b=(t%h.length+h.length)%h.length,h.forEach((a,n)=>a.classList.toggle("is-active",n===b)),[...e.heroDots.children].forEach((a,n)=>a.classList.toggle("is-active",n===b)),o&&I())}function I(){q&&clearInterval(q),!(h.length<=1)&&(q=setInterval(()=>F(b+1),3500))}function W(){const t=G();e.heroSlider.innerHTML=t.map((o,a)=>`
    <img class="hero-image hero-slide${a===0?" is-active":""}" src="${o}" alt="صورة سلايدر ${a+1}">
  `).join(""),h=Array.from(e.heroSlider.querySelectorAll(".hero-slide")),b=0,O(),I()}function j(){const t=[{key:"instagram_url",label:"Instagram",icon:"📸"},{key:"snapchat_url",label:"Snapchat",icon:"👻"},{key:"tiktok_url",label:"TikTok",icon:"🎵"},{key:"facebook_url",label:"Facebook",icon:"f"},{key:"telegram_url",label:"Telegram",icon:"✈️"}].filter(o=>String(u[o.key]||"").trim());e.socialLinks.innerHTML="",t.forEach(o=>{const a=document.createElement("a");a.className="social-link",a.href=u[o.key],a.target="_blank",a.rel="noreferrer",a.innerHTML=`<span class="social-icon">${o.icon}</span><span>${o.label}</span>`,e.socialLinks.appendChild(a)})}function U(){const t=String(u.logo_url||"").trim();t?(e.brandLogo.src=t,e.brandLogo.classList.remove("hidden"),e.brandBadge.classList.add("hidden")):(e.brandLogo.classList.add("hidden"),e.brandBadge.classList.remove("hidden"))}function D(){P(u),document.title=u.store_name||m.store_name,e.storeName.textContent=u.store_name||m.store_name,e.storeTagline.textContent=u.tagline||m.tagline,U(),W(),e.waTop.href=N(),e.waFooter.href=N(),j()}function B(){e.heroProductsCount.textContent=String(S.length)}function E(){e.cartDrawer.classList.add("open"),e.overlay.classList.add("show")}function C(){e.cartDrawer.classList.remove("open"),e.overlay.classList.remove("show")}function J(t,o){const a=[`🛒 طلب جديد من ${t.customer_name}`,`📞 الهاتف: ${t.phone}`,`📍 العنوان: ${t.address}`,t.notes?`📝 ملاحظات: ${t.notes}`:null,`💰 المجموع: ${Number(t.total_price).toFixed(2)} ₪`,"","📦 المنتجات:"].filter(Boolean);return o.forEach(n=>a.push(`- ${n.product_name} × ${n.quantity} = ${(Number(n.price)*Number(n.quantity)).toFixed(2)} ₪`)),encodeURIComponent(a.join(`
`))}function L(){const t=e.searchInput.value.trim().toLowerCase(),o=e.categoryFilter.value,a=e.sortFilter.value;let n=S.filter(r=>{const c=!t||[r.name,r.description,r.category].filter(Boolean).join(" ").toLowerCase().includes(t),d=o==="all"||r.category===o;return c&&d});n.sort((r,c)=>a==="price-asc"?Number(r.price)-Number(c.price):a==="price-desc"?Number(c.price)-Number(r.price):a==="stock"?Number(c.stock||0)-Number(r.stock||0):new Date(c.created_at||0)-new Date(r.created_at||0)),e.productsGrid.innerHTML="",e.emptyBox.classList.toggle("hidden",n.length>0),n.forEach(r=>{const c=r.sold_out||Number(r.stock||0)<=0,d=document.createElement("article");d.className="product-card",d.innerHTML=`
      <div class="product-image">
        <img src="${r.image||"https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80"}" alt="${r.name}">
        <div class="badges">
          <span class="badge">${r.category||"منتج"}</span>
          ${c?'<span class="badge sold">Sold Out</span>':""}
        </div>
      </div>
      <div class="product-body">
        <div>
          <h3 class="product-title">${r.name}</h3>
          <div class="product-cat">${r.category||""}</div>
        </div>
        <div class="product-desc">${r.description||""}</div>
        <div class="price-row">
          <span class="price">${_(r.price)}</span>
          ${r.old_price?`<span class="old-price">${_(r.old_price)}</span>`:""}
        </div>
        <div class="stock-line">
          <span>المتوفر: ${Number(r.stock||0)}</span>
          <span>${c?"غير متوفر":"جاهز للطلب"}</span>
        </div>
        <div class="qty-wrap">
          <button type="button" data-minus>-</button>
          <input value="1" min="1" max="${Math.max(1,Number(r.stock||1))}" ${c?"disabled":""}>
          <button type="button" data-plus>+</button>
        </div>
        <button class="btn full add" ${c?"disabled":""}>أضف للسلة</button>
      </div>
    `;const v=d.querySelector("input");d.querySelector("[data-minus]").onclick=()=>v.value=Math.max(1,Number(v.value)-1),d.querySelector("[data-plus]").onclick=()=>v.value=Math.min(Number(r.stock||1),Number(v.value)+1),d.querySelector(".add").onclick=()=>{const k=Math.max(1,Math.min(Number(r.stock||1),Number(v.value))),f=l.find(A=>A.id===r.id);f?f.quantity=Math.min(f.quantity+k,Number(r.stock||0)):l.push({id:r.id,name:r.name,price:Number(r.price),quantity:k,stock:Number(r.stock||0)}),$(),g(),y(e.toast,"تمت إضافة المنتج"),E()},e.productsGrid.appendChild(d)});const p=[...new Set(S.map(r=>r.category).filter(Boolean))],i=e.categoryFilter.value;e.categoryFilter.innerHTML='<option value="all">كل الأقسام</option>'+p.map(r=>`<option value="${r}">${r}</option>`).join(""),p.includes(i)&&(e.categoryFilter.value=i),B()}function g(){if($(),e.cartItems.innerHTML="",!l.length){e.cartItems.innerHTML='<div class="empty">السلة فارغة.</div>',e.cartTotal.textContent=_(0);return}l.forEach(t=>{const o=document.createElement("div");o.className="cart-item",o.innerHTML=`
      <div class="cart-top">
        <div><strong>${t.name}</strong><div class="muted">${_(t.price)} للقطعة</div></div>
        <button class="icon-btn">✕</button>
      </div>
      <div class="qty-wrap" style="margin-top:12px">
        <button type="button" data-minus>-</button>
        <input value="${t.quantity}" min="1" max="${Math.max(1,t.stock||1)}">
        <button type="button" data-plus>+</button>
      </div>
    `,o.querySelector(".icon-btn").onclick=()=>{l=l.filter(n=>n.id!==t.id),g()};const a=o.querySelector("input");o.querySelector("[data-minus]").onclick=()=>{t.quantity=Math.max(1,t.quantity-1),g()},o.querySelector("[data-plus]").onclick=()=>{t.quantity=Math.min(t.stock||1,t.quantity+1),g()},a.onchange=()=>{t.quantity=Math.max(1,Math.min(t.stock||1,Number(a.value))),g()},e.cartItems.appendChild(o)}),e.cartTotal.textContent=_(M())}async function z(){if(!T())return;const{data:t}=await w.from("store_settings").select("*").limit(1).maybeSingle();t&&(u={...m,...t}),D()}async function H(){if(!T()){y(e.toast,"أضف مفاتيح Supabase أولًا");return}const{data:t,error:o}=await w.from("products").select("*").order("created_at",{ascending:!1});if(o){console.error(o),y(e.toast,"فشل تحميل المنتجات");return}S=t||[],L()}async function Q(){if(!l.length)return[];const t=l.map(i=>i.id),{data:o,error:a}=await w.from("products").select("id,name,stock,sold_out").in("id",t);if(a)throw a;const n=new Map((o||[]).map(i=>[i.id,i])),p=[];if(l=l.map(i=>{const r=n.get(i.id);if(!r)return p.push(`المنتج ${i.name} لم يعد موجودًا`),null;const c=Math.max(0,Number(r.stock||0));if(r.sold_out||c<=0)return p.push(`المنتج ${i.name} غير متوفر حاليًا`),null;const d=Math.min(i.quantity,c);return d<i.quantity&&p.push(`تم تعديل كمية ${i.name} إلى ${d} بسبب المخزون`),{...i,name:r.name||i.name,stock:c,quantity:d}}).filter(Boolean),$(),g(),!l.length)throw new Error(p[0]||"السلة أصبحت فارغة");if(p.length)throw new Error(p[0]);return o||[]}async function R(t){const o=new Map((t||[]).map(a=>[a.id,a]));for(const a of l){const n=o.get(a.id);if(!n)throw new Error(`تعذر تحديث مخزون ${a.name}`);const p=Math.max(0,Number(n.stock||0));if(a.quantity>p)throw new Error(`الكمية المطلوبة من ${a.name} لم تعد متوفرة`);const i=Math.max(0,p-Number(a.quantity||0)),{error:r}=await w.from("products").update({stock:i,sold_out:!!n.sold_out||i<=0}).eq("id",a.id);if(r)throw r}}async function K(t){var k;const o=await Q(),a=((k=t.get("notes"))==null?void 0:k.trim())||"",n={customer_name:t.get("customer_name"),phone:t.get("phone"),address:t.get("address"),total_price:M(),status:"new"},{data:p,error:i}=await w.from("orders").insert(n).select().single();if(i)throw i;const r=l.map(f=>({order_id:p.id,product_name:f.name,price:f.price,quantity:f.quantity})),c=await w.from("order_items").insert(r);if(c.error)throw c.error;await R(o);const d=x(u.whatsapp_number);if(!d)throw new Error("رقم الواتساب غير موجود");const v=`https://wa.me/${d}?text=${J({...n,notes:a},r)}`;l=[],$(),g(),C(),await H(),window.location.href=v,y(e.toast,"تم حفظ الطلب وفتح واتساب ✅")}e.openCart.onclick=E;e.closeCart.onclick=C;e.overlay.onclick=C;e.toggleCheckout.onclick=()=>e.checkoutForm.classList.toggle("hidden");e.searchInput.oninput=L;e.categoryFilter.onchange=L;e.sortFilter.onchange=L;e.checkoutForm.onsubmit=async t=>{if(t.preventDefault(),!l.length)return y(e.toast,"السلة فارغة");const o=t.currentTarget;try{await K(new FormData(o)),o.reset()}catch(a){console.error(a),y(e.toast,(a==null?void 0:a.message)||"فشل حفظ الطلب")}};(async function(){D(),g(),B(),await z(),await H()})();
