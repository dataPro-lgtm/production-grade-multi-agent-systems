# 术语表

| 术语 | 本书中的含义 |
|---|---|
| Agent | 围绕目标观察状态、选择并执行动作、根据结果更新状态并决定下一步的系统 |
| Agentic Workflow | 在确定性编排中引入局部动态判断的工作流 |
| Bounded Autonomy | 被候选动作、权限、预算、状态机和评测门禁限制的自主性 |
| Context Contract | 对进入模型上下文的信息类型、来源、权限、生命周期和可信度的约定 |
| Handoff | 一个 Agent 将任务控制权和必要状态显式移交给另一个 Agent |
| Supervisor | 负责路由、委托、汇总或控制多个责任单元的编排角色 |
| Delegation Contract | 对子任务目标、验收标准、范围、工具、预算、截止时间和升级方式的约定 |
| Result Contract | 对 Agent 任务状态、结论、证据引用、缺失信息、副作用和下一步建议的约定 |
| Join Contract | 对并行任务等待集合、完成阈值、超时、冲突与晚到结果的聚合约定 |
| Artifact | Agent 或工具产生的可引用产物；生产系统中宜使用不可变版本和内容哈希 |
| A2A | Agent2Agent Protocol，独立 Agent 之间发现能力、交换消息、跟踪任务和交付产物的互操作协议 |
| AgentCard | A2A 中描述 Agent 身份、接口、能力、技能与安全方案的发现对象 |
| Tool Call | 模型生成的结构化动作提议；需要经过解析、校验和授权后才能执行 |
| Tool Contract | 工具名称、用途、输入 Schema、权限、错误、幂等和副作用的完整契约 |
| State | Agent 跨步骤共享的结构化运行数据，包括任务、证据、控制和关联信息 |
| Checkpoint | 在状态图步骤边界保存的状态快照，用于暂停、恢复、回放和故障分析 |
| Idempotency | 同一业务动作被重复请求时，不产生额外副作用或返回同一结果的性质 |
| MCP | Model Context Protocol，AI Host 与外部 Server 发现、读取和调用能力的标准协议 |
| Golden Dataset | 用于持续评测和回归比较的代表性任务与标准证据集合 |
| Trace | 一次任务中计划、路由、工具、状态和输出的可观测执行轨迹 |
| ADR | Architecture Decision Record，记录背景、约束、选项、决策和验证方式 |
