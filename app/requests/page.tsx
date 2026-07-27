'use client';

import Link from 'next/link';
import { useState } from 'react';
import JaYai from '@/components/JaYai';
import TrackerCard from '@/components/TrackerCard';
import { Reveal } from '@/components/ui';
import { allRequests, useNow } from '@/lib/store';

type TabKey = 'all' | 'active' | 'completed';

const TABS: [TabKey, string][] = [
  ['all', 'ทั้งหมด'],
  ['active', 'กำลังดำเนินการ'],
  ['completed', 'สำเร็จแล้ว'],
];

export default function RequestsPage() {
  const now = useNow();
  const [tab, setTab] = useState<TabKey>('all');

  const reqs =
    now !== null
      ? allRequests(now).filter((r) =>
          tab === 'all' ? true : tab === 'completed' ? r.status === 'completed' : r.status !== 'completed',
        )
      : [];

  return (
    <section className="section wrap">
      <Reveal>
        <div className="section-head">
          <div>
            <p className="eyebrow">ติดตามคำขอ DSR</p>
            <h2>คำขอลบข้อมูลทั้งหมดของคุณ</h2>
          </div>
        </div>
      </Reveal>

      <div className="inv-toolbar" role="group" aria-label="กรองตามสถานะคำขอ">
        {TABS.map(([key, label]) => (
          <button key={key} className="filter-btn" aria-pressed={tab === key} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="req-list">
        {now !== null &&
          (reqs.length ? (
            reqs.map((req) => <TrackerCard key={req.itemId} req={req} linkTitle />)
          ) : (
            <div className="empty card">
              <JaYai pose="think" />
              <p>
                {tab === 'completed' ? 'ยังไม่มีคำขอที่เสร็จสิ้นในหมวดนี้' : 'ไม่มีคำขอในหมวดนี้'} —
                เริ่มจากส่องคลังข้อมูลของคุณก่อน
              </p>
              <Link className="btn btn-gold" href="/inventory">
                ไปที่คลังข้อมูล
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
}
