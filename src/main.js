import "./styles.css";
import { supabase } from "./lib/supabase.js";

let items = [];
let total = 0;

// عناصر الفورم
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const notesInput = document.getElementById("notes");

const orderBtn = document.getElementById("orderBtn");
const waBtn = document.getElementById("waOrder");

// 🟢 دالة إنشاء رسالة واتساب
function buildWhatsAppMessage(payload, items) {
  let msg = `طلب جديد من الموقع:\n\n`;
  msg += `الاسم: ${payload.customer_name}\n`;
  msg += `الهاتف: ${payload.phone}\n`;
  msg += `العنوان: ${payload.address}\n\n`;

  msg += `المنتجات:\n`;
  items.forEach(i => {
    msg += `- ${i.name} × ${i.qty}\n`;
  });

  msg += `\nالمجموع: ${payload.total_price} ₪`;

  return encodeURIComponent(msg);
}

// 🟢 إرسال الطلب
async function submitOrder() {
  const payload = {
    customer_name: nameInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    notes: notesInput.value,
    total_price: total
  };

  if (!payload.customer_name || !payload.phone || !payload.address) {
    alert("عبّي كل البيانات");
    return;
  }

  try {
    // ✅ حفظ الطلب
    await supabase.from("orders").insert(payload);

    // 🔥 إرسال الإيميل
    await fetch("https://icfqkxtvcpomrjgfnvjx.functions.supabase.co/order-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.customer_name,
        phone: payload.phone,
        address: payload.address,
        notes: payload.notes,
        items: items,
        total: payload.total_price,
      }),
    });

    // 📲 زر واتساب
    const whatsappNumber = "970XXXXXXXXX"; // حط رقمك هون
    const waLink = `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage(payload, items)}`;

    waBtn.href = waLink;
    waBtn.textContent = "⚠️ اضغط هنا وأرسل الطلب عبر واتساب لتأكيده";
    waBtn.classList.remove("hidden");

    alert("تم حفظ الطلب ✅ الرجاء تأكيده عبر واتساب");

  } catch (err) {
    console.error(err);
    alert("صار خطأ ❌");
  }
}

// ربط الزر
orderBtn?.addEventListener("click", submitOrder);
