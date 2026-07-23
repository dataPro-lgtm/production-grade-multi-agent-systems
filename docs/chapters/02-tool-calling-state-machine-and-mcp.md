---
title: 第 02 章 让 Agent 安全地行动
description: 从工具调用协议、ReAct 状态机、Checkpoint 与幂等，到 MCP 边界和可观测执行
---

# 第 02 章：让 Agent 安全地行动——工具调用、状态机与 MCP

上一章把 AI Agent 定义为一个持续运行的行动闭环：系统围绕目标观察环境、选择动作、执行动作、更新状态，直到完成、失败、拒绝或转交人工。

这个定义听起来并不复杂，真正实现时却会立刻遇到一组棘手的问题：

- 模型输出一个工具名称和一组参数，是否意味着工具已经被调用？
- 谁验证参数、检查权限并承担执行后果？
- 工具失败后，系统应该重试、换计划、请求澄清，还是立即停止？
- 运行到一半进程崩溃，恢复后怎样避免重复执行副作用？
- 工具迁移到 MCP Server 以后，授权和审计责任是否也随之迁移？
- 最终答案不正确时，怎样定位错误发生在模型选择、策略门禁、工具执行还是状态更新？

如果这些问题没有明确答案，所谓 Agent 通常只是一个能够生成工具参数的模型，被一个脆弱的 `while` 循环包裹起来。

本章继续使用第一章的退款率分析场景。我们的目标不是展示一个“会调用工具”的演示程序，而是建立一条从模型动作提议到安全执行、从状态更新到故障恢复、从本地工具到 MCP 的完整工程链路。

贯穿本章的核心原则只有一句：

> **模型负责提出可能的下一步；状态机负责决定系统允许怎样前进；工具层负责安全地读取或改变世界。**

!!! note "稳定原理与当前接口"
    Tool Contract、状态转换、权限、幂等、恢复和可观测属于相对稳定的工程原理。`create_agent`、`ToolNode`、`StateGraph` 和 Checkpointer 是当前 LangChain 1.x / LangGraph 1.x 参考实现。框架接口会变化，生产项目应固定依赖版本并用 CI 持续验证示例。

## 1. 模型没有手：Tool Call 只是动作提议

假设用户提出：

> 分析 2026 年 7 月华东地区付费客户退款率上涨的原因。

模型可能返回如下结构：

```json
{
  "id": "call_01",
  "name": "query_refund_metric",
  "arguments": {
    "period": "2026-07",
    "region": "华东",
    "customer_type": "paid"
  }
}
```

这段 JSON 不是查询结果，也不是执行许可。它只是模型根据当前上下文提出的一份**动作申请**。

模型不知道调用者是否有权访问这项指标，不知道当前租户是否允许查询华东数据，也不知道数据库是否处于维护窗口。即使参数满足 JSON Schema，也不代表它符合业务规则。真正的执行发生在模型之外，由 Agent 运行时完成。

### 1.1 一次完整工具调用的责任链

![Tool Calling 的受控执行责任链](../assets/images/chapter-02/tool-call-control-plane.png)

*图 2-1　模型只产生动作提议；运行时负责解析、授权、执行、回写和审计。*

一条完整链路至少包含八个步骤：

1. **能力暴露**：运行时向模型提供当前允许看到的工具名称、描述和参数 Schema；
2. **动作选择**：模型选择直接回答，或生成一个或多个 Tool Call；
3. **协议解析**：运行时确认工具存在、版本正确、请求结构完整；
4. **参数校验**：Schema 和业务规则共同验证格式、枚举、范围与组合约束；
5. **策略授权**：根据调用者身份、租户、数据权限、风险、预算和审批状态做出允许或拒绝；
6. **确定性执行**：执行器调用本地函数、API、数据库或 MCP Server；
7. **结果封装**：结果被包装成结构化 Tool Message，并关联原始 `tool_call_id`；
8. **状态推进**：运行时保存证据、错误、预算和 Trace，再决定是否将结果交给模型继续推理。

