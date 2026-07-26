/* State + simulated DSR (Data Subject Request) pipeline.
   Requests live in localStorage so status survives page changes.
   Stage progression is time-based to demo the tracker:
     0s → ส่งคำขอแล้ว, 8s → กำลังดำเนินการ, 40s → ลบข้อมูลสำเร็จ
   Elapsed time is mapped onto the 30-day PDPA SLA (5s ≈ 1 วัน). */

import { ITEMS, byId } from './data.js';

const KEY = 'jayai-state-v1';
const PROCESSING_AT = 8_000;
const COMPLETED_AT = 40_000;
const MS_PER_SLA_DAY = 5_000;
export const SLA_DAYS = 30;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

/* first visit: seed one finished and one in-flight request so the
   tracker never opens empty (and moves live during the demo) */
function init() {
  let state = load();
  if (!state) {
    const now = Date.now();
    state = {
      requests: {
        'phone-bigmart': { submittedAt: now - 2 * 86_400_000 },
        'citizenid-connectel': { submittedAt: now - 15_000 },
      },
    };
    save(state);
  }
  return state;
}

export function submitRequest(itemId) {
  const state = init();
  if (!state.requests[itemId]) {
    state.requests[itemId] = { submittedAt: Date.now() };
    save(state);
  }
  return requestFor(itemId);
}

export function requestFor(itemId) {
  const req = init().requests[itemId];
  if (!req) return null;
  const elapsed = Date.now() - req.submittedAt;
  const status = elapsed >= COMPLETED_AT ? 'completed' : elapsed >= PROCESSING_AT ? 'processing' : 'submitted';
  const simDay = Math.min(SLA_DAYS, Math.floor(elapsed / MS_PER_SLA_DAY) + 1);
  const completedDay = Math.min(SLA_DAYS, Math.floor(COMPLETED_AT / MS_PER_SLA_DAY) + 1);
  return {
    itemId,
    submittedAt: req.submittedAt,
    status,
    progress: Math.min(1, elapsed / COMPLETED_AT),
    simDay: status === 'completed' ? completedDay : simDay,
    deadline: new Date(req.submittedAt + SLA_DAYS * 86_400_000),
    isFresh: elapsed < 1_500,
  };
}

export function allRequests() {
  return Object.keys(init().requests)
    .map((id) => requestFor(id))
    .filter(Boolean)
    .sort((a, b) => b.submittedAt - a.submittedAt);
}

/* dashboard aggregates */
export function stats() {
  const reqs = allRequests();
  const completedIds = new Set(reqs.filter((r) => r.status === 'completed').map((r) => r.itemId));
  const activeItems = ITEMS.filter((i) => !completedIds.has(i.id));
  const orgs = new Set(activeItems.map((i) => i.holder));
  const erasedOrgs = new Set(
    ITEMS.filter((i) => completedIds.has(i.id))
      .map((i) => i.holder)
      .filter((h) => ![...orgs].includes(h)),
  );
  const avg = activeItems.length
    ? Math.round(activeItems.reduce((s, i) => s + i.score, 0) / activeItems.length)
    : 0;
  return {
    orgCount: orgs.size,
    erasedOrgCount: erasedOrgs.size,
    itemCount: activeItems.length,
    completedCount: reqs.filter((r) => r.status === 'completed').length,
    inFlightCount: reqs.filter((r) => r.status !== 'completed').length,
    exposure: avg,
    highCount: activeItems.filter((i) => i.tier === 'high').length,
    recommendedItems: ITEMS.filter((i) => i.recommended && !init().requests[i.id]),
    reqs,
  };
}

export function isErased(itemId) {
  const r = requestFor(itemId);
  return r?.status === 'completed';
}

export { byId };
