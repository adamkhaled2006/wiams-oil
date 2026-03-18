# Wiam's Oil Store — Fixed Build

هذه النسخة مضبوطة ليعمل:
- `/` المتجر
- `/admin.html` لوحة الأدمن

## مهم في Vercel
أبقِ Environment Variables كما هي:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

## إذا رفعتها على GitHub
استبدل ملفات المشروع الحالية كاملة بهذه الملفات، ثم اعمل Redeploy.

## مهم في Supabase
شغّل `supabase-setup.sql`
واعمل مستخدم أدمن في Authentication بنفس الإيميل الموجود داخل ملف SQL.
