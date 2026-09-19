import { useEffect, useMemo, useReducer } from "react";
import { FlaskConical, RotateCcw, ShieldCheck } from "lucide-react";
import { ConversationPanel } from "./components/ConversationPanel";
import { EntryPage } from "./components/EntryPage";
import { EvidencePanel } from "./components/EvidencePanel";
import { StageDetails } from "./components/StageDetails";
import { StageRail } from "./components/StageRail";
import { directionCandidates, recommendedQuestions, snapshotFor, stages, wideQaOptions } from "./demo-data";
import { createInitialState, reducer } from "./demo-reducer";
import type { MessageAction, StageId } from "./types";

const pageCopy: Record<StageId, { kicker: string; title: string; subtitle: string; toolbar: string }> = {
  b3: {
    kicker: "B3 · RESEARCH BRIEF",
    title: "确认研究问题",
    subtitle: "把候选方向收敛成可公开复核、可冻结的 ResearchBrief。",
    toolbar: "ResearchBrief · G0 / G1 人工闸门",
  },
  b5: {
    kicker: "B5 · 自动研究",
    title: "自动文献研究",
    subtitle: "系统沿冻结的 ResearchBrief 自动推进；只需查看步骤、依据和失败边界。",
    toolbar: "自动文献研究 · 只读正式过程",
  },
  b6: {
    kicker: "B6 · RESEARCH GAP",
    title: "Gap 对抗与冻结",
    subtitle: "先看候选与三组公开查新，再决定是否把一个 SURVIVED Gap 交给 B7。",
    toolbar: "Research Gap · G2 人工闸门",
  },
  b7: {
    kicker: "B7 · ROUTE C HANDOFF",
    title: "路线 C 研究交接包",
    subtitle: "在交给阶段 C Agent 前，检查 FrozenGap、依据、限制和硬校验。",
    toolbar: "路线 C 研究交接 · H1 人工闸门",
  },
};

