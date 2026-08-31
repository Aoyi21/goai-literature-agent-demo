import type { DirectionCandidate, MessageAction, Stage, StageId, StageSnapshot } from "./types";

export const stages: Stage[] = [
  {
    id: "b3",
    index: "B3",
    short: "问题收敛",
    title: "B3 · 问题收敛",
    subtitle: "把宽主题压缩成可公开复核的研究问题。",
  },
  {
    id: "b5",
    index: "B5",
    short: "自动研究",
    title: "B5 · 自动文献研究",
    subtitle: "沿冻结 ResearchBrief 模拟检索、筛选、抽取和覆盖。",
  },
  {
    id: "b6",
    index: "B6",
    short: "Gap 挑战",
    title: "B6 · Gap 对抗与冻结",
    subtitle: "用反向查新挑战候选 Gap，再决定是否冻结。",
  },
  {
    id: "b7",
    index: "B7",
    short: "路线交接",
    title: "B7 · 路线 C 交接",
    subtitle: "检查最小输入包、限制和回执，不生成路线答案。",
  },
];

export const recommendedQuestions: Record<StageId, string[]> = {
  b3: [
    "帮我把主题边界整理成候选方向",
    "哪些边界不能进入公开 Demo？",
    "冻结问题并开始文献研究",
  ],
  b5: [
    "自动研究现在完成了哪些步骤？",
    "右侧证据为什么不是科研结论？",
    "查看 Gap 候选",
  ],
  b6: [
    "开始反向查新挑战这个 Gap",
    "这个 Gap 还有哪些未知？",
    "冻结 Gap 并进入交接",
  ],
  b7: [
    "路线 C 最小输入包包含什么？",
    "批准交接前还要检查什么？",
    "批准交接",
  ],
};

export const stageJourney: Record<StageId, Array<{ label: string; detail: string }>> = {
  b3: [
    { label: "说明主题边界", detail: "已完成" },
    { label: "比较候选方向", detail: "已完成" },
    { label: "确认研究问题", detail: "当前" },
    { label: "自动文献研究", detail: "等待 B5" },
    { label: "验收 Research Gap", detail: "等待 B6" },
    { label: "检查路线 C 交接包", detail: "等待 B7" },
  ],
  b5: [
    { label: "说明主题边界", detail: "已完成" },
    { label: "比较候选方向", detail: "已完成" },
    { label: "确认研究问题", detail: "已完成" },
    { label: "自动文献研究", detail: "当前" },
    { label: "验收 Research Gap", detail: "等待 B6" },
    { label: "检查路线 C 交接包", detail: "等待 B7" },
  ],
  b6: [
    { label: "形成候选 Gap", detail: "Proposer" },
    { label: "反向查新", detail: "三组查询 / 候选" },
    { label: "科学家决定", detail: "当前" },
  ],
  b7: [
    { label: "读取 FrozenGap", detail: "已回读" },
    { label: "编译交接预览", detail: "已回读" },
    { label: "等待 H1", detail: "当前" },
    { label: "交给阶段 C", detail: "等待" },
  ],
};

export const stageDirector: Record<StageId, string> = {
  b3: "Research Director",
  b5: "Research Director",
  b6: "Gap Director",
  b7: "Route C Handoff Director",
};

export const stageSeed: Record<StageId, { body: string; action?: MessageAction; meta: string }> = {
  b3: {
    body: "先说一个宽主题。我会把材料体系、应用语境、价值目标、限制和公开检索范围整理成主题边界草稿。确认主题边界后，才会探索可比较的候选方向。",
    action: "confirm-theme",
    meta: "B3 · 主题讨论",
  },
  b5: {
    body: "系统会沿冻结的 ResearchBrief 自动推进检索规划、筛选、公开证据抽取和知识覆盖。这里展示的是受控 Mock 过程，暂时无需操作。",
    meta: "B5 · 自动研究",
  },
  b6: {
    body: "候选 Gap 已回读。先用精确术语、过程近邻和边界反例做三组反向查新，再决定是否冻结。",
    action: "challenge-gap",
    meta: "B6 · 等你决定",
  },
  b7: {
    body: "FrozenGap、公开证据摘要、限制和未解问题已经编译成最小交接预览。请检查后作出 H1 决定。",
    action: "approve-handoff",
    meta: "B7 · 等待 H1",
  },
};

