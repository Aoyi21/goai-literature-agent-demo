import { directionCandidates, initialSystemMessage, stageDirector, stageSeed } from "./demo-data";
import type { DemoAction, DemoState, Message, MessageAction, StageId } from "./types";

let messageCounter = 0;

function nextId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

function message(role: Message["role"], body: string, action?: MessageAction, meta?: string): Message {
  return {
    id: nextId(role),
    role,
    author: role === "user" ? "科学家" : role === "agent" ? "Research Director" : "系统",
    body,
    action,
    meta,
  };
}

function agentMessage(stage: StageId, body: string, action?: MessageAction, meta?: string): Message {
  return { ...message("agent", body, action, meta), author: stageDirector[stage] };
}

function seedMessages(stage: StageId): Message[] {
  const systemCopy = stage === "b3"
    ? initialSystemMessage
    : `正在查看 ${stage.toUpperCase()} 的公开 Mock 阶段。这里不调用模型，也不会改变真实科研状态。`;
  return [
    message("system", systemCopy, undefined, "PUBLIC MOCK"),
    agentMessage(stage, stageSeed[stage].body, stageSeed[stage].action, stageSeed[stage].meta),
  ];
}

export function createInitialState(): DemoState {
  messageCounter = 0;
  return {
    stage: "b3",
    messages: {
      b3: seedMessages("b3"),
      b5: seedMessages("b5"),
      b6: seedMessages("b6"),
      b7: seedMessages("b7"),
    },
    completed: [],
    b3DirectionsReady: false,
    selectedDirection: null,
    directionsRejected: false,
    b5Step: 0,
    b6Challenged: false,
    gapFrozen: false,
    handoffApproved: false,
    inputSeed: 0,
  };
}

function uniqueStages(stages: StageId[]) {
  return Array.from(new Set(stages));
}

function detectStage(text: string, current: StageId): StageId {
  const normalized = text.toLowerCase();
  if (/b7|交接|handoff|路线|批准|最小输入包|h1/.test(normalized)) return "b7";
  if (/b6|gap|缺口|查新|冻结 gap|反向/.test(normalized)) return "b6";
  if (/b5|文献|检索|筛选|证据|知识|自动/.test(normalized)) return "b5";
  if (/b3|问题|主题|边界|收窄|收敛|冻结/.test(normalized)) return "b3";
  return current;
}

function answerFor(text: string, target: StageId, state: DemoState): { body: string; action?: MessageAction } {
  const recognized = /b3|b5|b6|b7|主题|问题|边界|收窄|收敛|冻结|开始|文献|检索|筛选|证据|知识|自动|gap|缺口|查新|反向|挑战|交接|handoff|路线|批准|最小输入包|h1|公开|不能/i.test(text);
  if (!recognized) {
    return { body: "这个问题没有对应的真实工具，公开 Demo 也不会临时生成科研回答。请点击上方复现话术，或从左侧直接进入 B3、B5、B6、B7 的 Mock 对话。" };
  }
  if (/批准交接|approve|批准/.test(text) || target === "b7") {
    return state.handoffApproved
      ? { body: "H1 已批准。Demo 已停在公开回执状态，不会继续生成路线、实验参数或科研结论。" }
      : { body: "交接包已经准备成最小输入形式：研究问题、FrozenGap、证据摘要、限制和未解问题都在右侧。你可以批准，也可以退回说明问题。", action: "approve-handoff" };
  }
  if (/冻结 gap|进入交接/.test(text)) {
    return state.b6Challenged
      ? { body: "挑战报告已回读。当前 Gap 保留了未知和限制，可以冻结并交给 B7 做 H1 验收。", action: "freeze-gap" }
      : { body: "还没有执行反向查新。先挑战 Gap，再决定是否冻结。", action: "challenge-gap" };
  }
  if (/反向|查新|挑战/.test(text) || target === "b6") {
    return state.gapFrozen
      ? { body: "FrozenGap 已经形成。下一步是进入 B7 检查交接包。", action: "approve-handoff" }
      : { body: state.b6Challenged ? "三组公开反向查询已完成。结果只说明这个 Mock Gap 暂未被直接闭合，不证明真实世界无人研究。" : "可以启动三组反向查询：精确术语、过程近邻和边界反例。", action: state.b6Challenged ? "freeze-gap" : "challenge-gap" };
  }
  if (/查看 gap|gap 候选/.test(text)) return { body: "B5 的 Mock 研究已经整理出一个候选 Gap。进入 B6 后，需要先用反向查新挑战它。", action: "open-gap" };
  if (/文献|检索|筛选|证据|自动|b5/.test(text) || target === "b5") {
    return state.b5Step >= 3
      ? { body: "自动研究已完成：检索规划、候选筛选、公开证据摘要、知识覆盖和冲突摘要都已模拟写入。", action: "open-gap" }
      : { body: "B5 会自动推进。右侧会依次出现 SearchPlan、筛选计数、EvidenceBundle 和 KnowledgeBase 的 Mock 状态。" };
  }
  if (/不能|边界|公开/.test(text)) return { body: "公开 Demo 只展示改写后的受控摘要、阶段状态和 Mock 统计，不展示受限材料、全文、raw run、内部路径、密钥或模型调用原文。", action: "freeze-brief" };
  if (/冻结|开始/.test(text)) return { body: "研究问题已经足够清楚：只在公开证据范围内复核一个可定位的方法边界。确认后进入 B5。", action: "freeze-brief" };
  if (target === "b3") return { body: "我会把问题收敛成三个条件：公开来源可复核、边界可定位、不会被写成实验答案。", action: "freeze-brief" };
  return { body: "这个问题在公开 Mock Demo 里没有对应的真实工具。你可以继续演示 B3 问题收敛、B5 自动研究、B6 Gap 挑战或 B7 交接。" };
}

