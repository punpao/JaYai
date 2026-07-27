'use client';

import Link from 'next/link';
import { useState } from 'react';
import JaYai from '@/components/JaYai';
import Icon from '@/components/Icon';
import { toast } from '@/components/Toaster';
import { Bubble, PixMeter, Reveal, SlaBar, StatusChip, TierChip, TrackerSteps } from '@/components/ui';
import { byId, holderOf, type FlowKind } from '@/lib/data';
import { requestFor, submitRequest, useNow, type DsrRequest } from '@/lib/store';

const FLOW_KIND: Record<FlowKind, { label: string; icon: 'db' | 'building' | 'send' | 'alert' }> = {
  collect: { label: 'จัดเก็บ / COLLECTED', icon: 'db' },
  store: { label: 'เก็บรักษา / STORED', icon: 'building' },
  share: { label: 'ส่งต่อ / SHARED', icon: 'send' },
  broker: { label: 'นายหน้าข้อมูล / BROKER', icon: 'alert' },
};

export default function ItemDetail({ id }: { id: string }) {
  const now = useNow();
  const [, bump] = useState(0);
  const item = byId(id);

  if (!item) {
    return (
      <div className="wrap">
        <div className="empty card" style={{ marginTop: 24 }}>
          <JaYai pose="think" />
          <p>
            <strong>ไม่พบรายการนี้ในแฟ้ม</strong>
            <br />
            กลับไปเลือกจากคลังข้อมูลของคุณอีกครั้ง
          </p>
          <Link className="btn btn-gold" href="/inventory">
            ไปที่คลังข้อมูล
          </Link>
        </div>
      </div>
    );
  }

  const h = holderOf(item);
  const req = now !== null ? requestFor(item.id, now) : null;

  const onErase = () => {
    submitRequest(item.id);
    bump((v) => v + 1);
    toast(`รับเรื่องแล้ว! ส่งคำขอลบไปยัง ${h.name} ผ่าน DSR API`, 'salute');
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="breadcrumb">
        <Link href="/inventory">คลังข้อมูลของฉัน</Link>
        <span>/</span>
        <span>{item.dataType}</span>
      </nav>

      <div className="detail-grid">
        <div>
          <Reveal>
            <div className="card">
              <div className="detail-head">
                <span className="ico" style={{ color: 'var(--cyan)' }}>
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h1>{item.dataType}</h1>
                  <div className="h">
                    ถือโดย {h.name} · {h.type}
                  </div>
                </div>
              </div>
              <div className="score-row">
                <PixMeter score={item.score} tier={item.tier} />
                <TierChip tier={item.tier} />
              </div>
              <p className="cta-note" style={{ textAlign: 'left', marginTop: 10 }}>
                สถานะล่าสุด: {item.lastActivity}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="card" style={{ marginTop: 18 }}>
              <p className="eyebrow">เส้นทางของข้อมูล</p>
              <h2 className="card-h2">ข้อมูลชิ้นนี้เดินทางไปไหนมาบ้าง</h2>
              <div className="flow">
                {item.flow.map((f, i) => {
                  const k = FLOW_KIND[f.kind];
                  return (
                    <div key={i} className={`flow-step kind-${f.kind}`}>
                      <div className="node">
                        <div className="n-dot">
                          <Icon name={k.icon} />
                        </div>
                        <div className="n-line" />
                      </div>
                      <div className="f-body">
                        <div className="f-kind">{k.label}</div>
                        <div className="f-org">{f.org}</div>
                        <div className="f-lbl">{f.label}</div>
                        <div className="f-date">{f.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="analysis">
          <Reveal delay={140}>
            <div className="card">
              <p className="eyebrow">บทวิเคราะห์จากจ่าใหญ่</p>
              <div className="bubble-row" style={{ marginTop: 14 }}>
                <JaYai pose="bulb" />
                <Bubble who={`จ่าใหญ่วิเคราะห์ · Exposure Score ${item.score}/100`}>{item.risk}</Bubble>
              </div>

              {!req ? (
                <>
                  {item.recommended && (
                    <div className="bubble-row" style={{ marginTop: 18 }}>
                      <JaYai pose="point" alt="" />
                      <Bubble who="จ่าใหญ่ขอแทรก">
                        <strong>{item.recommendReason}</strong> — อย่ารอช้า ผมแนะนำให้กดส่งเลย
                      </Bubble>
                    </div>
                  )}
                  <div className="cta-box">
                    <button className="btn btn-gold btn-wide glow btn-hero" onClick={onErase} disabled={now === null}>
                      <Icon name="trash" /> 1-Tap ส่งคำขอลบข้อมูล
                    </button>
                    <p className="cta-note">
                      ส่งคำขอใช้สิทธิ์ลบ (Right to Erasure) ผ่าน Standardized DSR API ไปยัง {h.name} ·
                      องค์กรต้องตอบภายใน 30 วันตาม PDPA
                    </p>
                  </div>
                </>
              ) : (
                <RequestStatus req={req} holderName={h.name} />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function RequestStatus({ req, holderName }: { req: DsrRequest; holderName: string }) {
  return (
    <>
      <div className="tracker-card card-deep" style={{ marginTop: 18 }}>
        <div className="tracker-top">
          <span className="title">สถานะคำขอ DSR</span>
          <span className="spacer" />
          <StatusChip status={req.status} />
        </div>
        <TrackerSteps req={req} />
        <SlaBar req={req} />
      </div>
      {req.status === 'completed' ? (
        <div className="done-banner" style={{ marginTop: 14 }}>
          <JaYai pose="salute" />
          <div>
            <div className="t">ภารกิจสำเร็จ — {holderName} ลบข้อมูลของคุณแล้ว</div>
            <p>จ่าใหญ่ตรวจรับหลักฐานการลบเรียบร้อย รายการนี้ถูกปลดออกจากคะแนนความเสี่ยงของคุณ</p>
          </div>
        </div>
      ) : (
        <p className="cta-note" style={{ marginTop: 12 }}>
          {req.status === 'submitted'
            ? `คำขอถูกส่งถึง ${holderName} แล้ว — รอองค์กรยืนยันรับเรื่อง`
            : `${holderName} กำลังดำเนินการลบ — จ่าใหญ่เฝ้าติดตามให้อยู่ ไม่มีหายเงียบแน่นอน`}
        </p>
      )}
    </>
  );
}
