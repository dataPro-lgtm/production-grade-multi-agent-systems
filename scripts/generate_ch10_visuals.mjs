#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-10");
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

const esc = (v) =>
  String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function text(x, y, value, size = 28, opts = {}) {
  const { color = C.ink, weight = 500, anchor = "start", lineGap = 1.28 } = opts;
  const lines = Array.isArray(value) ? value : [value];
  const tspans = lines
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineGap}">${esc(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" font-family="'Kaiti SC','STKaiti','Noto Sans SC',sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${tspans}</text>`;
}

function box(x, y, w, h, opts = {}) {
  const { fill = C.paper, stroke = C.ink, width = 3, radius = 22, dash = "" } = opts;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/><rect x="${x + 2}" y="${y - 1}" width="${w - 1}" height="${h + 1}" rx="${radius + 1}" fill="none" stroke="${stroke}" stroke-width="1.2" opacity=".28" transform="rotate(.18 ${x + w / 2} ${y + h / 2})"/>`;
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
  return `${box(x, y, w, 56, { fill, stroke: color, width: 2.5, radius: 26 })}${text(x + w / 2, y + 37, label, size, { color, weight: 760, anchor: "middle" })}`;
}

function circle(x, y, r, opts = {}) {
  const { fill = C.paper, stroke = C.ink, width = 3 } = opts;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/><circle cx="${x + 1}" cy="${y}" r="${r - 2}" fill="none" stroke="${stroke}" stroke-width="1" opacity=".25"/>`;
}

