export function money(value) {
  const amount = Number(value || 0);
  return `${amount.toFixed(2)} ₪`;
}

export function showToast(element, message) {
  element.textContent = message;
  element.classList.remove("hidden");
  clearTimeout(element._timer);
  element._timer = setTimeout(() => element.classList.add("hidden"), 2600);
}

export function sanitizeWhatsapp(number) {
  return (number || "").replace(/[^\d]/g, "");
}

export function buildOrderWhatsappText(settings, order, items) {
  const lines = [
    `طلب جديد من ${order.customer_name}`,
    `الهاتف: ${order.phone}`,
    `العنوان: ${order.address}`,
    `المجموع: ${order.total_price} ₪`,
    "",
    "المنتجات:"
  ];
  items.forEach((item) => {
    lines.push(`- ${item.product_name} × ${item.quantity} = ${Number(item.price) * Number(item.quantity)} ₪`);
  });
  return encodeURIComponent(lines.join("\n"));
}

export function applyTheme(settings) {
  const root = document.documentElement;
  root.style.setProperty("--primary", settings.primary_color || "#8b5e3c");
  root.style.setProperty("--accent", settings.accent_color || "#d8c1a8");
}
