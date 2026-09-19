import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  CircleDashed,
  FileCheck2,
  Files,
  GitCompareArrows,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import type { DirectionCandidate, EntryPath, NarrowDraft, StageId } from "../types";

type Props = {
  stage: StageId;
  entryPath: EntryPath | null;
  directionsReady: boolean;
  wideQaStep: number;
  selectedDirection: string | null;
  narrowDraft: NarrowDraft | null;
  candidates: DirectionCandidate[];
  b5Step: number;
  b6Challenged: boolean;
  gapFrozen: boolean;
  handoffApproved: boolean;
  onSelectDirection: (candidateId: string) => void;
};

function themeRows(step: number) {
  const waiting = "等待本轮回答";
  return [
    ["宽主题", step >= 1 ? "废旧磷酸铁基正极的高值化利用" : waiting],
    ["材料体系", step >= 1 ? "废旧磷酸铁基正极；相邻含铁固废只作公开参照" : waiting],
    ["应用语境", step >= 2 ? "面向水处理的氧化功能材料" : waiting],
    ["价值目标", step >= 2 ? "优先直接利用原料中的铁，并保留短周期可验证性" : waiting],
    ["公开检索范围", step >= 3 ? "公开论文摘要、元数据与可合法读取的公开全文" : waiting],
    ["约束", step >= 3 ? "两到四周小试；常规电化学、UV–Vis 与 XRD" : waiting],
    ["不做事项", step >= 3 ? "排除含氯路线、内部样品经验、精确配方和未公开结论" : waiting],
    ["待澄清", step >= 3 ? "产物评价口径与杂质影响保留给后续研究" : waiting],
  ];
}

function SectionTitle({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <header className="detail-title">
      <div>{icon}<h2>{title}</h2></div>
      <span>{meta}</span>
    </header>
  );
}

function NarrowBriefDetails({ draft }: { draft: NarrowDraft }) {
  const rows: Array<[string, string]> = [
    ["研究问题", draft.researchQuestion], ["材料体系", draft.materialSystem], ["目标物种 / 功能", draft.target],
    ["应用语境", draft.applicationContext], ["工艺边界", draft.processBoundary], ["公开证据范围", draft.evidenceScope],
    ["成功判据", draft.successCriteria], ["排除项", draft.exclusions],
  ];
  return (
    <>
      <section className="detail-card theme-draft">
        <SectionTitle icon={<FileCheck2 size={16} />} title="ResearchBrief Draft" meta="具体问题入口 · 等待 G1" />
        <div className="draft-readiness complete"><CheckCircle2 size={16} /><div><strong>已跳过主题候选探索</strong><p>入口选择被显式记录；冻结后与宽入口汇合到同一套 B5。</p></div></div>
        <dl className="draft-grid">
          {rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "未填写 · 可在讨论中补充"}</dd></div>)}
        </dl>
        <footer>表格只是浏览器 Draft。点击上方最新 AI 消息里的冻结动作后，才生成 G1 Mock 记录。</footer>
      </section>
      <section className="detail-card evidence-ledger">
        <SectionTitle icon={<BookOpenCheck size={16} />} title="入口与正式记录" meta="DIRECT ENTRY · CONTROLLED_E2E" />
        <div className="evidence-ledger-grid">
          <article><span>入口来源</span><strong>具体研究问题</strong><p>没有静默跳过 B3；页面明确记录直接进入 B4 ResearchBrief。</p><em>HUMAN INPUT · Draft</em></article>
          <article><span>公开检索</span><strong>尚未启动</strong><p>只有 G1 冻结后，B5 才会沿固定问题自动研究。</p><em>WAITING G1</em></article>
          <article><span>正式记录</span><strong>ResearchBrief · Mock Draft v1</strong><p>当前可讨论、可修改，但尚未形成正式 Artifact。</p><em>DRAFT</em></article>
        </div>
      </section>
    </>
  );
}