这条责任链中，只有第二步主要由模型决定。其余步骤应由可测试的确定性系统承担。

### 1.2 为什么 `tool_call_id` 不能省略

一个模型响应可能同时提出多个只读查询：

```text
call_region  → query_refund_by_region
call_product → query_refund_by_product
```

当结果异步返回时，系统必须知道每份结果对应哪个请求。如果只按返回顺序拼接消息，渠道数据可能被误认为产品数据，超时错误也可能挂到错误的动作上。

因此，一次工具交互至少要保存这些关联字段：

| 字段 | 作用 | 缺失后的风险 |
|---|---|---|
| `tool_call_id` | 关联动作提议与执行结果 | 并行结果错配，因果链断裂 |
| `tool_name` 与版本 | 确认实际执行能力 | 同名工具行为漂移 |
| 规范化参数摘要 | 支持审计、去重和复现 | 无法判断执行范围 |
| 状态 | 成功、失败、拒绝、等待审批 | 运行时靠自然语言猜测 |
| 证据或错误码 | 支持下一步路由 | 模型只能从模糊文本推断 |
| 延迟与资源消耗 | 支持 SLO 和预算控制 | 无法发现慢调用与成本膨胀 |

`tool_call_id` 解决的是一次模型交互中的关联问题；`trace_id` 关联一次端到端请求；`thread_id` 关联跨轮对话或任务状态。三个 ID 的作用不同，不应互相替代。

## 2. Tool Contract：能力边界的最小单元

Prompt 可以影响模型怎样选择工具，但真正决定工具能否被安全使用的，是 Tool Contract。

一个生产工具不是“一个能被调用的 Python 函数”，而是一份由模型、运行时、业务服务、安全系统和运维团队共同依赖的契约。

### 2.1 工具契约的九个问题

| 契约部分 | 必须回答的问题 |
|---|---|
| 名称与版本 | 是否稳定、唯一，升级后是否兼容？ |
| 使用条件 | 什么时候应该使用，什么时候禁止使用？ |
| 输入 Schema | 类型、单位、枚举、范围和必填字段是什么？ |
| 业务约束 | 哪些字段组合虽然格式正确，业务上仍然非法？ |
| 输出 Schema | 事实、来源、新鲜度、质量和错误怎样表达？ |
| 权限 | 哪些身份、租户和作用域可以调用？ |
| 副作用与幂等 | 是只读、可逆还是不可逆？重复调用会怎样？ |
| 超时与重试 | 哪类失败可重试，最多几次？ |
| 审计与所有权 | 记录什么，由谁维护，SLO 是什么？ |

工具描述也属于契约。下面两种写法都能运行，但它们给模型提供的信息质量完全不同。

| 类型 | 描述 |
|---|---|
| 模糊描述 | 查询退款信息。 |
| 可执行描述 | 读取指定月份、地区和客户类型的聚合退款指标。仅用于分析，不返回客户级记录，不得用于修改订单或退款状态。`period` 必须为 `YYYY-MM`。 |

好描述不是营销文案。它应该同时表达能力范围、使用条件和禁止事项，尽量减少模型在工具选择阶段的歧义。

### 2.2 Schema 是第一道防线，不是全部防线

可以使用 Pydantic 将工具参数约束为有限空间：

```python
from enum import Enum

from pydantic import BaseModel, Field


class CustomerType(str, Enum):
    paid = "paid"
    trial = "trial"


class RefundMetricInput(BaseModel):
    period: str = Field(pattern=r"^\d{4}-\d{2}$")
    region: str = Field(min_length=2, max_length=20)
    customer_type: CustomerType
```

这个 Schema 可以拒绝错误月份格式和未知客户类型，却无法回答以下问题：

