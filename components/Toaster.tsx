'use client';

import { useEffect, useRef, useState } from 'react';
import JaYai, { type PoseName } from './JaYai';

/* fire-and-forget toast bus: any component calls toast(), <Toaster/> renders it */

interface ToastDetail {
  msg: string;
  pose: PoseName;
}

export function toast(msg: string, pose: PoseName = 'thumbs') {
  window.dispatchEvent(new CustomEvent<ToastDetail>('jayai-toast', { detail: { msg, pose } }));
}

export default function Toaster() {
  const [current, setCurrent] = useState<ToastDetail | null>(null);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { detail } = e as CustomEvent<ToastDetail>;
      setCurrent(detail);
      requestAnimationFrame(() => setShow(true));
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), 3600);
    };
    window.addEventListener('jayai-toast', onToast);
    return () => {
      window.removeEventListener('jayai-toast', onToast);
      clearTimeout(timer.current);
    };
  }, []);

  if (!current) return null;
  return (
    <div className={`toast ${show ? 'show' : ''}`} role="status">
      <JaYai pose={current.pose} alt="" />
      <span>{current.msg}</span>
    </div>
  );
}