export function App() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    if (state.stage !== "b5" || state.b5Step >= 3) return;
    const timer = window.setTimeout(() => dispatch({ type: "advanceB5" }), 850);
    return () => window.clearTimeout(timer);
  }, [state.stage, state.b5Step]);

  const currentStage = stages.find((item) => item.id === state.stage) ?? stages[0];
  const copy = state.stage === "b3"
    ? {
        ...pageCopy.b3,
        title: state.entryPath === "narrow" ? "确认研究问题" : state.b3DirectionsReady && !state.selectedDirection ? "确定研究方向" : state.selectedDirection ? "确认研究问题" : "确定研究方向",
        subtitle: state.entryPath === "narrow"
          ? "具体问题已形成 ResearchBrief Draft；检查后冻结并启动自动文献研究。"
          : state.b3DirectionsReady && !state.selectedDirection
          ? "候选方向已经带着公开依据返回。比较、选择或全部拒绝。"
          : state.selectedDirection
            ? "已选方向只进入问题讨论；冻结后才交给 B5 自动研究。"
            : "正在整理宽主题边界；确认后探索可比较的候选方向。",
      }
    : pageCopy[state.stage];
  const currentRecommended = state.entryPath === "wide" && state.stage === "b3" && !state.b3DirectionsReady && !state.selectedDirection
    ? state.wideQaStep < wideQaOptions.length
      ? wideQaOptions[state.wideQaStep]
      : ["为什么这些主题字段已经足够？", "哪些内容不会进入公开检索？"]
    : state.entryPath === "narrow" && state.stage === "b3"
      ? ["只纳入能定位到完整方法块的公开研究。", "把无氯边界写进排除项。", "冻结问题并开始文献研究"]
      : recommendedQuestions[state.stage];
  const snapshot = useMemo(
    () => snapshotFor(state.stage, state.b5Step, state.b6Challenged, state.gapFrozen, state.handoffApproved, state.b3DirectionsReady, state.selectedDirection, state.wideQaStep, state.entryPath),
    [state.b3DirectionsReady, state.b5Step, state.b6Challenged, state.entryPath, state.gapFrozen, state.handoffApproved, state.selectedDirection, state.stage, state.wideQaStep],
  );

  function handleFormal(action: MessageAction) {
    dispatch({ type: "formal", action });
  }

  function handleJump(stage: StageId) {
    dispatch({ type: "jump", stage });
  }

  if (state.entryView !== "workbench") {
    return (
      <EntryPage
        view={state.entryView}
        onWide={() => dispatch({ type: "chooseEntry", path: "wide" })}
        onNarrow={() => dispatch({ type: "chooseEntry", path: "narrow" })}
        onBack={() => dispatch({ type: "backToEntry" })}
        onSubmitNarrow={(draft) => dispatch({ type: "submitNarrow", draft })}
      />
    );
  }

  return (
    <div className="competition-shell">
      <main className="product-shell">
        <header className="stage-toolbar">
          <div className="toolbar-identity">
            <span className="toolbar-mark"><FlaskConical size={15} aria-hidden="true" /></span>
            <div><strong>GOAI 文献 Agent</strong><small>{copy.toolbar}</small></div>
          </div>
          <div className="toolbar-actions">
            <div className="mock-banner" role="note" aria-label="公开 Mock Demo 边界"><ShieldCheck size={14} aria-hidden="true" />公开 Mock / 不调用模型 / 不代表科研结果</div>
            <span className="status-badge">{snapshot.status}</span>
            <span className="run-id">RUN-CONTROLLED-DEMO</span>
            <button type="button" className="toolbar-reset" onClick={() => dispatch({ type: "reset" })}>
              <RotateCcw size={14} aria-hidden="true" />重新演示
            </button>
          </div>
        </header>

        <section className="workspace" aria-label="GOAI 文献 Agent 静态演示工作台">
          <StageRail
            stages={stages}
            activeStage={state.stage}
            completed={state.completed}
            entryPath={state.entryPath}
            b3DirectionsReady={state.b3DirectionsReady}
            selectedDirection={state.selectedDirection}
            onJump={handleJump}
          />
          <section className="center-column interaction-column" aria-labelledby="page-title">
            <div className="center-scroll interaction-scroll">
              <header className="page-intro">
                <span>{copy.kicker}</span>
                <h1 id="page-title">{copy.title}</h1>
                <p>{copy.subtitle}</p>
              </header>
              <ConversationPanel
                stage={currentStage}
                status={snapshot.status}
                statusTone={snapshot.statusTone}
                messages={state.messages[state.stage]}
                recommended={currentRecommended}
                onSubmit={(text) => dispatch({ type: "submit", text })}
                onFormalAction={handleFormal}
                directionsReady={state.b3DirectionsReady}
                selectedDirection={state.selectedDirection}
                directionCandidates={directionCandidates}
                onSelectDirection={(candidateId) => dispatch({ type: "selectDirection", candidateId })}
                onRejectDirections={(comment) => dispatch({ type: "rejectDirections", comment })}
                inputSeed={state.inputSeed}
                locked={state.handoffApproved && state.stage === "b7"}
              />
            </div>
            <footer className="workbench-footer">
              <span>当前：{copy.title}</span>
              <span>对话、选择与正式动作</span>
              <span><ShieldCheck size={13} aria-hidden="true" />普通讨论不会改变真实研究流程</span>
            </footer>
          </section>

          <section className="research-product-column" aria-labelledby="research-product-title">
            <header className="product-column-header">
              <div>
                <span>{copy.kicker}</span>
                <h2 id="research-product-title">研究产物</h2>
              </div>
              <p>草稿、候选、证据包与交接结果随当前阶段同步更新。</p>
            </header>
            <div className="research-product-scroll">
              <StageDetails
                stage={state.stage}
                entryPath={state.entryPath}
                directionsReady={state.b3DirectionsReady}
                wideQaStep={state.wideQaStep}
                selectedDirection={state.selectedDirection}
                narrowDraft={state.narrowDraft}
                candidates={directionCandidates}
                b5Step={state.b5Step}
                b6Challenged={state.b6Challenged}
                gapFrozen={state.gapFrozen}
                handoffApproved={state.handoffApproved}
                onSelectDirection={(candidateId) => dispatch({ type: "selectDirection", candidateId })}
              />
            </div>
          </section>
          <EvidencePanel snapshot={snapshot} />
        </section>
      </main>
    </div>
  );
}
