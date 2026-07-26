import { jaYaiSVG } from './jayai.js';
import { byId, holderOf, tierOf } from './data.js';
import { requestFor, submitRequest } from './store.js';
import { renderShell, ICONS, FLOW_KIND, pixMeter, tierChip, statusChip, trackerSteps, slaBar, toast, initReveals } from './ui.js';

renderShell('inventory');

const id = new URLSearchParams(location.search).get('id');
const item = byId(id);
const root = document.getElementById('detail-root');

if (!item) {
  root.innerHTML = `<div class="empty card" style="grid-column:1/-1">
    ${jaYaiSVG('think')}
    <p><strong>ไม่พบรายการนี้ในแฟ้ม</strong><br>กลับไปเลือกจากคลังข้อมูลของคุณอีกครั้ง</p>
    <a class="btn btn-gold" href="inventory.html">ไปที่คลังข้อมูล</a>
  </div>`;
} else {
  document.title = `${item.dataType} — จ่าใหญ่`;
  document.getElementById('crumb-here').textContent = item.dataType;
  const h = holderOf(item);

  function flowHTML() {
    return item.flow
      .map((f) => {
        const k = FLOW_KIND[f.kind];
        return `<div class="flow-step kind-${f.kind}">
          <div class="node">
            <div class="n-dot">${ICONS[k.icon]}</div>
            <div class="n-line"></div>
          </div>
          <div class="f-body">
            <div class="f-kind">${k.label}</div>
            <div class="f-org">${f.org}</div>
            <div class="f-lbl">${f.label}</div>
            <div class="f-date">${f.date}</div>
          </div>
        </div>`;
      })
      .join('');
  }

  function ctaHTML(req) {
    if (!req) {
      return `
        ${
          item.recommended
            ? `<div class="bubble-row" style="margin-top:18px">
                ${jaYaiSVG('point')}
                <div>
                  <div class="bubble">
                    <span class="who">จ่าใหญ่ขอแทรก</span>
                    <strong>${item.recommendReason}</strong> — อย่ารอช้า ผมแนะนำให้กดส่งเลย
                  </div>
                  <div class="bubble-tail"></div>
                </div>
              </div>`
            : ''
        }
        <div class="cta-box">
          <button class="btn btn-gold btn-wide glow" id="erase-btn" style="min-height:56px;font-size:18px">
            ${ICONS.trash} 1-Tap ส่งคำขอลบข้อมูล
          </button>
          <p class="cta-note">ส่งคำขอใช้สิทธิ์ลบ (Right to Erasure) ผ่าน Standardized DSR API ไปยัง ${h.name} · องค์กรต้องตอบภายใน 30 วันตาม PDPA</p>
        </div>`;
    }
    return `
      <div class="tracker-card card-deep" style="margin-top:18px">
        <div class="tracker-top">
          <span class="title">สถานะคำขอ DSR</span>
          <span class="spacer"></span>
          ${statusChip(req.status)}
        </div>
        ${trackerSteps(req)}
        ${slaBar(req)}
      </div>
      ${
        req.status === 'completed'
          ? `<div class="done-banner" style="margin-top:14px">
              ${jaYaiSVG('salute')}
              <div>
                <div class="t">ภารกิจสำเร็จ — ${h.name} ลบข้อมูลของคุณแล้ว</div>
                <p>จ่าใหญ่ตรวจรับหลักฐานการลบเรียบร้อย รายการนี้ถูกปลดออกจากคะแนนความเสี่ยงของคุณ</p>
              </div>
            </div>`
          : `<p class="cta-note" style="margin-top:12px">${
              req.status === 'submitted'
                ? `คำขอถูกส่งถึง ${h.name} แล้ว — รอองค์กรยืนยันรับเรื่อง`
                : `${h.name} กำลังดำเนินการลบ — จ่าใหญ่เฝ้าติดตามให้อยู่ ไม่มีหายเงียบแน่นอน`
            }</p>`
      }`;
  }

  function render() {
    const req = requestFor(item.id);
    root.innerHTML = `
      <div>
        <div class="card reveal">
          <div class="detail-head">
            <span class="ico" style="color:var(--cyan)">${ICONS[item.icon]}</span>
            <div>
              <h1>${item.dataType}</h1>
              <div class="h">ถือโดย ${h.name} · ${h.type}</div>
            </div>
          </div>
          <div class="score-row">
            ${pixMeter(item.score, item.tier)}
            ${tierChip(item.tier)}
          </div>
          <p class="cta-note" style="text-align:left;margin-top:10px">สถานะล่าสุด: ${item.lastActivity}</p>
        </div>
        <div class="card reveal" style="margin-top:18px">
          <p class="eyebrow">Data Trail / เส้นทางของข้อมูล</p>
          <h2 style="font-family:var(--font-display);font-size:20px;margin:8px 0 16px">ข้อมูลชิ้นนี้เดินทางไปไหนมาบ้าง</h2>
          <div class="flow">${flowHTML()}</div>
        </div>
      </div>
      <div class="analysis">
        <div class="card reveal">
          <p class="eyebrow">AI Analysis / บทวิเคราะห์</p>
          <div class="bubble-row" style="margin-top:14px">
            ${jaYaiSVG('bulb')}
            <div>
              <div class="bubble">
                <span class="who">จ่าใหญ่วิเคราะห์ · Exposure Score ${item.score}/100</span>
                ${item.risk}
              </div>
              <div class="bubble-tail"></div>
            </div>
          </div>
          <div id="cta-area">${ctaHTML(req)}</div>
        </div>
      </div>`;

    const btn = document.getElementById('erase-btn');
    if (btn)
      btn.addEventListener('click', () => {
        submitRequest(item.id);
        toast(`รับเรื่องแล้ว! ส่งคำขอลบไปยัง ${h.name} ผ่าน DSR API`, 'salute');
        render();
      });
    initReveals();
  }

  render();
  /* keep the tracker live while a request is in flight */
  setInterval(() => {
    const req = requestFor(item.id);
    if (!req) return;
    const area = document.getElementById('cta-area');
    if (area) area.innerHTML = ctaHTML(req);
  }, 1000);
}