- 当前用户能否查看华东地区数据；
- 该租户是否订阅了退款分析能力；
- 查询是否超过当日扫描预算；
- 时间窗口是否触发合规限制；
- 这个只读工具是否正在使用已经下线的数据版本。

因此，参数检查至少分成三层：

```text
结构校验：JSON / Pydantic / JSON Schema
    ↓
业务校验：字段组合、状态迁移、指标语义
    ↓
策略校验：身份、租户、权限、风险、预算、审批
```

把某个布尔字段默认设为 `false`，不等于建立了安全控制。模型仍然可能显式传入 `true`。禁止访问个人数据必须由策略层强制执行，而不是依赖默认值或 Prompt。

### 2.3 输出要面向证据，而不是只面向自然语言

如果工具只返回“退款率是 8.3%”，模型无法知道这个数字的分子、分母、过滤条件、来源和新鲜度。

更有用的工具输出是一个证据对象：

```json
{
  "evidence_id": "ev_refund_2026_07_east_paid",
  "metric": "refund_rate",
  "value": 0.083,
  "numerator": 830,
  "denominator": 10000,
  "filters": {
    "period": "2026-07",
    "region": "华东",
    "customer_type": "paid"
  },
  "source": "analytics.refund_daily",
  "freshness_at": "2026-07-22T08:00:00Z",
  "quality_status": "passed",
  "tool_call_id": "call_01"
}
```

最终答案中的每项定量结论都应该引用一个或多个 `evidence_id`。这样，即使语言表达发生变化，系统仍然可以验证结论是否建立在正确证据上。

### 2.4 工具越多，越需要动态能力过滤

将几十个工具全部暴露给模型，会增加上下文长度和选择错误。运行时可以根据以下条件先筛出当前候选集合：

| 过滤维度 | 示例 |
|---|---|
| 身份 | 访客不暴露导出与客户明细工具 |
| 领域 | 退款分析不暴露库存写入工具 |
| 会话阶段 | 证据不足时不暴露报告发布工具 |
| 风险 | 未进入审批状态时隐藏高风险写工具 |
| 协议能力 | 只暴露 MCP Server 已协商且当前可用的能力 |

动态工具选择不是为了让模型“更聪明”，而是缩小动作空间。动作空间越小，权限越清楚，评测和审计也越容易。

## 3. ReAct 的工程本质是状态转换

ReAct 常被展开为 Reason + Act，但“让模型先思考再行动”并不足以构成生产运行机制。

从工程角度看，ReAct 是一个显式状态循环：

1. 模型节点读取允许进入上下文的状态；
2. 模型产生最终回答、工具调用、澄清请求或审批请求；
3. 路由器根据结构化结果和控制字段选择下一条边；
4. 工具节点执行获准动作并写回结果；
5. 新状态再次进入模型节点，或进入终止状态。

![ReAct 的显式状态机](../assets/images/chapter-02/react-state-machine.png)

*图 2-2　ReAct 不应是无限循环，而应是具有合法状态、条件边和终止状态的运行图。*

### 3.1 一轮模型决策的五种合法结果

| 模型输出 | 运行时动作 | 状态 |
|---|---|---|
| 最终回答 | 进入证据与输出校验 | 结束或返工 |
| 工具调用 | 经过策略门禁后执行 | 继续 |
| 请求澄清 | 保存原因并向用户提问 | 暂停 |
| 请求审批 | 创建审批记录并中断 | 暂停 |
| 无法完成 | 返回结构化失败原因 | 结束 |

不要把所有非工具输出都当作“最终成功”。一句“我无法访问数据”可能是合法拒绝，也可能是工具选择失败。终止状态需要表达原因。

### 3.2 停止条件必须由运行时强制

模型可能知道“不要重复调用同一工具”，但 Prompt 中的提醒不能替代控制逻辑。运行时至少需要检查：

- 是否已经满足成功标准；
- 是否达到最大模型调用或最大工具步数；
- Token、费用、时间或数据扫描预算是否耗尽；
- 是否连续产生相同工具和相同参数；
- 是否触发权限拒绝、安全阻断或人工审批；
- 是否出现不可重试错误；
- 是否长时间没有新增证据。

