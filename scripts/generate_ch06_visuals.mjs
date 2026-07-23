#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-06");
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
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineGap}">${esc(line)}</tspan>`)
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
  return `${main}<rect x="${x + 2}" y="${y - 1}" width="${w - 1}" height="${h + 1}" rx="${radius + 1}" fill="none" stroke="${stroke}" stroke-width="1.2" opacity=".32" transform="rotate(.18 ${x + w / 2} ${y + h / 2})"/>`;
}

function arrow(x1, y1, x2, y2, opts = {}) {
  const { color = C.ink, width = 4, dash = "", marker = true } = opts;
  return `<path d="M ${x1} ${y1} C ${(x1 * 2 + x2) / 3} ${y1 - 2}, ${(x1 + x2 * 2) / 3} ${y2 + 2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${marker ? ` marker-end="url(#arrow-${color.slice(1)})"` : ""}/>`;
}

function pill(x, y, w, label, color, fill, size = 24) {
  return `${box(x, y, w, 52, { fill, stroke: color, width: 2.4, radius: 26 })}${text(x + w / 2, y + 34, label, size, { color, weight: 700, anchor: "middle" })}`;
}

function titleBlock(title, subtitle) {
  return `${text(70, 76, title, 43, { weight: 760 })}<path d="M 70 94 C 265 87, 485 102, 710 93" fill="none" stroke="${C.amber}" stroke-width="7" stroke-linecap="round" opacity=".85"/>${text(72, 128, subtitle, 23, { color: C.muted })}`;
}

