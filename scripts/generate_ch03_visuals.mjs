#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-03");
fs.mkdirSync(outDir, { recursive: true });

const C = {
  bg: "#fbf7ec",
  paper: "#fffdf7",
  ink: "#1e3a5f",
  muted: "#55708f",
  amber: "#d59621",
  amberSoft: "#f7e7b8",
  green: "#3c8d77",
  greenSoft: "#dcefe7",
  red: "#c94c4c",
  redSoft: "#f7dddd",
  purple: "#7651a6",
  purpleSoft: "#e9e0f4",
  blueSoft: "#dfeaf4",
  gray: "#d9d4c7",
};

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function text(x, y, value, size = 28, opts = {}) {
  const {
    color = C.ink,
    weight = 500,
    anchor = "start",
    family = "'Kaiti SC','STKaiti','Noto Sans SC',sans-serif",
    rotate = 0,
    opacity = 1,
  } = opts;
  const lines = Array.isArray(value) ? value : [value];
  const tspans = lines
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * 1.28}">${esc(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" opacity="${opacity}"${rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : ""}>${tspans}</text>`;
}

function box(x, y, w, h, opts = {}) {
  const {
    fill = C.paper,
    stroke = C.ink,
    width = 3,
    radius = 22,
    dash = "",
    rough = true,
  } = opts;
  const first = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  if (!rough) return first;
  return `${first}<rect x="${x + 2}" y="${y - 1}" width="${w - 1}" height="${h + 1}" rx="${radius + 1}" fill="none" stroke="${stroke}" stroke-width="1.2" opacity=".32" transform="rotate(.18 ${x + w / 2} ${y + h / 2})"/>`;
}

function line(x1, y1, x2, y2, opts = {}) {
  const { color = C.ink, width = 4, dash = "", arrow = true, opacity = 1 } = opts;
  return `<path d="M ${x1} ${y1} C ${(x1 * 2 + x2) / 3} ${y1 - 2}, ${(x1 + x2 * 2) / 3} ${y2 + 2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow-${color.slice(1)})"` : ""} opacity="${opacity}"/>`;
}

function pill(x, y, w, label, color, fill, size = 24) {
  return `${box(x, y, w, 52, { fill, stroke: color, width: 2.4, radius: 26 })}${text(x + w / 2, y + 34, label, size, { color, weight: 650, anchor: "middle" })}`;
}

function titleBlock(title, subtitle) {
  return `${text(70, 76, title, 43, { weight: 760 })}<path d="M 70 94 C 260 88, 470 101, 680 93" fill="none" stroke="${C.amber}" stroke-width="7" stroke-linecap="round" opacity=".85"/>${text(72, 128, subtitle, 23, { color: C.muted })}`;
}