“没有新的 Tool Call”只是停止条件之一，不代表结果一定正确。

### 3.3 用 LangGraph 显式表达循环

下面的简化状态只展示核心字段：

```python
from typing import Annotated, Literal
from typing_extensions import TypedDict

from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    goal: str
    status: Literal[
        "running",
        "waiting_user",
        "waiting_approval",
        "completed",
        "failed",
    ]
    evidence: list[dict]
    step_count: int
    max_steps: int
    last_error: dict | None
```

节点接收当前状态，但只返回自己负责的增量更新：

```python
def call_model(state: AgentState) -> dict:
    response = model_with_tools.invoke(state["messages"])
    return {
        "messages": [response],
        "step_count": state["step_count"] + 1,
    }
```

条件路由由程序检查，而不是把全部责任交给模型：

```python
from langgraph.graph import END


def route_after_model(state: AgentState):
    if state["step_count"] >= state["max_steps"]:
        return END

    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "tools"

    return END
```

然后将模型节点、工具节点和条件边组装为图：

```python
from langgraph.graph import START, StateGraph
from langgraph.prebuilt import ToolNode


builder = StateGraph(AgentState)
builder.add_node("model", call_model)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "model")
builder.add_conditional_edges("model", route_after_model)
builder.add_edge("tools", "model")

graph = builder.compile()
```

这个例子仍然省略了策略门禁、错误分类和审批分支。生产实现可以在 `ToolNode` 外围增加 Middleware，也可以使用自定义工具执行节点，把“解析—授权—执行—审计”明确展开。

## 4. State 是 Agent 的运行契约

许多原型把 Agent 状态等同于消息列表。这在最小聊天机器人中可行，但无法支撑可恢复、可审计的行动系统。

![Agent State 的五层运行契约](../assets/images/chapter-02/state-contract.png)

*图 2-3　消息只是状态的一部分；任务、证据、控制和关联信息必须结构化保存。*

一个可运营的 State 通常包含五类信息：

| 状态层 | 典型内容 | 主要使用者 |
|---|---|---|
| Messages | 用户输入、模型响应、Tool Message | 模型上下文构建器 |
| Task | 目标、计划、当前步骤、任务状态 | 路由器与产品界面 |
| Evidence | 事实、来源、新鲜度、质量状态 | 模型、验证器与评测 |
| Control | 预算、重试、风险、权限、审批 | 运行时与策略引擎 |
| Trace | `thread_id`、`trace_id`、`tool_call_id`、版本 | 可观测与审计系统 |

把预算写在自然语言消息中，会迫使程序重新解析文本；把权限结果写进 Prompt，会使模型有机会覆盖它；把证据原文无限追加到消息历史，会造成上下文膨胀和间接 Prompt Injection。

结构化状态的目的，就是把**控制平面**和**模型上下文**分开。完整 State 可以持久化，但只有必要字段经过过滤后进入模型。

### 4.1 全量 State 与增量 Update

节点通常可以读取完整 State，却不应该重写完整 State。

```python
def record_policy_denial(state: AgentState, reason: str) -> dict:
    return {
        "status": "failed",
        "last_error": {
            "code": "PERMISSION_DENIED",
            "reason": reason,
        },
    }
```

增量更新让字段所有权更清楚，也减少并行节点互相覆盖。

对于消息、证据列表或并行结果，需要明确 Reducer 的合并语义。没有 Reducer 的字段通常采用覆盖语义；两个节点同时更新同一字段时，系统可能产生冲突或非预期结果。

### 4.2 State、Memory 与 Knowledge 再次划清边界

