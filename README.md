# จ่าใหญ่ (Ja Yai) — PDPA Personal Data Exposure & Erasure Tracker

ต้นแบบเว็บแอปสำหรับ PDPA Hackathon 2026 — ให้ผู้ใช้เห็นว่า**ใครถือข้อมูลส่วนบุคคลของตัวเองบ้าง** เข้าใจระดับความเสี่ยง และ**ใช้สิทธิ์ลบข้อมูล (Right to Erasure) ได้ในแตะเดียว** โดยยืมภาษา UX ของการติดตามพัสดุ (Shopee/Grab-style order tracking) มาใช้กับคำขอ DSR

มาสคอต **จ่าใหญ่** — สารวัตรข้อมูลหนวดเทาในเครื่องแบบน้ำตาล — เป็นผู้บรรยายตลอดทั้งแอป วาดเป็น pixel-art ด้วยโค้ด (SVG grid ใน `js/jayai.js`) มี 9 ท่าที่ใช้ตามบริบท เช่น ถือแฟ้มบนแดชบอร์ด ส่องแว่นขยายในคลังข้อมูล ชูหลอดไฟตอนวิเคราะห์ และทำวันทยหัตถ์เมื่อลบสำเร็จ

## Run

ไฟล์สแตติกล้วน ไม่มี build step — เสิร์ฟโฟลเดอร์นี้ด้วยเว็บเซิร์ฟเวอร์ใดก็ได้:

```bash
python3 -m http.server 8000
# เปิด http://localhost:8000
```

(ต้องเสิร์ฟผ่าน http เพราะใช้ ES modules — เปิดไฟล์ตรง ๆ ด้วย `file://` ไม่ได้)

## Pages

| หน้า | ไฟล์ | หน้าที่ |
|---|---|---|
| แดชบอร์ด | `index.html` | คำวินิจฉัยรวมจากจ่าใหญ่, Exposure meter, สถิติ, คำขอที่กำลังเดินทาง (order-tracker), รายการที่แนะนำให้ลบ |
| คลังข้อมูล | `inventory.html` | ข้อมูลทุกชิ้น: อะไร–ใครถือ–ถูกส่งต่อกี่ทอด พร้อมตัวกรองตามระดับความเสี่ยง |
| รายละเอียด | `item.html?id=…` | เส้นทางข้อมูล (Data Trail), บทวิเคราะห์ AI เสียงจ่าใหญ่ + Exposure Score, ปุ่ม 1-Tap Erasure, สถานะ DSR สด |
| คำขอทั้งหมด | `requests.html` | ประวัติคำขอแบบหน้า order history พร้อมแท็บสถานะ |

## Mock / Simulation

- **ข้อมูล**: บริษัทไทยสมมติ 8 แห่ง + ข้อมูล 13 รายการใน `js/data.js` (คะแนนความเสี่ยงและบทวิเคราะห์เป็น mock ตามโจทย์)
- **DSR pipeline**: `js/store.js` เก็บคำขอใน `localStorage` (สถานะคงอยู่ข้ามหน้า) และไล่สถานะตามเวลาเพื่อเดโม: ส่งคำขอแล้ว → 8 วิ → กำลังดำเนินการ → 40 วิ → ลบสำเร็จ โดยแมปเวลาเป็นวันใน SLA 30 วันตาม PDPA (5 วิ ≈ 1 วัน)
- ครั้งแรกที่เปิดจะ seed คำขอไว้ 2 รายการ (1 สำเร็จ, 1 กำลังวิ่ง) เพื่อให้ tracker ไม่ว่างและมีสถานะขยับสด ๆ ระหว่างเดโม
- ล้างสถานะเดโม: `localStorage.removeItem('jayai-state-v1')` ใน DevTools

## Design

ตาม `PDPA Hackathon 2026 Visual Style Guide`: Navy Black `#020C2C` / Card Navy `#243B72` / Badge Indigo `#11015A` / PDPA Gold `#F7D047` (สงวนไว้สำหรับ CTA เท่านั้น) / Icon Cyan `#6EEDFC` (ไอคอนเท่านั้น) — ฟอนต์ Kanit (display) + Prompt (body) + IBM Plex Mono (eyebrow labels) — โมชัน ease-out-expo 200–700ms, เคารพ `prefers-reduced-motion`
