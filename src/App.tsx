import { useEffect, useMemo, useReducer } from "react";
import { FlaskConical, RotateCcw, ShieldCheck } from "lucide-react";
import { AppSidebar } from "./components/AppSidebar";
import { ConversationPanel } from "./components/ConversationPanel";
import { EvidencePanel } from "./components/EvidencePanel";
import { StageDetails } from "./components/StageDetails";
import { StageRail } from "./components/StageRail";
import { directionCandidates, recommendedQuestions, snapshotFor, stages } from "./demo-data";
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
        title: state.b3DirectionsReady && !state.selectedDirection ? "确定研究方向" : state.selectedDirection ? "确认研究问题" : "确定研究方向",
        subtitle: state.b3DirectionsReady && !state.selectedDirection
          ? "候选方向已经带着公开依据返回。比较、选择或全部拒绝。"
          : state.selectedDirection
            ? "已选方向只进入问题讨论；冻结后才交给 B5 自动研究。"
            : "正在整理宽主题边界；确认后探索可比较的候选方向。",
      }
    : pageCopy[state.stage];
  const snapshot = useMemo(
    () => snapshotFor(state.stage, state.b5Step, state.b6Challenged, state.gapFrozen, state.handoffApproved, state.b3DirectionsReady, state.selectedDirection),
    [state.b3DirectionsReady, state.b5Step, state.b6Challenged, state.gapFrozen, state.handoffApproved, state.selectedDirection, state.stage],
  );

  function handleFormal(action: MessageAction) {
    dispatch({ type: "formal", action });
  }

  function handleJump(stage: StageId) {
    dispatch({ type: "jump", stage });
  }

  return (
    <div className="competition-shell">
      <AppSidebar activeStage={state.stage} onJump={handleJump} />
      <main className="product-shell">
        <header className="project-bar">
          <p><span>项目</span> Project GOAI-C01 <b>/</b> 磷酸铁基废旧正极 → Fe(VI) 高铁酸盐</p>
          <div className="mock-banner" role="note" aria-label="公开 Mock Demo 边界">
            <ShieldCheck size={15} aria-hidden="true" />
            公开 Mock Demo / 不调用模型 / 不代表新增科研结果
          </div>
        </header>

        <header className="stage-toolbar">
          <div className="toolbar-identity">
            <span className="toolbar-mark"><FlaskConical size={15} aria-hidden="true" /></span>
            <div><strong>GOAI 文献 Agent</strong><small>{copy.toolbar}</small></div>
          </div>
          <div className="toolbar-actions">
            <span className="mode-badge">PUBLIC MOCK</span>
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
            b3DirectionsReady={state.b3DirectionsReady}
            selectedDirection={state.selectedDirection}
            onJump={handleJump}
          />
          <section className="center-column" aria-labelledby="page-title">
            <div className="center-scroll">
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
                recommended={recommendedQuestions[state.stage]}
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
              <StageDetails
                stage={state.stage}
                directionsReady={state.b3DirectionsReady}
                selectedDirection={state.selectedDirection}
                candidates={directionCandidates}
                b5Step={state.b5Step}
                b6Challenged={state.b6Challenged}
                gapFrozen={state.gapFrozen}
                handoffApproved={state.handoffApproved}
                onSelectDirection={(candidateId) => dispatch({ type: "selectDirection", candidateId })}
              />
            </div>
            <footer className="workbench-footer">
              <span>当前：{copy.title}</span>
              <span>点击左侧 B3 / B5 / B6 / B7 可直接查看对应 Mock 对话</span>
              <span><ShieldCheck size={13} aria-hidden="true" />普通讨论不会改变真实研究流程</span>
            </footer>
          </section>
          <EvidencePanel snapshot={snapshot} />
        </section>
      </main>
    </div>
  );
}
