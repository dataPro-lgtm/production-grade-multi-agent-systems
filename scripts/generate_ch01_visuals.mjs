#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-01");
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

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function text(x, y, value, size = 28, options = {}) {
  const {
    color = C.ink,
    weight = 500,
    anchor = "start",
    family = "'Kaiti SC','STKaiti','Noto Sans SC',sans-serif",
  } = options;
  const lines = Array.isArray(value) ? value : [value];
  const spans = lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : size * 1.3}">${esc(line)}</tspan>`,
    )
    .join("");
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${spans}</text>`;
}

function box(x, y, width, height, options = {}) {
  const {
    fill = C.paper,
    stroke = C.ink,
    strokeWidth = 3,
    radius = 22,
    dash = "",
  } = options;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>
<rect x="${x + 2}" y="${y - 1}" width="${width - 1}" height="${height + 1}" rx="${radius + 1}" fill="none" stroke="${stroke}" stroke-width="1.2" opacity=".3" transform="rotate(.15 ${x + width / 2} ${y + height / 2})"/>`;
}

function line(x1, y1, x2, y2, options = {}) {
  const {
    color = C.ink,
    width = 4,
    dash = "",
    arrow = true,
  } = options;
  return `<path d="M ${x1} ${y1} C ${(x1 * 2 + x2) / 3} ${y1 - 2}, ${(x1 + x2 * 2) / 3} ${y2 + 2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow-${color.slice(1)})"` : ""}/>`;
}

function pill(x, y, width, label, color, fill) {
  return `${box(x, y, width, 50, { fill, stroke: color, strokeWidth: 2, radius: 25 })}${text(x + width / 2, y + 33, label, 22, { color, weight: 700, anchor: "middle" })}`;
}

function titleBlock(title, subtitle) {
  return `${text(70, 75, title, 43, { weight: 760 })}