function svg(body) {
  const markers = [C.ink, C.amber, C.green, C.red, C.purple]
    .map((color) => `<marker id="arrow-${color.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs>${markers}<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="10" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .035"/></feComponentTransfer></filter></defs><rect width="1600" height="900" fill="${C.bg}"/><rect width="1600" height="900" fill="#38516d" filter="url(#paper)" opacity=".16"/>${body}</svg>`;
}

function titleBlock(title, subtitle) {
  return `${text(70, 82, title, 43, { weight: 800 })}${text(72, 128, subtitle, 22, { color: C.muted })}${line(70, 160, 1530, 160, { color: C.amber, width: 3, dash: "10 10" })}`;
}

const files = {};

files["capstone-lifecycle-closure.svg"] = svg(`
${titleBlock("Capstone：闭合系统完整生命周期", "交付不是最后补一份 README，而是从问题开始持续生成可验证证据。")}
${[
  ["Discover", "问题 / 基线", C.ink, C.blueSoft],
  ["Design", "ADR / 风险", C.purple, C.purpleSoft],
  ["Build", "Slice / 合同", C.green, C.greenSoft],
  ["Secure", "控制 / 红队", C.red, C.redSoft],
  ["Evaluate", "Golden / N-run", C.amber, C.amberSoft],
  ["Deploy", "RC / Provenance", C.ink, C.blueSoft],
  ["Operate", "SLO / Learning", C.green, C.greenSoft],
].map((item, i) => {
  const x = 50 + i * 220;
  return `${box(x, 275, 180, 135, { fill: item[3], stroke: item[2], width: 3 })}${text(x + 90, 326, item[0], 25, { anchor: "middle", weight: 800, color: item[2] })}${text(x + 90, 370, item[1], 18, { anchor: "middle", color: C.muted })}${i < 6 ? arrow(x + 180, 342, x + 215, 342, { color: item[2] }) : ""}`;
}).join("")}
${line(140, 410, 140, 585, { color: C.ink, dash: "9 7" })}
${line(360, 410, 360, 585, { color: C.purple, dash: "9 7" })}
${line(580, 410, 580, 585, { color: C.green, dash: "9 7" })}
${line(800, 410, 800, 585, { color: C.red, dash: "9 7" })}
${line(1020, 410, 1020, 585, { color: C.amber, dash: "9 7" })}
${line(1240, 410, 1240, 585, { color: C.ink, dash: "9 7" })}
${line(1460, 410, 1460, 585, { color: C.green, dash: "9 7" })}
${box(210, 585, 1180, 135, { fill: C.paper, stroke: C.red, width: 4, radius: 38 })}
${text(800, 638, "Evidence Package", 32, { anchor: "middle", weight: 800, color: C.red })}
${text(800, 685, "Requirement · Decision · Contract · Test · Runtime Evidence · Sign-off", 23, { anchor: "middle" })}
${text(800, 810, "每个“已完成”都必须绑定同一 Release Candidate；证据漂移会让闭环失效。", 28, { anchor: "middle", weight: 760, color: C.red })}
`);

files["acceptance-evidence-chain.svg"] = svg(`
${titleBlock("验收证据链：从 Requirement 到 Sign-off", "一个节点缺失，系统声明就只能降级为假设。")}
${[
  ["Requirement", "要证明什么", C.ink, C.blueSoft],
  ["ADR", "为什么这样设计", C.purple, C.purpleSoft],
  ["Contract", "边界必须成立", C.green, C.greenSoft],
  ["Implementation", "哪个版本实现", C.ink, C.paper],
  ["Test / Eval", "怎样验证", C.amber, C.amberSoft],
  ["Runtime", "生产证据", C.red, C.redSoft],
  ["Sign-off", "谁承担判断", C.green, C.greenSoft],
].map((item, i) => {
  const x = 40 + i * 220;
  return `${box(x, 300, 180, 155, { fill: item[3], stroke: item[2], width: 3 })}${text(x + 90, 353, item[0], 24, { anchor: "middle", weight: 800, color: item[2] })}${text(x + 90, 402, item[1], 18, { anchor: "middle", color: C.muted })}${i < 6 ? arrow(x + 180, 377, x + 215, 377, { color: item[2] }) : ""}`;
}).join("")}
${box(100, 560, 1400, 145, { fill: C.paper, stroke: C.amber, dash: "12 9", radius: 34 })}
${text(150, 612, "变更影响", 27, { weight: 800, color: C.amber })}
${text(360, 612, "需求变化 → 合同 / 测试 / 指标", 22, { weight: 700 })}
${text(800, 612, "合同 Major → Consumer 复核", 22, { weight: 700 })}
${text(1170, 612, "线上异常 → 用户承诺", 22, { weight: 700 })}
${text(800, 666, "Traceability Matrix 不是文档目录，而是可查询的双向关系。", 24, { anchor: "middle", color: C.muted })}
${text(800, 810, "当前 RC 的 Claim，只能由当前 RC 的测试、Trace、Artifact 和签署支持。", 28, { anchor: "middle", weight: 760, color: C.red })}
`);

files["vertical-slice-through-boundaries.svg"] = svg(`
${titleBlock("Vertical Slice：一条真实链路穿过所有关键边界", "先证明最小系统的正确性、安全、恢复和观测，再增加更多能力。")}
${[
  ["User Goal", "identity", C.ink, C.blueSoft],
  ["Gateway", "auth · tenant", C.red, C.redSoft],
  ["Supervisor", "plan · validate", C.purple, C.purpleSoft],
  ["Case Team", "delegate · scope", C.green, C.greenSoft],
  ["MCP Tool", "schema · policy", C.amber, C.amberSoft],
  ["Evidence", "source · hash", C.ink, C.paper],
  ["Answer", "claim · outcome", C.green, C.greenSoft],
].map((item, i) => {
  const x = 45 + i * 220;
  return `${box(x, 300, 175, 145, { fill: item[3], stroke: item[2], width: 3 })}${text(x + 87, 350, item[0], 24, { anchor: "middle", weight: 800, color: item[2] })}${text(x + 87, 398, item[1], 18, { anchor: "middle", color: C.muted })}${i < 6 ? arrow(x + 175, 372, x + 215, 372, { color: item[2] }) : ""}`;
}).join("")}
${box(110, 565, 1380, 150, { fill: C.paper, stroke: C.ink, width: 3, radius: 34 })}
${pill(150, 610, 220, "State / Event", C.ink, C.blueSoft, 21)}
${pill(415, 610, 220, "Trace / Graph", C.purple, C.purpleSoft, 21)}
${pill(680, 610, 220, "Golden / Failure", C.amber, C.amberSoft, 21)}
${pill(945, 610, 220, "Retry / Recover", C.red, C.redSoft, 21)}
${pill(1210, 610, 220, "Quickstart", C.green, C.greenSoft, 21)}
${text(800, 802, "Slice 0 未通过前，不增加 Memory、GraphRAG、自动动作或更多 Agent。", 29, { anchor: "middle", weight: 760, color: C.red })}
`);

files["sequential-release-gates.svg"] = svg(`
${titleBlock("Release Gates：顺序削减风险，而不是累计分数", "性能、文档和功能不能抵扣跨租户泄露、未知副作用或不可恢复状态。")}
${[
  ["G0", "Problem", "Charter", C.ink, C.blueSoft],
  ["G1", "Design", "ADR / Threat", C.purple, C.purpleSoft],
  ["G2", "Slice", "E2E / Trace", C.green, C.greenSoft],
  ["G3", "Quality", "Golden / N-run", C.amber, C.amberSoft],
  ["G4", "Security", "Red Team / SBOM", C.red, C.redSoft],
  ["G5", "Operations", "SLO / ORR", C.ink, C.blueSoft],
].map((item, i) => {
  const x = 85 + i * 250;
  return `${box(x, 275, 205, 190, { fill: item[4], stroke: item[3], width: 4 })}${text(x + 102, 322, item[0], 27, { anchor: "middle", weight: 800, color: item[3] })}${text(x + 102, 366, item[1], 29, { anchor: "middle", weight: 800, color: item[3] })}${text(x + 102, 418, item[2], 19, { anchor: "middle", color: C.muted })}${i < 5 ? arrow(x + 205, 370, x + 245, 370, { color: item[3] }) : ""}`;
}).join("")}
${box(235, 580, 1130, 125, { fill: C.paper, stroke: C.red, dash: "12 9", radius: 34 })}
${text(800, 628, "Pass · Conditional Pass · Fail", 30, { anchor: "middle", weight: 800, color: C.red })}
${text(800, 670, "条件必须有 Scope、Owner、Due Date 和 Verifier", 22, { anchor: "middle" })}
${text(800, 810, "后一个 Gate 不能为前一个 Gate 补证；关键变更必须生成新的 RC。", 29, { anchor: "middle", weight: 760, color: C.red })}
`);

files["open-source-delivery-products.svg"] = svg(`
${titleBlock("开源交付：四个相互咬合的产品", "Repository 设为 Public 只改变可见性，不自动产生理解、信任或维护能力。")}
${box(135, 245, 480, 200, { fill: C.blueSoft, stroke: C.ink, width: 4 })}
${text(375, 305, "Knowledge", 31, { anchor: "middle", weight: 800 })}
${text(375, 355, "概念 · 决策 · Trade-off", 22, { anchor: "middle" })}
${text(375, 400, "为什么这样设计？", 20, { anchor: "middle", color: C.muted })}
${box(985, 245, 480, 200, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(1225, 305, "Code", 31, { anchor: "middle", weight: 800, color: C.green })}
${text(1225, 355, "Runnable · Tests · Fixtures", 22, { anchor: "middle" })}
${text(1225, 400, "怎样运行和修改？", 20, { anchor: "middle", color: C.muted })}
${box(135, 590, 480, 200, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(375, 650, "Evidence", 31, { anchor: "middle", weight: 800, color: C.amber })}
${text(375, 700, "Trace · Eval · Provenance", 22, { anchor: "middle" })}
${text(375, 745, "为什么相信声明？", 20, { anchor: "middle", color: C.muted })}
${box(985, 590, 480, 200, { fill: C.redSoft, stroke: C.red, width: 4 })}
${text(1225, 650, "Governance", 31, { anchor: "middle", weight: 800, color: C.red })}
${text(1225, 700, "License · Security · Support", 22, { anchor: "middle" })}
${text(1225, 745, "怎样贡献和接管？", 20, { anchor: "middle", color: C.muted })}
${arrow(615, 345, 700, 420)}
${arrow(985, 345, 900, 420, { color: C.green })}
${arrow(615, 690, 700, 615, { color: C.amber })}
${arrow(985, 690, 900, 615, { color: C.red })}
${circle(800, 517, 140, { fill: C.paper, stroke: C.purple, width: 5 })}
${text(800, 506, "Trusted", 31, { anchor: "middle", weight: 800, color: C.purple })}
${text(800, 548, "Delivery", 31, { anchor: "middle", weight: 800, color: C.purple })}
`);

files["capstone-maturity-ladder.svg"] = svg(`
${titleBlock("成熟度由可验证能力决定，不由 Agent 数量决定", "每一级都增加合同、控制、测量或运营能力。")}
${box(80, 620, 275, 150, { fill: C.paper, stroke: C.muted, width: 3 })}
${text(217, 668, "L0 · Demo", 28, { anchor: "middle", weight: 800, color: C.muted })}
${text(217, 718, "Happy Path", 22, { anchor: "middle" })}
${box(355, 530, 275, 240, { fill: C.blueSoft, stroke: C.ink, width: 3 })}
${text(492, 580, "L1 · Reliable", 28, { anchor: "middle", weight: 800 })}
${text(492, 632, ["Contract", "State", "Failure Semantics"], 20, { anchor: "middle", lineGap: 1.45 })}
${box(630, 430, 275, 340, { fill: C.redSoft, stroke: C.red, width: 3 })}
${text(767, 482, "L2 · Controlled", 28, { anchor: "middle", weight: 800, color: C.red })}
${text(767, 538, ["Policy / HITL", "Idempotency", "Recovery", "Security Gate"], 20, { anchor: "middle", lineGap: 1.45 })}
${box(905, 330, 275, 440, { fill: C.amberSoft, stroke: C.amber, width: 3 })}
${text(1042, 384, "L3 · Measured", 28, { anchor: "middle", weight: 800, color: C.amber })}
${text(1042, 442, ["Golden / N-run", "SLO", "Cost", "Evidence Package", "Release Gate"], 20, { anchor: "middle", lineGap: 1.45 })}
${box(1180, 220, 340, 550, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(1350, 280, "L4 · Operated", 30, { anchor: "middle", weight: 800, color: C.green })}
${text(1350, 345, ["GameDay", "Incident Learning", "Provenance", "Maintenance", "Community", "Independent Review"], 21, { anchor: "middle", lineGap: 1.5 })}
${text(800, 840, "更多 Agent 不是升级条件；可接管、可恢复、可验证才是。", 29, { anchor: "middle", weight: 760, color: C.red })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

const manifest = `version: 1
chapter: 10
style: architect-whiteboard
source: scripts/generate_ch10_visuals.mjs
assets:
${Object.keys(files).map((name) => {
  const stem = name.replace(/\.svg$/, "");
  return `  - id: ${stem}
    svg: ${name}
    png: ${stem}.png
    width: 1600
    height: 900`;
}).join("\n")}
`;

fs.writeFileSync(path.join(outDir, "visual-manifest.yml"), manifest);
console.log(`Wrote ${Object.keys(files).length} SVG files and visual-manifest.yml to ${outDir}`);
