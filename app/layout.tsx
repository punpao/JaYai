import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Nav from '@/components/Nav';
import Toaster from '@/components/Toaster';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'จ่าใหญ่ — PDPA Data Guard',
    template: '%s — จ่าใหญ่',
  },
  description:
    'จ่าใหญ่ — เครื่องมือติดตามว่าใครถือข้อมูลส่วนบุคคลของคุณ และสั่งลบได้ในแตะเดียวตามสิทธิ์ PDPA (ต้นแบบ)',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap">
            <div>จ่าใหญ่ — ต้นแบบเครื่องมือติดตามข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</div>
            <div className="mono">PROTOTYPE · MOCK DATA · STANDARDIZED DSR API (SIMULATED)</div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
