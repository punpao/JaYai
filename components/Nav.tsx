'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import JaYai from './JaYai';

const LINKS = [
  { href: '/', label: 'แดชบอร์ด' },
  { href: '/inventory', label: 'คลังข้อมูลของฉัน' },
  { href: '/requests', label: 'คำขอลบข้อมูล', tag: 'DSR' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <Link className="brand" href="/" aria-label="จ่าใหญ่ — หน้าแดชบอร์ด">
          <JaYai pose="crossed" alt="" priority />
          <span>
            <span className="brand-name">จ่าใหญ่</span>
            <br />
            <span className="brand-sub">PDPA Data Guard</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="เมนูหลัก">
          {LINKS.map(({ href, label, tag }) => (
            <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}>
              {label}
              {tag && <span className="tag">{tag}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