export const directionCandidates: DirectionCandidate[] = [
  {
    id: "direct-electrochemical",
    title: "无氯电化学高铁酸盐路径",
    summary: "把废旧磷酸铁基正极作为牺牲阳极，讨论浓碱条件下直接生成 Fe(VI) 的公开方法边界。",
    difference: "中间转化环节更少，重点落在阳极溶出、价态提升与产物保持。",
    evidence: ["公开摘要出现铁基阳极与高价铁生成的相邻方法", "可用电化学指标描述过程边界"],
    unknowns: ["复杂基体中的选择性", "钝化是否快速终止生成"],
    risks: ["公开命中多为近邻体系，不能直接外推"],
  },
  {
    id: "one-pot-conversion",
    title: "碱性介质中的一步转化路径",
    summary: "讨论废旧正极黑粉进入阳极液后，经惰性阳极介导生成高铁酸盐的公开可验证路线。",
    difference: "强调一步法和电解液介导，减少固体电极成形前处理。",
    evidence: ["公开方法可定位到碱性电解与铁物种转化", "存在可比较的溶液条件窗口"],
    unknowns: ["杂质离子对稳定性的影响", "物料衡算是否闭合"],
    risks: ["一步法可能把分离难题后移"],
  },
  {
    id: "benchmark-validation",
    title: "公开方法边界的基准验证",
    summary: "用公开分析级高铁酸盐作基准，比较废旧正极来源产物在典型抗生素去除场景中的可测表现。",
    difference: "不先押注制备路线，先建立公开、可复核的性能比较框架。",
    evidence: ["公开污染物降解方法可形成对照指标", "可把来源差异与性能比较拆开"],
    unknowns: ["有效 Fe(VI) 浓度如何统一", "副反应贡献如何排除"],
    risks: ["只能验证性能，不直接证明制备机制"],
  },
  {
    id: "passivation-control",
    title: "钝化控制与持续生成条件",
    summary: "围绕电化学活化、循环伏安和阻抗表征，讨论废旧正极阳极持续生成 Fe(VI) 的控制条件。",
    difference: "把研究焦点从是否生成，转向为什么衰减以及怎样保持过程。",
    evidence: ["公开电化学表征可用于观察界面变化", "可形成条件—响应的验证矩阵"],
    unknowns: ["真实钝化层组成", "活化操作的可重复性"],
    risks: ["问题更偏机制，短期验证成本较高"],
  },
];

export const initialSystemMessage =
  "公开 Mock Demo 已加载。这里不调用模型、不联网、不读本地数据库；所有交互只在当前浏览器内存里模拟 B3 到 B7 的产品路径。";

export const firstAgentMessage =
  "我们先从 B3 开始。目标不是给出科研答案，而是把一个宽主题收敛成可以公开复核的研究问题。确认后，Demo 会用受控 Mock 数据推进到自动研究。";

