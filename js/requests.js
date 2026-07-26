import { jaYaiSVG } from './jayai.js';
import { byId, holderOf } from './data.js';
import { allRequests } from './store.js';
import { renderShell, trackerSteps, slaBar, statusChip, initReveals } from './ui.js';

renderShell('requests');

const TABS = [
  ['all', 'ทั้งหมด'],
  ['active', 'กำลังดำเนินการ'],
  ['completed', 'สำเร็จแล้ว'],
];
let active = 'all';
let revealed = false;

function renderTabs() {
  document.getElementById('tabs').innerHTML = TABS.map(
    ([key, label]) => `<button class="filter-btn" aria-pressed="${key === active}" data-t="${key}">${label}</button>`,
  ).join('');
  document.querySelectorAll('[data-t]').forEach((b) =>
    b.addEventListener('click', () => {
      active = b.dataset.t;
      revealed = false;
      renderTabs();
      render();
    }),
  );
}

function render() {
  const reqs = allRequests().filter((r) =>
    active === 'all' ? true : active === 'completed' ? r.status === 'completed' : r.status !== 'completed',
  );
  const el = document.getElementById('req-list');
  el.innerHTML = reqs.length
    ? reqs
        .map((req) => {
          const item = byId(req.itemId);
          const h = holderOf(item);
          const when = new Date(req.submittedAt).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: '2-digit',
          });
          return `<article class="tracker-card ${revealed ? '' : 'reveal'}">
            <div class="tracker-top">
              <span class="title"><a href="item.html?id=${item.id}" style="text-decoration:underline;text-underline-offset:4px">${item.dataType}</a></span>
              <span class="org">· ${h.name} · ยื่นเมื่อ ${when}</span>
              <span class="spacer"></span>
              ${statusChip(req.status)}
            </div>
            ${trackerSteps(req)}
            ${slaBar(req)}
          </article>`;
        })
        .join('')
    : `<div class="empty card">
        ${jaYaiSVG('think')}
        <p>${active === 'completed' ? 'ยังไม่มีคำขอที่เสร็จสิ้นในหมวดนี้' : 'ไม่มีคำขอในหมวดนี้'} — เริ่มจากส่องคลังข้อมูลของคุณก่อน</p>
        <a class="btn btn-gold" href="inventory.html">ไปที่คลังข้อมูล</a>
      </div>`;
  if (!revealed) {
    initReveals();
    revealed = true;
  }
}

renderTabs();
render();
setInterval(render, 1000);
