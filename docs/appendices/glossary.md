# 术语表

| 术语 | 本书中的含义 |
|---|---|
| Agent | 围绕目标观察状态、选择并执行动作、根据结果更新状态并决定下一步的系统 |
| Agentic Workflow | 在确定性编排中引入局部动态判断的工作流 |
| Bounded Autonomy | 被候选动作、权限、预算、状态机和评测门禁限制的自主性 |
| Context Contract | 对进入模型上下文的信息类型、来源、权限、生命周期和可信度的约定 |
| Context Engineering | 构建动态系统，在正确时机以正确格式向模型和工具提供完成任务所需的信息、能力与约束 |
| Context Pack | 一次模型调用实际获得的类型化输入合同，包含目标、状态、证据、工具、预算、遗漏和版本信息 |
| Evidence | 绑定来源、版本、Locator、时间、权限和所支持 Claim 的决策证据 |
| Source Manifest | 对数据源 Owner、分类、ACL、刷新、有效时间、删除、解析器和 Schema 的登记合同 |
| RAG | Retrieval-Augmented Generation，在生成时检索外部知识并作为模型上下文 |
| Agentic RAG | Agent 根据推理进展决定何时、怎样检索，并在受限循环中补充证据 |
| Hybrid Retrieval | 按查询形状组合 FTS、Vector、Graph、SQL 或 API，并对多路候选合并和精排 |
| GraphRAG | 利用实体、关系、路径、社区或图算法检索和组织证据的模式；具体产品实现可能不同 |
| Knowledge Graph | 描述业务实体、关系和规则的图，回答“什么是真的、什么相连” |
| Context Graph | 描述一次 Agent 执行中 Goal、Task、Tool、Evidence 和 Claim 因果关系的图 |
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
| Control Plane | 负责路由、计划、策略、预算、审批与状态转换的控制责任面 |
| Execution Plane | 负责实际运行 Agent、Tool、Worker、Sandbox 与模型调用的执行责任面 |
| Source of Truth | 某项事实发生冲突时具有最终裁决权的权威来源 |
| Derived Index | 从权威来源生成、用于提升查询或分析效率，并且应能按版本重建的派生结构 |
| Startup Probe | 判断应用是否在允许时间内完成初始化；成功前不应执行常规存活与就绪探测 |
| Liveness Probe | 判断进程是否陷入需要重启才能恢复的内部故障 |
| Readiness Probe | 判断当前实例能否接收新流量；失败通常移出流量而不重启 |
| Synthetic Check | 以受控测试请求验证关键端到端业务路径的主动检查 |
| OpenTelemetry | 用于生成、传播、采集和导出 Trace、Metric 与 Log 等遥测数据的开放可观测性框架 |
| Baggage | 随请求传播的受控键值上下文；可能进入下游网络请求，不应携带敏感数据 |
| SLO | Service Level Objective，在指定窗口内对用户可感知服务指标设定的目标 |
| Error Budget | `1 - SLO` 所允许的不可靠空间，用于平衡变更速度与可靠性投入 |
| RPO | Recovery Point Objective，故障后可以接受丢失的数据时间范围 |
| RTO | Recovery Time Objective，从故障到恢复目标服务允许的最长时间 |
| Circuit Breaker | 在下游持续故障时快速失败，并通过受控探测判断是否恢复的熔断机制 |
| Bulkhead | 按任务、租户、工具或资源池隔离并发和故障的舱壁机制 |
| Backpressure | 系统过载时通过拒绝、有界排队、限流或降级抑制上游输入的机制 |
| DLQ | Dead Letter Queue，保存达到重试上限或无法处理消息并等待诊断与受控重放的队列 |
| ADR | Architecture Decision Record，记录背景、约束、选项、决策和验证方式 |
