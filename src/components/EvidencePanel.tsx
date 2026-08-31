import { AlertTriangle, FileCheck2, Info, ShieldAlert } from "lucide-react";
import type { EvidenceItem, StageSnapshot } from "../types";

type Props = {
  snapshot: StageSnapshot;
};

function itemClass(tone: EvidenceItem["tone"]) {
  return tone ? `kv-item ${tone}` : "kv-item";
}

function KvList({ items }: { items: EvidenceItem[] }) {
  return (
    <dl className="kv-list">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className={itemClass(item.tone)}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EvidencePanel({ snapshot }: Props) {
  return (
    <aside className="evidence-panel" aria-label="只读证据和正式状态">
      <section className="side-block highlight">
        <div className="side-title">
          <FileCheck2 size={15} aria-hidden="true" />
          <h2>{snapshot.headline}</h2>
        </div>
        <p className="side-status">{snapshot.status}</p>
      </section>

      <section className="side-block">
        <div className="side-title">
          <Info size={15} aria-hidden="true" />
          <h2>{snapshot.evidenceTitle}</h2>
        </div>
        <KvList items={snapshot.evidence} />
      </section>

      <section className="side-block">
        <div className="side-title">
          <AlertTriangle size={15} aria-hidden="true" />
          <h2>{snapshot.coverageTitle}</h2>
        </div>
        <KvList items={snapshot.coverage} />
      </section>

      <section className="side-block">
        <div className="side-title">
          <ShieldAlert size={15} aria-hidden="true" />
          <h2>{snapshot.formalTitle}</h2>
        </div>
        <KvList items={snapshot.formal} />
      </section>

      <section className="side-block boundary">
        <h2>诚信边界</h2>
        <ul>
          {snapshot.limits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
