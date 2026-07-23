#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-07");
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
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function text(x, y, value, size = 28, opts = {}) {
  const {
    color = C.ink,
    weight = 500,
    anchor = "start",
    rotate = 0,
    lineGap = 1.28,
  } = opts;
  const lines = Array.isArray(value) ? value : [value];
  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineGap}">${esc(line)}</tspan>`,
    )
    .join("");
  return `<text x="${x}" y="${y}" font-family="'Kaiti SC','STKaiti','Noto Sans SC',sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}"${rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : ""}>${tspans}</text>`;
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
  const main = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  if (!rough) return main;
  return `${main}<rect x="${x + 2}" y="${y - 1}" width="${w - 1}" height="${h + 1}" rx="${radius + 1}" fill="none" stroke="${stroke}" stroke-width="1.2" opacity=".3" transform="rotate(.18 ${x + w / 2} ${y + h / 2})"/>`;
}

function line(x1, y1, x2, y2, opts = {}) {
  const { color = C.ink, width = 4, dash = "" } = opts;
  return `<path d="M ${x1} ${y1} C ${(x1 * 2 + x2) / 3} ${y1 - 2}, ${(x1 + x2 * 2) / 3} ${y2 + 2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}

function arrow(x1, y1, x2, y2, opts = {}) {
  const { color = C.ink, width = 4, dash = "" } = opts;
  return `<path d="M ${x1} ${y1} C ${(x1 * 2 + x2) / 3} ${y1 - 2}, ${(x1 + x2 * 2) / 3} ${y2 + 2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#arrow-${color.slice(1)})"/>`;
}

function pill(x, y, w, label, color, fill, size = 22) {
  return `${box(x, y, w, 50, { fill, stroke: color, width: 2.4, radius: 25 })}${text(x + w / 2, y + 33, label, size, { color, weight: 700, anchor: "middle" })}`;
}

function titleBlock(title, subtitle) {
  return `${text(70, 76, title, 43, { weight: 760 })}<path d="M 70 94 C 265 87, 485 102, 710 93" fill="none" stroke="${C.amber}" stroke-width="7" stroke-linecap="round" opacity=".85"/>${text(72, 128, subtitle, 23, { color: C.muted })}`;
}

function arrowDefs() {
  return [C.ink, C.amber, C.green, C.red, C.purple, C.muted]
    .map(
      (color) =>
        `<marker id="arrow-${color.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`,
    )
    .join("");
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img">
<defs>${arrowDefs()}</defs>
<rect width="1600" height="900" fill="${C.bg}"/>
<path d="M 20 180 C 420 171, 920 190, 1580 177 M 30 718 C 530 727, 980 707, 1570 721" stroke="#e7dfce" stroke-width="2" fill="none" opacity=".52"/>
${body}
<text x="1525" y="860" font-family="'Kaiti SC','STKaiti',sans-serif" font-size="18" fill="${C.muted}" text-anchor="end">生产级多智能体系统 · 第 07 章</text>
</svg>`;
}

const files = {};

files["layered-multi-agent-system.svg"] = svg(`
${titleBlock("分层多 Agent：逐层缩小决策空间", "每一层只接收完成本层责任所需的目标、上下文、权限和预算。")}
${box(80, 220, 1440, 82, { fill: C.redSoft, stroke: C.red })}
${pill(105, 236, 230, "Access / API", C.red, C.paper, 24)}
${text(400, 272, "用户身份 · 会话 · 输入门禁 · 响应协议", 25, { weight: 650 })}
${text(1450, 271, "不做业务规划", 21, { color: C.red, anchor: "end", weight: 700 })}
${arrow(800, 302, 800, 335, { color: C.red })}
${box(140, 335, 1320, 82, { fill: C.blueSoft, stroke: C.ink })}
${pill(165, 351, 270, "Central Supervisor", C.ink, C.paper, 23)}
${text(500, 387, "跨域目标 · 团队路由 · 全局依赖 · Join", 25, { weight: 650 })}
${text(1390, 386, "不碰业务数据库", 21, { color: C.red, anchor: "end", weight: 700 })}
${arrow(800, 417, 800, 450)}
${box(200, 450, 1200, 82, { fill: C.amberSoft, stroke: C.amber })}
${pill(225, 466, 270, "Team Supervisors", C.amber, C.paper, 23)}
${text(560, 502, "域内计划 · Worker 路由 · 子预算 · 局部汇总", 25, { weight: 650 })}
${text(1330, 501, "不改写全局权限", 21, { color: C.red, anchor: "end", weight: 700 })}
${arrow(800, 532, 800, 565, { color: C.amber })}
${box(260, 565, 1080, 82, { fill: C.greenSoft, stroke: C.green })}
${pill(285, 581, 210, "Workers", C.green, C.paper, 23)}
${text(560, 617, "单一能力 · 证据化结果 · 明确错误", 25, { weight: 650 })}
${text(1270, 616, "不自由探索工具", 21, { color: C.red, anchor: "end", weight: 700 })}
${arrow(800, 647, 800, 680, { color: C.green })}
${box(320, 680, 960, 82, { fill: C.paper, stroke: C.purple })}
${pill(345, 696, 240, "Tools / Data", C.purple, C.purpleSoft, 23)}
${text(650, 732, "执行 · 授权 · 幂等 · Schema", 23, { weight: 650 })}
${text(1210, 731, "不理解开放目标", 21, { color: C.red, anchor: "end", weight: 700 })}
${text(800, 815, "层级有价值的前提：每向下一层，权限、上下文和故障半径都更小。", 27, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["a2a-mcp-boundary.svg"] = svg(`
${titleBlock("A2A 与 MCP：两个协议，两类边界", "A2A 连接独立 Agent 系统；MCP 连接 AI Host 与工具、资源和确定性能力。")}
${box(60, 220, 660, 520, { fill: C.blueSoft, stroke: C.ink })}
${text(390, 272, "A2A · Agent System ↔ Agent System", 30, { anchor: "middle", weight: 760 })}
${box(105, 335, 225, 150, { fill: C.paper, stroke: C.ink })}
${text(217, 385, "Central", 28, { anchor: "middle", weight: 720 })}
${text(217, 425, "Supervisor", 25, { anchor: "middle" })}
${box(450, 335, 225, 150, { fill: C.amberSoft, stroke: C.amber })}
${text(562, 385, "Claims", 28, { anchor: "middle", weight: 720, color: C.amber })}
${text(562, 425, "Agent System", 25, { anchor: "middle" })}
${arrow(330, 410, 450, 410)}
${text(390, 380, "Task · Message", 18, { anchor: "middle" })}
${text(390, 454, "Artifact · Status", 18, { anchor: "middle" })}
${pill(125, 545, 170, "AgentCard", C.ink, C.paper, 20)}
${pill(305, 545, 170, "Skill", C.purple, C.purpleSoft, 20)}
${pill(485, 545, 170, "Task", C.amber, C.paper, 20)}
${text(390, 655, "不共享远端内部 Memory、Tool 与实现", 23, { anchor: "middle", color: C.muted, weight: 650 })}
${box(880, 220, 660, 520, { fill: C.greenSoft, stroke: C.green })}
${text(1210, 272, "MCP · Host / Client ↔ Server", 30, { anchor: "middle", weight: 760, color: C.green })}
${box(925, 335, 225, 150, { fill: C.paper, stroke: C.green })}
${text(1037, 385, "Worker", 28, { anchor: "middle", weight: 720 })}
${text(1037, 425, "MCP Client", 25, { anchor: "middle" })}
${box(1270, 335, 225, 150, { fill: C.purpleSoft, stroke: C.purple })}
${text(1382, 385, "Claims", 28, { anchor: "middle", weight: 720, color: C.purple })}
${text(1382, 425, "MCP Server", 25, { anchor: "middle" })}
${arrow(1150, 410, 1270, 410, { color: C.green })}
${text(1210, 380, "tools/list", 18, { anchor: "middle" })}
${text(1210, 454, "tools/call", 18, { anchor: "middle" })}
${pill(945, 545, 170, "Tools", C.green, C.paper, 20)}
${pill(1125, 545, 170, "Resources", C.ink, C.blueSoft, 20)}
${pill(1305, 545, 170, "Prompts", C.purple, C.paper, 20)}
${text(1210, 655, "工具可发现，不代表当前请求已授权", 23, { anchor: "middle", color: C.muted, weight: 650 })}
${text(800, 800, "常见组合：Agent 系统之间使用 A2A；每个 Agent 系统内部使用 MCP 访问工具与数据。", 27, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["state-ownership-and-join.svg"] = svg(`
${titleBlock("State Ownership：Fan-out 之后必须确定性 Join", "每个字段只有一个权威写入者或显式 Reducer；重复、迟到和冲突结果不能靠最后写入者获胜。")}
${box(55, 240, 360, 460, { fill: C.blueSoft, stroke: C.ink })}
${text(235, 292, "Supervisor State", 30, { anchor: "middle", weight: 760 })}
${pill(95, 340, 280, "Goal · Request Processor", C.ink, C.paper, 18)}
${pill(95, 415, 280, "Plan · Validator", C.purple, C.purpleSoft, 18)}
${pill(95, 490, 280, "Budget · Controller", C.amber, C.amberSoft, 18)}
${pill(95, 565, 280, "Evidence · Reducer", C.green, C.greenSoft, 18)}
${pill(95, 640, 280, "Errors · Append-only", C.red, C.redSoft, 18)}
${arrow(415, 470, 530, 350)}
${arrow(415, 470, 530, 470)}
${arrow(415, 470, 530, 590)}
${box(530, 285, 300, 130, { fill: C.paper, stroke: C.green })}
${text(680, 335, "Step S2", 27, { anchor: "middle", weight: 720 })}
${text(680, 375, "Claims Artifact", 21, { anchor: "middle" })}
${box(530, 425, 300, 130, { fill: C.paper, stroke: C.purple })}
${text(680, 475, "Step S3", 27, { anchor: "middle", weight: 720 })}
${text(680, 515, "Policy Evidence", 21, { anchor: "middle" })}
${box(530, 565, 300, 130, { fill: C.paper, stroke: C.amber })}
${text(680, 615, "Step S4", 27, { anchor: "middle", weight: 720 })}
${text(680, 655, "Draft Artifact", 21, { anchor: "middle" })}
${arrow(830, 350, 960, 430, { color: C.green })}
${arrow(830, 490, 960, 490, { color: C.purple })}
${arrow(830, 630, 960, 550, { color: C.amber })}
${box(960, 300, 300, 360, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(1110, 355, "Join Contract", 31, { anchor: "middle", weight: 760, color: C.amber })}
${text(1110, 415, ["Required Set", "Optional Set", "Deadline", "No Data / Degraded", "Late Result Policy", "Conflict Policy"], 23, { anchor: "middle", lineGap: 1.47 })}
${arrow(1260, 480, 1370, 480, { color: C.amber })}
${box(1370, 350, 175, 260, { fill: C.greenSoft, stroke: C.green })}
${text(1457, 420, "Accepted", 27, { anchor: "middle", weight: 720, color: C.green })}
${text(1457, 465, "Results", 27, { anchor: "middle", weight: 720, color: C.green })}
${text(1457, 535, "+", 28, { anchor: "middle" })}
${text(1457, 575, "Evidence", 25, { anchor: "middle" })}
${text(800, 775, "旧 Plan 的迟到结果只记录不合并；同一 Step 的不同 Hash 必须阻断并升级。", 28, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["end-to-end-incident-flow.svg"] = svg(`
${titleBlock("C-102 调查：一条端到端受控执行链", "目标冻结、计划校验、A2A 委托、MCP 取证、Artifact 汇合与审批边界必须在同一条因果链上。")}
${box(45, 250, 190, 130, { fill: C.redSoft, stroke: C.red })}
${text(140, 300, "用户目标", 28, { anchor: "middle", weight: 720, color: C.red })}
${text(140, 340, "只调查 + 草稿", 19, { anchor: "middle" })}
${box(285, 250, 210, 130, { fill: C.blueSoft, stroke: C.ink })}
${text(390, 300, "Plan DAG", 28, { anchor: "middle", weight: 720 })}
${text(390, 340, "Validator", 19, { anchor: "middle" })}
${box(545, 250, 230, 130, { fill: C.amberSoft, stroke: C.amber })}
${text(660, 300, "Central", 28, { anchor: "middle", weight: 720, color: C.amber })}
${text(660, 340, "Supervisor", 22, { anchor: "middle" })}
${arrow(235, 315, 285, 315, { color: C.red })}
${arrow(495, 315, 545, 315)}
${box(880, 200, 255, 120, { fill: C.paper, stroke: C.green })}
${text(1007, 250, "Claims Team", 27, { anchor: "middle", weight: 720, color: C.green })}
${text(1007, 286, "A2A Task", 19, { anchor: "middle" })}
${box(880, 350, 255, 120, { fill: C.paper, stroke: C.purple })}
${text(1007, 400, "Knowledge Team", 27, { anchor: "middle", weight: 720, color: C.purple })}
${text(1007, 436, "A2A Task", 19, { anchor: "middle" })}
${box(880, 500, 255, 120, { fill: C.paper, stroke: C.amber })}
${text(1007, 550, "Notification Team", 25, { anchor: "middle", weight: 720, color: C.amber })}
${text(1007, 586, "Draft only", 19, { anchor: "middle" })}
${arrow(775, 315, 880, 260, { color: C.green })}
${text(825, 262, "Ready S2", 16, { anchor: "middle", color: C.green })}
${arrow(1007, 320, 1007, 350, { color: C.purple })}
${arrow(1007, 470, 1007, 500, { color: C.amber })}
${box(1205, 200, 340, 420, { fill: C.greenSoft, stroke: C.green })}
${text(1375, 252, "Artifact + Evidence", 29, { anchor: "middle", weight: 760, color: C.green })}
${pill(1250, 305, 250, "claim:C-102@v17", C.green, C.paper, 19)}
${pill(1250, 380, 250, "policy:terms@v8", C.purple, C.paper, 19)}
${pill(1250, 455, 250, "notice:draft@sha256", C.amber, C.paper, 19)}
${pill(1250, 530, 250, "send action = NONE", C.red, C.redSoft, 19)}
${arrow(1135, 260, 1205, 305, { color: C.green })}
${arrow(1135, 410, 1205, 420, { color: C.purple })}
${arrow(1135, 560, 1205, 535, { color: C.amber })}
${box(380, 675, 840, 92, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 42 })}
${text(800, 713, "Consolidator 只读取 Accepted Result", 25, { anchor: "middle", weight: 720 })}
${text(800, 748, "每个 Claim → Evidence；每个副作用 → Authority + Approval + Idempotency", 21, { anchor: "middle", color: C.muted })}
${arrow(1375, 620, 1200, 675, { color: C.green })}
${text(800, 815, "“生成通知草稿”与“发送通知”必须是不同 Skill、不同 Tool、不同权限。", 28, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["context-graph-runtime.svg"] = svg(`
${titleBlock("Context Graph：从目标到结论的运行时证据链", "它保存业务因果与引用；Checkpoint、Artifact、Trace 和 Knowledge 各自保持独立权威。")}
${box(55, 235, 200, 105, { fill: C.redSoft, stroke: C.red })}
${text(155, 297, "Goal", 30, { anchor: "middle", weight: 760, color: C.red })}
${box(325, 235, 200, 105, { fill: C.blueSoft, stroke: C.ink })}
${text(425, 297, "Plan / Step", 28, { anchor: "middle", weight: 760 })}
${box(595, 235, 200, 105, { fill: C.amberSoft, stroke: C.amber })}
${text(695, 297, "Agent / Tool", 28, { anchor: "middle", weight: 760, color: C.amber })}
${box(865, 235, 200, 105, { fill: C.greenSoft, stroke: C.green })}
${text(965, 297, "Artifact", 30, { anchor: "middle", weight: 760, color: C.green })}
${box(1135, 235, 200, 105, { fill: C.purpleSoft, stroke: C.purple })}
${text(1235, 297, "Evidence", 30, { anchor: "middle", weight: 760, color: C.purple })}
${box(1405, 235, 150, 105, { fill: C.paper, stroke: C.red })}
${text(1480, 297, "Claim", 30, { anchor: "middle", weight: 760, color: C.red })}
${arrow(255, 287, 325, 287, { color: C.red })}
${arrow(525, 287, 595, 287)}
${arrow(795, 287, 865, 287, { color: C.amber })}
${arrow(1065, 287, 1135, 287, { color: C.green })}
${arrow(1335, 287, 1405, 287, { color: C.purple })}
${text(290, 257, "DECOMPOSED", 15, { anchor: "middle" })}
${text(560, 257, "ROUTED", 15, { anchor: "middle" })}
${text(830, 257, "PRODUCED", 15, { anchor: "middle" })}
${text(1100, 257, "CONTAINS", 15, { anchor: "middle" })}
${text(1370, 257, "SUPPORTS", 15, { anchor: "middle" })}
${box(100, 480, 300, 165, { fill: C.paper, stroke: C.ink })}
${text(250, 530, "Checkpoint", 28, { anchor: "middle", weight: 720 })}
${text(250, 574, "恢复执行状态", 21, { anchor: "middle" })}
${text(250, 612, "checkpoint_ref", 18, { anchor: "middle", color: C.muted })}
${box(470, 480, 300, 165, { fill: C.paper, stroke: C.green })}
${text(620, 530, "Artifact Store", 28, { anchor: "middle", weight: 720, color: C.green })}
${text(620, 574, "保存原始大对象", 21, { anchor: "middle" })}
${text(620, 612, "artifact_ref + hash", 18, { anchor: "middle", color: C.muted })}
${box(840, 480, 300, 165, { fill: C.paper, stroke: C.purple })}
${text(990, 530, "OpenTelemetry", 28, { anchor: "middle", weight: 720, color: C.purple })}
${text(990, 574, "运行路径与时延", 21, { anchor: "middle" })}
${text(990, 612, "trace_ref + span_ref", 18, { anchor: "middle", color: C.muted })}
${box(1210, 480, 300, 165, { fill: C.paper, stroke: C.amber })}
${text(1360, 530, "Knowledge Graph", 28, { anchor: "middle", weight: 720, color: C.amber })}
${text(1360, 574, "业务实体与关系", 21, { anchor: "middle" })}
${text(1360, 612, "entity_ref + version", 18, { anchor: "middle", color: C.muted })}
${line(425, 340, 250, 480, { color: C.ink, dash: "10 8" })}
${line(965, 340, 620, 480, { color: C.green, dash: "10 8" })}
${line(695, 340, 990, 480, { color: C.purple, dash: "10 8" })}
${line(1235, 340, 1360, 480, { color: C.amber, dash: "10 8" })}
${text(800, 755, "Context Graph 保存关系和引用，不复制所有文件、状态快照、遥测与知识。", 28, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["integration-verification-loop.svg"] = svg(`
${titleBlock("系统合龙：先证明一条垂直链路", "从合同到故障演练形成闭环；每次扩展团队、模型、工具或版本都重新进入验证。")}
${box(55, 320, 220, 145, { fill: C.blueSoft, stroke: C.ink })}
${text(165, 370, "1 · Contracts", 29, { anchor: "middle", weight: 760 })}
${text(165, 414, "State · Plan · Result", 18, { anchor: "middle" })}
${box(315, 320, 220, 145, { fill: C.amberSoft, stroke: C.amber })}
${text(425, 370, "2 · Golden Path", 29, { anchor: "middle", weight: 760, color: C.amber })}
${text(425, 414, "One Team · One Tool", 18, { anchor: "middle" })}
${box(575, 320, 220, 145, { fill: C.greenSoft, stroke: C.green })}
${text(685, 370, "3 · Evidence", 29, { anchor: "middle", weight: 760, color: C.green })}
${text(685, 414, "Artifact · Graph · Trace", 18, { anchor: "middle" })}
${box(835, 320, 220, 145, { fill: C.redSoft, stroke: C.red })}
${text(945, 370, "4 · Faults", 29, { anchor: "middle", weight: 760, color: C.red })}
${text(945, 414, "Timeout · Crash · Replay", 18, { anchor: "middle" })}
${box(1095, 320, 220, 145, { fill: C.purpleSoft, stroke: C.purple })}
${text(1205, 370, "5 · Acceptance", 29, { anchor: "middle", weight: 760, color: C.purple })}
${text(1205, 414, "SLO · Security · Cost", 18, { anchor: "middle" })}
${box(1355, 320, 190, 145, { fill: C.paper, stroke: C.ink })}
${text(1450, 370, "6 · Scale", 29, { anchor: "middle", weight: 760 })}
${text(1450, 414, "Teams · Concurrency", 18, { anchor: "middle" })}
${arrow(275, 392, 315, 392)}
${arrow(535, 392, 575, 392, { color: C.amber })}
${arrow(795, 392, 835, 392, { color: C.green })}
${arrow(1055, 392, 1095, 392, { color: C.red })}
${arrow(1315, 392, 1355, 392, { color: C.purple })}
${arrow(1450, 465, 165, 610, { color: C.ink, dash: "12 9" })}
${box(245, 580, 1110, 120, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 45 })}
${text(800, 626, "版本或边界变化：AgentCard · Prompt · Model · Tool · Policy · Schema", 24, { anchor: "middle", weight: 700 })}
${text(800, 666, "消费者合同测试 → 场景回归 → 故障演练 → 新 Acceptance Report", 22, { anchor: "middle", color: C.muted })}
${text(800, 770, "不要先增加 Agent 数量；先让一条链路可运行、可恢复、可解释、可验收。", 29, { anchor: "middle", color: C.red, weight: 700 })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

console.log(`Generated ${Object.keys(files).length} SVG files in ${outDir}`);
