#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-09");
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
    lineGap = 1.28,
  } = opts;
  const lines = Array.isArray(value) ? value : [value];
  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineGap}">${esc(line)}</tspan>`,
    )
    .join("");
  return `<text x="${x}" y="${y}" font-family="'Kaiti SC','STKaiti','Noto Sans SC',sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${tspans}</text>`;
}

function box(x, y, w, h, opts = {}) {
  const {
    fill = C.paper,
    stroke = C.ink,
    width = 3,
    radius = 22,
    dash = "",
  } = opts;
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
  return `${box(x, y, w, 52, { fill, stroke: color, width: 2.5, radius: 24 })}${text(x + w / 2, y + 34, label, size, { color, weight: 700, anchor: "middle" })}`;
}

function circle(x, y, r, opts = {}) {
  const { fill = C.paper, stroke = C.ink, width = 3 } = opts;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/><circle cx="${x + 1}" cy="${y}" r="${r - 2}" fill="none" stroke="${stroke}" stroke-width="1" opacity=".25"/>`;
}

function svg(body) {
  const markerColors = [C.ink, C.amber, C.green, C.red, C.purple];
  const markers = markerColors
    .map(
      (color) =>
        `<marker id="arrow-${color.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<defs>${markers}<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="7" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .035"/></feComponentTransfer></filter></defs>
<rect width="1600" height="900" fill="${C.bg}"/><rect width="1600" height="900" fill="#38516d" filter="url(#paper)" opacity=".16"/>
${body}
</svg>`;
}

function titleBlock(title, subtitle) {
  return `${text(70, 82, title, 43, { weight: 800 })}${text(72, 128, subtitle, 22, { color: C.muted })}${line(70, 160, 1530, 160, { color: C.amber, width: 3, dash: "10 10" })}`;
}

const files = {};

files["agentops-five-operational-views.svg"] = svg(`
${titleBlock("AgentOps：五个联动运营视图", "APM 仍然重要，但观测对象必须从服务上移到用户 Goal。")}
${box(75, 235, 250, 345, { fill: C.greenSoft, stroke: C.green })}
${text(200, 290, "业务视图", 31, { anchor: "middle", weight: 800, color: C.green })}
${text(200, 350, ["Goal Success", "Evidence", "User Impact", "SLO / Budget"], 22, { anchor: "middle", lineGap: 1.65 })}
${box(375, 235, 250, 345, { fill: C.blueSoft, stroke: C.ink })}
${text(500, 290, "执行视图", 31, { anchor: "middle", weight: 800 })}
${text(500, 350, ["Plan / Step", "Route / Join", "Deadline", "Retry"], 22, { anchor: "middle", lineGap: 1.65 })}
${box(675, 235, 250, 345, { fill: C.purpleSoft, stroke: C.purple })}
${text(800, 290, "模型视图", 31, { anchor: "middle", weight: 800, color: C.purple })}
${text(800, 350, ["Prompt / Model", "Token / TTFT", "Output Schema", "Fallback"], 22, { anchor: "middle", lineGap: 1.65 })}
${box(975, 235, 250, 345, { fill: C.amberSoft, stroke: C.amber })}
${text(1100, 290, "工具视图", 31, { anchor: "middle", weight: 800, color: C.amber })}
${text(1100, 350, ["Tool Intent", "Policy", "Side Effect", "Evidence"], 22, { anchor: "middle", lineGap: 1.65 })}
${box(1275, 235, 250, 345, { fill: C.redSoft, stroke: C.red })}
${text(1400, 290, "控制视图", 31, { anchor: "middle", weight: 800, color: C.red })}
${text(1400, 350, ["Approval", "Circuit", "Degrade", "Recover"], 22, { anchor: "middle", lineGap: 1.65 })}
${line(200, 580, 200, 665, { color: C.green })}
${line(500, 580, 500, 665)}
${line(800, 580, 800, 665, { color: C.purple })}
${line(1100, 580, 1100, 665, { color: C.amber })}
${line(1400, 580, 1400, 665, { color: C.red })}
${box(95, 665, 1410, 90, { fill: C.paper, stroke: C.ink, width: 4, radius: 38 })}
${text(800, 705, "Correlation Spine", 28, { anchor: "middle", weight: 800 })}
${text(800, 740, "request · session · goal · task · step · trace · artifact · evidence · version", 21, { anchor: "middle", color: C.muted })}
${text(800, 820, "五张孤立 Dashboard 不能解释用户目标；统一关联主干才能重建因果。", 28, { anchor: "middle", weight: 760, color: C.red })}
`);

files["diagnostic-triad.svg"] = svg(`
${titleBlock("诊断三件套：Graph × Trace × Artifact", "同一事故的关系、时间和原始材料必须能够彼此跳转。")}
${box(90, 255, 390, 310, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(285, 315, "Context Graph", 32, { anchor: "middle", weight: 800, color: C.green })}
${text(285, 375, ["为什么依赖？", "Claim 由谁支持？", "错误传播到哪里？"], 24, { anchor: "middle", lineGap: 1.7 })}
${box(605, 255, 390, 310, { fill: C.blueSoft, stroke: C.ink, width: 4 })}
${text(800, 315, "Trace", 32, { anchor: "middle", weight: 800 })}
${text(800, 375, ["何时发生？", "关键路径多慢？", "哪里重试或取消？"], 24, { anchor: "middle", lineGap: 1.7 })}
${box(1120, 255, 390, 310, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(1315, 315, "Artifact", 32, { anchor: "middle", weight: 800, color: C.amber })}
${text(1315, 375, ["当时看到了什么？", "Prompt / Tool Result", "Policy / Evidence"], 24, { anchor: "middle", lineGap: 1.7 })}
${arrow(285, 565, 575, 690, { color: C.green })}
${arrow(800, 565, 800, 665)}
${arrow(1315, 565, 1025, 690, { color: C.amber })}
${box(510, 665, 580, 120, { fill: C.redSoft, stroke: C.red, width: 4, radius: 36 })}
${text(800, 712, "Incident Reconstruction", 31, { anchor: "middle", weight: 800, color: C.red })}
${text(800, 752, "找到第一个因果错误，不只修饰最终答案", 23, { anchor: "middle" })}
${text(800, 845, "敏感原文进入受控 Artifact；Trace 与 Graph 只保存最小属性和引用。", 25, { anchor: "middle", color: C.muted })}
`);

files["incident-causal-reconstruction.svg"] = svg(`
${titleBlock("事故重建：沿因果链寻找 First Wrong Node", "最终 Answer 往往只是下游症状；修复应落在第一个违反合同的节点。")}
${[
  ["Goal", "目标 / 约束"],
  ["Plan", "依赖 / 版本"],
  ["Route", "能力快照"],
  ["Worker", "执行合同"],
  ["Tool", "数据 / 副作用"],
  ["Evidence", "事实 / 时效"],
  ["Answer", "表达 / 决策"],
].map((item, i) => {
  const x = 45 + i * 220;
  const isWrong = i === 4;
  const stroke = isWrong ? C.red : i < 4 ? C.ink : C.muted;
  const fill = isWrong ? C.redSoft : i % 2 === 0 ? C.blueSoft : C.paper;
  return `${box(x, 315, 170, 150, { fill, stroke, width: isWrong ? 5 : 3 })}${text(x + 85, 370, item[0], 27, { anchor: "middle", weight: 800, color: stroke })}${text(x + 85, 414, item[1], 19, { anchor: "middle", color: C.muted })}${i < 6 ? arrow(x + 170, 390, x + 215, 390, { color: i === 3 ? C.red : C.ink }) : ""}`;
}).join("")}
${box(855, 215, 260, 65, { fill: C.redSoft, stroke: C.red, width: 3, radius: 28 })}
${text(985, 257, "First Wrong Node", 24, { anchor: "middle", weight: 800, color: C.red })}
${arrow(985, 280, 1010, 315, { color: C.red })}
${box(80, 570, 1440, 155, { fill: C.paper, stroke: C.amber, width: 3, dash: "12 9", radius: 32 })}
${text(130, 620, "逆向提问", 27, { weight: 800, color: C.amber })}
${text(320, 620, "影响谁？", 23, { weight: 700 })}
${text(500, 620, "哪个版本？", 23, { weight: 700 })}
${text(700, 620, "哪个合同先失效？", 23, { weight: 700 })}
${text(970, 620, "错误如何传播？", 23, { weight: 700 })}
${text(1225, 620, "保护为何漏检？", 23, { weight: 700 })}
${text(800, 685, "Alert → representative Goal → Plan → Route → Tool → Context → Evidence → Answer", 23, { anchor: "middle", color: C.muted })}
${text(800, 820, "不要只在 Answer 后补一句 Prompt；修复合同、受影响状态、评测案例和检测能力。", 28, { anchor: "middle", weight: 760, color: C.red })}
`);

files["runtime-control-state-machine.svg"] = svg(`
${titleBlock("运行控制与恢复：从看见异常到安全回归", "控制动作有 Scope、Approval、Version、TTL、Audit 和 Recovery Conditions。")}
${pill(80, 235, 230, "Observe", C.ink, C.blueSoft, 25)}
${arrow(310, 261, 370, 261)}
${pill(370, 235, 230, "Classify", C.amber, C.amberSoft, 25)}
${arrow(600, 261, 660, 261, { color: C.amber })}
${pill(660, 235, 230, "Decide", C.purple, C.purpleSoft, 25)}
${arrow(890, 261, 950, 261, { color: C.purple })}
${pill(950, 235, 230, "Act", C.red, C.redSoft, 25)}
${box(1240, 215, 285, 95, { fill: C.paper, stroke: C.red, dash: "9 7", radius: 28 })}
${text(1382, 252, "Control Action", 23, { anchor: "middle", weight: 800, color: C.red })}
${text(1382, 284, "deterministic + audited", 18, { anchor: "middle", color: C.muted })}
${arrow(1180, 261, 1240, 261, { color: C.red })}
${[
  ["Healthy", C.green, C.greenSoft],
  ["Degraded", C.amber, C.amberSoft],
  ["Open", C.red, C.redSoft],
  ["Recovering", C.purple, C.purpleSoft],
  ["Verifying", C.ink, C.blueSoft],
].map((item, i) => {
  const x = 85 + i * 300;
  return `${circle(x + 105, 520, 92, { fill: item[2], stroke: item[1], width: 4 })}${text(x + 105, 514, item[0], 25, { anchor: "middle", weight: 800, color: item[1] })}${text(x + 105, 550, i === 0 ? "normal" : i === 1 ? "partial" : i === 2 ? "blocked" : i === 3 ? "probe" : "evidence", 18, { anchor: "middle", color: C.muted })}${i < 4 ? arrow(x + 197, 520, x + 300, 520, { color: item[1] }) : ""}`;
}).join("")}
${arrow(1390, 612, 190, 690, { color: C.green, dash: "11 8" })}
${box(430, 675, 740, 100, { fill: C.paper, stroke: C.green, width: 3, radius: 36 })}
${text(800, 716, "Exit Conditions", 28, { anchor: "middle", weight: 800, color: C.green })}
${text(800, 752, "Goal + Evidence + Safety + Latency + Cost 全部验证", 23, { anchor: "middle" })}
${text(800, 840, "恢复不是重新打开流量；Recovering 和 Verifying 不能被跳过。", 28, { anchor: "middle", weight: 760, color: C.red })}
`);

files["cost-causal-tree.svg"] = svg(`
${titleBlock("成本因果树：每一笔消耗都要回到 Goal Outcome", "总账单只能说明花了多少；因果归因才能判断花得是否值得。")}
${box(620, 205, 360, 100, { fill: C.greenSoft, stroke: C.green, width: 4, radius: 34 })}
${text(800, 250, "Goal / Outcome", 31, { anchor: "middle", weight: 800, color: C.green })}
${text(800, 284, "success · partial · failed · blocked", 19, { anchor: "middle", color: C.muted })}
${arrow(710, 305, 390, 410, { color: C.green })}
${arrow(800, 305, 800, 410, { color: C.green })}
${arrow(890, 305, 1210, 410, { color: C.green })}
${box(180, 410, 420, 110, { fill: C.blueSoft, stroke: C.ink })}
${text(390, 455, "Team / Step", 28, { anchor: "middle", weight: 800 })}
${text(390, 491, "critical path · optional · discarded", 19, { anchor: "middle", color: C.muted })}
${box(590, 410, 420, 110, { fill: C.purpleSoft, stroke: C.purple })}
${text(800, 455, "Model / Tool", 28, { anchor: "middle", weight: 800, color: C.purple })}
${text(800, 491, "token · call · provider · evidence", 19, { anchor: "middle", color: C.muted })}
${box(1000, 410, 420, 110, { fill: C.amberSoft, stroke: C.amber })}
${text(1210, 455, "Retry / Cache", 28, { anchor: "middle", weight: 800, color: C.amber })}
${text(1210, 491, "amplification · hit · stale · bypass", 19, { anchor: "middle", color: C.muted })}
${arrow(390, 520, 390, 635)}
${arrow(800, 520, 800, 635, { color: C.purple })}
${arrow(1210, 520, 1210, 635, { color: C.amber })}
${box(140, 635, 440, 115, { fill: C.greenSoft, stroke: C.green })}
${text(360, 680, "Cost per Successful Goal", 26, { anchor: "middle", weight: 800, color: C.green })}
${text(360, 717, "成本是否转化为用户价值", 19, { anchor: "middle" })}
${box(580, 635, 440, 115, { fill: C.redSoft, stroke: C.red })}
${text(800, 680, "Wasted / Retry Cost", 26, { anchor: "middle", weight: 800, color: C.red })}
${text(800, 717, "失败、丢弃、重复和无贡献", 19, { anchor: "middle" })}
${box(1020, 635, 440, 115, { fill: C.blueSoft, stroke: C.ink })}
${text(1240, 680, "Critical Path / Evidence Cost", 25, { anchor: "middle", weight: 800 })}
${text(1240, 717, "完成目标真正需要的投入", 19, { anchor: "middle" })}
${text(800, 825, "预算不足时显式降级或阻断；不要静默删除必要 Evidence。", 28, { anchor: "middle", weight: 760, color: C.red })}
`);

files["continuous-operations-loop.svg"] = svg(`
${titleBlock("持续运营闭环：上线只是第一天", "生产事件、成本和反馈必须回流到评测、发布和下一轮可靠性改进。")}
${[
  ["SLO", 800, 235, C.green, C.greenSoft],
  ["Detect", 1120, 330, C.ink, C.blueSoft],
  ["Diagnose", 1250, 560, C.amber, C.amberSoft],
  ["Control", 1025, 735, C.red, C.redSoft],
  ["Recover", 575, 735, C.purple, C.purpleSoft],
  ["Verify", 350, 560, C.green, C.greenSoft],
  ["Learn", 480, 330, C.amber, C.amberSoft],
].map(([label, x, y, color, fill]) => `${circle(x, y, 82, { fill, stroke: color, width: 4 })}${text(x, y + 8, label, 27, { anchor: "middle", weight: 800, color })}`).join("")}
${arrow(875, 255, 1050, 310, { color: C.green })}
${arrow(1170, 395, 1225, 480)}
${arrow(1200, 625, 1085, 690, { color: C.amber })}
${arrow(940, 750, 660, 750, { color: C.red })}
${arrow(515, 690, 400, 625, { color: C.purple })}
${arrow(375, 480, 430, 395, { color: C.green })}
${arrow(550, 310, 725, 255, { color: C.amber })}
${box(615, 415, 370, 205, { fill: C.paper, stroke: C.ink, width: 4, radius: 40 })}
${text(800, 465, "Production Evidence", 29, { anchor: "middle", weight: 800 })}
${text(800, 512, ["Goal · Trace · Graph", "Artifact · Cost · Incident", "Feedback · GameDay"], 21, { anchor: "middle", lineGap: 1.5, color: C.muted })}
${box(85, 760, 330, 82, { fill: C.redSoft, stroke: C.red, dash: "9 7", radius: 30 })}
${text(250, 795, "Golden Dataset", 24, { anchor: "middle", weight: 800, color: C.red })}
${text(250, 824, "+ Runbook + Alert", 18, { anchor: "middle" })}
${arrow(420, 790, 540, 755, { color: C.red, dash: "9 7" })}
${box(1185, 760, 330, 82, { fill: C.greenSoft, stroke: C.green, dash: "9 7", radius: 30 })}
${text(1350, 795, "Release / ORR", 24, { anchor: "middle", weight: 800, color: C.green })}
${text(1350, 824, "Go · Conditional · No-Go", 18, { anchor: "middle" })}
${arrow(1060, 755, 1180, 790, { color: C.green, dash: "9 7" })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

const manifest = `version: 1
chapter: 09
style: architect-whiteboard
source: scripts/generate_ch09_visuals.mjs
assets:
${Object.keys(files)
  .map((name) => {
    const stem = name.replace(/\.svg$/, "");
    return `  - id: ${stem}
    svg: ${name}
    png: ${stem}.png
    width: 1600
    height: 900`;
  })
  .join("\n")}
`;

fs.writeFileSync(path.join(outDir, "visual-manifest.yml"), manifest);
console.log(`Wrote ${Object.keys(files).length} SVG files and visual-manifest.yml to ${outDir}`);