function B3Details({ entryPath, wideQaStep, narrowDraft, directionsReady, selectedDirection, candidates, onSelectDirection }: Pick<Props, "entryPath" | "wideQaStep" | "narrowDraft" | "directionsReady" | "selectedDirection" | "candidates" | "onSelectDirection">) {
  if (entryPath === "narrow" && narrowDraft) return <NarrowBriefDetails draft={narrowDraft} />;
  const draftReady = wideQaStep >= 3;
  const missingCount = [5, 3, 1, 0][Math.min(wideQaStep, 3)];
  return (
    <>
      <section className="detail-card theme-draft">
        <SectionTitle icon={<FileCheck2 size={16} />} title="主题边界草稿" meta={directionsReady ? "ThemeBrief · Mock v1" : "讨论草稿 · 浏览器内存"} />
        <div className={`draft-readiness ${draftReady ? "complete" : "warning"}`}>
          {draftReady ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <div><strong>{draftReady ? "已满足主题确认条件" : `还缺 ${missingCount} 项主题边界`}</strong><p>{draftReady ? directionsReady ? "G0 Mock 记录已回读，候选方向可比较。" : "请检查字段和论文线索，再点击最新 AI 消息中的正式动作。" : "每发送一次回答，AI 只补最影响下一步的字段。"}</p></div>
        </div>
        <dl className="draft-grid">
          {themeRows(wideQaStep).map(([label, value]) => <div className={value === "等待本轮回答" ? "missing" : ""} key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <footer>草稿需要继续讨论；正式确认动作只出现在最新 AI 阶段结消息中。</footer>
      </section>

      {wideQaStep >= 1 ? (
        <section className="detail-card literature-scan">
          <SectionTitle icon={<SearchCheck size={16} />} title="本轮公开论文线索" meta={`快速扫描 ${Math.min(wideQaStep, 2)}/2 · MOCK`} />
          <p className="detail-lead">这些是用于引导收窄的改写线索，不是实时检索结果，也不证明目标原料已经实现对应路线。</p>
          <div className="scan-list">
            <article><span>PAPER-01 · 相邻证据</span><strong>铁基废料资源化与含铁物种回收</strong><p>提示“直接利用铁源”可以成为候选比较轴；目标材料适用性仍未知。</p><em>PUBLIC ABSTRACT · Mock locator</em></article>
            <article><span>PAPER-02 · 方法近邻</span><strong>碱性电化学体系中的高价铁生成</strong><p>提供电位、碱度和阳极状态等检索词；不能直接外推到复杂废旧正极。</p><em>PUBLIC METADATA · Mock locator</em></article>
            <article><span>PAPER-03 · 应用近邻</span><strong>高铁酸盐在抗生素废水处理中的氧化应用</strong><p>帮助把“高值化”连接到可测功能；产物来源与性能仍需分开验证。</p><em>PUBLIC ABSTRACT · Mock locator</em></article>
          </div>
        </section>
      ) : null}

      {directionsReady ? (
        <section className="detail-card candidate-comparison">
          <SectionTitle icon={<GitCompareArrows size={16} />} title="候选方向比较" meta="4 个公开 Mock 候选" />
          <p className="detail-lead">这里复现参赛版“择优讨论”的核心交互。证据、未知和风险同时展示，选择不是把候选写成科研结论。</p>
          <div className="direction-grid">
            {candidates.map((candidate, index) => {
              const selected = selectedDirection === candidate.id;
              return (
                <article className={`direction-card ${selected ? "selected" : ""}`} key={candidate.id}>
                  <header><span>候选 {index + 1}</span><strong>{candidate.title}</strong>{selected ? <em>已选择</em> : null}</header>
                  <p>{candidate.summary}</p>
                  <dl>
                    <div><dt>区别</dt><dd>{candidate.difference}</dd></div>
                    <div><dt>公开依据 · Mock</dt><dd>{candidate.evidence.join("；")}</dd></div>
                    <div><dt>未知</dt><dd>{candidate.unknowns.join("；")}</dd></div>
                    <div><dt>风险</dt><dd>{candidate.risks.join("；")}</dd></div>
                  </dl>
                  <button type="button" onClick={() => onSelectDirection(candidate.id)} disabled={Boolean(selectedDirection)}>
                    {selected ? <CheckCircle2 size={15} /> : <CircleDashed size={15} />}
                    {selected ? "当前选择" : "选择并继续讨论"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="detail-card evidence-ledger">
        <SectionTitle icon={<BookOpenCheck size={16} />} title="公开证据与正式记录" meta="只读 · CONTROLLED_E2E" />
        <div className="evidence-ledger-grid">
          <article><span>公开证据摘要 01</span><strong>铁基阳极与高价铁生成的相邻方法</strong><p>只展示改写摘要和公开定位标签，不保存全文。</p><em>LITERATURE_FACT · Mock locator</em></article>
          <article><span>公开证据摘要 02</span><strong>碱性体系中的过程条件窗口</strong><p>用于比较候选差异，不足以证明具体路线成立。</p><em>UNVERIFIED · 待 B5 复核</em></article>
          <article><span>正式记录</span><strong>{selectedDirection ? "DirectionDecision · Mock v1" : directionsReady ? "ThemeBrief · Mock v1" : "DiscussionDraft · browser memory"}</strong><p>普通讨论只留在当前浏览器；正式动作才生成 Mock 回执。</p><em>{selectedDirection ? "WAITING G0" : "DRAFT"}</em></article>
        </div>
      </section>
    </>
  );
}

function B5Details({ b5Step }: Pick<Props, "b5Step">) {
  const steps = [
    ["检索规划", "固定公开查询维度和排除边界"],
    ["候选筛选", "纳入 3 / 排除 2 / 待核 1"],
    ["抽取与综合", "证据摘录 3 / 工艺记录 2 / 冲突 1"],
  ];
  return (
    <>
      <section className="detail-card">
        <SectionTitle icon={<SearchCheck size={16} />} title="自动研究进度" meta={`${b5Step}/3 · Mock 自动推进`} />
        <div className="research-progress">
          {steps.map(([title, detail], index) => <article className={b5Step > index ? "done" : b5Step === index ? "active" : ""} key={title}><span>{b5Step > index ? <CheckCircle2 size={16} /> : <CircleDashed size={16} />}</span><div><strong>{title}</strong><p>{detail}</p></div><em>{b5Step > index ? "完成" : b5Step === index ? "处理中" : "等待"}</em></article>)}
        </div>
      </section>
      <section className="detail-card">
        <SectionTitle icon={<Files size={16} />} title="证据、知识覆盖与正式产物" meta="不含 raw Run / 全文" />
        <div className="artifact-grid">
          <article><span>EvidenceBundle</span><strong>{b5Step >= 3 ? "Mock Accepted" : "Building"}</strong><p>公开定位标签、改写摘录、支持边界与冲突记录。</p></article>
          <article><span>KnowledgeBase</span><strong>{b5Step >= 3 ? "2 covered / 1 partial" : "Waiting synthesis"}</strong><p>把问题、过程条件、证据和未知关联起来。</p></article>
          <article><span>ConflictNote</span><strong>{b5Step >= 3 ? "1 boundary conflict retained" : "Pending"}</strong><p>不把相邻方法自动合并成同一个科学事实。</p></article>
        </div>
      </section>
    </>
  );
}

function B6Details({ b6Challenged, gapFrozen }: Pick<Props, "b6Challenged" | "gapFrozen">) {
  return (
    <>
      <section className="detail-card gap-candidate">
        <SectionTitle icon={<GitCompareArrows size={16} />} title="Gap 候选与反向查新" meta={gapFrozen ? "FROZEN · Mock v1" : b6Challenged ? "SURVIVED · 等待冻结" : "PENDING CHALLENGE"} />
        <div className="gap-statement"><span>候选 Gap · Mock</span><strong>公开方法对复杂废旧正极基体中的持续 Fe(VI) 生成边界仍未闭合。</strong><p>这是一条待挑战的产品候选，不是“真实世界无人研究”的断言。</p></div>
        <div className="query-grid">
          {["精确术语查询", "过程近邻查询", "边界反例查询"].map((title, index) => <article key={title}><span>Q{index + 1}</span><strong>{title}</strong><p>{b6Challenged ? ["未发现直接闭合；保留同义词风险", "命中相邻体系；不可直接外推", "发现限制条件；已写入未知"][index] : "等待点击上方“开始反向查新”"}</p><em>{b6Challenged ? "已回读" : "等待"}</em></article>)}
        </div>
      </section>
      <section className="detail-card">
        <SectionTitle icon={<AlertTriangle size={16} />} title="未知、反证与冻结条件" meta="科学家判断" />
        <div className="artifact-grid">
          <article><span>未知</span><strong>跨来源条件不可直接比较</strong><p>pH、碱度、电流密度和分析口径需要统一。</p></article>
          <article><span>反证</span><strong>{b6Challenged ? "存在过程近邻，没有直接闭合" : "等待三组查询"}</strong><p>近邻命中会降低新颖性置信度，但不会自动否决。</p></article>
          <article><span>冻结条件</span><strong>{gapFrozen ? "FrozenGap 已形成" : "保留限制并由人工决定"}</strong><p>冻结只推进工作流，不代表路线可行。</p></article>
        </div>
      </section>
    </>
  );
}

function B7Details({ handoffApproved }: Pick<Props, "handoffApproved">) {
  return (
    <>
      <section className="detail-card">
        <SectionTitle icon={<Files size={16} />} title="路线 C 最小交接包" meta={handoffApproved ? "H1 APPROVED" : "HandoffPreview · READY"} />
        <div className="file-list">
          {["manifest.json", "research-brief.mock.json", "frozen-gap.mock.json", "evidence-summary.md", "limits-and-unknowns.md", "replay-notes.md"].map((name, index) => <div key={name}><FileCheck2 size={15} /><strong>{name}</strong><span>{index === 0 ? "Mock hash verified" : "PUBLIC MOCK"}</span></div>)}
        </div>
      </section>
      <section className="detail-card">
        <SectionTitle icon={<ShieldCheck size={16} />} title="Verifier 与诚信边界" meta="PASS · 字段闭包校验" />
        <div className="artifact-grid">
          <article><span>输入闭包</span><strong>ResearchBrief + FrozenGap</strong><p>路线 C 只接收完成当前任务所需的最小输入。</p></article>
          <article><span>证据边界</span><strong>公开摘要与定位标签</strong><p>不包含全文、raw Run、密钥、内部路径或模型调用原文。</p></article>
          <article><span>输出边界</span><strong>{handoffApproved ? "Mock Receipt v1" : "等待 H1 决定"}</strong><p>本页面不继续生成实验路线、参数或科研结论。</p></article>
        </div>
      </section>
    </>
  );
}

export function StageDetails(props: Props) {
  return (
    <div className="stage-details" aria-label="当前阶段的草稿、证据与正式产物">
      {props.stage === "b3" ? <B3Details entryPath={props.entryPath} wideQaStep={props.wideQaStep} narrowDraft={props.narrowDraft} directionsReady={props.directionsReady} selectedDirection={props.selectedDirection} candidates={props.candidates} onSelectDirection={props.onSelectDirection} /> : null}
      {props.stage === "b5" ? <B5Details b5Step={props.b5Step} /> : null}
      {props.stage === "b6" ? <B6Details b6Challenged={props.b6Challenged} gapFrozen={props.gapFrozen} /> : null}
      {props.stage === "b7" ? <B7Details handoffApproved={props.handoffApproved} /> : null}
      <p className="mock-footnote"><ShieldCheck size={14} />公开演示只复现产品结构和状态变化，不代表新增科研结果。</p>
    </div>
  );
}