export function snapshotFor(
  stage: StageId,
  b5Step: number,
  b6Challenged: boolean,
  gapFrozen: boolean,
  handoffApproved: boolean,
  b3DirectionsReady = false,
  selectedDirection: string | null = null,
): StageSnapshot {
  if (stage === "b3") {
    return {
      headline: "当前主题版本",
      status: selectedDirection ? "方向已选 / 等待冻结问题" : b3DirectionsReady ? "候选已返回 / 等待择优" : "讨论草稿 v1 / 等待确认主题",
      statusTone: "decision",
      evidenceTitle: "公开依据摘要",
      evidence: [
        { label: "Mock 来源", value: "CONTROLLED_E2E · 公开样例剧本", tone: "success" },
        { label: "候选方向", value: b3DirectionsReady ? "候选 4 / 可选 1 / 可全部拒绝" : "等待确认主题" },
        { label: "证据粒度", value: "只保留改写摘要与公开 locator 类标签" },
      ],
      coverageTitle: "收敛条件",
      coverage: [
        { label: "材料边界", value: "公开样例材料体系", tone: "success" },
        { label: "目标边界", value: "Fe(VI) / 高铁酸盐方向", tone: "success" },
        { label: "排除项", value: "不展示受限材料、密钥、全文或内部路径", tone: "warning" },
      ],
      formalTitle: "Formal 状态",
      formal: [
        { label: "ThemeBrief", value: "Mock Draft v1" },
        { label: "ResearchBrief", value: selectedDirection ? "Draft · 等待冻结" : "尚未形成", tone: "warning" },
      ],
      limits: [
        "B3 只收敛问题，不生成实验路线。",
        "所有候选只代表 Demo 剧本，不代表新增科研结果。",
      ],
    };
  }

  if (stage === "b5") {
    const done = b5Step >= 3;
    return {
      headline: "自动研究进度",
      status: done ? "已完成 / 可交给 B6" : "处理中 / Mock 自动推进",
      statusTone: done ? "complete" : "working",
      evidenceTitle: "证据摘要",
      evidence: [
        { label: "检索规划", value: b5Step >= 1 ? "已生成公开检索维度" : "等待", tone: b5Step >= 1 ? "success" : "warning" },
        { label: "候选筛选", value: b5Step >= 2 ? "纳入 3 / 排除 2 / 待核 1" : "等待", tone: b5Step >= 2 ? "success" : "warning" },
        { label: "证据抽取", value: done ? "证据摘录 3 / 工艺记录 2 / 冲突 1" : "处理中", tone: done ? "success" : "warning" },
      ],
      coverageTitle: "知识覆盖",
      coverage: [
        { label: "问题覆盖", value: done ? "覆盖 2 / 部分覆盖 1" : "等待 synthesis" },
        { label: "冲突记录", value: done ? "保留 1 条边界冲突" : "尚未整理" },
      ],
      formalTitle: "Formal 状态",
      formal: [
        { label: "SearchPlan", value: b5Step >= 1 ? "Mock Accepted" : "未写入" },
        { label: "EvidenceBundle", value: done ? "Mock Accepted" : "等待" },
        { label: "KnowledgeBase", value: done ? "Mock Accepted" : "等待" },
      ],
      limits: [
        "B5 在 Demo 中只模拟状态变化，不访问 Sciverse、MinerU 或数据库。",
        "页面不展示 raw call、全文、模型调用原文或隐藏推理。",
      ],
    };
  }

  if (stage === "b6") {
    return {
      headline: "Gap 候选",
      status: gapFrozen ? "FrozenGap 已回读 / B7 可接管" : b6Challenged ? "挑战已完成 / 等待冻结" : "等待反向查新",
      statusTone: gapFrozen ? "complete" : b6Challenged ? "decision" : "ready",
      evidenceTitle: "挑战摘要",
      evidence: [
        { label: "候选 Gap", value: "公开方法边界仍未闭合", tone: "warning" },
        { label: "反向查询", value: b6Challenged ? "三组查询完成：精确术语 / 过程近邻 / 边界反例" : "未启动" },
        { label: "新颖性状态", value: b6Challenged ? "SURVIVED · Mock" : "PENDING_CHALLENGE", tone: b6Challenged ? "success" : "warning" },
      ],
      coverageTitle: "未知与变量",
      coverage: [
        { label: "未知", value: "缺少跨来源条件比较", tone: "warning" },
        { label: "可验证变量", value: "pH、碱度、电流密度" },
        { label: "反证", value: b6Challenged ? "有近邻，无直接闭合" : "等待查询" },
      ],
      formalTitle: "Formal 状态",
      formal: [
        { label: "GapCandidate", value: "Mock v1" },
        { label: "ChallengeReport", value: b6Challenged ? "Mock Accepted" : "等待挑战" },
        { label: "FrozenGap", value: gapFrozen ? "Mock Accepted" : "未冻结", tone: gapFrozen ? "success" : "warning" },
      ],
      limits: [
        "没有公开命中不等于无人研究，Demo 不做负面科学断言。",
        "Gap 冻结只说明产品状态推进，不说明路线可行。",
      ],
    };
  }

  return {
    headline: "路线 C 交接包",
    status: handoffApproved ? "H1 已批准 / Demo 完成" : "等待 H1 决定",
    statusTone: handoffApproved ? "complete" : "decision",
    evidenceTitle: "最小输入包",
    evidence: [
      { label: "manifest", value: "manifest.json · Mock hash", tone: "success" },
      { label: "payload", value: "ResearchBrief / FrozenGap / EvidenceSummary / Limits / ReplayNotes" },
      { label: "Verifier", value: "PASS · 仅校验 Mock 字段闭包", tone: "success" },
    ],
    coverageTitle: "交接检查",
    coverage: [
      { label: "研究问题", value: "已冻结", tone: "success" },
      { label: "限制", value: "不越过公开边界", tone: "success" },
      { label: "未解问题", value: "保留给路线 C，不在此生成答案", tone: "warning" },
    ],
    formalTitle: "Formal 状态",
    formal: [
      { label: "HandoffPreview", value: "Mock Ready" },
      { label: "H1 Decision", value: handoffApproved ? "Approved" : "Waiting", tone: handoffApproved ? "success" : "warning" },
      { label: "Receipt", value: handoffApproved ? "Mock Receipt v1" : "未生成" },
    ],
    limits: [
      "B7 只交接输入，不生成路线 C 方案、实验参数或结论。",
      "下载按钮为演示状态，不写文件、不访问网络。",
    ],
  };
}
