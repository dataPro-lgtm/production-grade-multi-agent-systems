#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("docs/assets/images/chapter-05");
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
<text x="1525" y="860" font-family="'Kaiti SC','STKaiti',sans-serif" font-size="18" fill="${C.muted}" text-anchor="end">生产级多智能体系统 · 第 05 章</text>
</svg>`;
}

const files = {};

files["production-platform-planes.svg"] = svg(`
${titleBlock("生产级 Agent 平台的五个平面", "责任可以部署在一起，但入口、决策、执行、状态与运营的所有权不能混在一起。")}
${box(60, 240, 270, 410, { fill: C.amberSoft, stroke: C.amber })}
${pill(95, 270, 200, "体验平面", C.amber, C.paper, 29)}
${text(195, 385, ["UI / API", "流式响应", "Webhook", "取消与反馈"], 25, { anchor: "middle", lineGap: 1.55 })}
${box(365, 240, 270, 410, { fill: C.blueSoft, stroke: C.ink })}
${pill(400, 270, 200, "控制平面", C.ink, C.paper, 29)}
${text(500, 385, ["计划与路由", "Policy Gate", "预算与审批", "Checkpoint"], 25, { anchor: "middle", lineGap: 1.55 })}
${box(670, 240, 270, 410, { fill: C.purpleSoft, stroke: C.purple })}
${pill(705, 270, 200, "执行平面", C.purple, C.paper, 29)}
${text(805, 385, ["Agent Runtime", "Tool Server", "Worker / Sandbox", "Model Gateway"], 25, { anchor: "middle", lineGap: 1.55 })}
${box(975, 240, 270, 410, { fill: C.greenSoft, stroke: C.green })}
${pill(1010, 270, 200, "数据平面", C.green, C.paper, 29)}
${text(1110, 385, ["SQL / Graph", "Vector / Object", "Cache / Queue", "SoT 与派生索引"], 25, { anchor: "middle", lineGap: 1.55 })}
${box(1280, 240, 270, 410, { fill: C.redSoft, stroke: C.red })}
${pill(1315, 270, 200, "运营平面", C.red, C.paper, 29)}
${text(1415, 385, ["Telemetry / SLO", "发布与告警", "备份与恢复", "安全与审计"], 25, { anchor: "middle", lineGap: 1.55 })}
${arrow(330, 445, 365, 445, { color: C.amber })}
${arrow(635, 445, 670, 445)}
${arrow(940, 445, 975, 445, { color: C.purple })}
${arrow(1245, 445, 1280, 445, { color: C.green })}
${text(800, 760, "模型只负责局部判断；权限、状态、恢复与运营保证必须由确定性平台承担。", 28, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["stateless-core-stateful-edge.svg"] = svg(`
${titleBlock("无状态核心，状态化边缘", "计算实例可以替换；每一份持久状态都必须有唯一 Owner、SoT 和恢复路径。")}
${box(390, 220, 820, 420, { fill: C.paper, stroke: C.ink, width: 4, dash: "13 9" })}
${pill(660, 245, 280, "可替换计算核心", C.ink, C.blueSoft, 28)}
${box(455, 350, 200, 125, { fill: C.amberSoft, stroke: C.amber })}
${text(555, 402, "Gateway", 30, { anchor: "middle", weight: 720, color: C.amber })}
${text(555, 442, "身份 · Deadline", 20, { anchor: "middle" })}
${box(700, 350, 200, 125, { fill: C.purpleSoft, stroke: C.purple })}
${text(800, 402, "Supervisor", 30, { anchor: "middle", weight: 720, color: C.purple })}
${text(800, 442, "计划 · 预算", 20, { anchor: "middle" })}
${box(945, 350, 200, 125, { fill: C.greenSoft, stroke: C.green })}
${text(1045, 402, "Agent / Tool", 30, { anchor: "middle", weight: 720, color: C.green })}
${text(1045, 442, "执行 · 隔离", 20, { anchor: "middle" })}
${arrow(655, 412, 700, 412, { color: C.amber })}
${arrow(900, 412, 945, 412, { color: C.purple })}
${box(35, 235, 260, 130, { fill: C.redSoft, stroke: C.red })}
${text(165, 285, "PostgreSQL", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(165, 326, "Task · Checkpoint · 幂等", 19, { anchor: "middle" })}
${box(35, 470, 260, 130, { fill: C.greenSoft, stroke: C.green })}
${text(165, 520, "Object Store", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(165, 561, "Evidence · Artifact", 19, { anchor: "middle" })}
${box(1305, 235, 260, 130, { fill: C.purpleSoft, stroke: C.purple })}
${text(1435, 285, "Graph / Vector", 29, { anchor: "middle", weight: 720, color: C.purple })}
${text(1435, 326, "知识图 · 派生索引", 19, { anchor: "middle" })}
${box(1305, 470, 260, 130, { fill: C.amberSoft, stroke: C.amber })}
${text(1435, 520, "Queue / Cache", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(1435, 561, "异步 · 背压 · 临时状态", 19, { anchor: "middle" })}
${arrow(390, 330, 295, 300, { color: C.red })}
${arrow(390, 515, 295, 535, { color: C.green })}
${arrow(1210, 330, 1305, 300, { color: C.purple })}
${arrow(1210, 515, 1305, 535, { color: C.amber })}
${text(800, 704, "SoT 丢失不能靠相似索引找回；派生索引丢失则必须能够从版本化源重建。", 27, { anchor: "middle", color: C.red, weight: 700 })}
${text(800, 758, "实例重启 → 读取 Checkpoint → 校验版本 → 继续或安全停止", 25, { anchor: "middle", color: C.green, weight: 700 })}
`);

files["deployment-health-contract.svg"] = svg(`
${titleBlock("从进程启动到业务可用：五层健康合同", "每层回答不同问题，失败动作也不同；不能用一个 /health 端点含糊带过。")}
${box(65, 335, 240, 145, { fill: C.blueSoft, stroke: C.ink })}
${text(185, 385, "Process", 30, { anchor: "middle", weight: 720 })}
${text(185, 427, "入口命令是否存在", 20, { anchor: "middle" })}
${box(370, 335, 240, 145, { fill: C.amberSoft, stroke: C.amber })}
${text(490, 385, "Startup", 30, { anchor: "middle", weight: 720, color: C.amber })}
${text(490, 427, "配置与初始化完成", 20, { anchor: "middle" })}
${box(675, 335, 240, 145, { fill: C.redSoft, stroke: C.red })}
${text(795, 385, "Liveness", 30, { anchor: "middle", weight: 720, color: C.red })}
${text(795, 427, "内部是否还能前进", 20, { anchor: "middle" })}
${box(980, 335, 240, 145, { fill: C.greenSoft, stroke: C.green })}
${text(1100, 385, "Readiness", 30, { anchor: "middle", weight: 720, color: C.green })}
${text(1100, 427, "能否接收新流量", 20, { anchor: "middle" })}
${box(1285, 335, 250, 145, { fill: C.purpleSoft, stroke: C.purple })}
${text(1410, 385, "Synthetic", 30, { anchor: "middle", weight: 720, color: C.purple })}
${text(1410, 427, "关键业务路径是否成功", 19, { anchor: "middle" })}
${arrow(305, 407, 370, 407)}
${arrow(610, 407, 675, 407, { color: C.amber })}
${arrow(915, 407, 980, 407, { color: C.red })}
${arrow(1220, 407, 1285, 407, { color: C.green })}
${pill(380, 545, 220, "失败：终止启动", C.amber, C.paper, 22)}
${pill(685, 545, 220, "失败：谨慎重启", C.red, C.paper, 22)}
${pill(980, 545, 240, "失败：移出流量", C.green, C.paper, 22)}
${pill(1285, 545, 250, "失败：告警 / 停发布", C.purple, C.paper, 22)}
${text(800, 690, "Readiness：低成本检查硬依赖与版本；Synthetic：低频验证端到端业务不变量。", 27, { anchor: "middle", weight: 700 })}
${text(800, 755, "外部依赖短暂故障不应让 Liveness 制造重启风暴。", 29, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["observability-causal-chain.svg"] = svg(`
${titleBlock("一次 Agent 请求的可观测因果链", "Trace 连接因果路径，Metric 聚合趋势，Log 解释事件；Baggage 只传播受控低敏上下文。")}
${box(55, 280, 205, 135, { fill: C.amberSoft, stroke: C.amber })}
${text(157, 333, "Request", 29, { anchor: "middle", weight: 720, color: C.amber })}
${text(157, 373, "request_id · deadline", 18, { anchor: "middle" })}
${box(315, 280, 205, 135, { fill: C.blueSoft, stroke: C.ink })}
${text(417, 333, "Supervisor", 29, { anchor: "middle", weight: 720 })}
${text(417, 373, "plan · budget", 18, { anchor: "middle" })}
${box(575, 280, 205, 135, { fill: C.purpleSoft, stroke: C.purple })}
${text(677, 333, "Agent", 29, { anchor: "middle", weight: 720, color: C.purple })}
${text(677, 373, "model · prompt", 18, { anchor: "middle" })}
${box(835, 280, 205, 135, { fill: C.greenSoft, stroke: C.green })}
${text(937, 333, "Tool", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(937, 373, "operation · policy", 18, { anchor: "middle" })}
${box(1095, 280, 205, 135, { fill: C.redSoft, stroke: C.red })}
${text(1197, 333, "Queue", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(1197, 373, "attempt · idempotency", 18, { anchor: "middle" })}
${box(1355, 280, 190, 135, { fill: C.paper, stroke: C.ink })}
${text(1450, 333, "DB / API", 29, { anchor: "middle", weight: 720 })}
${text(1450, 373, "query · status", 18, { anchor: "middle" })}
${arrow(260, 347, 315, 347, { color: C.amber })}
${arrow(520, 347, 575, 347)}
${arrow(780, 347, 835, 347, { color: C.purple })}
${arrow(1040, 347, 1095, 347, { color: C.green })}
${arrow(1300, 347, 1355, 347, { color: C.red })}
${box(120, 505, 1360, 180, { fill: C.paper, stroke: C.ink, dash: "12 9" })}
${pill(175, 545, 220, "Trace · 单次因果", C.ink, C.blueSoft, 22)}
${pill(455, 545, 220, "Metric · 聚合趋势", C.green, C.greenSoft, 22)}
${pill(735, 545, 220, "Log · 离散事件", C.amber, C.amberSoft, 22)}
${pill(1015, 545, 260, "Baggage · 传播上下文", C.purple, C.purpleSoft, 22)}
${text(800, 655, "完整内容进入受控 Artifact；遥测只保存稳定属性、哈希和不可变引用。", 24, { anchor: "middle", color: C.muted })}
${text(800, 770, "禁止：Secret · 原始 Prompt · PII · request_id 作为 Metric Label", 29, { anchor: "middle", color: C.red, weight: 700 })}
`);

files["reliability-envelope.svg"] = svg(`
${titleBlock("可靠性保护层：限制等待、放大与故障扩散", "每一层解决不同问题；最危险的反模式是多层无界重试和无限排队。")}
${box(75, 225, 1450, 500, { fill: C.redSoft, stroke: C.red, width: 4 })}
${text(115, 275, "Deadline / 全局预算", 28, { weight: 760, color: C.red })}
${box(145, 305, 1310, 360, { fill: C.amberSoft, stroke: C.amber, width: 4 })}
${text(185, 355, "Timeout + 有界 Retry / Jitter", 27, { weight: 740, color: C.amber })}
${box(215, 385, 1170, 220, { fill: C.blueSoft, stroke: C.ink, width: 4 })}
${text(255, 435, "Circuit Breaker + Bulkhead + Rate Limit", 27, { weight: 740 })}
${box(420, 470, 760, 90, { fill: C.greenSoft, stroke: C.green, width: 4 })}
${text(800, 525, "Queue / DLQ / Backpressure / Idempotency", 28, { anchor: "middle", weight: 760, color: C.green })}
${pill(80, 760, 300, "入口：绝对截止时间", C.red, C.paper, 22)}
${arrow(380, 786, 520, 786, { color: C.red })}
${pill(520, 760, 270, "单层负责重试", C.amber, C.paper, 22)}
${arrow(790, 786, 930, 786, { color: C.amber })}
${pill(930, 760, 300, "过载：拒绝或降级", C.green, C.paper, 22)}
${arrow(1230, 786, 1370, 786, { color: C.green })}
${pill(1370, 760, 150, "可证明", C.ink, C.paper, 22)}
${text(800, 690, "错误分类决定：重试、快速失败、降级、进 DLQ，还是人工升级。", 25, { anchor: "middle", weight: 700 })}
`);

files["backup-restore-loop.svg"] = svg(`
${titleBlock("备份只有在恢复与业务不变量验证后才成立", "RPO 约束恢复点，RTO 约束恢复时间；成功文件不等于成功恢复。")}
${box(60, 315, 210, 135, { fill: C.amberSoft, stroke: C.amber })}
${text(165, 367, "Backup", 30, { anchor: "middle", weight: 720, color: C.amber })}
${text(165, 408, "快照 · WAL · 版本", 19, { anchor: "middle" })}
${box(325, 315, 210, 135, { fill: C.blueSoft, stroke: C.ink })}
${text(430, 367, "Restore Point", 29, { anchor: "middle", weight: 720 })}
${text(430, 408, "满足 RPO", 20, { anchor: "middle" })}
${box(590, 315, 210, 135, { fill: C.purpleSoft, stroke: C.purple })}
${text(695, 367, "Version Gate", 29, { anchor: "middle", weight: 720, color: C.purple })}
${text(695, 408, "App · Schema · Contract", 19, { anchor: "middle" })}
${box(855, 315, 210, 135, { fill: C.greenSoft, stroke: C.green })}
${text(960, 367, "Invariants", 29, { anchor: "middle", weight: 720, color: C.green })}
${text(960, 408, "幂等 · Hash · 关系", 19, { anchor: "middle" })}
${box(1120, 315, 210, 135, { fill: C.redSoft, stroke: C.red })}
${text(1225, 367, "Synthetic", 29, { anchor: "middle", weight: 720, color: C.red })}
${text(1225, 408, "关键业务流程", 19, { anchor: "middle" })}
${box(1385, 315, 160, 135, { fill: C.paper, stroke: C.ink })}
${text(1465, 367, "Evidence", 28, { anchor: "middle", weight: 720 })}
${text(1465, 408, "满足 RTO", 19, { anchor: "middle" })}
${arrow(270, 382, 325, 382, { color: C.amber })}
${arrow(535, 382, 590, 382)}
${arrow(800, 382, 855, 382, { color: C.purple })}
${arrow(1065, 382, 1120, 382, { color: C.green })}
${arrow(1330, 382, 1385, 382, { color: C.red })}
${arrow(1465, 450, 165, 610, { color: C.ink, dash: "12 9" })}
${box(270, 575, 1060, 105, { fill: C.paper, stroke: C.ink, dash: "12 9", radius: 40 })}
${text(800, 620, "Drill Record", 28, { anchor: "middle", weight: 740 })}
${text(800, 655, "恢复点 · 耗时 · 版本集合 · 不变量 · 异常 · 审批", 22, { anchor: "middle", color: C.muted })}
${text(800, 765, "数据库可连接只是开始；任务不重放、Artifact 对齐、索引同源、权限仍生效才是完成。", 26, { anchor: "middle", color: C.red, weight: 700 })}
`);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content);
}

console.log(`Generated ${Object.keys(files).length} SVG files in ${outDir}`);
