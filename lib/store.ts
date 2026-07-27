/* State + simulated DSR (Data Subject Request) pipeline.
   Requests live in localStorage so status survives page changes.
   Stage progression is time-based to demo the tracker:
     0s → ส่งคำขอแล้ว, 8s → กำลังดำเนินการ, 40s → ลบข้อมูลสำเร็จ
   Elapsed time is mapped onto the 30-day PDPA SLA (5s ≈ 1 วัน). */

'use client';

import { useEffect, useState } from 'react';
import { ITEMS, type DataItem } from './data';

export type RequestStatus = 'submitted' | 'processing' | 'completed';

export interface DsrRequest {
  itemId: string;
  submittedAt: number;
  status: RequestStatus;
  progress: number;
  simDay: number;
  deadline: Date;
}

export interface DashboardStats {
  orgCount: number;
  itemCount: number;
  completedCount: number;
  inFlightCount: number;
  exposure: number;
  highCount: number;
  recommendedItems: DataItem[];
  reqs: DsrRequest[];
}

const KEY = 'jayai-state-v1';
const PROCESSING_AT = 8_000;
const COMPLETED_AT = 40_000;
const MS_PER_SLA_DAY = 5_000;
export const SLA_DAYS = 30;

interface StoredState {
  requests: Record<string, { submittedAt: number }>;
}

function load(): StoredState | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? 'null');
  } catch {
    return null;
  }
}

function save(state: StoredState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

/* first visit: seed one finished and one in-flight request so the
   tracker never opens empty (and moves live during the demo) */
function init(): StoredState {
  let state = load();
  if (!state) {
    const now = Date.now();
    state = {
      requests: {
        'phone-bigmart': { submittedAt: now - 2 * 86_400_000 },
        'citizenid-connectel': { submittedAt: now - 15_000 },
      },
    };
    if (typeof window !== 'undefined') save(state);
  }
  return state;
}

export function submitRequest(itemId: string): DsrRequest | null {
  const state = init();
  if (!state.requests[itemId]) {
    state.requests[itemId] = { submittedAt: Date.now() };
    save(state);
  }
  return requestFor(itemId);
}

export function requestFor(itemId: string, now: number = Date.now()): DsrRequest | null {
  const req = init().requests[itemId];
  if (!req) return null;
  const elapsed = now - req.submittedAt;
  const status: RequestStatus =
    elapsed >= COMPLETED_AT ? 'completed' : elapsed >= PROCESSING_AT ? 'processing' : 'submitted';
  const simDay = Math.min(SLA_DAYS, Math.floor(elapsed / MS_PER_SLA_DAY) + 1);
  const completedDay = Math.min(SLA_DAYS, Math.floor(COMPLETED_AT / MS_PER_SLA_DAY) + 1);
  return {
    itemId,
    submittedAt: req.submittedAt,
    status,
    progress: Math.min(1, elapsed / COMPLETED_AT),
    simDay: status === 'completed' ? completedDay : simDay,
    deadline: new Date(req.submittedAt + SLA_DAYS * 86_400_000),
  };
}

export function allRequests(now: number = Date.now()): DsrRequest[] {
  return Object.keys(init().requests)
    .map((id) => requestFor(id, now))
    .filter((r): r is DsrRequest => r !== null)
    .sort((a, b) => b.submittedAt - a.submittedAt);
}

/* dashboard aggregates */
export function stats(now: number = Date.now()): DashboardStats {
  const reqs = allRequests(now);
  const completedIds = new Set(reqs.filter((r) => r.status === 'completed').map((r) => r.itemId));
  const activeItems = ITEMS.filter((i) => !completedIds.has(i.id));
  const orgs = new Set(activeItems.map((i) => i.holder));
  const avg = activeItems.length
    ? Math.round(activeItems.reduce((s, i) => s + i.score, 0) / activeItems.length)
    : 0;
  const requested = new Set(Object.keys(init().requests));
  return {
    orgCount: orgs.size,
    itemCount: activeItems.length,
    completedCount: reqs.filter((r) => r.status === 'completed').length,
    inFlightCount: reqs.filter((r) => r.status !== 'completed').length,
    exposure: avg,
    highCount: activeItems.filter((i) => i.tier === 'high').length,
    recommendedItems: ITEMS.filter((i) => i.recommended && !requested.has(i.id)),
    reqs,
  };
}

/* ticking clock — null on the server / first paint, so pages can render a
   stable shell during static export and hydrate without mismatch */
export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
