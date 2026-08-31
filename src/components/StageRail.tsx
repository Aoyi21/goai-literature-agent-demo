import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { stageJourney } from "../demo-data";
import type { Stage, StageId } from "../types";

type Props = {
  stages: Stage[];
  activeStage: StageId;
  completed: StageId[];
  b3DirectionsReady: boolean;
  selectedDirection: string | null;
  onJump: (stage: StageId) => void;
};

export function StageRail({ stages, activeStage, completed, b3DirectionsReady, selectedDirection, onJump }: Props) {
  const activeIndex = stages.findIndex((stage) => stage.id === activeStage);
  const journey = activeStage === "b3"
    ? [
        { label: "说明主题边界", detail: "已完成" },
        { label: "比较候选方向", detail: selectedDirection ? "已完成" : b3DirectionsReady ? "当前 · 4 个候选" : "当前 · 等待探索" },
        { label: "确认研究问题", detail: selectedDirection ? "当前" : "等待选择" },
        { label: "自动文献研究", detail: "等待 B5" },
        { label: "验收 Research Gap", detail: "等待 B6" },
        { label: "检查路线 C 交接包", detail: "等待 B7" },
      ]
    : stageJourney[activeStage];
  const currentJourneyIndex = journey.findIndex((item) => item.detail === "当前");

  return (
    <aside className="stage-rail" aria-label="研究旅程">
      <div className="rail-heading">
        <span>研究旅程</span>
        <strong>只看当前判断</strong>
      </div>
      <div className="stage-jump" aria-label="切换演示阶段">
        {stages.map((stage) => (
          <button
            type="button"
            key={stage.id}
            className={stage.id === activeStage ? "active" : completed.includes(stage.id) ? "done" : ""}
            onClick={() => onJump(stage.id)}
            aria-current={stage.id === activeStage ? "step" : undefined}
          >
            <span>{stage.index}</span>
            {stage.short}
          </button>
        ))}
      </div>
      <ol className="stage-list">
        {journey.map((item, index) => {
          const active = index === currentJourneyIndex || item.detail.startsWith("当前");
          const done = index < currentJourneyIndex || item.detail === "已完成" || item.detail === "已回读";
          return (
            <li key={item.label} className={active ? "stage-item active" : done ? "stage-item done" : "stage-item"}>
              <span className="stage-icon" aria-hidden="true">
                {active ? <CircleDot size={14} /> : done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              </span>
              <span className="stage-copy">
                <span className="stage-index">{index + 1}</span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="rail-note">
        <p>{activeStage === "b3" ? "B3 只整理主题和候选方向，冻结后由 B5 自动研究。" : activeStage === "b5" ? "系统自动推进研究；科学家只查看步骤、依据和失败边界。" : activeStage === "b6" ? "Proposer 与 Challenger 只返回公开摘要，正式决定由科学家写入。" : "系统编译预览、校验和限制；科学家只做 H1 决定。"}</p>
      </div>
      <span className="journey-progress" aria-hidden="true">{activeIndex + 1} / {stages.length}</span>
    </aside>
  );
}
