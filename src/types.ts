export type StageId = "b3" | "b5" | "b6" | "b7";

export type MessageRole = "user" | "agent" | "system";

export type MessageAction =
  | "confirm-theme"
  | "freeze-brief"
  | "open-gap"
  | "challenge-gap"
  | "freeze-gap"
  | "approve-handoff";

export type Message = {
  id: string;
  role: MessageRole;
  author: string;
  body: string;
  meta?: string;
  action?: MessageAction;
};

export type Stage = {
  id: StageId;
  index: string;
  short: string;
  title: string;
  subtitle: string;
};

export type EvidenceItem = {
  label: string;
  value: string;
  tone?: "normal" | "success" | "warning" | "danger";
};

export type StageSnapshot = {
  headline: string;
  status: string;
  statusTone: "ready" | "working" | "decision" | "complete" | "warning";
  evidenceTitle: string;
  evidence: EvidenceItem[];
  coverageTitle: string;
  coverage: EvidenceItem[];
  formalTitle: string;
  formal: EvidenceItem[];
  limits: string[];
};

export type DirectionCandidate = {
  id: string;
  title: string;
  summary: string;
  difference: string;
  evidence: string[];
  unknowns: string[];
  risks: string[];
};

export type DemoState = {
  stage: StageId;
  messages: Record<StageId, Message[]>;
  completed: StageId[];
  b3DirectionsReady: boolean;
  selectedDirection: string | null;
  directionsRejected: boolean;
  b5Step: number;
  b6Challenged: boolean;
  gapFrozen: boolean;
  handoffApproved: boolean;
  inputSeed: number;
};

export type DemoAction =
  | { type: "submit"; text: string }
  | { type: "jump"; stage: StageId }
  | { type: "formal"; action: MessageAction }
  | { type: "selectDirection"; candidateId: string }
  | { type: "rejectDirections"; comment: string }
  | { type: "advanceB5" }
  | { type: "reset" };
