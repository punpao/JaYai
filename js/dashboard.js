import { mountJaYai, jaYaiSVG } from './jayai.js';
import { ITEMS, byId, holderOf, TIER } from './data.js';
import { stats, submitRequest } from './store.js';
import { renderShell, ICONS, trackerSteps, slaBar, statusChip, pixMeter, tierChip, initReveals, countUp, toast } from './ui.js';

renderShell('dashboard');
mountJaYai(document.getElementById('hero-mascot'), 'clipboard', { title: 'จ่าใหญ่ถือแฟ้มรายงาน' });

const overallTier = (score) => (score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low');

function verdictText(s) {
  if (s.highCount >= 3)
    return `ผมไล่ดูแฟ้มแล้ว มีข้อมูลระดับ<strong>เสี่ยงสูงถึง ${s.highCount} รายการ</strong> โดยเฉพาะพวกแอปกู้เงินกับนายหน้าข้อมูล อย่าปล่อยไว้ จัดการตามที่ผมแนะนำด้านล่างเลย`;
  if (s.highCount > 0)
    return `สถานการณ์ดีขึ้นแล้ว แต่ยังเหลือรายการเสี่ยงสูงอีก <strong>${s.highCount} รายการ</strong> ที่ผมอยากให้เก็บให้จบ`;
  return `<strong>เยี่ยมมาก!</strong> ตอนนี้ไม่เหลือรายการเสี่ยงสูงในแฟ้มของคุณแล้ว ผมจะเฝ้าระวังต่อไปให้เอง`;
}

let firstRender = true;

function render() {
  const s = stats();

  /* hero */
  document.getElementById('hero-headline').innerHTML =
    `ข้อมูลของคุณอยู่ในมือ <span class="accent">${s.orgCount} องค์กร</span> รวม ${s.itemCount} รายการ`;
  document.getElementById('hero-sub').textContent =
    'จ่าใหญ่รวบรวมจากบัญชีและความยินยอมที่คุณเคยให้ไว้ ตรวจดูว่าใครถืออะไร แล้วใช้สิทธิ์สั่งลบได้ในแตะเดียว';
  const tier = overallTier(s.exposure);
  document.getElementById('hero-meter').innerHTML = pixMeter(s.exposure, tier);
  const tc = document.getElementById('hero-tier-chip');
  tc.hidden = false;
  tc.className = `chip ${tier}`;
  tc.textContent = `ระดับความเสี่ยงรวม: ${TIER[tier].label}`;
  const verdict = document.getElementById('hero-verdict');
  verdict.hidden = false;
  document.getElementById('hero-verdict-text').innerHTML = verdictText(s);

  /* stats */
  const tiles = [
    { num: s.orgCount, lbl: 'องค์กรที่ถือข้อมูลของคุณ', icon: 'building', tone: '' },
    { num: s.highCount, lbl: 'รายการความเสี่ยงสูง', icon: 'alert', tone: 'high' },
    { num: s.inFlightCount, lbl: 'คำขอที่กำลังดำเนินการ', icon: 'gear', tone: 'gold' },
    { num: s.completedCount, lbl: 'ลบสำเร็จแล้ว', icon: 'check', tone: 'ok' },
  ];
  const statsEl = document.getElementById('stats');
  statsEl.innerHTML = tiles
    .map(
      (t, i) => `<div class="stat reveal in" data-tone="${t.tone}">
        <div class="ico" style="color:${t.tone === 'ok' ? 'var(--risk-low)' : 'var(--cyan)'}">${ICONS[t.icon]}</div>
        <div class="num" data-n="${t.num}">${firstRender ? 0 : t.num}</div>
        <div class="lbl">${t.lbl}</div>
      </div>`,
    )
    .join('');
  if (firstRender) statsEl.querySelectorAll('.num').forEach((el) => countUp(el, +el.dataset.n));

  /* in-flight + recent trackers */
  const list = document.getElementById('tracker-list');
  const shown = s.reqs.slice(0, 3);
  list.innerHTML = shown.length
    ? shown
        .map((req) => {
          const item = byId(req.itemId);
          return `<article class="tracker-card ${firstRender ? 'reveal' : ''}">
            <div class="tracker-top">
              <span class="title">${item.dataType}</span>
              <span class="org">· ${holderOf(item).name}</span>
              <span class="spacer"></span>
              ${statusChip(req.status)}
            </div>
            ${trackerSteps(req)}
            ${slaBar(req)}
          </article>`;
        })
        .join('')
    : `<div class="empty card">${jaYaiSVG('think')}<p>ยังไม่มีคำขอลบข้อมูล — ไปเลือกจากคลังข้อมูลของคุณได้เลย</p></div>`;

  /* recommendations */
  const recoEl = document.getElementById('reco-list');
  const recos = s.recommendedItems.slice(0, 4);
  recoEl.innerHTML = recos.length
    ? recos
        .map(
          (item, i) => `<article class="reco ${firstRender ? 'reveal' : ''}">
            ${jaYaiSVG(i % 2 ? 'magnify' : 'point')}
            <div>
              <div class="r-title">${item.dataType} ${tierChip(item.tier)}</div>
              <div class="r-org">ถือโดย ${holderOf(item).name} · ${holderOf(item).type}</div>
              <p class="r-why">“${item.recommendReason}”</p>
              <div class="r-act">
                <button class="btn btn-gold glow" data-erase="${item.id}">${ICONS.trash} ส่งคำขอลบทันที</button>
                <a class="btn btn-ghost" href="item.html?id=${item.id}">ดูรายละเอียด</a>
              </div>
            </div>
          </article>`,
        )
        .join('')
    : `<div class="empty card" style="grid-column:1/-1">${jaYaiSVG('salute')}<p><strong>ภารกิจครบถ้วน!</strong> รายการที่จ่าใหญ่แนะนำถูกส่งคำขอลบหมดแล้ว</p></div>`;

  recoEl.querySelectorAll('[data-erase]').forEach((btn) =>
    btn.addEventListener('click', () => {
      submitRequest(btn.dataset.erase);
      toast('รับทราบ! ส่งคำขอผ่าน DSR API แล้ว ผมจะตามให้จนจบ', 'salute');
      firstRender = false;
      render();
      document.getElementById('tracking-section').scrollIntoView({ behavior: 'smooth' });
    }),
  );

  if (firstRender) {
    firstRender = false;
    initReveals();
  }
}

render();
setInterval(render, 1000);
