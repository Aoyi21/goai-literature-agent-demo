# GOAI 文献 Agent 公开 Mock Demo

这是一个可独立部署到 GitHub Pages 的静态 Web UI Demo。它用于展示 GOAI 文献 Agent 从 B3 到 B7 的产品路径：问题收敛、自动文献研究、Gap 挑战、路线 C 交接。

它不是完整 Agent 后端。页面不调用模型、不访问数据库、不请求 Sciverse/MinerU，不需要 API Key。所有交互只保存在当前浏览器内存里，断网后仍可继续点击和输入。

## 功能

- 复刻参赛版四栏研究工作台：项目导航、研究旅程、中央对话主轴、右侧证据和 Formal 状态。
- 四个阶段可交互：B3 问题收敛、B5 自动研究、B6 Gap 挑战、B7 交接。
- B3 会先确认主题边界，再返回四个候选方向。用户可以比较依据、未知和风险，选择一个继续，也可以填写理由后全部拒绝并重新探索。
- 点击研究旅程中的 B3/B5/B6/B7，可直接切换中央 Mock 对话，不必按顺序等待。
- 推荐问题和自由输入都可触发 Mock 回复。
- 输入区提供“填入示例”和可直接发送的复现话术，便于评委快速走完完整链路。
- 阶段动作只挂在最新 Agent 消息上，点击后会更新阶段、消息和右侧状态。
- 对话下方会随阶段显示主题草稿、候选比较、证据记录、自动研究产物、Gap 查询和交接文件；中央区域可纵向滚动查看完整内容。
- 页面持续标注“公开 Mock Demo / 不调用模型 / 不代表新增科研结果”。

## Mock 边界

这个 Demo 只使用受控样例和改写摘要。它不会包含：

- raw Run、raw request、raw response 或模型调用原文；
- API Key、环境变量、数据库或服务端代码；
- 内部绝对路径、受限材料、论文全文或未公开实验参数；
- 新的科研发现、路线 C 方案、实验配方或可行性结论。

页面里的统计数字是显式 Mock，例如“候选 6 / 纳入 3 / 待核 1”。它们只用于说明产品状态，不代表真实研究结果。

## 本地启动

```bash
npm ci
npm run dev
```

默认开发地址是 Vite 输出的本地地址，通常为 `http://127.0.0.1:5173/goai-literature-agent-demo/`。

## 构建与预览

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

`dist/` 是纯静态文件，可以直接托管到 GitHub Pages。

## GitHub Pages 部署

默认仓库名假设为 `goai-literature-agent-demo`，因此 `vite.config.ts` 的默认 base path 是：

```text
/goai-literature-agent-demo/
```

如果仓库名不同，构建时覆盖：

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
```

当前公开仓库使用 `gh-pages` 静态分支发布，GitHub Pages 从该分支根目录读取构建产物。不需要 API Key、服务端或运行时环境变量。

更新页面时，先运行 `npm ci && npm run build`，再把 `dist/` 中的静态文件发布到 `gh-pages` 分支。主分支只保存源代码。

## 离线能力

构建后的页面没有 `fetch`、`XMLHttpRequest`、`WebSocket`、外链字体、远程图片、分析脚本或 Service Worker。依赖资源都随静态包输出。首次加载完成后，演示交互只依赖浏览器内存。

## 禁止声明

请不要把这个 Demo 描述为：

- 已恢复完整文献 Agent 后端；
- 真实调用模型、Sciverse、MinerU 或 SQLite；
- 产生了新增科研结果；
- 可以替代正式 Run、审计包或科研复核。