function arrowDefs() {
  return [C.ink, C.amber, C.green, C.red, C.purple, C.muted]
    .map((color) => `<marker id="arrow-${color.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`)
    .join("");
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img">
<defs>${arrowDefs()}</defs>
<rect width="1600" height="900" fill="${C.bg}"/>
<path d="M 20 180 C 420 171, 920 190, 1580 177 M 30 718 C 530 727, 980 707, 1570 721" stroke="#e7dfce" stroke-width="2" fill="none" opacity=".52"/>
${body}
<text x="1525" y="860" font-family="'Kaiti SC','STKaiti',sans-serif" font-size="18" fill="${C.muted}" text-anchor="end">生产级多智能体系统 · 第 06 章</text>
</svg>`;
}

const files = {};

files["agent-security-trust-boundaries.svg"] = svg(`
${titleBlock("多 Agent 安全从信任边界开始", "内部组件也可能处理恶意内容；跨越自然语言、权限和数据边界时必须重新验证。")}
${box(55, 240, 300, 430, { fill: C.redSoft, stroke: C.red })}
${pill(100, 270, 210, "不可信内容域", C.red, C.paper, 27)}
${text(205, 385, ["用户文本", "网页 / 邮件 / 文件", "OCR / Tool Result", "外部 Peer Agent"], 24, { anchor: "middle", lineGap: 1.55 })}
${box(415, 240, 300, 430, { fill: C.blueSoft, stroke: C.ink })}
${pill(460, 270, 210, "受控运行域", C.ink, C.paper, 27)}
${text(565, 385, ["Gateway", "Context Builder", "Supervisor / Agent", "普通 Worker"], 24, { anchor: "middle", lineGap: 1.55 })}
${box(775, 240, 300, 430, { fill: C.amberSoft, stroke: C.amber })}
${pill(820, 270, 210, "特权控制域", C.amber, C.paper, 27)}
${text(925, 385, ["Policy Engine", "Tool Guard", "Approval Service", "Secret Broker"], 24, { anchor: "middle", lineGap: 1.55 })}
${box(1135, 240, 410, 430, { fill: C.greenSoft, stroke: C.green })}
${pill(1235, 270, 210, "受保护资产域", C.green, C.paper, 27)}
${text(1340, 385, ["生产数据", "支付与变更", "客户隐私", "密钥与审计"], 24, { anchor: "middle", lineGap: 1.55 })}
${arrow(355, 455, 415, 455, { color: C.red })}
${arrow(715, 455, 775, 455)}
${arrow(1075, 455, 1135, 455, { color: C.amber })}
${text(385, 425, "内容分类", 18, { anchor: "middle", color: C.red })}
${text(745, 425, "身份 + 策略", 18, { anchor: "middle" })}
${text(1105, 425, "短期凭证", 18, { anchor: "middle", color: C.amber })}
${text(800, 762, "模型可以提出意图；只有确定性边界能够授予权限和执行副作用。", 29, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["defense-in-depth-execution-flow.svg"] = svg(`
${titleBlock("纵深防御：从恶意内容到受控副作用", "不同控制阻断不同失效；注入检测漏报后，授权、执行、DLP 和响应仍应成立。")}
${box(45, 280, 155, 130, { fill: C.redSoft, stroke: C.red })}
${text(122, 330, "输入", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(122, 370, "协议 · 注入", 19, { anchor: "middle" })}
${box(245, 280, 155, 130, { fill: C.blueSoft, stroke: C.ink })}
${text(322, 330, "Context", 29, { anchor: "middle", weight: 720 })}
${text(322, 370, "类型 · 来源", 19, { anchor: "middle" })}
${box(445, 280, 155, 130, { fill: C.purpleSoft, stroke: C.purple })}
${text(522, 330, "Agent", 29, { anchor: "middle", weight: 720, color: C.purple })}
${text(522, 370, "目标 · 预算", 19, { anchor: "middle" })}
${box(645, 280, 175, 130, { fill: C.amberSoft, stroke: C.amber })}
${text(732, 330, "Tool Guard", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(732, 370, "交集授权", 19, { anchor: "middle" })}
${box(865, 280, 175, 130, { fill: C.greenSoft, stroke: C.green })}
${text(952, 330, "Executor", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(952, 370, "隔离 · 凭证", 19, { anchor: "middle" })}
${box(1085, 280, 175, 130, { fill: C.blueSoft, stroke: C.ink })}
${text(1172, 330, "Output Gate", 29, { anchor: "middle", weight: 720 })}
${text(1172, 370, "ACL · DLP", 19, { anchor: "middle" })}
${box(1305, 280, 250, 130, { fill: C.paper, stroke: C.red })}
${text(1430, 330, "用户 / 下游", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(1430, 370, "渠道安全渲染", 19, { anchor: "middle" })}
${arrow(200, 345, 245, 345, { color: C.red })}
${arrow(400, 345, 445, 345)}
${arrow(600, 345, 645, 345, { color: C.purple })}
${arrow(820, 345, 865, 345, { color: C.amber })}
${arrow(1040, 345, 1085, 345, { color: C.green })}
${arrow(1260, 345, 1305, 345)}
${box(175, 535, 1250, 125, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 40 })}
${pill(220, 575, 210, "Audit · 决策证据", C.ink, C.blueSoft, 21)}
${pill(500, 575, 210, "Monitor · 漂移", C.purple, C.purpleSoft, 21)}
${pill(780, 575, 210, "Kill Switch", C.red, C.redSoft, 21)}
${pill(1060, 575, 310, "Red Team · 持续回归", C.green, C.greenSoft, 21)}
${text(800, 755, "安全不是十个分类器串联，而是协议、身份、策略、执行、数据和运营边界共同失效隔离。", 27, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["tool-guard-authority-intersection.svg"] = svg(`
${titleBlock("Tool Guard：授权是交集，不是角色查表", "用户、Agent、委托、任务、工具、资源、环境和审批必须同时允许。")}
${box(60, 210, 480, 520, { fill: C.paper, stroke: C.ink })}
${text(300, 265, "有效权限输入", 31, { anchor: "middle", weight: 760 })}
${pill(105, 310, 170, "User", C.ink, C.blueSoft, 22)}
${pill(325, 310, 170, "Workload", C.purple, C.purpleSoft, 22)}
${pill(105, 390, 170, "Delegation", C.amber, C.amberSoft, 22)}
${pill(325, 390, 170, "Task Scope", C.green, C.greenSoft, 22)}
${pill(105, 470, 170, "Tool Policy", C.red, C.redSoft, 22)}
${pill(325, 470, 170, "Resource ACL", C.ink, C.blueSoft, 22)}
${pill(105, 550, 170, "Runtime", C.purple, C.purpleSoft, 22)}
${pill(325, 550, 170, "Approval", C.amber, C.amberSoft, 22)}
${text(300, 660, "任一条件为空 → DENY", 25, { anchor: "middle", color: C.red, weight: 700 })}
${arrow(540, 470, 690, 470)}
${box(690, 305, 250, 330, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(815, 365, "Policy Decision", 31, { anchor: "middle", weight: 760, color: C.amber })}
${text(815, 435, ["Schema", "Risk / Budget", "Kill State", "Reason Codes"], 23, { anchor: "middle", lineGap: 1.55 })}
${pill(730, 555, 170, "ALLOW / DENY", C.red, C.paper, 21)}
${arrow(940, 470, 1080, 470, { color: C.amber })}
${box(1080, 250, 460, 440, { fill: C.greenSoft, stroke: C.green })}
${text(1310, 315, "受控执行", 31, { anchor: "middle", weight: 760, color: C.green })}
${text(1160, 385, ["短期受众绑定凭证", "Idempotency Key", "Expected Version", "专用 Executor / Sandbox", "结果最小化", "追加式 Audit"], 23, { lineGap: 1.55 })}
${text(800, 790, "Tool Description 帮模型选择；可信 Registry、Policy 和 Executor 决定能否执行。", 28, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["privacy-purpose-lifecycle.svg"] = svg(`
${titleBlock("隐私安全是一条用途绑定的数据生命周期", "输出打码只是最后一步；数据在进入 Context、Memory、索引和审计前就应被最小化。")}
${box(45, 315, 190, 135, { fill: C.redSoft, stroke: C.red })}
${text(140, 367, "发现 / 摄取", 28, { anchor: "middle", weight: 720, color: C.red })}
${text(140, 408, "来源 · 分类", 19, { anchor: "middle" })}
${box(280, 315, 190, 135, { fill: C.amberSoft, stroke: C.amber })}
${text(375, 367, "用途门禁", 28, { anchor: "middle", weight: 720, color: C.amber })}
${text(375, 408, "需要原值吗？", 19, { anchor: "middle" })}
${box(515, 315, 210, 135, { fill: C.purpleSoft, stroke: C.purple })}
${text(620, 367, "隐私转换", 28, { anchor: "middle", weight: 720, color: C.purple })}
${text(620, 408, "Mask · Tokenize", 19, { anchor: "middle" })}
${box(770, 315, 210, 135, { fill: C.blueSoft, stroke: C.ink })}
${text(875, 367, "受控使用", 28, { anchor: "middle", weight: 720 })}
${text(875, 408, "Context · Tool", 19, { anchor: "middle" })}
${box(1025, 315, 210, 135, { fill: C.greenSoft, stroke: C.green })}
${text(1130, 367, "保留 / 访问", 28, { anchor: "middle", weight: 720, color: C.green })}
${text(1130, 408, "TTL · Role · Channel", 18, { anchor: "middle" })}
${box(1280, 315, 275, 135, { fill: C.paper, stroke: C.red })}
${text(1417, 367, "删除传播", 28, { anchor: "middle", weight: 720, color: C.red })}
${text(1417, 408, "Memory · Index · Export", 18, { anchor: "middle" })}
${arrow(235, 382, 280, 382, { color: C.red })}
${arrow(470, 382, 515, 382, { color: C.amber })}
${arrow(725, 382, 770, 382, { color: C.purple })}
${arrow(980, 382, 1025, 382)}
${arrow(1235, 382, 1280, 382, { color: C.green })}
${box(265, 545, 1070, 120, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 40 })}
${text(800, 595, "Provenance + Consent / Policy + Detector Version + Retention + Deletion Evidence", 23, { anchor: "middle", weight: 700 })}
${text(800, 635, "原始会话删除后，摘要、长期 Memory、向量索引、Artifact、评测集和备份到期都要处理。", 21, { anchor: "middle", color: C.muted })}
${text(800, 760, "Encryption 保护传输和存储；它不减少解密后进入模型的敏感内容。", 28, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["secure-mcp-a2a-delegation.svg"] = svg(`
${titleBlock("MCP 与 A2A：身份成立后，业务权限仍要重新计算", "Token 绑定受众，委托逐跳收缩；传输身份和能力描述都不能替代资源授权。")}
${box(55, 255, 310, 380, { fill: C.blueSoft, stroke: C.ink })}
${text(210, 315, "Supervisor / Client", 30, { anchor: "middle", weight: 760 })}
${text(210, 385, ["用户委托", "Task Scope", "Deadline", "Risk Ceiling"], 23, { anchor: "middle", lineGap: 1.55 })}
${pill(105, 545, 210, "Token aud = MCP", C.ink, C.paper, 20)}
${box(465, 255, 310, 380, { fill: C.amberSoft, stroke: C.amber })}
${text(620, 315, "MCP Server", 30, { anchor: "middle", weight: 760, color: C.amber })}
${text(620, 385, ["验证 Audience", "Scope / Tool Policy", "不透传 Client Token", "独立上游凭证"], 23, { anchor: "middle", lineGap: 1.55 })}
${pill(515, 545, 210, "Tool Guard", C.red, C.paper, 21)}
${box(875, 255, 310, 380, { fill: C.purpleSoft, stroke: C.purple })}
${text(1030, 315, "A2A Peer", 30, { anchor: "middle", weight: 760, color: C.purple })}
${text(1030, 385, ["认证每个请求", "Task / Artifact ACL", "Expiry + Nonce", "Receiver Policy"], 23, { anchor: "middle", lineGap: 1.55 })}
${pill(925, 545, 210, "Scope 只收缩", C.purple, C.paper, 21)}
${box(1285, 255, 270, 380, { fill: C.greenSoft, stroke: C.green })}
${text(1420, 315, "资源 / API", 30, { anchor: "middle", weight: 760, color: C.green })}
${text(1420, 385, ["独立身份", "资源级授权", "字段最小化", "完整 Audit"], 23, { anchor: "middle", lineGap: 1.55 })}
${arrow(365, 445, 465, 445)}
${arrow(775, 445, 875, 445, { color: C.amber })}
${arrow(1185, 445, 1285, 445, { color: C.purple })}
${text(800, 720, "AgentCard / Tool Description 描述能力，不授予权限；接收方必须验证每个操作。", 27, { anchor: "middle", weight: 700 })}
${text(800, 772, "禁止：权限相加 · Token Passthrough · 内部 Peer 默认可信", 29, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["red-team-evidence-loop.svg"] = svg(`
${titleBlock("红队验证是一条持续安全证据闭环", "从资产与不变量出发，执行可重复攻击，观察副作用、告警和恢复，再进入发布回归。")}
${box(55, 310, 210, 140, { fill: C.blueSoft, stroke: C.ink })}
${text(160, 360, "Threat Record", 28, { anchor: "middle", weight: 720 })}
${text(160, 405, "资产 · 边界 · 不变量", 18, { anchor: "middle" })}
${box(315, 310, 210, 140, { fill: C.redSoft, stroke: C.red })}
${text(420, 360, "Attack Case", 28, { anchor: "middle", weight: 720, color: C.red })}
${text(420, 405, "入口 · Payload · 禁用目标", 18, { anchor: "middle" })}
${box(575, 310, 210, 140, { fill: C.amberSoft, stroke: C.amber })}
${text(680, 360, "Controlled Run", 28, { anchor: "middle", weight: 720, color: C.amber })}
${text(680, 405, "隔离身份 · 多次重复", 18, { anchor: "middle" })}
${box(835, 310, 210, 140, { fill: C.purpleSoft, stroke: C.purple })}
${text(940, 360, "Observe", 28, { anchor: "middle", weight: 720, color: C.purple })}
${text(940, 405, "副作用 · Audit · Alert", 18, { anchor: "middle" })}
${box(1095, 310, 210, 140, { fill: C.greenSoft, stroke: C.green })}
${text(1200, 360, "Evaluate", 28, { anchor: "middle", weight: 720, color: C.green })}
${text(1200, 405, "ASR · STC · False Block", 18, { anchor: "middle" })}
${box(1355, 310, 190, 140, { fill: C.paper, stroke: C.ink })}
${text(1450, 360, "Accept", 28, { anchor: "middle", weight: 720 })}
${text(1450, 405, "版本 · 范围 · 风险", 18, { anchor: "middle" })}
${arrow(265, 380, 315, 380)}
${arrow(525, 380, 575, 380, { color: C.red })}
${arrow(785, 380, 835, 380, { color: C.amber })}
${arrow(1045, 380, 1095, 380, { color: C.purple })}
${arrow(1305, 380, 1355, 380, { color: C.green })}
${arrow(1450, 450, 160, 610, { color: C.ink, dash: "12 9" })}
${box(280, 570, 1040, 105, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 40 })}
${text(800, 615, "Control / Policy / Dataset / Model / Tool Registry 版本变化", 24, { anchor: "middle", weight: 700 })}
${text(800, 650, "修复发现 → 加入回归集 → 重新执行 → 保存证据", 22, { anchor: "middle", color: C.muted })}
${text(800, 760, "测试集 ASR = 0 只证明当前版本和当前样本；未知攻击风险仍然存在。", 28, { anchor: "middle", color: C.red, weight: 700 })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

console.log(`Generated ${Object.keys(files).length} SVG files in ${outDir}`);
