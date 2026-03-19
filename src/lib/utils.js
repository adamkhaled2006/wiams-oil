export function money(v) {
  return `${Number(v || 0).toFixed(2)} ₪`;
}

export function sanitizeWhatsapp(v) {
  return String(v || "").replace(/[^\d]/g, "");
}

export function showToast(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2600);
}

export function setTheme(settings) {
  const root = document.documentElement;
  root.style.setProperty("--primary", settings.primary_color || "#6f4e37");
  root.style.setProperty("--accent", settings.accent_color || "#d8c1a8");
}
