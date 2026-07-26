/* Shared UI: SVG icons, nav, chips, pixel meter, DSR tracker, toast, reveals */

import { jaYaiSVG } from './jayai.js';
import { TIER } from './data.js';
import { SLA_DAYS } from './store.js';

/* ---------- icons (24×24, stroke) ---------- */
const P = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}${extra}</svg>`;

export const ICONS = {
  phone: P('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2z"/>'),
  cart: P('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>'),
  idcard: P('<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8.5" cy="11" r="2.5"/><path d="M14 9h6M14 13h6M4.5 18c.7-2 2.2-3 4-3s3.3 1 4 3"/>'),
  contacts: P('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'),
  pin: P('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
  health: P('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/><path d="M3.5 12H9l1.5-3 3 6L15 12h5.5"/>'),
  sim: P('<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="8" y="12" width="8" height="6" rx="1"/><path d="M12 12v6M8 15h8"/>'),
  bed: P('<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>'),
  profile: P('<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/><circle cx="7" cy="14" r="1"/><circle cx="11" cy="10" r="1"/><circle cx="14" cy="13" r="1"/><circle cx="19" cy="7" r="1"/>'),
  mail: P('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  building: P('<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>'),
  shield: P('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  check: P('<path d="M20 6 9 17l-5-5"/>'),
  send: P('<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>'),
  gear: P('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  arrow: P('<path d="M5 12h14M12 5l7 7-7 7"/>'),
  eye: P('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
  alert: P('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
  trash: P('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/>'),
  db: P('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.7-4 3-9 3s-9-1.3-9-3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/>'),
};

export const FLOW_KIND = {
  collect: { label: 'จัดเก็บ / COLLECTED', icon: 'db' },
  store: { label: 'เก็บรักษา / STORED', icon: 'building' },
  share: { label: 'ส่งต่อ / SHARED', icon: 'send' },
  broker: { label: 'นายหน้าข้อมูล / BROKER', icon: 'alert' },
};

/* ---------- nav + footer ---------- */
export function renderShell(active) {
  const links = [
    ['index.html', 'แดชบอร์ด', 'dashboard'],
    ['inventory.html', 'คลังข้อมูลของฉัน', 'inventory'],
    ['requests.html', 'คำขอลบข้อมูล', 'requests'],
  ];
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `
    <div class="wrap nav-inner">
      <a class="brand" href="index.html" aria-label="จ่าใหญ่ — หน้าแดชบอร์ด">
        ${jaYaiSVG('crossed')}
        <span>
          <span class="brand-name">จ่าใหญ่</span><br>
          <span class="brand-sub">PDPA Data Guard</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="เมนูหลัก">
        ${links
          .map(
            ([href, label, key]) =>
              `<a href="${href}" ${key === active ? 'aria-current="page"' : ''}>${label}${
                key === 'requests' ? '<span class="tag">DSR</span>' : ''
              }</a>`,
          )
          .join('')}
      </nav>
    </div>`;
  document.body.prepend(nav);
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

  const foot = document.createElement('footer');
  foot.className = 'footer';
  foot.innerHTML = `
    <div class="wrap">
      <div>จ่าใหญ่ — ต้นแบบเครื่องมือติดตามข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</div>
      <div class="mono">PROTOTYPE · MOCK DATA · STANDARDIZED DSR API (SIMULATED)</div>
    </div>`;
  document.body.append(foot);
}

/* ---------- small components ---------- */
export const tierChip = (tierKey) => {
  const t = TIER[tierKey];
  return `<span class="chip ${tierKey}">${t.label}</span>`;
};

export const STATUS = {
  submitted: 'ส่งคำขอแล้ว',
  processing: 'กำลังดำเนินการ',
  completed: 'ลบข้อมูลสำเร็จ',
};

export const statusChip = (status) => `<span class="chip status-${status}">${STATUS[status]}</span>`;

export function pixMeter(score, tierKey) {
  const cells = 10;
  const on = Math.round((score / 100) * cells);
  const color = TIER[tierKey].color;
  let html = `<div class="pixmeter" role="img" aria-label="คะแนนความเสี่ยง ${score} จาก 100" style="--meter:${color}">`;
  for (let i = 0; i < cells; i++) html += `<span class="cell ${i < on ? 'on' : ''}"></span>`;
  html += `<span class="val" style="color:${color}">${score}</span></div>`;
  return html;
}

/* DSR stepper: Submitted → Processing → Completed */
export function trackerSteps(req) {
  const order = ['submitted', 'processing', 'completed'];
  const idx = order.indexOf(req.status);
  const icons = ['send', 'gear', 'check'];
  return `<div class="steps" role="list" aria-label="สถานะคำขอลบข้อมูล">
    ${order
      .map((s, i) => {
        const cls = i < idx ? 'done' : i === idx ? (s === 'completed' ? 'done final' : 'now') : '';
        return `<div class="step ${cls}" role="listitem">
          <div class="bar"><i></i></div>
          <div class="dot">${ICONS[icons[i]]}</div>
          <div class="s-lbl">${STATUS[s]}</div>
        </div>`;
      })
      .join('')}
  </div>`;
}

export function slaBar(req) {
  const done = req.status === 'completed';
  const pct = done ? 100 : Math.round(req.progress * 100);
  const deadline = req.deadline.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  return `<div class="sla ${done ? 'ok' : ''}">
    <div class="sla-top">
      <span>กรอบเวลาตามกฎหมาย ${SLA_DAYS} วัน · ครบกำหนด ${deadline}</span>
      <span class="day">${done ? `เสร็จในวันที่ ${req.simDay}/${SLA_DAYS} ✓` : `วันที่ ${req.simDay}/${SLA_DAYS}`}</span>
    </div>
    <div class="rail"><i style="width:${pct}%"></i></div>
  </div>`;
}

/* ---------- toast ---------- */
let toastEl, toastTimer;
export function toast(msg, pose = 'thumbs') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    document.body.append(toastEl);
  }
  toastEl.innerHTML = `${jaYaiSVG(pose)}<span>${msg}</span>`;
  requestAnimationFrame(() => toastEl.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3600);
}

/* ---------- scroll reveals + count up ---------- */
export function initReveals() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { threshold: 0.12 },
  );
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 4) * 80}ms`;
    io.observe(el);
  });
}

export function countUp(el, to, ms = 800) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = to;
    return;
  }
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / ms);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
