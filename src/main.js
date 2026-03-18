import "./styles.css";
import { supabase } from "./lib/supabase.js";

let cartItems = [];
let totalPrice = 0;

// 🟢 عناصر الفورم
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const notesInput = document.getElementById("notes");

// 🟢 زر الطلب
const orderBtn = document.getElementById("orderBtn");

// 🟢 دالة الطلب
async function submitOrder() {
  const customerName = nameInput.value;
  const customerPhone = phoneInput.value;
  const customerAddress = addressInput.value;
  const customerNotes = notesInput.value;

  if (!customerName || !customerPhone || !customerAddress) {
    alert("عبّي كل البيانات");
    return;
  }

  try {
    // ✅ حفظ الطلب في Supabase
    await supabase.from("orders").insert({
      customer_name: customerName,
      phone: customerPhone,
      address: customerAddress,
      notes: customerNotes,
      total_price: totalPrice,
    });

    // 🔥 إرسال الإيميل
    await fetch("https://icfqkxtvcpomrjgfnvjx.functions.supabase.co/order-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        notes: customerNotes,
        items: cartItems,
        total: totalPrice,
      }),
    });

    alert("تم إرسال الطلب بنجاح ✅");

  } catch (error) {
    console.error(error);
    alert("صار خطأ ❌");
  }
}

// 🟢 ربط الزر
orderBtn?.addEventListener("click", submitOrder);
