# Wiam's Oil Store — Admin Upgrade + Email

هذه النسخة فيها:
- متجر احترافي
- زر واتساب واضح يطلب من الزبون إرسال الطلب للتأكيد
- لوحة أدمن مقسمة لأقسام منفصلة داخل واجهة واحدة
- حفظ الطلبات في الأدمن
- ملفات جاهزة لإرسال إيميل تلقائي عبر Supabase Edge Function + Resend

## المتغيرات في Vercel
اتركها كما هي:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

## المطلوب للإيميل التلقائي
1. أنشئ حساب Resend
2. أنشئ API Key
3. من Supabase > Edge Functions > Secrets
   أضف:
   - `RESEND_API_KEY`
   - `ORDER_NOTIFY_EMAIL` = adamkhaled999oooo@gmail.com
5. من داخل الموقع، بعد حفظ الطلب سيتم استدعاء الدالة تلقائيًا

## واتساب
الزر يظهر للزبون بعد حفظ الطلب بالنص:
"⚠️ اضغط هنا وأرسل الطلب عبر واتساب لتأكيده"

## ملاحظة
الإيميل التلقائي لن يعمل حتى تضيف `RESEND_API_KEY` وتنشر الـ Edge Function.
