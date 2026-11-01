# ISM Digital Museum

Мэдээллийн Системийн Менежментийн тэнхимийн дижитал музей. Internet Programming, Гэрийн даалгавар №1.
Бүтээлч санаа: **Digital Time Capsule** — ирээдүйн оюутнуудад зориулсан захиа, бүтээлийн түүх болон дурсамж хадгалах.

**Demo:** ism-digital-museum-sable.vercel.app · **GitHub:** https://github.com/Munkh-OrgilBatmunkh/ISM-Digital-Museum

## Технологи
React 18 + Vite, React Router, Supabase, Vercel.

## Ажилуулах
1. `npm install`
2. Музейн Supabase төсөл дээр `supabase/schema.sql`-ийг SQL Editor-т ажиллуулна (шинэ, хоосон төсөл дээр).
   Өмнө нь ажиллуулсан бол `update_capsule.sql`, `update_exhibits.sql`-ийг (өгөгдөл устгахгүй) ажиллуулна.
3. `.env.example`-ийг `.env` болгон хуулж Project URL болон **anon** түлхүүрийг бөглөнө.
4. `npm run dev`

## Функцууд
- **Үзэсгэлэн:** оюутны бүтээл, хайх, ангиллаар шүүх.
- **Time Capsule:** захидал бичих, бусдын захидлыг унших; зураг, товч тайлбартай дурсамжийн карт нэмэх.
- **Time Machine:** тэнхимийн түүхийн үйл явдлууд он цагийн дарааллаар.
- **Багш нар, Арга хэмжээ:** админ нэмэх, засах, давхарлах, устгах.
- Нүүр хуудсанд "Арга хэмжээ"-ний зургуудыг автоматаар сольж харуулдаг слайдер.

## Хэрэглэгчийн төрлүүд
| Төрөл | Хэрхэн болох | Боломж |
|---|---|---|
| Зочин | Нэвтрээгүй | Үзмэр, захидал, дурсамж, багш, арга хэмжээний зурагт цомог, түүхийг үзэх; хайх, ангиллаар шүүх |
| Бүтээгч / оюутан | Бүртгүүлсэн хэн ч (`profiles.role = 'student'`) | Өөрийн бүтээлийн мэдээлэл, зураг, холбоосыг нэмэх, засах, устгах; захидал, дурсамж бичих |
| Администратор | `profiles.role = 'admin'` | Бүх үзмэр, захидал, дурсамжийг хянах (засах, нуух, устгах); багш, арга хэмжээ, зургийн цомог, түүхийг удирдах |

Тест бүртгэл: оюутан — `(и-мэйл / нууц үг)`, админ — `(и-мэйл / нууц үг)`.
Админ болгох (SQL Editor): `update profiles set role = 'admin' where id = (select id from auth.users where email = 'ADMIN_И-МЭЙЛ');`
Эрхийг frontend-ээс гадна өгөгдлийн сан дээр **RLS** хамгаална. `service_role` түлхүүрийг frontend-д ашиглаагүй.

## Өгөгдлийн сангийн холбоо
`exhibits.creator_id → profiles.id → auth.users.id`, `exhibits.category_id → exhibition_categories.id`,
`capsule_letters.author_id → profiles.id`, `capsule_memories.author_id → profiles.id`, `event_photos.event_id → events.id`.

## Зураг
Зургийг компьютерээс сонгож Supabase Storage-д хадгална, эсвэл `public/images/` хавтаст хуулж `/images/нэр.jpg` гэж замыг нь бичнэ.

## Vercel дээр байршуулах
GitHub-д push → vercel.com → Add New Project → repo сонгоно. Environment Variables-д `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` нэмээд Deploy дарна.