export function reducer(state: DemoState, action: DemoAction): DemoState {
  if (action.type === "reset") return createInitialState();

  if (action.type === "jump") return { ...state, stage: action.stage, inputSeed: state.inputSeed + 1 };

  if (action.type === "selectDirection") {
    const candidate = directionCandidates.find((item) => item.id === action.candidateId);
    if (!candidate) return state;
    return {
      ...state,
      stage: "b3",
      selectedDirection: candidate.id,
      directionsRejected: false,
      messages: {
        ...state.messages,
        b3: [
          ...state.messages.b3,
          message("user", `选择这个方向：${candidate.title}`, undefined, "B3 · 正式选择"),
          agentMessage("b3", `已选定“${candidate.title}”。接下来只围绕这个方向形成 ResearchBrief；其他候选保留在比较记录中，不会被改写成结论。`, "freeze-brief", "B3 · 等待 G0"),
        ],
      },
      inputSeed: state.inputSeed + 1,
    };
  }

  if (action.type === "rejectDirections") {
    const comment = action.comment.trim() || "当前候选与目标不够贴合，请保留边界并重新探索。";
    return {
      ...state,
      stage: "b3",
      b3DirectionsReady: false,
      selectedDirection: null,
      directionsRejected: true,
      messages: {
        ...state.messages,
        b3: [
          ...state.messages.b3,
          message("user", `全部拒绝：${comment}`, undefined, "B3 · 拒绝说明"),
          agentMessage("b3", "四个方向都已退回。主题草稿不会丢失；补充的新约束会进入下一轮候选探索。这个 Demo 可再次点击下方按钮，模拟返回一组更新后的候选。", "confirm-theme", "B3 · 等待重新探索"),
        ],
      },
      inputSeed: state.inputSeed + 1,
    };
  }

  if (action.type === "submit") {
    const text = action.text.trim();
    if (!text) return state;
    const target = detectStage(text, state.stage);
    const response = answerFor(text, target, state);
    return {
      ...state,
      stage: target,
      messages: {
        ...state.messages,
        [target]: [...state.messages[target], message("user", text), agentMessage(target, response.body, response.action, `${target.toUpperCase()} · Mock 回复`)],
      },
      inputSeed: state.inputSeed + 1,
    };
  }

  if (action.type === "advanceB5") {
    if (state.stage !== "b5" || state.b5Step >= 3) return state;
    const nextStep = state.b5Step + 1;
    const stepCopy = [
      "SearchPlan 已写入：公开查询维度和排除边界已固定。",
      "筛选完成：候选 6，纳入 3，排除 2，待核 1。",
      "B5 完成：证据摘要、知识覆盖和冲突记录已形成，可以交给 B6。",
    ][nextStep - 1];
    return {
      ...state,
      b5Step: nextStep,
      messages: {
        ...state.messages,
        b5: [
          ...state.messages.b5,
          message("system", stepCopy, undefined, `B5 · 自动步骤 ${nextStep}/3`),
          ...(nextStep === 3 ? [agentMessage("b5", "自动文献研究已完成。公开证据摘要和知识覆盖已经回读，可以进入 B6 验收候选 Gap。", "open-gap", "B5 · 本阶段完成")] : []),
        ],
      },
      completed: nextStep === 3 ? uniqueStages([...state.completed, "b5"]) : state.completed,
    };
  }

  if (action.type !== "formal") return state;

  if (action.action === "confirm-theme") {
    return {
      ...state,
      stage: "b3",
      b3DirectionsReady: true,
      selectedDirection: null,
      directionsRejected: false,
      messages: {
        ...state.messages,
        b3: [
          ...state.messages.b3,
          message("system", "主题边界已确认为 Mock Draft v1；开始返回公开候选方向。", undefined, "B3 · 候选探索"),
          agentMessage("b3", "主题约束已确认，四个公开 Mock 候选方向已经返回。请比较它们的差异、公开依据、未知和风险，然后选择一个进入研究问题讨论；如果都不合适，也可以填写理由后全部拒绝。", undefined, "B3 · 等你择优"),
        ],
      },
    };
  }

  if (action.action === "freeze-brief") {
    if (!state.selectedDirection) return state;
    return {
      ...state,
      stage: "b5",
      b5Step: 0,
      messages: {
        ...state.messages,
        b3: [...state.messages.b3, message("system", "ResearchBrief 已冻结为公开 Mock v1，并交给 B5。", undefined, "B4 · 冻结桥接")],
        b5: [...state.messages.b5, message("system", "B4 桥接已模拟完成：ResearchBrief 冻结为公开 Mock v1。", undefined, "B4 · 冻结桥接")],
      },
      completed: uniqueStages([...state.completed, "b3"]),
    };
  }
  if (action.action === "open-gap") {
    return {
      ...state,
      stage: "b6",
      messages: { ...state.messages, b6: [...state.messages.b6, agentMessage("b6", "B6 已接管候选 Gap。先做反向查新挑战，再决定是否冻结。", "challenge-gap", "B6 · 等你决定")] },
      completed: uniqueStages([...state.completed, "b5"]),
    };
  }
  if (action.action === "challenge-gap") {
    return {
      ...state,
      stage: "b6",
      b6Challenged: true,
      messages: {
        ...state.messages,
        b6: [...state.messages.b6, message("system", "三组反向查新已模拟完成：精确术语、过程近邻、边界反例。", undefined, "B6 · ChallengeReport"), agentMessage("b6", "挑战结果回读：候选 Gap 暂未被公开摘要直接闭合，但仍保留未知和限制。", "freeze-gap", "B6 · 等你决定")],
      },
    };
  }
  if (action.action === "freeze-gap") {
    return {
      ...state,
      stage: "b7",
      gapFrozen: true,
      messages: {
        ...state.messages,
        b6: [...state.messages.b6, message("system", "FrozenGap Mock v1 已回读。", undefined, "B6 · G2")],
        b7: [...state.messages.b7, message("system", "FrozenGap Mock v1 已回读，Verifier PASS。", undefined, "B7 · 编译预览")],
      },
      completed: uniqueStages([...state.completed, "b6"]),
    };
  }
  if (action.action === "approve-handoff") {
    return {
      ...state,
      stage: "b7",
      handoffApproved: true,
      messages: {
        ...state.messages,
        b7: [...state.messages.b7, message("system", "H1 已批准：Mock Receipt v1 已生成。", undefined, "B7 · 完成"), agentMessage("b7", "交接已完成。这里不再继续生成路线 C 方案；公开 Demo 只证明产品路径和状态边界可以被看见。", undefined, "Demo 完成")],
      },
      completed: uniqueStages([...state.completed, "b7"]),
    };
  }
  return state;
}
