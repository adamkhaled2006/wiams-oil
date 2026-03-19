import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const ORDER_NOTIFY_EMAIL = Deno.env.get("ORDER_NOTIFY_EMAIL") || "adamkhaled999oooo@gmail.com";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const order = body.order || {};
    const items = body.items || [];
    const shop = body.shop || "متجر ويام";

    const itemRows = items.map((item: any) =>
      `<li>${item.product_name} × ${item.quantity} — ${Number(item.price).toFixed(2)} ₪</li>`
    ).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right">
        <h2>طلب جديد من ${shop}</h2>
        <p><strong>الاسم:</strong> ${order.customer_name || ""}</p>
        <p><strong>الهاتف:</strong> ${order.phone || ""}</p>
        <p><strong>العنوان:</strong> ${order.address || ""}</p>
        <p><strong>المجموع:</strong> ${Number(order.total_price || 0).toFixed(2)} ₪</p>
        <h3>المنتجات</h3>
        <ul>${itemRows}</ul>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "طلبات المتجر <onboarding@resend.dev>",
        to: [ORDER_NOTIFY_EMAIL],
        subject: `طلب جديد - ${shop}`,
        html
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify({ ok: response.ok, data }), {
      status: response.ok ? 200 : 400,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
