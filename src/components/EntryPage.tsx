import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical, ShieldCheck, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { narrowDemoDraft } from "../demo-data";
import type { EntryView, NarrowDraft } from "../types";

type Props = {
  view: EntryView;
  onWide: () => void;
  onNarrow: () => void;
  onBack: () => void;
  onSubmitNarrow: (draft: NarrowDraft) => void;
};

const emptyDraft: NarrowDraft = {
  researchQuestion: "",
  materialSystem: "",
  target: "",
  applicationContext: "",
  processBoundary: "",
  evidenceScope: "",
  successCriteria: "",
  exclusions: "",
};

const fields: Array<{ key: keyof NarrowDraft; label: string; placeholder: string; required?: boolean }> = [
  { key: "researchQuestion", label: "具体研究问题", placeholder: "写清你想验证什么", required: true },
  { key: "materialSystem", label: "材料体系", placeholder: "研究对象、原料或对照", required: true },
  { key: "target", label: "目标物种 / 功能", placeholder: "希望得到或验证什么", required: true },
  { key: "applicationContext", label: "应用语境", placeholder: "结果准备服务什么场景" },
  { key: "processBoundary", label: "工艺边界", placeholder: "允许或优先考虑的过程" },
  { key: "evidenceScope", label: "公开证据范围", placeholder: "允许检索哪些公开材料" },
  { key: "successCriteria", label: "成功判据", placeholder: "怎样算公开证据足够" },
  { key: "exclusions", label: "排除项", placeholder: "明确不做什么、不能进入什么" },
];

function EntryHeader() {
  return (
    <header className="entry-header">
      <div><span><FlaskConical size={16} /></span><strong>GOAI 文献 Agent</strong></div>
      <em>公开 Mock Demo</em>
    </header>
  );
}

function StartPage({ onWide, onNarrow }: Pick<Props, "onWide" | "onNarrow">) {
  return (
    <main className="entry-page" aria-labelledby="entry-title">
      <EntryHeader />
      <div className="entry-content">
        <div className="entry-intro">
          <span>研究问题入口</span>
          <h1 id="entry-title">从哪里开始？</h1>
          <p>先选你手里有什么。宽主题由 AI 结合公开论文线索陪你逐步收窄；已有具体问题则填写结构化表格，直接进入 ResearchBrief。</p>
        </div>
        <div className="entry-choices">
          <button type="button" onClick={onWide} aria-label="我只有一个宽主题">
            <span><strong>我只有一个宽主题</strong><small>我有大概方向，但还不知道应该研究哪一个具体问题。</small></span>
            <em><ArrowRight size={15} />进入宽主题对话</em>
          </button>
          <button type="button" onClick={onNarrow} aria-label="我已经有具体研究问题">
            <span><strong>我已经有具体研究问题</strong><small>我知道材料、目标和基本边界，希望直接开始文献研究。</small></span>
            <em><ArrowRight size={15} />填写 ResearchBrief</em>
          </button>
        </div>
        <div className="entry-boundary"><ShieldCheck size={15} /><span>两条入口最终汇合到同一套 B5—B7。所有对话、论文线索和数字均为公开 Mock，不调用模型。</span></div>
      </div>
    </main>
  );
}

function NarrowForm({ onBack, onSubmitNarrow }: Pick<Props, "onBack" | "onSubmitNarrow">) {
  const [draft, setDraft] = useState<NarrowDraft>(emptyDraft);
  const completed = useMemo(() => fields.filter((field) => draft[field.key].trim()).length, [draft]);
  const ready = Boolean(draft.researchQuestion.trim() && draft.materialSystem.trim() && draft.target.trim());

  function update(key: keyof NarrowDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="entry-page narrow-entry" aria-labelledby="narrow-title">
      <EntryHeader />
      <div className="narrow-content">
        <header className="narrow-heading">
          <div><span>B4 · 具体研究问题</span><h1 id="narrow-title">填写 ResearchBrief Draft</h1><p>必填三项即可开始。其余字段可以手工补充，也可以一键填入演示样例。</p></div>
          <div className={ready ? "narrow-readiness ready" : "narrow-readiness"}><CheckCircle2 size={16} /><strong>{completed}/8 已填写</strong><small>{ready ? "可以创建 Mock Run" : "至少填写问题、材料和目标"}</small></div>
        </header>

        <section className="narrow-form-panel" aria-label="具体研究问题表">
          <div className="narrow-form-toolbar">
            <div><strong>研究问题—边界表</strong><span>内容只保存在当前浏览器，冻结前不是正式 Artifact。</span></div>
            <button type="button" onClick={() => setDraft(narrowDemoDraft)}><WandSparkles size={14} />填入演示样例</button>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); if (ready) onSubmitNarrow(draft); }}>
            <table className="narrow-table">
              <tbody>
                {fields.map((field) => (
                  <tr key={field.key}>
                    <th><label htmlFor={`narrow-${field.key}`}>{field.label}{field.required ? <sup>必填</sup> : null}</label></th>
                    <td>
                      {field.key === "researchQuestion" || field.key === "exclusions" ? (
                        <textarea id={`narrow-${field.key}`} value={draft[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} rows={2} />
                      ) : (
                        <input id={`narrow-${field.key}`} value={draft[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="narrow-actions">
              <button type="button" className="secondary" onClick={onBack}><ArrowLeft size={14} />返回入口</button>
              <div><span>{ready ? "创建后直接进入 ResearchBrief Draft，不经过候选方向探索。" : "请先补齐 3 个必填字段。"}</span><button type="submit" className="primary" disabled={!ready}>创建 Mock Run 并进入 ResearchBrief<ArrowRight size={14} /></button></div>
            </footer>
          </form>
        </section>
      </div>
    </main>
  );
}

export function EntryPage(props: Props) {
  if (props.view === "narrow-form") return <NarrowForm onBack={props.onBack} onSubmitNarrow={props.onSubmitNarrow} />;
  return <StartPage onWide={props.onWide} onNarrow={props.onNarrow} />;
}
