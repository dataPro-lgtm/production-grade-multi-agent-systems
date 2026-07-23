#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-04");
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
    family = "'Kaiti SC','STKaiti','Noto Sans SC',sans-serif",
    rotate = 0,
    opacity = 1,
    lineGap = 1.28,
  } = opts;
  const lines = Array.isArray(value) ? value : [value];
  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : size * lineGap}">${esc(line)}</tspan>`)
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
<text x="1525" y="860" font-family="'Kaiti SC','STKaiti',sans-serif" font-size="18" fill="${C.muted}" text-anchor="end">生产级多智能体系统 · 第 04 章</text>
</svg>`;
}

const files = {};

files["context-engineering-pipeline.svg"] = svg(`
${titleBlock("Context Engineering 是运行时数据生产线", "目标不是塞入更多文字，而是交付最小、可信、及时、授权且可追溯的上下文。")}
${box(60, 330, 180, 135, { fill: C.amberSoft, stroke: C.amber })}
${text(150, 380, "来源", 31, { anchor: "middle", weight: 720, color: C.amber })}
${text(150, 420, "Source Registry", 20, { anchor: "middle", color: C.muted })}
${box(285, 330, 180, 135, { fill: C.blueSoft, stroke: C.ink })}
${text(375, 380, "检索", 31, { anchor: "middle", weight: 720 })}
${text(375, 420, "FTS · Vector · Graph", 19, { anchor: "middle", color: C.muted })}
${box(510, 330, 190, 135, { fill: C.redSoft, stroke: C.red })}
${text(605, 380, "门禁", 31, { anchor: "middle", weight: 720, color: C.red })}
${text(605, 420, "ACL · 时态 · 删除", 20, { anchor: "middle", color: C.muted })}
${box(745, 330, 195, 135, { fill: C.greenSoft, stroke: C.green })}
${text(842, 380, "Evidence", 31, { anchor: "middle", weight: 720, color: C.green })}
${text(842, 420, "来源 · Locator · Hash", 19, { anchor: "middle", color: C.muted })}
${box(985, 330, 190, 135, { fill: C.purpleSoft, stroke: C.purple })}
${text(1080, 380, "预算选择", 31, { anchor: "middle", weight: 720, color: C.purple })}
${text(1080, 420, "去重 · 排序 · 压缩", 19, { anchor: "middle", color: C.muted })}
${box(1220, 330, 200, 135, { fill: C.greenSoft, stroke: C.green })}
${text(1320, 380, "Context Pack", 30, { anchor: "middle", weight: 720, color: C.green })}
${text(1320, 420, "Manifest + Pack Hash", 19, { anchor: "middle", color: C.muted })}
${box(1460, 330, 100, 135, { fill: C.redSoft, stroke: C.red })}
${text(1510, 380, "模型", 28, { anchor: "middle", weight: 720, color: C.red })}
${text(1510, 420, "推理", 20, { anchor: "middle" })}
${arrow(240, 397, 285, 397, { color: C.amber })}
${arrow(465, 397, 510, 397)}
${arrow(700, 397, 745, 397, { color: C.red })}
${arrow(940, 397, 985, 397, { color: C.green })}
${arrow(1175, 397, 1220, 397, { color: C.purple })}
${arrow(1420, 397, 1460, 397, { color: C.green })}
${box(250, 585, 1100, 95, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 38 })}
${text(800, 625, "Context Trace", 28, { anchor: "middle", weight: 720 })}
${text(800, 660, "记录候选、拒绝原因、转换、Omissions、Pack Hash 与评测结果", 21, { anchor: "middle", color: C.muted })}
${arrow(1320, 465, 1320, 585, { color: C.ink, dash: "9 7" })}
${text(800, 785, "模型只是消费者；选择、授权、时态、证据和预算由运行时负责。", 27, { anchor: "middle", weight: 700, color: C.red })}
`);

files["context-inventory-planes.svg"] = svg(`
${titleBlock("七类上下文，三个工程平面", "分类不是为了贴标签，而是为了明确来源、Owner、生命周期和进入模型的规则。")}
${box(60, 210, 465, 500, { fill: C.amberSoft, stroke: C.amber })}
${pill(165, 235, 255, "目标平面", C.amber, C.paper, 29)}
${box(105, 330, 375, 105, { fill: C.paper, stroke: C.amber })}
${text(292, 375, "Task & Goal", 29, { anchor: "middle", weight: 700, color: C.amber })}
${text(292, 407, "目标 · 验收 · 计划 · 未决问题", 20, { anchor: "middle" })}
${box(105, 480, 375, 105, { fill: C.paper, stroke: C.red })}
${text(292, 525, "Policy & Normative", 28, { anchor: "middle", weight: 700, color: C.red })}
${text(292, 557, "权限 · 合规 · 业务口径 · 审批", 20, { anchor: "middle" })}
${box(565, 210, 480, 500, { fill: C.blueSoft, stroke: C.ink })}
${pill(675, 235, 260, "执行平面", C.ink, C.paper, 29)}
${box(610, 320, 390, 90, { fill: C.paper, stroke: C.ink })}
${text(805, 366, "Environmental", 27, { anchor: "middle", weight: 700 })}
${text(805, 394, "租户 · 环境 · Runtime 依赖", 19, { anchor: "middle", color: C.muted })}
${box(610, 445, 390, 90, { fill: C.greenSoft, stroke: C.green })}
${text(805, 490, "Agent State", 27, { anchor: "middle", weight: 700, color: C.green })}
${text(805, 518, "步骤 · 工具结果 · 错误 · 预算", 19, { anchor: "middle" })}
${box(610, 570, 390, 90, { fill: C.purpleSoft, stroke: C.purple })}
${text(805, 615, "Orchestration", 27, { anchor: "middle", weight: 700, color: C.purple })}
${text(805, 643, "Task Graph · Owner · Artifact", 19, { anchor: "middle" })}
${box(1085, 210, 455, 500, { fill: C.greenSoft, stroke: C.green })}
${pill(1185, 235, 255, "时间平面", C.green, C.paper, 29)}
${box(1130, 355, 365, 105, { fill: C.paper, stroke: C.green })}
${text(1312, 400, "Historical / Memory", 27, { anchor: "middle", weight: 700, color: C.green })}
${text(1312, 432, "消息 · 摘要 · 偏好 · 经验", 20, { anchor: "middle" })}
${box(1130, 510, 365, 105, { fill: C.paper, stroke: C.red })}
${text(1312, 555, "Temporal", 28, { anchor: "middle", weight: 700, color: C.red })}
${text(1312, 587, "event · valid · observed · as_of", 20, { anchor: "middle" })}
${text(800, 790, "秘密与连接属于 Tool Runtime；模型通常只需要抽象后的权限与环境结论。", 27, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["context-pack-contract.svg"] = svg(`
${titleBlock("Context Pack：一次模型调用的输入合同", "每个槽位都有来源、版本、预算和遗漏规则；Pack 可以保存、重放与评测。")}
${box(65, 205, 1040, 530, { fill: C.paper, stroke: C.ink, width: 4 })}
${text(105, 260, "Context Pack", 34, { weight: 760 })}
${pill(820, 225, 230, "pack_hash = sha256…", C.ink, C.blueSoft, 20)}
${box(105, 315, 210, 150, { fill: C.amberSoft, stroke: C.amber })}
${text(210, 362, "Instructions", 27, { anchor: "middle", weight: 700, color: C.amber })}
${text(210, 400, ["适用规则", "输出合同"], 20, { anchor: "middle" })}
${box(345, 315, 210, 150, { fill: C.blueSoft, stroke: C.ink })}
${text(450, 362, "Goal + State", 27, { anchor: "middle", weight: 700 })}
${text(450, 400, ["验收 · as_of", "步骤 · 未决问题"], 20, { anchor: "middle" })}
${box(585, 315, 210, 150, { fill: C.greenSoft, stroke: C.green })}
${text(690, 362, "Evidence", 27, { anchor: "middle", weight: 700, color: C.green })}
${text(690, 400, ["Claim · 来源", "时间 · Locator"], 20, { anchor: "middle" })}
${box(825, 315, 210, 150, { fill: C.purpleSoft, stroke: C.purple })}
${text(930, 362, "Capabilities", 27, { anchor: "middle", weight: 700, color: C.purple })}
${text(930, 400, ["工具 · Schema", "权限 · 风险"], 20, { anchor: "middle" })}
${box(105, 515, 450, 150, { fill: C.redSoft, stroke: C.red })}
${text(330, 562, "Omissions", 27, { anchor: "middle", weight: 700, color: C.red })}
${text(330, 600, ["未选内容 + 明确原因", "越权 · 过期 · 被替代 · 超预算"], 20, { anchor: "middle" })}
${box(585, 515, 450, 150, { fill: C.paper, stroke: C.green })}
${text(810, 562, "Token Allocation", 27, { anchor: "middle", weight: 700, color: C.green })}
${text(810, 600, ["指令 · 任务 · 证据 · 工具", "始终预留回答与修复空间"], 20, { anchor: "middle" })}
${box(1160, 210, 380, 525, { fill: C.paper, stroke: C.red })}
${text(1350, 270, "六条不变量", 31, { anchor: "middle", weight: 760, color: C.red })}
${text(1200, 340, ["① 相关：服务当前任务", "② 授权：用户和用途允许", "③ 及时：满足 as_of / freshness", "④ 可追溯：来源 / 版本 / Locator", "⑤ 有预算：按策略选择", "⑥ 可评测：可保存与重放"], 23, { color: C.ink, lineGap: 1.55 })}
${text(800, 805, "Chunk 只有绑定来源、时间、权限、Locator 和 Claim 后，才升级为 Evidence。", 27, { anchor: "middle", weight: 700, color: C.green })}
`);

files["hybrid-agentic-retrieval.svg"] = svg(`
${titleBlock("Hybrid Retrieval 负责分工，Agentic Retrieval 负责补缺口", "先按查询形状选择通道，再用证据充分性决定回答、补检索或部分结束。")}
${box(55, 355, 190, 135, { fill: C.amberSoft, stroke: C.amber })}
${text(150, 405, "Query Plan", 30, { anchor: "middle", weight: 720, color: C.amber })}
${text(150, 443, "实体 · 时间 · 证据要求", 18, { anchor: "middle" })}
${box(330, 190, 210, 95, { fill: C.blueSoft, stroke: C.ink })}
${text(435, 248, "FTS / BM25", 27, { anchor: "middle", weight: 700 })}
${box(330, 315, 210, 95, { fill: C.greenSoft, stroke: C.green })}
${text(435, 373, "Vector", 27, { anchor: "middle", weight: 700, color: C.green })}
${box(330, 440, 210, 95, { fill: C.purpleSoft, stroke: C.purple })}
${text(435, 498, "Graph", 27, { anchor: "middle", weight: 700, color: C.purple })}
${box(330, 565, 210, 95, { fill: C.redSoft, stroke: C.red })}
${text(435, 623, "SQL / API", 27, { anchor: "middle", weight: 700, color: C.red })}
${arrow(245, 390, 330, 237)}
${arrow(245, 410, 330, 362, { color: C.green })}
${arrow(245, 435, 330, 487, { color: C.purple })}
${arrow(245, 455, 330, 612, { color: C.red })}
${box(655, 330, 220, 165, { fill: C.paper, stroke: C.ink, width: 4 })}
${text(765, 382, "Merge + Rerank", 28, { anchor: "middle", weight: 720 })}
${text(765, 425, ["提高 Recall", "再提升前列精度"], 20, { anchor: "middle", color: C.muted })}
${arrow(540, 237, 655, 370)}
${arrow(540, 362, 655, 400, { color: C.green })}
${arrow(540, 487, 655, 430, { color: C.purple })}
${arrow(540, 612, 655, 460, { color: C.red })}
${box(980, 330, 230, 165, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(1095, 382, "Evidence Gate", 28, { anchor: "middle", weight: 720, color: C.green })}
${text(1095, 425, ["ACL · 时态", "来源 · 去重"], 20, { anchor: "middle" })}
${arrow(875, 412, 980, 412)}
${box(1330, 240, 220, 125, { fill: C.greenSoft, stroke: C.green })}
${text(1440, 288, "充分", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(1440, 326, "Build Pack → Answer", 19, { anchor: "middle" })}
${box(1330, 470, 220, 125, { fill: C.amberSoft, stroke: C.amber })}
${text(1440, 518, "有缺口", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(1440, 556, "Refine Query", 19, { anchor: "middle" })}
${arrow(1210, 390, 1330, 310, { color: C.green })}
${arrow(1210, 440, 1330, 520, { color: C.amber })}
${arrow(1440, 595, 220, 685, { color: C.amber, dash: "12 9" })}
${text(800, 755, "终止 = 证据充分 OR 达到轮数 / 截止时间 / 预算 OR 连续无进展", 27, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["graphrag-evidence-path.svg"] = svg(`
${titleBlock("GraphRAG 检索相连事实，而不是相邻文字", "关系的类型、方向、有效时间、来源与权限共同决定路径是否可用。")}
${box(55, 200, 210, 125, { fill: C.greenSoft, stroke: C.green })}
${text(160, 250, "Team", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(160, 288, "owner @ as_of", 19, { anchor: "middle" })}
${box(55, 360, 210, 125, { fill: C.blueSoft, stroke: C.ink })}
${text(160, 410, "Service", 30, { anchor: "middle", weight: 720 })}
${text(160, 448, "payment-api", 20, { anchor: "middle", color: C.muted })}
${box(370, 200, 230, 125, { fill: C.amberSoft, stroke: C.amber })}
${text(485, 250, "Deployment", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(485, 288, "release-2026.07.23.1", 18, { anchor: "middle" })}
${box(370, 520, 230, 125, { fill: C.redSoft, stroke: C.red })}
${text(485, 570, "Incident", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(485, 608, "PAY-4097", 20, { anchor: "middle" })}
${box(730, 360, 230, 125, { fill: C.purpleSoft, stroke: C.purple })}
${text(845, 410, "Runbook", 29, { anchor: "middle", weight: 720, color: C.purple })}
${text(845, 448, "valid version", 20, { anchor: "middle" })}
${box(1090, 360, 220, 125, { fill: C.redSoft, stroke: C.red })}
${text(1200, 410, "Policy", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(1200, 448, "scope + approval", 19, { anchor: "middle" })}
${arrow(160, 325, 160, 360, { color: C.green })}
${text(185, 347, "OWNS", 18, { color: C.green })}
${arrow(265, 390, 370, 270, { color: C.amber })}
${text(315, 305, "DEPLOYED_AS", 18, { anchor: "middle", color: C.amber })}
${arrow(265, 450, 370, 580, { color: C.red })}
${text(315, 550, "AFFECTED_BY", 18, { anchor: "middle", color: C.red })}
${arrow(265, 420, 730, 420, { color: C.purple })}
${text(500, 395, "GOVERNED_BY", 18, { anchor: "middle", color: C.purple })}
${arrow(960, 420, 1090, 420, { color: C.red })}
${text(1025, 395, "APPLIES_TO", 18, { anchor: "middle", color: C.red })}
${box(1370, 245, 170, 355, { fill: C.paper, stroke: C.ink, dash: "10 8" })}
${text(1455, 290, "每条边", 28, { anchor: "middle", weight: 720 })}
${text(1455, 345, ["valid_from/to", "source_version", "ACL label", "extraction method", "confidence", "supersedes"], 20, { anchor: "middle", lineGap: 1.55 })}
${text(800, 755, "“发布后发生”只证明时间相关；根因还需要机制、差异或回滚对照证据。", 27, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["enterprise-knowledge-investigation.svg"] = svg(`
${titleBlock("企业知识调查：确定性治理主干 + 受约束检索推理", "从 Source Manifest 到 Claim-Citation，每一层都有版本、权限、时态和 Trace。")}
${box(45, 245, 225, 360, { fill: C.paper, stroke: C.amber })}
${text(157, 295, "Source Registry", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(157, 355, ["Service Catalog", "Deployment DB", "Incident Store", "Runbook Repo", "Policy Store"], 21, { anchor: "middle", lineGap: 1.5 })}
${box(335, 245, 220, 360, { fill: C.blueSoft, stroke: C.ink })}
${text(445, 295, "Ingestion", 29, { anchor: "middle", weight: 720 })}
${text(445, 355, ["解析 · Chunk", "Evidence Anchor", "实体链接", "版本与删除", "索引发布"], 21, { anchor: "middle", lineGap: 1.5 })}
${box(620, 245, 220, 360, { fill: C.purpleSoft, stroke: C.purple })}
${text(730, 295, "Retrieval", 29, { anchor: "middle", weight: 720, color: C.purple })}
${text(730, 355, ["Query Plan", "FTS · Vector", "Graph · SQL", "Gap Retrieval", "终止条件"], 21, { anchor: "middle", lineGap: 1.5 })}
${box(905, 245, 220, 360, { fill: C.greenSoft, stroke: C.green })}
${text(1015, 295, "Context Builder", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(1015, 355, ["ACL · 时态", "Evidence Gate", "去重 · 压缩", "Budget Select", "Context Pack"], 21, { anchor: "middle", lineGap: 1.5 })}
${box(1190, 245, 365, 360, { fill: C.paper, stroke: C.red })}
${text(1372, 295, "Investigation Answer", 29, { anchor: "middle", weight: 720, color: C.red })}
${box(1235, 345, 275, 120, { fill: C.redSoft, stroke: C.red })}
${text(1372, 390, "Claim", 28, { anchor: "middle", weight: 720, color: C.red })}
${text(1372, 430, "fact · inference · hypothesis", 19, { anchor: "middle" })}
${text(1372, 520, ["Evidence IDs", "Missing Evidence", "Context Pack ID"], 21, { anchor: "middle", lineGap: 1.5 })}
${arrow(270, 425, 335, 425, { color: C.amber })}
${arrow(555, 425, 620, 425)}
${arrow(840, 425, 905, 425, { color: C.purple })}
${arrow(1125, 425, 1190, 425, { color: C.green })}
${box(290, 690, 1020, 80, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 35 })}
${text(800, 738, "Context Trace + Retriever / Pack / Answer Evaluation", 26, { anchor: "middle", weight: 720 })}
${arrow(1015, 605, 1015, 690, { color: C.ink, dash: "9 7" })}
${text(800, 825, "真正的产物不是一段答案，而是一条能够被重放的证据决策链。", 26, { anchor: "middle", color: C.red, weight: 700 })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

console.log(`Generated ${Object.keys(files).length} SVG files in ${outDir}`);
