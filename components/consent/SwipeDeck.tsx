'use client';

/* Tinder-style consent deck. One privacy-notice clause per card, verbatim.
   Swipe right = accept, swipe left = reject; explicit buttons + arrow keys
   are first-class equivalents. Mandatory cards lock the reject path and take
   a single "รับทราบ" acknowledgment instead. */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import JaYai from '@/components/JaYai';
import Icon from '@/components/Icon';
import { toast } from '@/components/Toaster';
import { Bubble } from '@/components/ui';
import {
  NOTICE_CARDS,
  NOTICE_META,
  RISK_LABEL,
  SCRATCH_CONTENT,
  type Decision,
  type NoticeCard,
} from '@/lib/notice';
import ScratchReveal from './ScratchReveal';

type Phase = 'intro' | 'deck' | 'summary';
type Fly = 'left' | 'right' | null;

const SWIPE_THRESHOLD = 110;

const riskTone = (risk: number) => (risk >= 4 ? 'high' : risk === 3 ? 'medium' : 'low');

function RiskDots({ risk }: { risk: number }) {
  const tone = riskTone(risk);
  return (
    <span className={`risk-dots tone-${tone}`} role="img" aria-label={`ความเสี่ยงระดับ ${risk} จาก 5 (${RISK_LABEL[risk]})`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < risk ? 'on' : ''} />
      ))}
      <b>
        {risk}/5 · {RISK_LABEL[risk]}
      </b>
    </span>
  );
}

function DocBlock({ card }: { card: NoticeCard }) {
  return (
    <blockquote className="doc" lang="th">
      <span className="doc-label">ข้อความจริงจากประกาศ (คัดมาทั้งข้อ ไม่ตัดทอน)</span>
      {card.doc.map((b, i) => {
        if (b.type === 'heading') return <h3 key={i}>{b.text}</h3>;
        if (b.type === 'bullet') return <li key={i}>{b.text}</li>;
        if (b.type === 'row')
          return (
            <div key={i} className="doc-row">
              <div>
                <em>วัตถุประสงค์</em>
                {b.cols![0]}
              </div>
              <div>
                <em>ข้อมูลที่ใช้</em>
                {b.cols![1]}
              </div>
              <div>
                <em>ฐานกฎหมาย</em>
                {b.cols![2]}
              </div>
            </div>
          );
        return <p key={i}>{b.text}</p>;
      })}
    </blockquote>
  );
}

function CardAnalysis({ card, onScratchState }: { card: NoticeCard; onScratchState?: (s: 'scratching' | 'revealed') => void }) {
  const bubble = (
    <div className="bubble-row card-voice">
      <JaYai pose={card.pose} />
      <Bubble who={`จ่าใหญ่วิเคราะห์`}>{card.voice}</Bubble>
    </div>
  );
  if (!card.scratch) return bubble;
  const hidden = SCRATCH_CONTENT[card.id];
  return (
    <>
      {bubble}
      <ScratchReveal onScratchStart={() => onScratchState?.('scratching')} onRevealed={() => onScratchState?.('revealed')}>
        <div className="scratch-prize">
          <strong>{hidden.headline}</strong>
          <p>{hidden.body}</p>
        </div>
      </ScratchReveal>
    </>
  );
}

