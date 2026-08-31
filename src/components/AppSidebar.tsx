import {
  Beaker,
  BookOpen,
  Database,
  FlaskConical,
  Home,
  Map,
  Network,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import type { StageId } from "../types";

type Props = {
  activeStage: StageId;
  onJump: (stage: StageId) => void;
};

const navItems = [
  { label: "研究工作台", stage: "b3" as const, icon: Home },
  { label: "证据实验室", stage: "b5" as const, icon: Beaker },
  { label: "知识与覆盖", stage: "b5" as const, icon: BookOpen },
  { label: "Gap 对抗", stage: "b6" as const, icon: Network },
  { label: "审计中心", stage: "b7" as const, icon: ShieldCheck },
];

export function AppSidebar({ activeStage, onJump }: Props) {
  return (
    <aside className="app-sidebar" aria-label="项目导航">
      <div className="sidebar-brand">
        <FlaskConical size={20} aria-hidden="true" />
        <strong>GOAI 文献 Agent</strong>
      </div>
      <div className="sidebar-project">
        <span>项目</span>
        <strong>磷酸铁基废旧正极</strong>
        <p>Fe(VI) 高铁酸盐</p>
      </div>
      <nav className="sidebar-nav" aria-label="产品区域">
        {navItems.map(({ label, stage, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className={activeStage === stage ? "sidebar-nav-item active" : "sidebar-nav-item"}
            onClick={() => onJump(stage)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
        <button type="button" className="sidebar-nav-item disabled" disabled>
          <Map size={16} aria-hidden="true" />
          Roadmap
          <span>开发中</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        <button type="button" disabled><Settings2 size={16} aria-hidden="true" />项目设置</button>
        <div><Database size={17} aria-hidden="true" />本地 Artifact 存储</div>
      </div>
    </aside>
  );
}
