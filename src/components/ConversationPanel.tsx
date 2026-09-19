import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Box,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MessageCircle,
  SearchCheck,
  Snowflake,
} from "lucide-react";
import { stageDirector } from "../demo-data";
import type { DirectionCandidate, Message, MessageAction, Stage } from "../types";

type Props = {
  stage: Stage;
  status: string;
  statusTone: "ready" | "working" | "decision" | "complete" | "warning";
  messages: Message[];
  recommended: string[];
  onSubmit: (text: string) => void;
  onFormalAction: (action: MessageAction) => void;
  directionsReady: boolean;
  selectedDirection: string | null;
  directionCandidates: DirectionCandidate[];
  onSelectDirection: (candidateId: string) => void;
  onRejectDirections: (comment: string) => void;
  inputSeed: number;
  locked: boolean;
};

const actionCopy: Record<MessageAction, { label: string; help: string }> = {
  "confirm-theme": {
    label: "确认主题边界，探索候选方向",
    help: "会保留当前主题草稿，并返回四个可比较的公开 Mock 候选。",
  },
  "freeze-brief": {
    label: "冻结问题并开始研究",
    help: "会模拟 B4 冻结桥接，然后进入 B5 自动研究。",
  },
  "open-gap": {
    label: "查看 Gap 候选",
    help: "会进入 B6，准备反向查新。",
  },
  "challenge-gap": {
    label: "开始反向查新",
    help: "会生成三组公开 Mock 查询摘要。",
  },
  "freeze-gap": {
    label: "冻结 Gap 并进入交接",
    help: "会形成 FrozenGap Mock 回执并进入 B7。",
  },
  "approve-handoff": {
    label: "批准交接，完成本系统",
    help: "会生成 H1 Mock 回执，不继续生成路线方案。",
  },
};

function ActionIcon({ action }: { action: MessageAction }) {
  if (action === "challenge-gap") return <SearchCheck size={16} aria-hidden="true" />;
  if (action === "freeze-gap") return <Snowflake size={16} aria-hidden="true" />;
  if (action === "approve-handoff") return <Box size={16} aria-hidden="true" />;
  return <CheckCircle2 size={16} aria-hidden="true" />;
}

function StatusIcon({ tone }: { tone: Props["statusTone"] }) {
  if (tone === "working") return <LoaderCircle className="spin" size={16} aria-hidden="true" />;
  if (tone === "complete") return <CheckCircle2 size={16} aria-hidden="true" />;
  if (tone === "decision") return <Clock3 size={16} aria-hidden="true" />;
  return <MessageCircle size={16} aria-hidden="true" />;
}

