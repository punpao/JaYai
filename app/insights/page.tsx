import type { Metadata } from 'next';
import CuriosityFeed from '@/components/insights/CuriosityFeed';

export const metadata: Metadata = {
  title: 'เกร็ดน่ารู้เรื่องข้อมูลส่วนตัว',
  description: 'เกร็ดความเสี่ยงจริงจากประกาศความเป็นส่วนตัว เปิดอ่านทีละชั้นแบบไม่ต้องกลืนกำแพงตัวหนังสือ',
};

export default function InsightsPage() {
  return (
    <section className="section wrap insights-page">
      <div className="section-head">
        <div>
          <p className="eyebrow">เกร็ดน่ารู้ · Did You Know</p>
          <h2>เรื่องที่ซ่อนอยู่ในประกาศที่คุณกด &ldquo;ยอมรับ&rdquo;</h2>
        </div>
      </div>
      <CuriosityFeed />
    </section>
  );
}
