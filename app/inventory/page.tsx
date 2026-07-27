'use client';

import Link from 'next/link';
import { useState } from 'react';
import JaYai from '@/components/JaYai';
import Icon from '@/components/Icon';
import { Bubble, Reveal, StatusChip, TierChip } from '@/components/ui';
import { ITEMS, holderOf, type DataItem } from '@/lib/data';
import { requestFor, useNow } from '@/lib/store';

type FilterKey = 'all' | 'reco' | 'high' | 'medium' | 'low';

const FILTERS: [FilterKey, string][] = [
  ['all', 'ทั้งหมด'],
  ['reco', 'จ่าใหญ่แนะนำให้ลบ'],
  ['high', 'เสี่ยงสูง'],
  ['medium', 'เสี่ยงปานกลาง'],
  ['low', 'เสี่ยงต่ำ'],
];

function ShareTrail({ item }: { item: DataItem }) {
  const shares = item.flow.filter((f) => f.kind === 'share' || f.kind === 'broker');
  if (!shares.length) return <span>เก็บไว้ที่ผู้ให้บริการเท่านั้น</span>;
  return (
    <>
      <Icon name="send" />
      <span>ส่งต่อ {shares.length} ทอด →</span>
      <span className="to">{shares[shares.length - 1].org}</span>
    </>
  );
}

export default function InventoryPage() {
  const now = useNow(1500);
  const [filter, setFilter] = useState<FilterKey>('all');

  const items = ITEMS.filter((i) => {
    if (filter === 'all') return true;
    if (filter === 'reco') return i.recommended;
    return i.tier === filter;
  }).sort((a, b) => b.score - a.score);

  return (
    <section className="section wrap">
      <Reveal>
        <div className="section-head">
          <div>
            <p className="eyebrow">Data Inventory / คลังข้อมูล</p>
            <h2>ข้อมูลของคุณทั้งหมดที่อยู่ในมือคนอื่น</h2>
          </div>
        </div>
      </Reveal>

      <Reveal className="bubble-row" delay={80}>
        <div className="bob">
          <JaYai pose="magnify" />
        </div>
        <Bubble who="จ่าใหญ่ · หัวหน้าสายตรวจข้อมูล">
          ผมไล่ส่องมาให้หมดแล้วว่าข้อมูลแต่ละชิ้นอยู่กับใคร แตะที่รายการเพื่อดูเส้นทางว่ามันถูกส่งต่อไปไหนบ้าง
        </Bubble>
      </Reveal>

      <div className="inv-toolbar" role="group" aria-label="กรองตามระดับความเสี่ยง" style={{ marginTop: 22 }}>
        {FILTERS.map(([key, label]) => (
          <button key={key} className="filter-btn" aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="inv-list">
        {items.map((item, i) => {
          const req = now !== null ? requestFor(item.id, now) : null;
          const erased = req?.status === 'completed';
          const h = holderOf(item);
          return (
            <Reveal key={item.id} delay={Math.min(i % 6, 4) * 80}>
              <Link className={`inv-row ${erased ? 'erased-row' : ''}`} href={`/item/${item.id}`}>
                <span className="ico" style={{ color: erased ? 'var(--risk-low)' : 'var(--cyan)' }}>
                  <Icon name={item.icon} />
                </span>
                <span className="what">
                  <span className="t">{item.dataType}</span>
                  <span className="h">
                    {h.name} · {h.type}
                  </span>
                  {item.recommended && !req && (
                    <span className="flag">
                      <Icon name="alert" /> จ่าใหญ่แนะนำให้ส่งคำขอลบ
                    </span>
                  )}
                </span>
                <span className="trail">
                  <ShareTrail item={item} />
                </span>
                <span>{req ? <StatusChip status={req.status} /> : <TierChip tier={item.tier} />}</span>
                <span className="go">
                  <Icon name="arrow" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
