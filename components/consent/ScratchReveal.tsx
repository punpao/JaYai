'use client';

/* Thai scratch-lottery style reveal: a gold foil canvas covers the content;
   scratching (touch or mouse) erases it with destination-out. Always paired
   with a visible "เปิดดูเลย" fallback button so the interaction never blocks
   progress (and stays keyboard-accessible). */

import { useEffect, useRef, useState, type ReactNode } from 'react';

const CLEAR_THRESHOLD = 0.45;
const BRUSH = 26;

export default function ScratchReveal({
  children,
  onScratchStart,
  onRevealed,
}: {
  children: ReactNode;
  onScratchStart?: () => void;
  onRevealed?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);
  const scratchingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const paint = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      /* gold foil with diagonal shine stripes */
      ctx.fillStyle = '#f7d047';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(199, 158, 43, 0.5)';
      for (let x = -height; x < width; x += 26) {
        ctx.save();
        ctx.translate(x, 0);
        ctx.rotate((28 * Math.PI) / 180);
        ctx.fillRect(0, -height, 10, height * 3);
        ctx.restore();
      }
      ctx.fillStyle = '#020c2c';
      ctx.font = "600 15px Kanit, 'Prompt', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ขูดตรงนี้ เปิดคำวิเคราะห์ของจ่าใหญ่', width / 2, height / 2 - 12);
      ctx.font = "400 12.5px 'Prompt', sans-serif";
      ctx.fillText('ลากนิ้วหรือเมาส์ถูไปมาเหมือนลอตเตอรี่ขูด', width / 2, height / 2 + 14);
    };
    paint();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scratchAt = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(((clientX - r.left) * canvas.width) / r.width, ((clientY - r.top) * canvas.height) / r.height, BRUSH * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const clearedRatio = () => {
      const { width, height } = canvas;
      if (!width || !height) return 0;
      const step = 12;
      const data = ctx.getImageData(0, 0, width, height).data;
      let clear = 0;
      let total = 0;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          total++;
          if (data[(y * width + x) * 4 + 3] === 0) clear++;
        }
      }
      return total ? clear / total : 0;
    };

    const down = (e: PointerEvent) => {
      scratchingRef.current = true;
      canvas.setPointerCapture(e.pointerId);
      if (!startedRef.current) {
        startedRef.current = true;
        onScratchStart?.();
      }
      scratchAt(e.clientX, e.clientY);
    };
    const move = (e: PointerEvent) => {
      if (!scratchingRef.current) return;
      scratchAt(e.clientX, e.clientY);
    };
    const up = () => {
      if (!scratchingRef.current) return;
      scratchingRef.current = false;
      if (clearedRatio() >= CLEAR_THRESHOLD) reveal();
    };

    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reveal = () => {
    setFading(true);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(
      () => {
        setRevealed(true);
        onRevealed?.();
      },
      reduced ? 0 : 350,
    );
  };

  return (
    <div>
      <div ref={wrapRef} className="scratch-wrap">
        {children}
        {!revealed && <canvas ref={canvasRef} className={`scratch-foil ${fading ? 'fading' : ''}`} aria-hidden="true" />}
      </div>
      {!revealed && (
        <button type="button" className="scratch-skip" onClick={reveal}>
          ขูดไม่ถนัด? เปิดดูเลย
        </button>
      )}
    </div>
  );
}
