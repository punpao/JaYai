import { mountJaYai } from './jayai.js';
import { ITEMS, holderOf } from './data.js';
import { isErased, requestFor } from './store.js';
import { renderShell, ICONS, tierChip, statusChip, initReveals } from './ui.js';

renderShell('inventory');
mountJaYai(document.getElementById('inv-mascot'), 'magnify', { title: 'จ่าใหญ่ส่องข้อมูลด้วยแว่นขยาย' });

const FILTERS = [
  ['all', 'ทั้งหมด'],
  ['reco', 'จ่าใหญ่แนะนำให้ลบ'],
  ['high', 'เสี่ยงสูง'],
  ['medium', 'เสี่ยงปานกลาง'],
  ['low', 'เสี่ยงต่ำ'],
];
let active = 'all';
let lastSig = '';

function shareTrail(item) {
  const shares = item.flow.filter((f) => f.kind === 'share' || f.kind === 'broker');
  if (!shares.length) return `<span>เก็บไว้ที่ผู้ให้บริการเท่านั้น</span>`;
  return `${ICONS.send}<span>ส่งต่อ ${shares.length} ทอด →</span><span class="to">${shares[shares.length - 1].org}</span>`;
}

function renderFilters() {
  document.getElementById('filters').innerHTML = FILTERS.map(
    ([key, label]) =>
      `<button class="filter-btn" aria-pressed="${key === active}" data-f="${key}">${label}</button>`,
  ).join('');
  document.querySelectorAll('[data-f]').forEach((b) =>
    b.addEventListener('click', () => {
      active = b.dataset.f;
      renderFilters();
      renderList();
    }),
  );
}

function renderList() {
  const items = ITEMS.filter((i) => {
    if (active === 'all') return true;
    if (active === 'reco') return i.recommended;
    return i.tier === active;
  }).sort((a, b) => b.score - a.score);

  document.getElementById('inv-list').innerHTML = items
    .map((item) => {
      const erased = isErased(item.id);
      const req = requestFor(item.id);
      const h = holderOf(item);
      return `<a class="inv-row reveal ${erased ? 'erased-row' : ''}" href="item.html?id=${item.id}">
        <span class="ico" style="color:${erased ? 'var(--risk-low)' : 'var(--cyan)'}">${ICONS[item.icon]}</span>
        <span class="what">
          <span class="t">${item.dataType}</span>
          <span class="h">${h.name} · ${h.type}</span>
          ${item.recommended && !req ? `<span class="flag">${ICONS.alert} จ่าใหญ่แนะนำให้ส่งคำขอลบ</span>` : ''}
        </span>
        <span class="trail">${shareTrail(item)}</span>
        <span>${req ? statusChip(req.status) : tierChip(item.tier)}</span>
        <span class="go">${ICONS.arrow}</span>
      </a>`;
    })
    .join('');
  initReveals();
}

renderFilters();
renderList();
lastSig = statusSig();

/* refresh only when a request actually changes stage */
function statusSig() {
  return ITEMS.map((i) => requestFor(i.id)?.status ?? '-').join('|') + active;
}
setInterval(() => {
  const sig = statusSig();
  if (sig !== lastSig) {
    lastSig = sig;
    renderList();
  }
}, 1500);