| 类型 | 生命周期 | 典型内容 | 合适载体 |
|---|---|---|---|
| Thread State | 一次任务或对话 | 步骤、错误、审批、短期消息 | Checkpointer |
| Long-term Memory | 跨 Thread | 稳定偏好、经过筛选的经验 | Store |
| Domain Knowledge | 跨用户共享 | 指标、政策、实体关系 | 数据库、知识图谱、向量库 |
| Audit / Trace | 合规与运维周期 | 身份、动作、参数摘要、版本 | Trace 与审计存储 |

Checkpoint 让同一个 Thread 恢复，不意味着自动获得跨 Thread 长期记忆。长期记忆也不应该成为另一个不受治理的聊天记录仓库。

## 5. Checkpoint 解决恢复，幂等解决重复副作用

状态图如果只存在进程内存中，进程退出后就失去了继续执行的依据。Checkpointer 会在图的步骤边界保存 StateSnapshot，并按 `thread_id` 组织历史状态。

它支持：

- 多轮对话继续使用同一 Thread；
- 人工审批时暂停，批准后从原位置继续；
- 进程故障后从最近 Checkpoint 恢复；
- 回放历史步骤或从旧快照分叉；
- 事故分析时检查每一步状态和下一节点。

```python
from langgraph.checkpoint.memory import InMemorySaver


checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {
    "configurable": {
        "thread_id": "refund-case-001",
    }
}

result = graph.invoke(initial_state, config=config)
```

`InMemorySaver` 适合测试和本地实验。生产环境通常使用 PostgreSQL、Redis、MongoDB 或其他持久化实现，并明确租户隔离、加密、保留周期和 Schema 迁移。

### 5.1 最危险的故障窗口

![Checkpoint 与外部副作用之间的重复执行窗口](../assets/images/chapter-02/checkpoint-idempotency.png)

*图 2-4　外部动作成功而新 Checkpoint 尚未提交时发生崩溃，恢复后可能重复执行同一动作。*

考虑一个写工具：

```text
1. 读取 CP-2
2. 调用 update_refund_case
3. 外部系统更新成功
4. 进程崩溃
5. CP-3 尚未保存
6. 系统从 CP-2 恢复
7. 再次调用 update_refund_case
```

Checkpoint 只能告诉系统“从哪里继续”，不能证明外部世界“已经做过什么”。这就是状态持久化与副作用一致性之间的缝隙。

### 5.2 不要承诺虚假的 exactly-once

跨模型、Agent 运行时、消息系统和外部 API 的 exactly-once 很难成立。更现实的设计是：

1. 为动作生成稳定的 `idempotency_key`；
2. 在执行账本中记录 `PENDING`、`COMPLETED` 或 `FAILED`；
3. 工具服务按幂等键返回已有结果，而不是重复产生副作用；
4. 数据库写入使用唯一约束或事务保护；
5. 不可逆高风险动作进入人工审批；
6. 无法幂等的动作提供补偿或人工处置流程。

只读查询也需要关注重复执行。重复查询可能造成成本膨胀、速率限制或数据快照不一致，只是风险通常低于写操作。

## 6. MCP：标准化连接，不替代业务边界

当工具只服务一个进程时，本地函数调用最简单。随着系统增长，工具可能由不同团队维护、使用不同依赖、需要独立部署，或要被多个 AI 应用复用。此时需要稳定的远程能力边界。

Model Context Protocol（MCP）为 AI 应用与外部能力之间提供标准化协议。它定义连接生命周期、能力协商、发现和调用方式，但不规定 Agent 如何规划，也不会自动替代业务权限系统。

![MCP 的 Host、Client、Server 与双重安全边界](../assets/images/chapter-02/mcp-trust-boundaries.png)

*图 2-5　Host 为每个 Server 管理独立 Client 连接；协议能力与业务授权分别在 Host 和 Server 侧受控。*

### 6.1 Host、Client 与 Server

