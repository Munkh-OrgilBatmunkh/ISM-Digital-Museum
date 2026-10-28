# ISM Digital Museum

Мэдээллийн Системийн Менежментийн тэнхимийн дижитал музей. Internet Programming, Гэрийн даалгавар №1.

**Demo:** https://ТАНЫ-ТӨСӨЛ.vercel.app  ·  **Бүтээлч шийдэл:** ISM Time Machine (`/timeline`)

## Технологи
React 18 + Vite, React Router, Supabase (Auth, PostgreSQL, Storage, RLS), Vercel.

## Суулгах
1. `npm install`
2. Supabase төсөл үүсгээд `supabase/schema.sql`-ийг SQL Editor дээр ажиллуулна.
3. `.env.example`-ийг `.env` болгож хуулаад Supabase-ийн Project URL болон **anon** түлхүүрийг бөглөнө.
4. `npm run dev`

## Хэрэглэгчийн эрх
- Зочин: үзэх, хайх. Оюутан: бүртгүүлж өөрийн үзмэрийг нэмэх/засах/устгах. Админ: бүх үзмэрийг засах/нуух, багш, арга хэмжээ, зурагт цомгийн мэдээлэл удирдах.
- Эрхийг frontend-ээс гадна өгөгдлийн сан дээр **RLS** хамгаална (`schema.sql`).
- `service_role` түлхүүрийг frontend-д ашиглаагүй.

## Өгөгдлийн сангийн холбоо
`exhibits.creator_id → profiles.id → auth.users.id`, `exhibits.category_id → exhibition_categories.id`, `event_photos.event_id → events.id`.

## Vercel дээр байршуулах
GitHub-д push хийгээд vercel.com → Add New Project → repo сонгоно. Environment Variables-д `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` нэмээд Deploy дарна.
