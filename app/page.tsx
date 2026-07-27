'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import JaYai from '@/components/JaYai';
import Icon from '@/components/Icon';
import TrackerCard from '@/components/TrackerCard';
import { toast } from '@/components/Toaster';
import { CountUp, PixMeter, Reveal, TierChip } from '@/components/ui';
import { TIER, holderOf, type TierKey } from '@/lib/data';
import { stats, submitRequest, useNow } from '@/lib/store';

const overallTier = (score: number): TierKey => (score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low');

function Verdict({ highCount }: { highCount: number }) {
  if (highCount >= 3)
    return (
      <>
        ผมไล่ดูแฟ้มแล้ว มีข้อมูลระดับ<strong>เสี่ยงสูงถึง {highCount} รายการ</strong>{' '}
        โดยเฉพาะพวกแอปกู้เงินกับนายหน้าข้อมูล อย่าปล่อยไว้ จัดการตามที่ผมแนะนำด้านล่างเลย
      </>
    );
  if (highCount > 0)
    return (
      <>
        สถานการณ์ดีขึ้นแล้ว แต่ยังเหลือรายการเสี่ยงสูงอีก <strong>{highCount} รายการ</strong> ที่ผมอยากให้เก็บให้จบ
      </>
    );
  return (
    <>
      <strong>เยี่ยมมาก!</strong> ตอนนี้ไม่เหลือรายการเสี่ยงสูงในแฟ้มของคุณแล้ว ผมจะเฝ้าระวังต่อไปให้เอง
    </>
  );
}

export default function DashboardPage() {
  const now = useNow();
  const [, bump] = useState(0);
  const trackingRef = useRef<HTMLElement>(null);

  const s = now !== null ? stats(now) : null;
  const tier = s ? overallTier(s.exposure) : 'medium';

  const onErase = (id: string) => {
    submitRequest(id);
    bump((v) => v + 1);
    toast('รับทราบ! ส่งคำขอผ่าน DSR API แล้ว ผมจะตามให้จนจบ', 'salute');
    trackingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="hero wrap">
        <Reveal>
          <div className="panel briefing">
            <div className="briefing-mascot">
              <div className="bob">
                <JaYai pose="clipboard" priority />
              </div>
            </div>
            <div className="briefing-body">
              <p className="eyebrow">รายงานสถานการณ์ / Status Report</p>
              <h1>
                {s ? (
                  <>
                    ข้อมูลของคุณอยู่ในมือ <span className="accent">{s.orgCount} องค์กร</span> รวม {s.itemCount} รายการ
                  </>
                ) : (
                  'กำลังตรวจแฟ้มข้อมูลของคุณ…'
                )}
              </h1>
              <p className="sub">
                จ่าใหญ่รวบรวมจากบัญชีและความยินยอมที่คุณเคยให้ไว้ ตรวจดูว่าใครถืออะไร แล้วใช้สิทธิ์สั่งลบได้ในแตะเดียว
              </p>
              {s && (
                <>
                  <div className="score-row">
                    <PixMeter score={s.exposure} tier={tier} />
                    <span className={`chip ${tier}`}>ระดับความเสี่ยงรวม: {TIER[tier].label}</span>
                  </div>
                  <div className="bubble" style={{ marginTop: 18 }}>
                    <span className="who">คำวินิจฉัยของจ่าใหญ่ / Verdict</span>
                    <Verdict highCount={s.highCount} />
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>

        <div className="stats">
          {s &&
            (
              [
                { num: s.orgCount, lbl: 'องค์กรที่ถือข้อมูลของคุณ', icon: 'building', tone: '' },
                { num: s.highCount, lbl: 'รายการความเสี่ยงสูง', icon: 'alert', tone: 'high' },
                { num: s.inFlightCount, lbl: 'คำขอที่กำลังดำเนินการ', icon: 'gear', tone: 'gold' },
                { num: s.completedCount, lbl: 'ลบสำเร็จแล้ว', icon: 'check', tone: 'ok' },
              ] as const
            ).map((t) => (
              <div key={t.lbl} className="stat" data-tone={t.tone}>
                <div className="ico" style={{ color: t.tone === 'ok' ? 'var(--risk-low)' : 'var(--cyan)' }}>
                  <Icon name={t.icon} />
                </div>
                <div className="num">
                  <CountUp value={t.num} />
                </div>
                <div className="lbl">{t.lbl}</div>
              </div>
            ))}
        </div>
      </section>

      <section className="section wrap" ref={trackingRef}>
        <Reveal>
          <div className="section-head">
            <div>
              <p className="eyebrow">DSR Tracking / ติดตามคำขอ</p>
              <h2>คำขอลบข้อมูลของคุณกำลังเดินทาง</h2>
            </div>
            <Link className="more" href="/requests">
              ดูคำขอทั้งหมด →
            </Link>
          </div>
        </Reveal>
        <div className="tracker-list">
          {s &&
            (s.reqs.length ? (
              s.reqs.slice(0, 3).map((req) => <TrackerCard key={req.itemId} req={req} />)
            ) : (
              <div className="empty card">
                <JaYai pose="think" />
                <p>ยังไม่มีคำขอลบข้อมูล — ไปเลือกจากคลังข้อมูลของคุณได้เลย</p>
              </div>
            ))}
        </div>
      </section>

      <section className="section wrap">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="eyebrow">คำแนะนำจากจ่าใหญ่ / Recommended</p>
              <h2>รายการที่จ่าใหญ่อยากให้จัดการก่อน</h2>
            </div>
            <Link className="more" href="/inventory">
              ดูคลังข้อมูลทั้งหมด →
            </Link>
          </div>
        </Reveal>
        <div className="reco-list">
          {s &&
            (s.recommendedItems.length ? (
              s.recommendedItems.slice(0, 4).map((item, i) => (
                <article key={item.id} className="reco">
                  <JaYai pose={i % 2 ? 'magnify' : 'point'} alt="" />
                  <div>
                    <div className="r-title">
                      {item.dataType} <TierChip tier={item.tier} />
                    </div>
                    <div className="r-org">
                      ถือโดย {holderOf(item).name} · {holderOf(item).type}
                    </div>
                    <p className="r-why">“{item.recommendReason}”</p>
                    <div className="r-act">
                      <button className="btn btn-gold glow" onClick={() => onErase(item.id)}>
                        <Icon name="trash" /> ส่งคำขอลบทันที
                      </button>
                      <Link className="btn btn-ghost" href={`/item/${item.id}`}>
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty card" style={{ gridColumn: '1/-1' }}>
                <JaYai pose="salute" />
                <p>
                  <strong>ภารกิจครบถ้วน!</strong> รายการที่จ่าใหญ่แนะนำถูกส่งคำขอลบหมดแล้ว
                </p>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
