import type { Metadata } from 'next';
import SwipeDeck from '@/components/consent/SwipeDeck';

export const metadata: Metadata = {
  title: 'สาธิตการยินยอมข้อมูลส่วนบุคคล',
  description: 'อ่านประกาศความเป็นส่วนตัวทีละข้อแบบการ์ด — ยอมรับหรือปฏิเสธเป็นราย ๆ พร้อมคำแปลภาษาคนจากจ่าใหญ่',
};

export default function ConsentPage() {
  return (
    <section className="section wrap consent-page">
      <div className="section-head">
        <div>
          <p className="eyebrow">สาธิตความยินยอม · Consent Demo</p>
          <h2>อ่านประกาศทีละข้อ แล้วเลือกเอง</h2>
        </div>
      </div>
      <SwipeDeck />
    </section>
  );
}