<path d="M 70 94 C 270 87, 490 101, 720 93" fill="none" stroke="${C.amber}" stroke-width="7" stroke-linecap="round" opacity=".85"/>
${text(72, 130, subtitle, 23, { color: C.muted })}`;
}

function markers() {
  return [C.ink, C.amber, C.green, C.red, C.purple, C.muted]
    .map(
      (color) =>
        `<marker id="arrow-${color.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`,
    )
    .join("");
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img">
<defs>${markers()}</defs>
<rect width="1600" height="900" fill="${C.bg}"/>
<path d="M 18 177 C 420 169, 930 188, 1580 176 M 25 720 C 520 730, 1000 708, 1575 721" stroke="#e7dfce" stroke-width="2" fill="none" opacity=".55"/>
${body}
<text x="1525" y="860" font-family="'Kaiti SC','STKaiti',sans-serif" font-size="18" fill="${C.muted}" text-anchor="end">生产级多智能体系统 · 第 01 章</text>
</svg>`;
}

const files = {};

files["agent-minimal-loop.svg"] = svg(`
${titleBlock("Agent 的最小闭环：模型选路，运行时控场", "观察结果必须改变下一动作；权限、执行、状态与终止不交给模型自由发挥。")}
${box(565, 315, 470, 235, { fill: C.paper, stroke: C.ink, strokeWidth: 4, radius: 90 })}
${text(800, 385, "目标 + 当前状态", 38, { anchor: "middle", weight: 760 })}
${text(800, 438, "范围 · 预算 · 证据缺口", 25, { anchor: "middle", color: C.muted })}
${pill(690, 474, 220, "受约束动作空间", C.amber, C.amberSoft)}
${box(85, 255, 285, 150, { fill: C.blueSoft, stroke: C.ink })}
${text(228, 308, "① Observe", 31, { anchor: "middle", weight: 720 })}
${text(228, 353, "工具结果 · 错误 · 权限", 21, { anchor: "middle" })}
${box(1230, 255, 285, 150, { fill: C.purpleSoft, stroke: C.purple })}
${text(1372, 308, "② Decide", 31, { anchor: "middle", weight: 720, color: C.purple })}
${text(1372, 353, "选择下一动作或停止", 21, { anchor: "middle" })}
${box(1230, 590, 285, 150, { fill: C.redSoft, stroke: C.red })}
${text(1372, 643, "③ Policy + Act", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(1372, 688, "鉴权 · 校验 · 幂等执行", 21, { anchor: "middle" })}
${box(85, 590, 285, 150, { fill: C.greenSoft, stroke: C.green })}
${text(228, 643, "④ Update", 31, { anchor: "middle", weight: 720, color: C.green })}
${text(228, 688, "持久化状态与证据", 21, { anchor: "middle" })}
${line(370, 320, 565, 380, { color: C.ink })}
${line(1035, 380, 1230, 320, { color: C.purple })}
${line(1372, 405, 1372, 590, { color: C.red })}
${line(1230, 665, 1035, 500, { color: C.red })}
${line(565, 500, 370, 665, { color: C.green })}
${line(228, 590, 228, 405, { color: C.green })}
${box(545, 650, 510, 105, { fill: C.paper, stroke: C.muted, strokeWidth: 2, dash: "10 8" })}
${text(800, 693, "终止也是显式动作", 27, { anchor: "middle", weight: 700 })}
${text(800, 730, "完成 · 证据不足 · 拒绝 · 等待审批 · 转人工", 21, { anchor: "middle", color: C.muted })}
`);

files["agent-five-layer-stack.svg"] = svg(`
${titleBlock("生产 Agent 的五层结构：责任清楚，系统才可治理", "五层不等于五个服务；它们是必须被分配、验证和观察的五组工程责任。")}
${box(155, 205, 1060, 112, { fill: C.blueSoft, stroke: C.ink, strokeWidth: 4 })}
${text(240, 255, "目标层", 31, { weight: 760 })}
${text(240, 293, "目标 · 成功标准 · 范围 · 终止条件", 22, { color: C.muted })}
${pill(960, 236, 200, "要什么 / 何时停", C.ink, C.paper)}
${box(155, 342, 1060, 112, { fill: C.purpleSoft, stroke: C.purple, strokeWidth: 4 })}
${text(240, 392, "认知层", 31, { weight: 760, color: C.purple })}
${text(240, 430, "推理 · 规划 · 路由 · 评估 · 反思", 22, { color: C.muted })}
${pill(960, 373, 200, "下一步做什么", C.purple, C.paper)}
${box(155, 479, 1060, 112, { fill: C.amberSoft, stroke: C.amber, strokeWidth: 4 })}
${text(240, 529, "行动层", 31, { weight: 760, color: C.amber })}
${text(240, 567, "检索 · 计算 · 操作 · 通信", 22, { color: C.muted })}
${pill(960, 510, 200, "怎样影响环境", C.amber, C.paper)}
${box(155, 616, 1060, 112, { fill: C.greenSoft, stroke: C.green, strokeWidth: 4 })}
${text(240, 666, "状态层", 31, { weight: 760, color: C.green })}
${text(240, 704, "任务状态 · 记忆 · 知识 · 证据 · 轨迹", 22, { color: C.muted })}
${pill(960, 647, 200, "发生了什么", C.green, C.paper)}
${line(685, 317, 685, 342, { color: C.ink, width: 3 })}
${line(685, 454, 685, 479, { color: C.purple, width: 3 })}
${line(685, 591, 685, 616, { color: C.amber, width: 3 })}
${box(1270, 205, 270, 523, { fill: C.redSoft, stroke: C.red, strokeWidth: 5, radius: 34 })}
${text(1405, 272, "控制层", 34, { anchor: "middle", weight: 780, color: C.red })}
${text(1405, 335, "身份与权限", 24, { anchor: "middle", color: C.ink, weight: 650 })}
${text(1405, 378, "Schema 校验", 24, { anchor: "middle", color: C.ink, weight: 650 })}
${text(1405, 421, "预算与超时", 24, { anchor: "middle", color: C.ink, weight: 650 })}
${text(1405, 464, "审批与幂等", 24, { anchor: "middle", color: C.ink, weight: 650 })}
${text(1405, 507, "重试与熔断", 24, { anchor: "middle", color: C.ink, weight: 650 })}
${text(1405, 550, "审计与追踪", 24, { anchor: "middle", color: C.ink, weight: 650 })}
${pill(1305, 650, 200, "是否允许", C.red, C.paper)}
${line(1270, 261, 1215, 261, { color: C.red, width: 3 })}
${line(1270, 398, 1215, 398, { color: C.red, width: 3 })}
${line(1270, 535, 1215, 535, { color: C.red, width: 3 })}
${line(1270, 672, 1215, 672, { color: C.red, width: 3 })}
${box(320, 775, 960, 64, { fill: C.paper, stroke: C.muted, strokeWidth: 2, dash: "10 8", radius: 25 })}
${text(800, 816, "模型主要参与认知；运行时必须让目标、行动、状态与控制保持一致。", 24, { anchor: "middle", weight: 680 })}
`);

files["autonomy-matrix.svg"] = svg(`
${titleBlock("自治有两条轴：会规划，不等于可以执行", "规划自治决定“下一步谁选”；执行自治决定“系统允许改变什么”。")}
${line(240, 730, 1450, 730, { color: C.ink, width: 5 })}
${line(240, 730, 240, 205, { color: C.ink, width: 5 })}
${text(1450, 780, "规划自治高", 25, { anchor: "end", weight: 700 })}
${text(245, 780, "规划自治低", 22, { color: C.muted })}
${text(172, 215, "执行自治高", 25, { anchor: "middle", weight: 700 })}
${text(168, 710, "执行自治低", 22, { anchor: "middle", color: C.muted })}
${line(845, 225, 845, 730, { color: C.gray, width: 2, dash: "10 10", arrow: false })}
${line(240, 475, 1430, 475, { color: C.gray, width: 2, dash: "10 10", arrow: false })}
${box(295, 260, 430, 150, { fill: C.redSoft, stroke: C.red })}
${text(510, 312, "固定资金流程", 31, { anchor: "middle", weight: 720, color: C.red })}
${text(510, 357, "代码定路 · 可产生真实副作用", 22, { anchor: "middle" })}
${box(965, 260, 400, 150, { fill: C.purpleSoft, stroke: C.purple })}
${text(1165, 312, "高风险自主系统", 31, { anchor: "middle", weight: 720, color: C.purple })}
${text(1165, 357, "少量场景 · 强治理与审批", 22, { anchor: "middle" })}
${box(295, 545, 430, 135, { fill: C.blueSoft, stroke: C.ink })}
${text(510, 595, "普通工作流", 31, { anchor: "middle", weight: 720 })}
${text(510, 638, "代码定路 · 只读或无副作用", 22, { anchor: "middle" })}
${box(965, 530, 400, 165, { fill: C.greenSoft, stroke: C.green, strokeWidth: 4 })}
${text(1165, 583, "CaseOps 目标位置", 32, { anchor: "middle", weight: 760, color: C.green })}
${text(1165, 626, "动态调查 · 低执行权限", 23, { anchor: "middle" })}
${pill(1050, 655, 230, "草稿必须审批", C.amber, C.amberSoft)}
${text(800, 825, "矩阵不是成熟度排行：规划空间扩大时，执行权限不必同步扩大。", 26, { anchor: "middle", color: C.muted, weight: 650 })}
`);

files["engineering-boundaries.svg"] = svg(`
${titleBlock("值得拆分的 Agent，必须对应真实工程边界", "先找责任差异，再起角色名称；Prompt 数量不是架构边界。")}
${box(600, 330, 400, 190, { fill: C.paper, stroke: C.ink, strokeWidth: 4, radius: 70 })}
${text(800, 395, "为什么必须拆开？", 37, { anchor: "middle", weight: 760 })}
${text(800, 445, "能否独立授权、恢复、扩缩容", 24, { anchor: "middle", color: C.muted })}
${text(800, 482, "并由明确所有者负责？", 24, { anchor: "middle", color: C.muted })}
${box(75, 220, 300, 135, { fill: C.blueSoft, stroke: C.ink })}
${text(225, 270, "领域与验收", 29, { anchor: "middle", weight: 720 })}
${text(225, 313, "术语、规则、成功标准", 21, { anchor: "middle" })}
${box(1225, 220, 300, 135, { fill: C.amberSoft, stroke: C.amber })}
${text(1375, 270, "数据与工具", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(1375, 313, "访问范围、读写能力", 21, { anchor: "middle" })}
${box(55, 565, 320, 135, { fill: C.greenSoft, stroke: C.green })}
${text(215, 615, "权限与身份", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(215, 658, "委托、审批、最小权限", 21, { anchor: "middle" })}
${box(1225, 565, 320, 135, { fill: C.redSoft, stroke: C.red })}
${text(1385, 615, "状态与故障", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(1385, 658, "所有权、重试、降级", 21, { anchor: "middle" })}
${box(625, 655, 350, 115, { fill: C.purpleSoft, stroke: C.purple })}
${text(800, 700, "团队与运行责任", 29, { anchor: "middle", weight: 720, color: C.purple })}
${text(800, 740, "发布 · SLO · 独立容量", 21, { anchor: "middle" })}
${line(375, 290, 600, 380, { color: C.ink })}
${line(1225, 290, 1000, 380, { color: C.amber })}
${line(375, 630, 610, 495, { color: C.green })}
${line(1225, 630, 990, 495, { color: C.red })}
${line(800, 655, 800, 520, { color: C.purple })}
${text(800, 820, "若边界无法独立测试，拆分通常只会增加协调成本。", 26, { anchor: "middle", weight: 650 })}
`);

files["architecture-escalation.svg"] = svg(`
${titleBlock("架构升级靠证据推动，不靠名词推动", "每增加一层自治，都要说明上一层为什么无法满足需求。")}
${box(70, 620, 245, 130, { fill: C.blueSoft, stroke: C.ink })}
${text(192, 670, "确定性代码", 29, { anchor: "middle", weight: 720 })}
${text(192, 710, "规则明确", 21, { anchor: "middle", color: C.muted })}
${box(365, 530, 245, 165, { fill: C.paper, stroke: C.ink })}
${text(487, 582, "LLM 调用", 29, { anchor: "middle", weight: 720 })}
${text(487, 623, ["抽取 · 分类", "摘要 · 改写"], 21, { anchor: "middle", color: C.muted })}
${box(660, 430, 260, 190, { fill: C.amberSoft, stroke: C.amber })}
${text(790, 483, "LLM 工作流", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(790, 520, "代码定义整体路径", 20, { anchor: "middle" })}
${text(790, 548, "模型处理局部语义", 20, { anchor: "middle" })}
${pill(708, 568, 165, "常见终点", C.amber, C.paper)}
${box(970, 315, 245, 215, { fill: C.greenSoft, stroke: C.green, strokeWidth: 4 })}
${text(1092, 370, "单 Agent", 31, { anchor: "middle", weight: 760, color: C.green })}
${text(1092, 408, "根据反馈选路", 20, { anchor: "middle" })}
${text(1092, 438, "动作空间受限", 20, { anchor: "middle" })}
${pill(1017, 468, 150, "先选它", C.green, C.paper)}
${box(1280, 205, 245, 235, { fill: C.purpleSoft, stroke: C.purple })}
${text(1402, 262, "多 Agent", 31, { anchor: "middle", weight: 760, color: C.purple })}
${text(1402, 300, "责任边界独立", 19, { anchor: "middle" })}
${text(1402, 330, "协议 · Join · 恢复", 19, { anchor: "middle" })}
${pill(1330, 365, 145, "有条件", C.purple, C.paper)}
${line(315, 670, 365, 615, { color: C.ink })}
${line(610, 580, 660, 525, { color: C.amber })}
${line(920, 475, 970, 420, { color: C.green })}
${line(1215, 365, 1280, 315, { color: C.purple })}
${text(205, 786, "稳定规则", 22, { anchor: "middle", color: C.muted })}
${text(1460, 786, "状态、测试、安全与运维成本上升", 22, { anchor: "end", color: C.red, weight: 650 })}
${line(320, 810, 1370, 810, { color: C.red, width: 4 })}
`);

files["caseops-architecture-options.svg"] = svg(`
${titleBlock("CaseOps 三种方案：动态调查责任放在哪里？", "三种方案共享同一确定性控制面；区别不在有没有数据库，而在谁选择调查路径。")}
${box(55, 210, 450, 470, { fill: C.blueSoft, stroke: C.ink, strokeWidth: 4 })}
${pill(90, 240, 150, "本章选择", C.ink, C.paper)}
${text(280, 330, "A · 确定性服务", 34, { anchor: "middle", weight: 760 })}
${box(125, 385, 310, 90, { fill: C.paper, stroke: C.ink })}
${text(280, 440, "固定调查工作流", 26, { anchor: "middle", weight: 700 })}
${line(280, 475, 280, 545, { color: C.ink })}
${box(125, 545, 310, 80, { fill: C.paper, stroke: C.ink })}
${text(280, 595, "集合差 + 规则有效期", 23, { anchor: "middle" })}
${text(280, 650, "结构化输入已足够", 21, { anchor: "middle", color: C.muted })}
${box(575, 210, 450, 470, { fill: C.greenSoft, stroke: C.green, strokeWidth: 4 })}
${pill(610, 240, 150, "下一阶段", C.green, C.paper)}
${text(800, 330, "B · 受约束单 Agent", 34, { anchor: "middle", weight: 760, color: C.green })}
${box(645, 385, 310, 90, { fill: C.paper, stroke: C.green })}
${text(800, 440, "Investigation Agent", 26, { anchor: "middle", weight: 700, color: C.green })}
${line(800, 475, 800, 545, { color: C.green })}
${box(645, 545, 310, 80, { fill: C.paper, stroke: C.green })}
${text(800, 595, "动态取证 · 请求澄清", 23, { anchor: "middle" })}
${text(800, 650, "只读工具 + 草稿动作", 21, { anchor: "middle", color: C.muted })}
${box(1095, 210, 450, 470, { fill: C.purpleSoft, stroke: C.purple, strokeWidth: 4 })}
${pill(1130, 240, 180, "出现边界后", C.purple, C.paper)}
${text(1320, 330, "C · 受监督多 Agent", 34, { anchor: "middle", weight: 760, color: C.purple })}
${box(1165, 380, 310, 80, { fill: C.paper, stroke: C.purple })}
${text(1320, 430, "Supervisor", 27, { anchor: "middle", weight: 700, color: C.purple })}
${line(1260, 460, 1230, 540, { color: C.purple })}
${line(1380, 460, 1410, 540, { color: C.purple })}
${box(1135, 540, 190, 85, { fill: C.paper, stroke: C.purple })}
${text(1230, 592, "材料核验", 22, { anchor: "middle" })}
${box(1315, 540, 190, 85, { fill: C.paper, stroke: C.purple })}
${text(1410, 592, "规则研究", 22, { anchor: "middle" })}
${text(1320, 650, "独立权限 · 状态 · 故障", 21, { anchor: "middle", color: C.muted })}
${box(55, 720, 1490, 85, { fill: C.paper, stroke: C.red, strokeWidth: 3, radius: 30 })}
${text(800, 773, "共享确定性控制面：身份 · 租户 · 状态 · 规则 · 幂等 · 审计 · Outbox · 审批", 25, { anchor: "middle", color: C.red, weight: 700 })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

console.log(`Generated ${Object.keys(files).length} chapter 1 SVG files.`);
