'use client';

import Link from 'next/link';
import { byId, holderOf } from '@/lib/data';
import type { DsrRequest } from '@/lib/store';
import { SlaBar, StatusChip, TrackerSteps } from './ui';

/* one DSR request rendered as a package-tracking card */
export default function TrackerCard({ req, linkTitle = false }: { req: DsrRequest; linkTitle?: boolean }) {
  const item = byId(req.itemId);
  if (!item) return null;
  const h = holderOf(item);
  const when = new Date(req.submittedAt).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
  return (
    <article className="tracker-card">
      <div className="tracker-top">
        <span className="title">
          {linkTitle ? <Link className="title-link" href={`/item/${item.id}`}>{item.dataType}</Link> : item.dataType}
        </span>
        <span className="org">
          · {h.name}
          {linkTitle && <> · ยื่นเมื่อ {when}</>}
        </span>
        <span className="spacer" />
        <StatusChip status={req.status} />
      </div>
      <TrackerSteps req={req} />
      <SlaBar req={req} />
    </article>
  );
}
