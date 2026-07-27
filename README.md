# จ่าใหญ่ (Ja Yai) — PDPA Personal Data Exposure & Erasure Tracker

ต้นแบบเว็บแอปสำหรับ PDPA Hackathon 2026 — ให้ผู้ใช้เห็นว่า**ใครถือข้อมูลส่วนบุคคลของตัวเองบ้าง** เข้าใจระดับความเสี่ยง และ**ใช้สิทธิ์ลบข้อมูล (Right to Erasure) ได้ในแตะเดียว** โดยยืมภาษา UX ของการติดตามพัสดุ (Shopee/Grab-style order tracking) มาใช้กับคำขอ DSR

มาสคอต **จ่าใหญ่** — สารวัตรข้อมูลหนวดเทาในเครื่องแบบน้ำตาล — เป็นผู้บรรยายตลอดทั้งแอป ใช้สไปรต์ pixel-art ทางการ 12 ท่า (`public/poses/`) ตามบริบท เช่น ถือแฟ้มบนแดชบอร์ด ส่องแว่นขยายในคลังข้อมูล ชูหลอดไฟตอนวิเคราะห์ และทำวันทยหัตถ์เมื่อลบสำเร็จ

## Stack

Next.js 15 (App Router, static export) + React 19 + TypeScript — สไตล์เป็น CSS ล้วนใน `app/globals.css` ตามโทเคนของ PDPA Hackathon 2026

## Run

```bash
npm install
npm run dev        # http://localhost:3000

npm run build      # static export → out/  (โฮสต์บนเว็บเซิร์ฟเวอร์สแตติกใดก็ได้)
```

## Routes

| หน้า | เส้นทาง | หน้าที่ |
|---|---|---|
| แดชบอร์ด | `/` | คำวินิจฉัยรวมจากจ่าใหญ่, Exposure meter, สถิติ, คำขอที่กำลังเดินทาง (order-tracker), รายการที่แนะนำให้ลบ |
| คลังข้อมูล | `/inventory` | ข้อมูลทุกชิ้น: อะไร–ใครถือ–ถูกส่งต่อกี่ทอด พร้อมตัวกรองตามระดับความเสี่ยง |
| รายละเอียด | `/item/[id]` | เส้นทางข้อมูล (Data Trail), บทวิเคราะห์ AI เสียงจ่าใหญ่ + Exposure Score, ปุ่ม 1-Tap Erasure, สถานะ DSR สด |
| คำขอทั้งหมด | `/requests` | ประวัติคำขอแบบหน้า order history พร้อมแท็บสถานะ |

## Structure

```
app/            หน้าเพจ (App Router) + globals.css
components/     JaYai (มาสคอต), Icon, Nav, TrackerCard, Toaster, ui (chips/meter/stepper/SLA)
lib/            data.ts (mock seed, typed) · store.ts (DSR simulation + hooks)
public/poses/   สไปรต์จ่าใหญ่ 12 ท่า
```

## Mock / Simulation

- **ข้อมูล**: บริษัทไทยสมมติ 8 แห่ง + ข้อมูล 13 รายการใน `lib/data.ts` (คะแนนความเสี่ยงและบทวิเคราะห์เป็น mock ตามโจทย์)
- **DSR pipeline**: `lib/store.ts` เก็บคำขอใน `localStorage` (สถานะคงอยู่ข้ามหน้า) และไล่สถานะตามเวลาเพื่อเดโม: ส่งคำขอแล้ว → 8 วิ → กำลังดำเนินการ → 40 วิ → ลบสำเร็จ โดยแมปเวลาเป็นวันใน SLA 30 วันตาม PDPA (5 วิ ≈ 1 วัน)
- ครั้งแรกที่เปิดจะ seed คำขอไว้ 2 รายการ (1 สำเร็จ, 1 กำลังวิ่ง) เพื่อให้ tracker ไม่ว่างและมีสถานะขยับสด ๆ ระหว่างเดโม
- ล้างสถานะเดโม: `localStorage.removeItem('jayai-state-v1')` ใน DevTools

## Design

ตาม `PDPA Hackathon 2026 Visual Style Guide`: Navy Black `#020C2C` / Card Navy `#243B72` / Badge Indigo `#11015A` / PDPA Gold `#F7D047` (สงวนไว้สำหรับ CTA เท่านั้น) / Icon Cyan `#6EEDFC` (ไอคอนเท่านั้น) — ฟอนต์ Kanit (display) + Prompt (body) + IBM Plex Mono (eyebrow labels) — โมชัน ease-out-expo 200–700ms, เคารพ `prefers-reduced-motion`