| 参与方 | 主要职责 | 不应误解为 |
|---|---|---|
| Host | 承载用户体验、模型、Agent 循环、同意与安全策略 | 远程工具实现本身 |
| Client | 维护与一个 Server 的连接、协商能力、路由协议消息 | 独立业务 Agent |
| Server | 声明并提供聚焦的 Tools、Resources、Prompts 等能力 | 可以看到全部对话的中心控制器 |

一个 Host 通常为每个 Server 创建一个 Client。这样可以隔离连接状态和 Server 上下文，也便于 Host 控制哪些信息可以发给哪个 Server。

### 6.2 Tools、Resources 与 Prompts

| MCP 原语 | 含义 | 典型用途 |
|---|---|---|
| Tools | 可被模型选择并调用的动作 | 查询数据、创建工单、执行计算 |
| Resources | 由应用读取和管理的上下文对象 | 文件、Schema、知识条目 |
| Prompts | Server 提供的可复用交互模板 | 标准分析流程、操作向导 |

不要把所有能力都设计成 Tool。只读的静态 Schema 可能更适合 Resource；需要用户明确选择的标准流程可能更适合 Prompt。

### 6.3 连接初始化不是简单“连上就用”

当前 MCP 规范使用日期形式的协议版本。一次连接首先完成初始化：

1. Client 发送支持的协议版本、Client Capabilities 和实现信息；
2. Server 返回协商后的版本、Server Capabilities 和实现信息；
3. Client 判断版本与必需能力是否兼容；
4. Client 发送 `notifications/initialized`；
5. 双方只使用已经成功协商的能力。

本书以当前稳定版本 `2025-11-25` 为参考。应用不应把协议版本硬编码成“永远兼容”，而应在初始化阶段显式处理版本不匹配和能力缺失。

### 6.4 MCP 没有替你完成授权

MCP 可以承载远程认证和授权流程，也为 Tools 提供输入、输出 Schema，但生产系统仍需回答：

- 哪个用户和租户正在发起调用；
- Token 是否只允许访问当前 Server 和所需 Scope；
- 具体 Tool 是否允许该身份执行；
- 参数是否满足行级、字段级和业务状态约束；
- 高风险动作是否得到用户确认或人工批准；
- Tool 输出是否包含不可信指令或敏感数据；
- Host 是否把过多对话上下文泄露给 Server。

Host 负责决定“当前上下文中暴露哪些能力”，Server 负责在资源侧再次执行身份、Scope 和业务授权。两端都不能假设另一端已经完成全部安全工作。

### 6.5 本地工具、API 与 MCP 怎样选择

| 场景 | 优先选择 |
|---|---|
| 单进程、工具只服务一个应用、追求最低延迟 | 本地函数 |
| 已经存在稳定业务服务 | 直接 API，必要时增加 MCP 适配层 |
| 工具由独立团队维护并被多个 AI Host 复用 | MCP Server |
| 需要能力发现、版本协商和统一 AI 工具接口 | MCP Server |
| 高频细粒度调用，对网络开销非常敏感 | 本地函数或批量 API |

不要为了“使用 MCP”而把每个函数都变成远程服务。协议边界只有在复用、所有权、部署或安全隔离收益大于网络与运维成本时才有价值。

## 7. 先分类错误，再决定是否重试

“失败就重试三次”不是可靠性策略。它会让权限错误浪费三倍延迟，让非幂等写入产生多次副作用，也会在依赖过载时继续施压。

| 错误类型 | 示例 | 默认处理 |
|---|---|---|
| 瞬时错误 | 超时、429、临时连接失败 | 有上限的退避、抖动，遵守 `Retry-After` |
| 参数错误 | 月份格式错误、枚举非法 | 本地修正或请求用户澄清 |
| 业务错误 | 指标不存在、数据为空 | 换计划或如实结束 |
| 权限错误 | 无权访问客户明细 | 立即停止并审计 |
| 安全错误 | Prompt Injection、DLP 命中 | 阻断、隔离、告警，不自动重试 |
| 永久依赖错误 | 工具下线、Schema 不兼容 | 熔断、降级或切换兼容版本 |