function arrows() {
  return [C.ink, C.amber, C.green, C.red, C.purple, C.muted]
    .map((color) => `<marker id="arrow-${color.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`)
    .join("");
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img">
<defs>${arrows()}<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feBlend in="SourceGraphic" in2="n" mode="multiply"/></filter></defs>
<rect width="1600" height="900" fill="${C.bg}"/>
<path d="M 20 180 C 420 171, 920 190, 1580 177 M 30 718 C 530 727, 980 707, 1570 721" stroke="#e7dfce" stroke-width="2" fill="none" opacity=".52"/>
${body}
<text x="1525" y="860" font-family="'Kaiti SC','STKaiti',sans-serif" font-size="18" fill="${C.muted}" text-anchor="end">生产级多智能体系统 · 第 03 章</text>
</svg>`;
}

const files = {};

files["multi-agent-control-axes.svg"] = svg(`
${titleBlock("多 Agent 架构，先回答五个控制问题", "模式名称只是表象；真正决定系统行为的是控制与责任。")}
${box(585, 325, 430, 200, { fill: C.paper, stroke: C.ink, width: 4, radius: 90 })}
${text(800, 395, "多 Agent", 45, { anchor: "middle", weight: 760 })}
${text(800, 446, "分布式控制系统", 31, { anchor: "middle", color: C.muted })}
${text(800, 490, "不是“多开几个模型”", 24, { anchor: "middle", color: C.red, weight: 650 })}
${box(90, 235, 310, 150, { fill: C.blueSoft, stroke: C.ink })}
${text(245, 285, "① 控制权", 31, { anchor: "middle", weight: 720 })}
${text(245, 328, "谁决定下一步？", 24, { anchor: "middle" })}
${box(1200, 235, 310, 150, { fill: C.amberSoft, stroke: C.amber })}
${text(1355, 285, "② 所有权", 31, { anchor: "middle", weight: 720, color: C.amber })}
${text(1355, 328, "谁对结果负责？", 24, { anchor: "middle" })}
${box(80, 570, 320, 150, { fill: C.greenSoft, stroke: C.green })}
${text(240, 620, "③ 拓扑", 31, { anchor: "middle", weight: 720, color: C.green })}
${text(240, 663, "信息和控制怎样流动？", 23, { anchor: "middle" })}
${box(640, 625, 320, 150, { fill: C.purpleSoft, stroke: C.purple })}
${text(800, 675, "④ 边界", 31, { anchor: "middle", weight: 720, color: C.purple })}
${text(800, 718, "为什么必须拆开？", 24, { anchor: "middle" })}
${box(1200, 570, 310, 150, { fill: C.redSoft, stroke: C.red })}
${text(1355, 620, "⑤ 收敛", 31, { anchor: "middle", weight: 720, color: C.red })}
${text(1355, 663, "怎样确认完成或停止？", 23, { anchor: "middle" })}
${line(400, 310, 585, 385, { color: C.ink })}
${line(1200, 310, 1015, 385, { color: C.amber })}
${line(400, 620, 600, 500, { color: C.green })}
${line(800, 625, 800, 525, { color: C.purple })}
${line(1200, 620, 1000, 500, { color: C.red })}
${text(77, 805, "故障语义贯穿五个问题：谁处理、谁承担、传播多远、能否隔离、何时停止。", 24, { color: C.muted })}
`);

files["pattern-family-map.svg"] = svg(`
${titleBlock("模式不是菜单，而是五类控制结构", "同一系统可以组合模式；每一层都要说明它解决了什么问题。")}
${box(70, 205, 280, 540, { fill: C.paper, stroke: C.ink })}
${pill(105, 235, 210, "稳定任务", C.ink, C.blueSoft)}
${text(210, 330, ["确定性流水线", "Sequential", "Chain-of-Agents"], 27, { anchor: "middle", weight: 650 })}
${text(210, 485, ["路径由代码决定", "可预测 · 易测试", "适合稳定步骤"], 22, { anchor: "middle", color: C.muted })}
${box(375, 205, 280, 540, { fill: C.paper, stroke: C.purple })}
${pill(410, 235, 210, "探索问题", C.purple, C.purpleSoft)}
${text(515, 330, ["搜索与审议", "Tree-of-Thoughts", "Magentic"], 27, { anchor: "middle", weight: 650, color: C.purple })}
${text(515, 485, ["探索、评分、重规划", "必须限制宽度深度", "目标合同保持不变"], 22, { anchor: "middle", color: C.muted })}
${box(680, 205, 280, 540, { fill: C.paper, stroke: C.amber })}
${pill(715, 235, 210, "责任变化", C.amber, C.amberSoft)}
${text(820, 330, ["控制权切换", "Handoff", "Supervisor"], 27, { anchor: "middle", weight: 650, color: C.amber })}
${text(820, 485, ["移交当前责任", "或保留全局责任", "所有权必须明确"], 22, { anchor: "middle", color: C.muted })}
${box(985, 205, 280, 540, { fill: C.paper, stroke: C.green })}
${pill(1020, 235, 210, "独立子任务", C.green, C.greenSoft)}
${text(1125, 330, ["并行聚合", "Router", "Fan-Out / Join"], 27, { anchor: "middle", weight: 650, color: C.green })}
${text(1125, 485, ["并行缩短关键路径", "难点在 Join", "部分结果要有语义"], 22, { anchor: "middle", color: C.muted })}
${box(1290, 205, 240, 540, { fill: C.paper, stroke: C.red })}
${pill(1305, 235, 210, "组织复杂", C.red, C.redSoft)}
${text(1410, 330, ["组织与元模式", "Hierarchical", "Semantic Consensus"], 25, { anchor: "middle", weight: 650, color: C.red })}
${text(1410, 485, ["分层团队与汇总", "证据独立性优先", "不是简单多数票"], 22, { anchor: "middle", color: C.muted })}
${text(800, 812, "选择原则：使用能够满足约束的最小动态结构；新增模式必须用质量、延迟、成本或风险收益证明。", 25, { anchor: "middle", color: C.ink, weight: 650 })}
`);

files["handoff-vs-supervisor.svg"] = svg(`
${titleBlock("同一条箭头，两种所有权", "Handoff 转移当前责任；Supervisor 保留全局责任，只委托子任务。")}
${box(70, 205, 690, 555, { fill: C.paper, stroke: C.amber })}
${pill(105, 235, 210, "Handoff", C.amber, C.amberSoft, 29)}
${text(105, 330, "所有权随控制权一起转移", 28, { weight: 720, color: C.amber })}
${box(125, 405, 205, 125, { fill: C.blueSoft, stroke: C.ink })}
${text(227, 457, "前台 Agent", 29, { anchor: "middle", weight: 680 })}
${text(227, 493, "原责任主体", 21, { anchor: "middle", color: C.muted })}
${box(500, 405, 205, 125, { fill: C.amberSoft, stroke: C.amber })}
${text(602, 457, "争议 Agent", 29, { anchor: "middle", weight: 680, color: C.amber })}
${text(602, 493, "新责任主体", 21, { anchor: "middle", color: C.muted })}
${line(330, 466, 500, 466, { color: C.amber, width: 6 })}
${text(415, 433, "交接合同", 20, { anchor: "middle", color: C.muted, weight: 650 })}
${text(105, 600, ["适合：阶段或责任领域明确切换", "关键控制：交接摘要、路由历史、循环保护"], 24, { color: C.ink })}
${box(840, 205, 690, 555, { fill: C.paper, stroke: C.green })}
${pill(875, 235, 235, "Supervisor", C.green, C.greenSoft, 29)}
${text(875, 330, "全局所有权始终保留", 28, { weight: 720, color: C.green })}
${box(1065, 380, 240, 130, { fill: C.greenSoft, stroke: C.green })}
${text(1185, 432, "Supervisor", 30, { anchor: "middle", weight: 720, color: C.green })}
${text(1185, 470, "目标 · 预算 · 结果", 21, { anchor: "middle", color: C.muted })}
${box(885, 580, 195, 105, { fill: C.blueSoft, stroke: C.ink })}
${text(982, 643, "日志专家", 27, { anchor: "middle", weight: 650 })}
${box(1290, 580, 195, 105, { fill: C.purpleSoft, stroke: C.purple })}
${text(1387, 643, "安全专家", 27, { anchor: "middle", weight: 650, color: C.purple })}
${line(1120, 510, 1010, 580, { color: C.green })}
${line(1250, 510, 1360, 580, { color: C.green })}
${text(1185, 555, "受限子任务", 21, { anchor: "middle", color: C.muted })}
${text(800, 830, "判断句：接手“用户接下来由谁负责”是 Handoff；回答“全局任务中的一个问题”是委托。", 25, { anchor: "middle", weight: 650 })}
`);

files["fanout-join-contract.svg"] = svg(`
${titleBlock("Fan-Out 很直观，可靠的 Join 才是工程难点", "并行只缩短执行时间；Join Contract 决定什么时候、带着什么证据继续。")}
${box(70, 350, 230, 150, { fill: C.blueSoft, stroke: C.ink })}
${text(185, 405, "Router", 34, { anchor: "middle", weight: 720 })}
${text(185, 452, "拆分独立子任务", 22, { anchor: "middle", color: C.muted })}
${box(430, 205, 300, 125, { fill: C.greenSoft, stroke: C.green })}
${text(580, 255, "Log Agent", 30, { anchor: "middle", weight: 700, color: C.green })}
${text(580, 294, "completed · 45s", 21, { anchor: "middle" })}
${box(430, 375, 300, 125, { fill: C.amberSoft, stroke: C.amber })}
${text(580, 425, "Metric Agent", 30, { anchor: "middle", weight: 700, color: C.amber })}
${text(580, 464, "partial · 429", 21, { anchor: "middle" })}
${box(430, 545, 300, 125, { fill: C.purpleSoft, stroke: C.purple })}
${text(580, 595, "Security Agent", 30, { anchor: "middle", weight: 700, color: C.purple })}
${text(580, 634, "completed · 冲突", 21, { anchor: "middle" })}
${line(300, 410, 430, 265, { color: C.green })}
${line(300, 425, 430, 437, { color: C.amber })}
${line(300, 440, 430, 607, { color: C.purple })}
${box(860, 260, 330, 340, { fill: C.paper, stroke: C.ink, width: 4 })}
${text(1025, 315, "Join Contract", 34, { anchor: "middle", weight: 760 })}
${text(900, 375, ["等待集合：谁必须回来？", "完成阈值：哪些证据不可缺？", "截止时间：超时如何降级？", "冲突策略：保留还是仲裁？", "晚到结果：丢弃还是修订？"], 23, { color: C.ink })}
${line(730, 265, 860, 340, { color: C.green })}
${line(730, 437, 860, 430, { color: C.amber })}
${line(730, 607, 860, 520, { color: C.purple })}
${box(1320, 330, 220, 195, { fill: C.redSoft, stroke: C.red })}
${text(1430, 380, "阶段性判断", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(1430, 425, ["2/3 完成", "保留冲突", "标明缺失证据"], 22, { anchor: "middle" })}
${line(1190, 430, 1320, 430, { color: C.red, width: 5 })}
${text(800, 760, "推荐：事故初判使用 timeout + partial；一个分支超时，不应自动把全局任务判为失败。", 26, { anchor: "middle", weight: 650 })}
`);

files["collaboration-contract-stack.svg"] = svg(`
${titleBlock("协作的核心不是消息，而是合同", "四份业务合同定义语义；A2A、MCP 与工作流承载不同层次。")}
${box(70, 215, 900, 500, { fill: C.paper, stroke: C.ink })}
${text(110, 270, "业务协作合同", 31, { weight: 750 })}
${box(110, 320, 185, 250, { fill: C.blueSoft, stroke: C.ink })}
${text(202, 365, "Delegation", 27, { anchor: "middle", weight: 700 })}
${text(202, 408, ["目标", "Scope", "验收", "预算"], 22, { anchor: "middle" })}
${box(325, 320, 185, 250, { fill: C.greenSoft, stroke: C.green })}
${text(417, 365, "Result", 27, { anchor: "middle", weight: 700, color: C.green })}
${text(417, 408, ["状态", "Claims", "缺口", "副作用"], 22, { anchor: "middle" })}
${box(540, 320, 185, 250, { fill: C.amberSoft, stroke: C.amber })}
${text(632, 365, "Evidence", 27, { anchor: "middle", weight: 700, color: C.amber })}
${text(632, 408, ["来源", "范围", "哈希", "新鲜度"], 22, { anchor: "middle" })}
${box(755, 320, 175, 250, { fill: C.purpleSoft, stroke: C.purple })}
${text(842, 365, "Join", 27, { anchor: "middle", weight: 700, color: C.purple })}
${text(842, 408, ["等待", "阈值", "冲突", "超时"], 22, { anchor: "middle" })}
${line(295, 445, 325, 445, { color: C.ink })}
${line(510, 445, 540, 445, { color: C.green })}
${line(725, 445, 755, 445, { color: C.amber })}
${text(110, 635, "合同可测试 · 失败可表达 · 结论可追溯", 25, { color: C.muted, weight: 650 })}
${box(1030, 215, 500, 500, { fill: C.paper, stroke: C.ink })}
${text(1070, 270, "协议与运行时分层", 31, { weight: 750 })}
${box(1070, 320, 420, 82, { fill: C.blueSoft, stroke: C.ink })}
${text(1280, 371, "Agent ↔ Agent：A2A / Queue / RPC", 24, { anchor: "middle", weight: 650 })}
${box(1070, 425, 420, 82, { fill: C.greenSoft, stroke: C.green })}
${text(1280, 476, "Agent ↔ Tool：MCP / Tool Calling", 24, { anchor: "middle", weight: 650, color: C.green })}
${box(1070, 530, 420, 115, { fill: C.amberSoft, stroke: C.amber })}
${text(1280, 573, "控制与证据", 25, { anchor: "middle", weight: 700, color: C.amber })}
${text(1280, 612, "Workflow · Ledger · Artifact · Trace", 21, { anchor: "middle" })}
${text(800, 795, "协议保证互操作，不替代任务分解、授权、证据质量和全局收敛。", 27, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["incident-response-mas.svg"] = svg(`
${titleBlock("事故响应：确定性主干 + Agentic 岛屿", "让模型探索证据，让运行时控制生命周期、权限、Join 和高风险动作。")}
${box(50, 330, 205, 150, { fill: C.blueSoft, stroke: C.ink })}
${text(152, 380, "Intake Gate", 29, { anchor: "middle", weight: 720 })}
${text(152, 424, ["去重 · 规范化", "风险初筛"], 20, { anchor: "middle", color: C.muted })}
${box(315, 330, 220, 150, { fill: C.greenSoft, stroke: C.green })}
${text(425, 380, "Supervisor", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(425, 424, ["目标 · 预算", "受限委托"], 20, { anchor: "middle", color: C.muted })}
${line(255, 405, 315, 405, { color: C.ink })}
${box(630, 205, 235, 110, { fill: C.blueSoft, stroke: C.ink })}
${text(747, 270, "Log Agent", 28, { anchor: "middle", weight: 700 })}
${box(630, 355, 235, 110, { fill: C.amberSoft, stroke: C.amber })}
${text(747, 420, "Metric Agent", 28, { anchor: "middle", weight: 700, color: C.amber })}
${box(630, 505, 235, 110, { fill: C.purpleSoft, stroke: C.purple })}
${text(747, 570, "Security Agent", 28, { anchor: "middle", weight: 700, color: C.purple })}
${line(535, 380, 630, 260, { color: C.ink })}
${line(535, 405, 630, 410, { color: C.amber })}
${line(535, 430, 630, 560, { color: C.purple })}
${box(955, 330, 230, 150, { fill: C.paper, stroke: C.ink, width: 4 })}
${text(1070, 380, "Evidence Join", 29, { anchor: "middle", weight: 720 })}
${text(1070, 423, ["验收 · 冲突", "partial 语义"], 20, { anchor: "middle", color: C.muted })}
${line(865, 260, 955, 365, { color: C.ink })}
${line(865, 410, 955, 405, { color: C.amber })}
${line(865, 560, 955, 445, { color: C.purple })}
${box(1260, 330, 280, 150, { fill: C.redSoft, stroke: C.red, width: 4 })}
${text(1400, 378, "Policy + Approval", 28, { anchor: "middle", weight: 720, color: C.red })}
${text(1400, 420, ["R0 只读可执行", "R2/R3 人工审批"], 20, { anchor: "middle" })}
${line(1185, 405, 1260, 405, { color: C.red, width: 5 })}
${pathLabel(560, 175, 380, 475, "Agentic 调查区：允许语义判断与受限探索", C.green)}
${pathLabel(40, 680, 1510, 105, "确定性主干：事件 → 委托 → Join → 策略 → 审批 / 发布", C.ink)}
${text(800, 825, "根因 Claim → EvidenceRef → 不可变 Artifact → Tool Result → 查询与授权决策", 24, { anchor: "middle", color: C.muted, weight: 650 })}
`);

files["caseops-slice2-collaboration.svg"] = svg(`
${titleBlock("CaseOps Slice 2：协议分层与证据收敛", "Supervisor 持有全局状态；A2A 传任务；MCP 取事实；Join 决定是否收敛。")}
${box(55, 235, 210, 135, { fill: C.blueSoft, stroke: C.ink })}
${text(160, 282, "CaseOps API", 28, { anchor: "middle", weight: 720 })}
${text(160, 322, ["租户身份", "幂等入口"], 20, { anchor: "middle", color: C.muted })}
${box(55, 470, 270, 190, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(190, 520, "Supervisor", 31, { anchor: "middle", weight: 740, color: C.green })}
${text(190, 565, ["目标 · 截止时间", "委托账本 · 全局结果", "唯一收敛责任人"], 21, { anchor: "middle" })}
${line(160, 370, 175, 470, { color: C.ink })}
${text(60, 420, "请求 + principal", 19, { color: C.muted })}

${pathLabel(390, 180, 510, 505, "A2A 1.0 协作边界", C.purple)}
${box(435, 250, 190, 105, { fill: C.blueSoft, stroke: C.ink })}
${text(530, 292, "Coverage Agent", 24, { anchor: "middle", weight: 700 })}
${text(530, 327, "coverage:read", 18, { anchor: "middle", color: C.muted })}
${box(435, 405, 190, 105, { fill: C.amberSoft, stroke: C.amber })}
${text(530, 447, "Document Agent", 24, { anchor: "middle", weight: 700, color: C.amber })}
${text(530, 482, "document:read", 18, { anchor: "middle", color: C.muted })}
${box(435, 560, 190, 105, { fill: C.redSoft, stroke: C.red })}
${text(530, 602, "Risk Agent", 24, { anchor: "middle", weight: 700, color: C.red })}
${text(530, 637, "risk:read", 18, { anchor: "middle", color: C.muted })}
${line(325, 520, 435, 302, { color: C.purple })}
${line(325, 555, 435, 457, { color: C.purple })}
${line(325, 590, 435, 612, { color: C.purple })}
${text(345, 257, ["DelegationTask", "+ task token"], 18, { color: C.purple, weight: 650 })}

${box(970, 230, 260, 180, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(1100, 278, "MCP Tool Server", 29, { anchor: "middle", weight: 730, color: C.green })}
${text(1100, 323, ["五个只读工具", "Schema · Scope · 审计", "无业务状态所有权"], 20, { anchor: "middle" })}
${line(625, 300, 970, 290, { color: C.green })}
${line(625, 457, 970, 320, { color: C.green })}
${line(625, 612, 970, 350, { color: C.green })}
${text(760, 270, "MCP / 最小权限取证", 18, { anchor: "middle", color: C.green, weight: 650 })}

${box(1310, 230, 235, 180, { fill: C.paper, stroke: C.ink })}
${text(1427, 280, "PostgreSQL", 29, { anchor: "middle", weight: 730 })}
${text(1427, 325, ["业务任务", "A2A Task", "Outbox / Audit"], 20, { anchor: "middle", color: C.muted })}
${line(1230, 320, 1310, 320, { color: C.ink })}

${box(970, 510, 260, 155, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(1100, 558, "Evidence Join", 29, { anchor: "middle", weight: 730, color: C.amber })}
${text(1100, 600, ["验收 · quorum", "冲突 · partial"], 20, { anchor: "middle" })}
${line(625, 302, 970, 545, { color: C.amber })}
${line(625, 457, 970, 580, { color: C.amber })}
${line(625, 612, 970, 615, { color: C.amber })}
${text(800, 642, "SpecialistResult Artifact", 18, { anchor: "middle", color: C.amber, weight: 650 })}

${box(1310, 510, 235, 155, { fill: C.redSoft, stroke: C.red, width: 4 })}
${text(1427, 555, "全局结果", 29, { anchor: "middle", weight: 730, color: C.red })}
${text(1427, 598, ["人工复核", "side_effect = none"], 20, { anchor: "middle" })}
${line(1230, 587, 1310, 587, { color: C.red, width: 5 })}

${box(55, 750, 1490, 70, { fill: C.paper, stroke: C.gray, width: 2, radius: 24 })}
${text(800, 794, "三本账不可混用：A2A Task 管协议生命周期  ·  Delegated Task 管业务委托  ·  CloudEvent 管跨服务事实", 23, { anchor: "middle", weight: 650 })}
`);

function pathLabel(x, y, w, h, label, color) {
  return `${box(x, y, w, h, { fill: "none", stroke: color, width: 2.5, radius: 30, dash: "12 9" })}${text(x + w / 2, y + 32, label, 20, { anchor: "middle", color, weight: 650 })}`;
}

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

console.log(`Generated ${Object.keys(files).length} SVG files in ${outDir}`);