export function ConversationPanel({
  stage,
  status,
  statusTone,
  messages,
  recommended,
  onSubmit,
  onFormalAction,
  directionsReady,
  selectedDirection,
  directionCandidates,
  onSelectDirection,
  onRejectDirections,
  inputSeed,
  locked,
}: Props) {
  const [text, setText] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const latestAgentIndex = messages.map((msg) => msg.role).lastIndexOf("agent");
  const guidedQa = stage.id === "b3" && !directionsReady && !selectedDirection;

  useEffect(() => {
    setText("");
    setRejectComment("");
  }, [inputSeed]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function submit(value = text) {
    const trimmed = value.trim();
    if (!trimmed || locked) return;
    onSubmit(trimmed);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  return (
    <section className="conversation-shell" aria-labelledby="conversation-title">
      <header className="conversation-header">
        <div className="director-identity">
          <MessageCircle size={21} aria-hidden="true" />
          <div>
            <h2 id="conversation-title">{stageDirector[stage.id]}</h2>
            <p>{stage.id === "b5" ? "自动文献研究的正式步骤、Event 和阶段结果" : stage.id === "b7" ? "交接检查、Verifier 和 H1 决定沿同一条消息主轴呈现" : "连续对话 · 只更新当前浏览器 Draft · 正式动作只在最新消息提供"}</p>
          </div>
        </div>
        <div className={`status-pill ${statusTone}`} role="status" aria-live="polite">
          <StatusIcon tone={statusTone} />
          <span>{status}</span>
        </div>
      </header>

      <div className="conversation-body" ref={listRef} role="log" aria-label="当前会话消息" aria-relevant="additions text" tabIndex={0}>
        {messages.map((item, index) => {
          const isLatestAgent = index === latestAgentIndex && item.role === "agent";
          return (
            <article key={item.id} className={`turn ${item.role} ${isLatestAgent ? "latest" : ""}`}>
              <header>
                <strong>{item.author}</strong>
                {item.meta ? <span>{item.meta}</span> : null}
              </header>
              <p>{item.body}</p>
              {isLatestAgent && item.action ? (
                <div className="turn-actions">
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => onFormalAction(item.action!)}
                    aria-describedby={`${item.id}-action-help`}
                  >
                    <ActionIcon action={item.action} />
                    {actionCopy[item.action].label}
                  </button>
                  <small id={`${item.id}-action-help`}>{actionCopy[item.action].help}</small>
                </div>
              ) : null}
              {isLatestAgent && stage.id === "b3" && directionsReady && !selectedDirection ? (
                <div className="candidate-actions" aria-label="候选研究方向">
                  <p className="candidate-action-note">候选公开依据和比较结果已附在下方。请选择一个方向，或说明为什么全部不合适。</p>
                  {directionCandidates.map((candidate, candidateIndex) => (
                    <button
                      type="button"
                      className="candidate-choice"
                      key={candidate.id}
                      onClick={() => onSelectDirection(candidate.id)}
                    >
                      <span>候选 {candidateIndex + 1}</span>
                      <strong>选择这个方向，开始讨论研究问题：{candidate.title}</strong>
                    </button>
                  ))}
                  <label htmlFor="reject-directions">全部拒绝说明</label>
                  <textarea
                    id="reject-directions"
                    value={rejectComment}
                    onChange={(event) => setRejectComment(event.target.value)}
                    placeholder="说明为什么这些方向都不合适，以及下一轮应补充什么约束"
                    rows={2}
                  />
                  <button
                    type="button"
                    className="reject-directions"
                    onClick={() => onRejectDirections(rejectComment)}
                    disabled={!rejectComment.trim()}
                  >
                    全部拒绝这些方向
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <div className="composer-presets">
          <span>{guidedQa ? "可直接发送的科学家回答" : "评委复现话术"}</span>
          <button type="button" className="fill-example" onClick={() => setText(recommended[0] ?? "")} disabled={locked}>填入示例</button>
        </div>
        <div className={`question-row ${guidedQa ? "guided-answers" : ""}`} aria-label={guidedQa ? "推荐回答（点击直接发送）" : "推荐问题（点击直接发送）"}>
          {recommended.map((question) => (
            <button type="button" key={question} onClick={() => submit(question)} disabled={locked} title={guidedQa ? "点击作为科学家回答发送" : "点击直接发送这句话"}>
              {question}
            </button>
          ))}
        </div>
        <label htmlFor="demo-question">{guidedQa ? "描述宽主题或回答当前问题" : "当前讨论"}</label>
        <div className="input-row">
          <textarea
            id="demo-question"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={locked ? "Demo 已完成。点击“重新演示”可从入口再跑一遍。" : guidedQa ? "可以自由输入，也可以直接点击上方回答" : "输入问题，或点击上方推荐问题"}
            disabled={locked}
            rows={3}
          />
          <button type="submit" className="send-button" disabled={locked || !text.trim()} title={locked ? "Demo 已完成，请重新演示" : "发送讨论"}>
            <ArrowUp size={16} aria-hidden="true" />
            发送讨论
          </button>
        </div>
        <p className="composer-help">快捷键：Ctrl/⌘ + Enter 发送。交互只保存在当前浏览器内存。</p>
      </form>
    </section>
  );
}
