'use client';

/* Curiosity-gap reveal cards (Loewenstein, 1994): each card opens with a hook
   that names a real risk point from the privacy notice, and the explanation is
   revealed in layers — one tap at a time — to keep cognitive load low.
   Education only: no consent actions live here. */

import Link from 'next/link';
import { useState } from 'react';
import JaYai from '@/components/JaYai';
import Icon from '@/components/Icon';
import { Bubble, Reveal } from '@/components/ui';
import { CURIOSITY_CARDS, type CuriosityCard } from '@/lib/notice';

function Hook({ card }: { card: CuriosityCard }) {
  const [before, after] = card.hook.split(`{${card.hookHighlight}}`);
  return (
    <>
      {before}
      <mark>{card.hookHighlight}</mark>
      {after}
    </>
  );
}

function CuriosityItem({ card, index }: { card: CuriosityCard; index: number }) {
  const [open, setOpen] = useState(0); // how many layers are revealed
  const totalLayers = card.layers.length + 1; // + verbatim quote layer
  const done = open >= totalLayers;

  return (
    <Reveal delay={Math.min(index, 4) * 80}>
      <article className="curio-card">
        <div className="curio-head">
          <JaYai pose={card.pose} />
          <div>
            <h3 className="curio-hook">
              <Hook card={card} />
            </h3>
          </div>
        </div>

        {card.layers.slice(0, open).map((layer) => (
          <div key={layer.label} className="curio-layer">
            <span className="curio-layer-label">{layer.label}</span>
            <p>{layer.text}</p>
          </div>
        ))}

        {open > card.layers.length && (
          <blockquote className="doc curio-quote">
            <span className="doc-label">ข้อความจริงจากประกาศ</span>
            <p>{card.quote}</p>
          </blockquote>
        )}

        {!done ? (
          <button className="curio-more" onClick={() => setOpen((o) => o + 1)} aria-expanded={open > 0}>
            {open === 0 ? 'แตะเพื่อดูคำตอบ' : open < card.layers.length ? 'แล้วไงต่อ?' : 'ขอดูข้อความจริงในประกาศ'}
            <Icon name="arrow" />
          </button>
        ) : (
          <div className="curio-done">
            <Bubble who="จ่าใหญ่สรุป">
              อ่านครบชั้นแล้ว — รู้แบบนี้แล้วตัดสินใจอะไรก็แม่นขึ้นเยอะ ไปลองให้ความยินยอมแบบมีสติกันต่อ
            </Bubble>
            <Link className="btn btn-ghost" href="/consent">
              ลองสาธิตการยินยอม →
            </Link>
          </div>
        )}
      </article>
    </Reveal>
  );
}

export default function CuriosityFeed() {
  return (
    <>
      <Reveal className="bubble-row" delay={60}>
        <div className="bob">
          <JaYai pose="wave" priority />
        </div>
        <Bubble who="จ่าใหญ่ · หัวหน้าสายตรวจข้อมูล">
          เกร็ดพวกนี้ผมคัดมาจากประกาศความเป็นส่วนตัวจริง ๆ ทั้งนั้น แต่ละใบซ่อนคำตอบไว้เป็นชั้น ๆ
          แตะทีละชั้น อ่านทีละนิด ไม่ต้องกลืนกำแพงตัวหนังสือทีเดียว
        </Bubble>
      </Reveal>
      <div className="curio-list">
        {CURIOSITY_CARDS.map((c, i) => (
          <CuriosityItem key={c.id} card={c} index={i} />
        ))}
      </div>
    </>
  );
}