export default function SwipeDeck() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [drag, setDrag] = useState({ dx: 0, dy: 0, active: false });
  const [fly, setFly] = useState<Fly>(null);
  const [shake, setShake] = useState(false);
  const [scratchState, setScratchState] = useState<'idle' | 'scratching' | 'revealed'>('idle');
  const deckRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ id: -1, x: 0, y: 0, dragging: false });

  const card = NOTICE_CARDS[index];
  const total = NOTICE_CARDS.length;
  const locked = card && card.mode !== 'optional';
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* phase switches change page height — bring the user back to the top of the stage */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }, [phase]);

  const advance = useCallback(
    (decision: Decision) => {
      const c = NOTICE_CARDS[index];
      setDecisions((d) => ({ ...d, [c.id]: decision }));
      setScratchState('idle');
      setDrag({ dx: 0, dy: 0, active: false });
      setFly(null);
      if (index + 1 >= total) setPhase('summary');
      else setIndex((i) => i + 1);
    },
    [index, total],
  );

  const decide = useCallback(
    (decision: Decision) => {
      if (fly) return;
      if (decision === 'rejected' && locked) {
        setShake(true);
        window.setTimeout(() => setShake(false), 450);
        toast(`ข้อนี้ปฏิเสธไม่ได้ครับ — ${card.lockReason}`, 'crossed');
        setDrag({ dx: 0, dy: 0, active: false });
        return;
      }
      if (reduced()) {
        advance(decision);
        return;
      }
      setFly(decision === 'rejected' ? 'left' : 'right');
      window.setTimeout(() => advance(decision), 340);
    },
    [advance, card, fly, locked],
  );

  /* ---- pointer swipe (touch-action: pan-y keeps vertical scroll native) ---- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (fly || (e.target as HTMLElement).closest('button, a, canvas')) return;
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dragging: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (p.id !== e.pointerId || fly) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (!p.dragging) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
      p.dragging = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    setDrag({ dx, dy, active: true });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (p.id !== e.pointerId) return;
    pointer.current.id = -1;
    if (!p.dragging) return;
    const dx = e.clientX - p.x;
    if (dx <= -SWIPE_THRESHOLD) decide('rejected');
    else if (dx >= SWIPE_THRESHOLD) decide(locked ? 'acknowledged' : 'accepted');
    else setDrag({ dx: 0, dy: 0, active: false });
  };

  /* ---- keyboard equivalents ---- */
  useEffect(() => {
    if (phase !== 'deck') return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        decide('rejected');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        decide(locked ? 'acknowledged' : 'accepted');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, decide, locked]);

  /* จ่าใหญ่ reacts while scratching */
  useEffect(() => {
    if (scratchState === 'scratching') toast('เอ้า ขูดเลย ๆ ผมลุ้นอยู่นะ…', 'waveHigh');
    if (scratchState === 'revealed' && card?.scratch)
      toast(SCRATCH_CONTENT[card.id].after, card.risk >= 4 ? 'crossed' : 'thumbsSmall');
  }, [scratchState, card]);

  /* ---------- intro ---------- */
  if (phase === 'intro') {
    return (
      <div className="deck-stage">
        <div className="bubble-row">
          <div className="bob">
            <JaYai pose="waveHigh" priority />
          </div>
          <Bubble who="จ่าใหญ่ · หัวหน้าสายตรวจข้อมูล">
            สวัสดีครับ! ปกติประกาศความเป็นส่วนตัวคือกำแพงตัวยาวเหยียดกับปุ่ม &ldquo;ยอมรับทั้งหมด&rdquo; ปุ่มเดียว
            วันนี้ผมจะพาอ่าน<strong>ทีละข้อ</strong> — ข้อความจริงไม่ตัดทอน ผมช่วยแปลเป็นภาษาคน
            แล้วคุณค่อยตัดสินใจเองว่ายอมรับหรือปฏิเสธเป็นราย ๆ ไป
          </Bubble>
        </div>
        <div className="card intro-card">
          <p className="eyebrow">ตัวอย่างประกาศที่ใช้สาธิต</p>
          <h2 className="card-h2">ประกาศความเป็นส่วนตัว (Privacy Notice)</h2>
          <p className="intro-meta">
            {NOTICE_META.company} · {NOTICE_META.effective}
          </p>
          <blockquote className="doc">
            <span className="doc-label">ข้อความจริงจากประกาศ</span>
            <p>{NOTICE_META.intro}</p>
          </blockquote>
          <div className="intro-how">
            <span>
              <Icon name="arrow" /> ปัดขวา / ปุ่ม &ldquo;ยอมรับ&rdquo; = ยินยอมข้อนั้น
            </span>
            <span>
              <Icon name="arrow" /> ปัดซ้าย / ปุ่ม &ldquo;ปฏิเสธ&rdquo; = ไม่ยินยอม (ข้อบังคับจะกดได้แค่ &ldquo;รับทราบ&rdquo;)
            </span>
            <span>
              <Icon name="eye" /> ใช้คีย์บอร์ดได้: ← ปฏิเสธ · → ยอมรับ
            </span>
          </div>
          <button className="btn btn-gold btn-wide btn-hero glow" onClick={() => setPhase('deck')}>
            เริ่มอ่านทีละข้อ ({total} ข้อ)
          </button>
        </div>
      </div>
    );
  }

  /* ---------- summary ---------- */
  if (phase === 'summary') {
    const counts = { accepted: 0, rejected: 0, acknowledged: 0 };
    for (const d of Object.values(decisions)) counts[d]++;
    return (
      <div className="deck-stage">
        <div className="done-banner summary-hero">
          <div className="bob">
            <JaYai pose="salute" priority />
          </div>
          <div>
            <div className="t">ภารกิจสำเร็จ! อ่านครบทั้ง {total} ข้อ</div>
            <p>
              คุณยอมรับ {counts.accepted} · ปฏิเสธ {counts.rejected} · รับทราบข้อบังคับ {counts.acknowledged} —
              นี่แหละการให้ความยินยอมแบบที่ควรเป็น: รู้ว่ากำลังยอมอะไร
            </p>
          </div>
        </div>
        <div className="summary-list">
          {NOTICE_CARDS.map((c) => {
            const d = decisions[c.id];
            return (
              <div key={c.id} className="summary-row">
                <span className="s-title">{c.title}</span>
                <RiskDots risk={c.risk} />
                <span className={`chip decision-${d}`}>
                  {d === 'accepted' ? 'ยอมรับ' : d === 'rejected' ? 'ปฏิเสธ' : 'รับทราบ (บังคับ)'}
                </span>
              </div>
            );
          })}
        </div>
        <div className="summary-actions">
          <button
            className="btn btn-ghost"
            onClick={() => {
              setDecisions({});
              setIndex(0);
              setPhase('intro');
            }}
          >
            เริ่มสาธิตใหม่
          </button>
          <Link className="btn btn-gold glow" href="/insights">
            ไปอ่านเกร็ดน่ารู้ต่อ →
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- deck ---------- */
  const rot = drag.dx * 0.06;
  const stampAccept = Math.min(1, Math.max(0, drag.dx / SWIPE_THRESHOLD));
  const stampReject = Math.min(1, Math.max(0, -drag.dx / SWIPE_THRESHOLD));
  const topStyle = fly
    ? undefined
    : drag.active
      ? { transform: `translate(${drag.dx}px, ${drag.dy * 0.25}px) rotate(${rot}deg)`, transition: 'none' }
      : undefined;

  return (
    <div className="deck-stage">
      <div className="deck-progress">
        <span className="deck-count">
          ข้อ {index + 1}/{total}
        </span>
        <div className="deck-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}>
          <i style={{ width: `${(index / total) * 100}%` }} />
        </div>
      </div>

      <div
        ref={deckRef}
        className="deck"
        role="group"
        aria-label={`การ์ดความยินยอมข้อที่ ${index + 1} จาก ${total}: ${card.title}`}
      >
        {NOTICE_CARDS.slice(index + 1, index + 3)
          .reverse()
          .map((c, i, arr) => (
            <div key={c.id} className="consent-card ghost-card" style={{ ['--depth' as string]: arr.length - i }} aria-hidden="true" />
          ))}

        <article
          key={card.id}
          className={`consent-card top-card ${fly ? `fly-${fly}` : ''} ${shake ? 'shake' : ''}`}
          style={topStyle}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="stamp stamp-accept" style={{ opacity: fly === 'right' ? 1 : stampAccept }}>
            {locked ? 'รับทราบ' : 'ยอมรับ'}
          </div>
          <div className="stamp stamp-reject" style={{ opacity: fly === 'left' ? 1 : stampReject }}>
            ปฏิเสธ
          </div>

          <header className="cc-head">
            <span className={`chip ${card.mode === 'optional' ? 'mode-optional' : 'mode-locked'}`}>
              {card.mode === 'optional' ? (card.beyondCompliance ? 'เลือกได้ (เกินมาตรฐาน)' : 'เลือกได้') : 'บังคับ — รับทราบเท่านั้น'}
            </span>
            <h2>{card.title}</h2>
            <RiskDots risk={card.risk} />
            <p className="cc-riskwhy">{card.riskWhy}</p>
          </header>

          <DocBlock card={card} />

          <CardAnalysis card={card} onScratchState={setScratchState} />

          {locked && (
            <div className="lock-note">
              <Icon name="shield" />
              <div>
                <strong>ทำไมข้อนี้ปฏิเสธไม่ได้?</strong>
                <p>{card.lockReason}</p>
              </div>
            </div>
          )}
        </article>
      </div>

      <div className="deck-controls">
        {locked ? (
          <button className="btn btn-gold btn-wide btn-hero glow" onClick={() => decide('acknowledged')}>
            <Icon name="check" /> รับทราบ ไปข้อถัดไป
          </button>
        ) : (
          <>
            <button className="btn btn-reject" onClick={() => decide('rejected')}>
              ✕ ปฏิเสธ
            </button>
            <button className="btn btn-gold glow btn-accept" onClick={() => decide(locked ? 'acknowledged' : 'accepted')}>
              ✓ ยอมรับ
            </button>
          </>
        )}
      </div>
      <p className="deck-hint">ปัดการ์ดซ้าย/ขวา กดปุ่ม หรือใช้ลูกศร ← → ก็ได้</p>
    </div>
  );
}
