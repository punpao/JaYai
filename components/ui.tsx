'use client';

/* Shared UI: chips, pixel meter, DSR tracker, speech bubble, reveals, count-up */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TIER, type TierKey } from '@/lib/data';
import { SLA_DAYS, type DsrRequest, type RequestStatus } from '@/lib/store';
import Icon from './Icon';

export const STATUS_LABEL: Record<RequestStatus, string> = {
  submitted: 'ส่งคำขอแล้ว',
  processing: 'กำลังดำเนินการ',
  completed: 'ลบข้อมูลสำเร็จ',
};

export function TierChip({ tier }: { tier: TierKey }) {
  return <span className={`chip ${tier}`}>{TIER[tier].label}</span>;
}

export function StatusChip({ status }: { status: RequestStatus }) {
  return <span className={`chip status-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function PixMeter({ score, tier }: { score: number; tier: TierKey }) {
  const cells = 10;
  const on = Math.round((score / 100) * cells);
  const color = TIER[tier].color;
  return (
    <div
      className="pixmeter"
      role="img"
      aria-label={`คะแนนความเสี่ยง ${score} จาก 100`}
      style={{ ['--meter' as string]: color }}
    >
      {Array.from({ length: cells }, (_, i) => (
        <span key={i} className={`cell ${i < on ? 'on' : ''}`} />
      ))}
      <span className="val" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

/* DSR stepper: Submitted → Processing → Completed */
const STEP_ORDER: RequestStatus[] = ['submitted', 'processing', 'completed'];
const STEP_ICONS = ['send', 'gear', 'check'] as const;

export function TrackerSteps({ req }: { req: DsrRequest }) {
  const idx = STEP_ORDER.indexOf(req.status);
  return (
    <div className="steps" role="list" aria-label="สถานะคำขอลบข้อมูล">
      {STEP_ORDER.map((s, i) => {
        const cls = i < idx ? 'done' : i === idx ? (s === 'completed' ? 'done final' : 'now') : '';
        return (
          <div key={s} className={`step ${cls}`} role="listitem">
            <div className="bar">
              <i />
            </div>
            <div className="dot">
              <Icon name={STEP_ICONS[i]} />
            </div>
            <div className="s-lbl">{STATUS_LABEL[s]}</div>
          </div>
        );
      })}
    </div>
  );
}

export function SlaBar({ req }: { req: DsrRequest }) {
  const done = req.status === 'completed';
  const pct = done ? 100 : Math.round(req.progress * 100);
  const deadline = req.deadline.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  return (
    <div className={`sla ${done ? 'ok' : ''}`}>
      <div className="sla-top">
        <span>
          กรอบเวลาตามกฎหมาย {SLA_DAYS} วัน · ครบกำหนด {deadline}
        </span>
        <span className="day">
          {done ? `เสร็จในวันที่ ${req.simDay}/${SLA_DAYS} ✓` : `วันที่ ${req.simDay}/${SLA_DAYS}`}
        </span>
      </div>
      <div className="rail">
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Bubble({ who, children }: { who: string; children: ReactNode }) {
  return (
    <div>
      <div className="bubble">
        <span className="who">{who}</span>
        {children}
      </div>
      <div className="bubble-tail" />
    </div>
  );
}

/* fade-up on first scroll into view */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

/* animated number: counts up on first mount, then tracks value directly */
export function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mounted.current = true;
      setDisplay(value);
      return;
    }
    mounted.current = true;
    const t0 = performance.now();
    const ms = 800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display}</>;
}
