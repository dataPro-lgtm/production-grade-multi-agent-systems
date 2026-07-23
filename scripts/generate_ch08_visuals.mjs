#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-08");
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
  return `${box(x, y, w, 52, { fill, stroke: color, width: 2.4, radius: 26 })}${text(x + w / 2, y + 34, label, size, { color, weight: 700, anchor: "middle" })}`;
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
<text x="1525" y="860" font-family="'Kaiti SC','STKaiti',sans-serif" font-size="18" fill="${C.muted}" text-anchor="end">生产级多智能体系统 · 第 08 章</text>
</svg>`;
}

const files = {};

files["evaluation-causal-chain.svg"] = svg(`
${titleBlock("评测对象：一条受约束的因果链", "最终答案只告诉我们结果；分层指标和运行证据解释结果怎样产生。")}
${box(45, 270, 145, 115, { fill: C.redSoft, stroke: C.red })}
${text(117, 323, "Goal", 28, { anchor: "middle", weight: 760, color: C.red })}
${text(117, 357, "约束", 19, { anchor: "middle" })}
${box(220, 270, 145, 115, { fill: C.blueSoft, stroke: C.ink })}
${text(292, 323, "Plan", 28, { anchor: "middle", weight: 760 })}
${text(292, 357, "依赖", 19, { anchor: "middle" })}
${box(395, 270, 145, 115, { fill: C.amberSoft, stroke: C.amber })}
${text(467, 323, "Route", 28, { anchor: "middle", weight: 760, color: C.amber })}
${text(467, 357, "团队", 19, { anchor: "middle" })}
${box(570, 270, 145, 115, { fill: C.greenSoft, stroke: C.green })}
${text(642, 323, "Worker", 27, { anchor: "middle", weight: 760, color: C.green })}
${text(642, 357, "能力", 19, { anchor: "middle" })}
${box(745, 270, 145, 115, { fill: C.purpleSoft, stroke: C.purple })}
${text(817, 323, "Tool", 28, { anchor: "middle", weight: 760, color: C.purple })}
${text(817, 357, "动作", 19, { anchor: "middle" })}
${box(920, 270, 145, 115, { fill: C.greenSoft, stroke: C.green })}
${text(992, 323, "Evidence", 25, { anchor: "middle", weight: 760, color: C.green })}
${text(992, 357, "来源", 19, { anchor: "middle" })}
${box(1095, 270, 145, 115, { fill: C.amberSoft, stroke: C.amber })}
${text(1167, 323, "Join", 28, { anchor: "middle", weight: 760, color: C.amber })}
${text(1167, 357, "归并", 19, { anchor: "middle" })}
${box(1270, 270, 145, 115, { fill: C.blueSoft, stroke: C.ink })}
${text(1342, 323, "Decision", 24, { anchor: "middle", weight: 760 })}
${text(1342, 357, "风险", 19, { anchor: "middle" })}
${box(1445, 270, 120, 115, { fill: C.redSoft, stroke: C.red })}
${text(1505, 323, "Answer", 23, { anchor: "middle", weight: 760, color: C.red })}
${text(1505, 357, "表达", 19, { anchor: "middle" })}
${arrow(190, 327, 220, 327, { color: C.red })}
${arrow(365, 327, 395, 327)}
${arrow(540, 327, 570, 327, { color: C.amber })}
${arrow(715, 327, 745, 327, { color: C.green })}
${arrow(890, 327, 920, 327, { color: C.purple })}
${arrow(1065, 327, 1095, 327, { color: C.green })}
${arrow(1240, 327, 1270, 327, { color: C.amber })}
${arrow(1415, 327, 1445, 327)}
${pill(65, 485, 275, "合同 / 约束覆盖", C.red, C.paper, 20)}
${pill(365, 485, 275, "计划 / 路由准确", C.amber, C.paper, 20)}
${pill(665, 485, 275, "工具 / 权限正确", C.purple, C.paper, 20)}
${pill(965, 485, 275, "证据 / 忠实度", C.green, C.paper, 20)}
${pill(1265, 485, 275, "目标 / 决策质量", C.ink, C.paper, 20)}
${line(117, 385, 202, 485, { color: C.red, dash: "9 7" })}
${line(467, 385, 502, 485, { color: C.amber, dash: "9 7" })}
${line(817, 385, 802, 485, { color: C.purple, dash: "9 7" })}
${line(992, 385, 1102, 485, { color: C.green, dash: "9 7" })}
${line(1422, 385, 1402, 485, { color: C.ink, dash: "9 7" })}
${box(300, 650, 1000, 100, { fill: C.paper, stroke: C.red, dash: "12 9", radius: 42 })}
${text(800, 693, "端到端指标判断是否成功 · 分层指标定位哪里失败", 28, { anchor: "middle", weight: 760, color: C.red })}
${text(800, 730, "Case + Plan + Trace + Context Graph + Evidence + Score 一起保存", 21, { anchor: "middle", color: C.muted })}
`);

files["four-levels-of-correctness.svg"] = svg(`
${titleBlock("四层正确性：从可解析到可决策", "外层需要更多语义判断；内层失败时，外层高分不能抵扣。")}
${box(120, 235, 1360, 500, { fill: C.redSoft, stroke: C.red, width: 4, radius: 38 })}
${text(800, 288, "④ 推理正确 · 决策与权衡", 30, { anchor: "middle", weight: 760, color: C.red })}
${box(245, 315, 1110, 355, { fill: C.amberSoft, stroke: C.amber, width: 4, radius: 34 })}
${text(800, 366, "③ 语义正确 · 事实与证据", 29, { anchor: "middle", weight: 760, color: C.amber })}
${box(370, 395, 860, 210, { fill: C.greenSoft, stroke: C.green, width: 4, radius: 30 })}
${text(800, 446, "② 行为正确 · 路由、工具、权限、副作用", 27, { anchor: "middle", weight: 760, color: C.green })}
${box(520, 475, 560, 80, { fill: C.blueSoft, stroke: C.ink, width: 4, radius: 26 })}
${text(800, 526, "① 结构正确 · Schema、类型、状态", 25, { anchor: "middle", weight: 760 })}
${pill(160, 650, 265, "领域专家 + Rubric", C.red, C.paper, 20)}
${pill(450, 650, 265, "证据规则 + Judge", C.amber, C.paper, 20)}
${pill(740, 650, 265, "Trace / 图断言", C.green, C.paper, 20)}
${pill(1030, 650, 265, "代码 / 状态机", C.ink, C.paper, 20)}
${text(800, 795, "跨租户泄露、未授权副作用、合同破坏：任何一次命中都应硬阻断。", 28, { anchor: "middle", color: C.red, weight: 760 })}
`);

files["golden-entry-contract.svg"] = svg(`
${titleBlock("Golden Entry：不是一问一答，而是一份可执行规格", "把必须成立的事实、路径、安全约束和容忍度从参考文字中拆出来。")}
${box(60, 255, 250, 400, { fill: C.blueSoft, stroke: C.ink })}
${text(185, 310, "输入", 31, { anchor: "middle", weight: 760 })}
${text(185, 372, ["用户请求", "身份 / 租户", "初始状态", "语言 / 风险"], 23, { anchor: "middle", lineGap: 1.55 })}
${arrow(310, 455, 385, 455)}
${box(385, 215, 360, 480, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(565, 270, "预期事实与证据", 31, { anchor: "middle", weight: 760, color: C.green })}
${pill(430, 325, 270, "Fact → EvidenceRef", C.green, C.paper, 20)}
${pill(430, 405, 270, "权威源 + 版本", C.purple, C.paper, 20)}
${pill(430, 485, 270, "缺失 / 冲突语义", C.amber, C.paper, 20)}
${pill(430, 565, 270, "可接受 Outcome", C.ink, C.paper, 20)}
${arrow(745, 455, 820, 455, { color: C.green })}
${box(820, 215, 360, 480, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(1000, 270, "路径与安全不变量", 31, { anchor: "middle", weight: 760, color: C.amber })}
${pill(865, 325, 270, "必要 Team / Skill", C.amber, C.paper, 20)}
${pill(865, 405, 270, "允许动作", C.green, C.paper, 20)}
${pill(865, 485, 270, "禁止动作", C.red, C.redSoft, 20)}
${pill(865, 565, 270, "依赖 / Join 断言", C.ink, C.paper, 20)}
${arrow(1180, 455, 1255, 455, { color: C.amber })}
${box(1255, 255, 285, 400, { fill: C.purpleSoft, stroke: C.purple })}
${text(1397, 310, "治理", 31, { anchor: "middle", weight: 760, color: C.purple })}
${text(1397, 372, ["Fixture", "N-run 容忍度", "来源 / Owner", "版本 / 有效期", "允许用途"], 22, { anchor: "middle", lineGap: 1.5 })}
${text(800, 780, "表达可以不同，但事实不能自由改写；路径可以不同，但不变量必须成立。", 29, { anchor: "middle", color: C.red, weight: 760 })}
`);

files["judge-control-plane.svg"] = svg(`
${titleBlock("Judge 控制面：有边界的语义测量仪器", "能由代码确定的属性交给规则；开放属性由校准后的 Judge 判断；争议和高风险进入人工复核。")}
${box(55, 245, 340, 410, { fill: C.blueSoft, stroke: C.ink })}
${text(225, 302, "Measurement Input", 28, { anchor: "middle", weight: 760 })}
${pill(95, 350, 260, "Case + Output", C.ink, C.paper, 20)}
${pill(95, 430, 260, "Rubric", C.amber, C.amberSoft, 20)}
${pill(95, 510, 260, "Evidence Pack", C.green, C.greenSoft, 20)}
${pill(95, 590, 260, "版本 / Slice", C.purple, C.purpleSoft, 20)}
${arrow(395, 450, 470, 450)}
${box(470, 245, 330, 410, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(635, 302, "LLM-as-a-Judge", 30, { anchor: "middle", weight: 760, color: C.amber })}
${text(635, 370, ["单答 / 参考引导", "Pairwise 随机顺序", "结构化 Verdict", "EvidenceRef", "Abstain"], 23, { anchor: "middle", lineGap: 1.52 })}
${arrow(800, 450, 875, 450, { color: C.amber })}
${box(875, 245, 330, 410, { fill: C.greenSoft, stroke: C.green })}
${text(1040, 302, "Calibration", 30, { anchor: "middle", weight: 760, color: C.green })}
${text(1040, 370, ["人类标签", "一致率 / Kappa", "Precision / Recall", "顺序翻转率", "切片误差"], 23, { anchor: "middle", lineGap: 1.52 })}
${arrow(1205, 450, 1280, 450, { color: C.green })}
${box(1280, 245, 265, 410, { fill: C.redSoft, stroke: C.red })}
${text(1412, 302, "Human Review", 29, { anchor: "middle", weight: 760, color: C.red })}
${text(1412, 380, ["高风险", "Judge 弃权", "证据冲突", "新任务", "抽样审计"], 23, { anchor: "middle", lineGap: 1.58 })}
${box(445, 705, 710, 80, { fill: C.paper, stroke: C.red, dash: "12 9", radius: 38 })}
${text(800, 755, "位置偏差 · 冗长偏差 · 自偏好 · Prompt Injection", 26, { anchor: "middle", color: C.red, weight: 760 })}
`);

files["n-run-distribution-and-gates.svg"] = svg(`
${titleBlock("N-run：一次通过不是稳定性证明", "候选搜索关心至少一次成功；生产路径更关心每一次都安全、都满足不变量。")}
${text(100, 245, "同一 Golden Case · 固定 Fixture · 10 次运行", 28, { weight: 760 })}
${["✓","✓","✓","✓","✓","✓","✕","✓","✓","✓"].map((v,i) => {
  const x = 90 + i * 145;
  const ok = v === "✓";
  return `${box(x, 295, 105, 120, { fill: ok ? C.greenSoft : C.redSoft, stroke: ok ? C.green : C.red })}${text(x + 52, 365, v, 47, { anchor: "middle", weight: 800, color: ok ? C.green : C.red })}${text(x + 52, 402, `R${i+1}`, 18, { anchor: "middle", color: C.muted })}`;
}).join("")}
${box(80, 500, 440, 170, { fill: C.blueSoft, stroke: C.ink })}
${text(300, 552, "pass@k", 34, { anchor: "middle", weight: 760 })}
${text(300, 603, "k 次中至少一次成功", 24, { anchor: "middle" })}
${text(300, 640, "候选生成 / 搜索", 20, { anchor: "middle", color: C.muted })}
${box(580, 500, 440, 170, { fill: C.amberSoft, stroke: C.amber })}
${text(800, 552, "pass^k", 34, { anchor: "middle", weight: 760, color: C.amber })}
${text(800, 603, "本书记号：k 次全部成功", 24, { anchor: "middle" })}
${text(800, 640, "稳定执行", 20, { anchor: "middle", color: C.muted })}
${box(1080, 500, 440, 170, { fill: C.redSoft, stroke: C.red })}
${text(1300, 552, "safe_path_rate", 32, { anchor: "middle", weight: 760, color: C.red })}
${text(1300, 603, "满足安全不变量的运行比例", 23, { anchor: "middle" })}
${text(1300, 640, "高风险硬门禁", 20, { anchor: "middle", color: C.muted })}
${text(800, 770, "保存每次 Plan、Route、Tool、Evidence 与 Trace；不要只保存平均分。", 29, { anchor: "middle", color: C.red, weight: 760 })}
`);

files["continuous-evaluation-loop.svg"] = svg(`
${titleBlock("持续评测：从数据到发布，再从生产回到数据", "离线回归控制发布；线上观测发现真实分布、质量事件与漂移。")}
${box(60, 290, 200, 125, { fill: C.blueSoft, stroke: C.ink })}
${text(160, 340, "Dataset", 28, { anchor: "middle", weight: 760 })}
${text(160, 375, "+ Fixture", 20, { anchor: "middle" })}
${box(320, 290, 200, 125, { fill: C.greenSoft, stroke: C.green })}
${text(420, 340, "Replay", 28, { anchor: "middle", weight: 760, color: C.green })}
${text(420, 375, "N-run", 20, { anchor: "middle" })}
${box(580, 290, 200, 125, { fill: C.amberSoft, stroke: C.amber })}
${text(680, 340, "Score", 28, { anchor: "middle", weight: 760, color: C.amber })}
${text(680, 375, "Rules + Judge", 20, { anchor: "middle" })}
${box(840, 290, 200, 125, { fill: C.purpleSoft, stroke: C.purple })}
${text(940, 340, "Compare", 28, { anchor: "middle", weight: 760, color: C.purple })}
${text(940, 375, "Paired + Slice", 20, { anchor: "middle" })}
${box(1100, 290, 200, 125, { fill: C.redSoft, stroke: C.red })}
${text(1200, 340, "Gate", 28, { anchor: "middle", weight: 760, color: C.red })}
${text(1200, 375, "Go / No-Go", 20, { anchor: "middle" })}
${box(1360, 290, 180, 125, { fill: C.paper, stroke: C.ink })}
${text(1450, 340, "Canary", 27, { anchor: "middle", weight: 760 })}
${text(1450, 375, "Production", 20, { anchor: "middle" })}
${arrow(260, 352, 320, 352)}
${arrow(520, 352, 580, 352, { color: C.green })}
${arrow(780, 352, 840, 352, { color: C.amber })}
${arrow(1040, 352, 1100, 352, { color: C.purple })}
${arrow(1300, 352, 1360, 352, { color: C.red })}
${box(360, 570, 880, 130, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 42 })}
${text(800, 615, "规则全量 · Judge 抽样 · 用户反馈 · 业务结果", 26, { anchor: "middle", weight: 760 })}
${text(800, 657, "Input / Path / Quality / System / Data Drift", 22, { anchor: "middle", color: C.muted })}
${arrow(1450, 415, 1210, 570, { color: C.ink, dash: "12 9" })}
${arrow(390, 635, 160, 415, { color: C.red, dash: "12 9" })}
${text(800, 795, "质量事件 → 最小复现 Case → 人工复核 → 治理后进入 Golden Dataset", 28, { anchor: "middle", color: C.red, weight: 760 })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

const manifest = `chapter: 08
style: architect-whiteboard
generator: scripts/generate_ch08_visuals.mjs
deterministic: true
assets:
${Object.keys(files)
  .map((name) => `  - svg: ${name}\n    png: ${name.replace(".svg", ".png")}`)
  .join("\n")}
`;
fs.writeFileSync(path.join(outDir, "visual-manifest.yml"), manifest);

console.log(`Generated ${Object.keys(files).length} SVG files in ${outDir}`);