只有被明确分类为瞬时错误的失败，才进入指数退避：

```python
delay = min(base_delay * (2 ** retry_count), max_delay)
delay = delay + random.uniform(0, jitter)
```

重试还必须满足三个前提：

1. 当前动作可以安全重复，或已经具备幂等保护；
2. 全局 Deadline 和重试预算仍未耗尽；
3. 重试确实有机会改变结果，而不是重复同一错误。

### 7.1 Action Fingerprint 与循环检测

可以对规范化后的工具名、版本和参数计算指纹：

```text
fingerprint = hash(tool_name + tool_version + canonical_arguments)
```

运行时维护最近若干动作、结果状态和新增证据量。当相同指纹连续出现时，不应只依赖模型自行停止：

- 若是合法分页，指纹中应包含页游标；
- 若前次为瞬时失败，可在预算内重试；
- 若参数和结果完全相同且没有新增证据，应标记 `LOOP_DETECTED`；
- 若模型声称需要重复调用，应要求它说明新增信息来自哪里；
- 超过阈值后，终止或转交人工。

## 8. 可观测：记录答案是远远不够的

Agent 的最终回答是运行结果，不是运行证据。要诊断一个错误答案，必须能沿链路回答：

- 模型看到了哪些工具；
- 为什么选择这个工具；
- 生成了什么参数；
- 哪条策略允许或拒绝了动作；
- 工具实际执行了哪个版本；
- 返回了什么证据或错误；
- 路由器为什么继续、暂停或结束；
- 最终结论引用了哪些证据。

![从 Thread 到 Trace、Run 和 Evidence 的可观测链路](../assets/images/chapter-02/observable-execution.png)

*图 2-6　一次用户请求形成一个 Trace，内部包含模型、策略、工具和验证 Run，并通过稳定 ID 关联状态与证据。*

### 8.1 最小关联模型

```text
Thread
└── Trace：一次用户目标
    ├── Model Run：动作选择
    ├── Policy Run：授权与风险判断
    ├── Tool Run：参数、结果与延迟
    ├── Model Run：证据解释
    └── Validation Run：证据覆盖与输出校验
```

每个 Trace 至少附带：

- `thread_id`、`trace_id` 和调用者角色；
- 模型、Prompt、工具和数据集版本；
- Tool Call 与 Tool Message 的关联 ID；
- 参数与结果的脱敏摘要；
- Token、费用、延迟、重试和错误分类；
- 证据 ID、质量状态和最终引用关系。

可观测不等于把完整 Prompt、访问令牌和数据库结果全部上传。Trace 仍需字段级脱敏、采样、访问控制、保留周期和删除机制。

### 8.2 第二章就应该建立的测试

| 测试层 | 必须验证 |
|---|---|
| Tool Unit Test | 参数、权限、输出 Schema、超时和错误分类 |
| Policy Test | 不同身份、租户、风险和审批状态 |
| Router Test | 什么状态调用工具、澄清、暂停或结束 |
| State Test | Reducer、步数、预算和状态转换 |
| Loop Test | 最大步数、重复动作和无进展终止 |
| Persistence Test | 同一 Thread 恢复，不同 Thread 隔离 |
| Idempotency Test | 崩溃恢复不会重复副作用 |
| Trace Test | 模型、策略、工具、证据具有稳定关联 |

对于退款分析案例，一个最小场景集应覆盖：

- 总体退款率无异常，查询总体后直接结束；
- 总体上涨且渠道集中，继续按渠道下钻；
- 渠道证据不足，转向产品维度；
- 工具超时一次，在预算内重试成功；
- 月份格式错误，在执行前被拒绝；
- 模型被诱导访问客户明细，策略层阻断；
- 相同动作连续重复，运行时标记循环并结束；
- 进程在工具成功后崩溃，恢复时通过幂等键复用结果。

## 9. 选择合适的实现抽象

理解底层责任链之后，才适合选择框架抽象。

### 9.1 标准工具循环：`create_agent`

当任务接近标准 ReAct 循环时，可以使用 LangChain 当前的预构建 Agent：

```python
import os

from langchain.agents import create_agent


agent = create_agent(
    model=os.environ.get("MODEL_ID", "openai:gpt-5.4"),
    tools=tools,
    system_prompt=(
        "You are a read-only refund analytics agent. "
        "Use tool evidence and never invent metrics."
    ),
)
```

预构建不等于免除设计责任。Tool Contract、动态工具过滤、授权、预算、Checkpoint、幂等和评测仍然需要配置或通过 Middleware 扩展。

### 9.2 自定义路径：`ToolNode + StateGraph`

当系统需要独立审批节点、复杂状态、多个停止原因、证据验证或定制预算时，显式 `StateGraph` 更合适。代价是需要维护更多节点、边和测试。

### 9.3 强监管或复杂事务：自定义执行器

对于严格事务、不可逆高风险动作或框架无关运行时，可以将模型降级为“动作候选生成器”，由自定义状态机和执行平台控制全过程。

| 选择 | 适合场景 | 主要代价 |
|---|---|---|
| `create_agent` | 标准工具循环、快速构建、Middleware 足够 | 路径定制空间较小 |
| `ToolNode + StateGraph` | 自定义状态、审批、预算和复杂分支 | 实现与测试更多 |
| 自定义执行器 | 强监管、复杂事务、框架无关 | 维护成本最高 |

正确的选择不是“抽象越低越专业”，而是使用能够清楚表达当前控制需求的最低复杂度实现。

## 10. 本章结论

工具调用是 Agent 从语言系统走向行动系统的关键一步，也是在这里，模型的不确定性第一次真正触碰外部世界。

模型可以提出一个结构正确的 Tool Call，却不能为自己授予权限；Schema 可以限制参数形状，却不能代替业务规则；状态机可以保存和恢复进度，却不能自动保证外部副作用只发生一次；MCP 可以标准化能力发现和调用，却不能自动解决用户身份、租户隔离和业务授权。

因此，一套生产级工具运行机制必须同时具备：

1. 清晰的 Tool Contract；
2. 模型之外的策略门禁与确定性执行；
3. 显式的状态、条件路由和终止原因；
4. Checkpoint、执行账本与幂等保护；
5. MCP Host 与 Server 两端的安全边界；
6. 分类后的重试、循环检测和全局预算；
7. 能够关联模型、策略、工具、证据和答案的 Trace；
8. 覆盖正常、失败、越权和恢复路径的自动化测试。

可以把本章压缩为三条工程判断：

> **Tool Call 是动作提议，不是执行许可。**

> **Checkpoint 解决“从哪里继续”，幂等解决“继续时会不会重复做坏事”。**

> **MCP 解决互操作，不会替你完成业务授权。**

下一章将从一个稳定的单 Agent 出发，讨论什么时候继续保持工作流或单 Agent，什么时候才有足够理由引入多个独立决策单元。

## 延伸阅读

- Murali Kashaboina. *Practical Multi-Agent AI Systems: How to Architect, Build, and Scale Next-Generation AI Systems That Work in the Real World*. Wiley, 2026.
- [LangChain：Agents](https://docs.langchain.com/oss/python/langchain/agents)
- [LangChain：Tools](https://docs.langchain.com/oss/python/langchain/tools)
- [LangGraph：Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [Model Context Protocol：Architecture](https://modelcontextprotocol.io/docs/learn/architecture)
- [Model Context Protocol：Versioning](https://modelcontextprotocol.io/docs/learn/versioning)
- [MCP Specification 2025-11-25：Lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)
- [MCP Specification 2025-11-25：Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [OpenAI：Structured Outputs 与 Function Calling](https://openai.com/index/introducing-structured-outputs-in-the-api/)
