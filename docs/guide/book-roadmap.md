# 全书目录

十章沿着同一条工程链展开。每一章解决一个不可跳过的问题，并把结论落到可审查的合同、代码和运行证据中。

<div class="book-spine" aria-label="全书知识主线">
  <span>判断</span><b>→</b>
  <span>执行</span><b>→</b>
  <span>协作</span><b>→</b>
  <span>取证</span><b>→</b>
  <span>运行</span><b>→</b>
  <span>防御</span><b>→</b>
  <span>合龙</span><b>→</b>
  <span>评测</span><b>→</b>
  <span>运营</span><b>→</b>
  <span>交付</span>
</div>

## 第一部分：架构判断与执行控制 { #part-one }

先决定系统是否需要自治，再把模型提出的动作放入受控运行时，最后处理多个 Agent 之间的控制权和状态所有权。

<div class="chapter-grid">

<a class="chapter-card" href="../chapters/01-what-is-an-ai-agent/">
  <span class="chapter-card__number">01</span>
  <h3>Agent 的本质与架构边界</h3>
  <p>区分普通代码、LLM 工作流、单 Agent 与多 Agent，确定动态选路和执行自治应当停在哪里。</p>
  <small>产物：Agent 判断框架、自治边界矩阵、ADR</small>
</a>

<a class="chapter-card" href="../chapters/02-tool-calling-state-machine-and-mcp/">
  <span class="chapter-card__number">02</span>
  <h3>工具调用：状态机、控制面与 MCP</h3>
  <p>把 Tool Call 从模型建议转化为可授权、可恢复、可审计且不会重复制造副作用的执行。</p>
  <small>产物：Tool Contract、状态机、Checkpoint、MCP 边界</small>
</a>

<a class="chapter-card" href="../chapters/03-multi-agent-patterns-collaboration-and-incident-response/">
  <span class="chapter-card__number">03</span>
  <h3>多 Agent 协作：架构模式、协议与事件响应</h3>
  <p>用控制权、责任、状态和失败语义选择 Handoff、Supervisor、Router、Fan-out 与 Join。</p>
  <small>产物：模式决策记录、委托合同、确定性 Join</small>
</a>

</div>

## 第二部分：可信上下文与生产保障 { #part-two }

让系统只使用有资格成为证据的信息，并在基础设施故障和模型被误导时仍能守住业务边界。

<div class="chapter-grid">

<a class="chapter-card" href="../chapters/04-context-engineering-agentic-rag-and-graphrag/">
  <span class="chapter-card__number">04</span>
  <h3>上下文工程：Agentic RAG、GraphRAG 与证据链</h3>
  <p>治理查询、混合检索、关系证据、权限、时态和引用，让 Context 成为可追溯的运行时产品。</p>
  <small>产物：Context Pack、检索门禁、GraphRAG 证据路径</small>
</a>

<a class="chapter-card" href="../chapters/05-production-infrastructure-observability-and-recovery/">
  <span class="chapter-card__number">05</span>
  <h3>生产底座：部署、可观测性与故障恢复</h3>
  <p>明确状态所有权、健康语义、遥测关联、可靠性保护和恢复顺序，把“能启动”变成运行保证。</p>
  <small>产物：生产就绪契约、SLO、恢复演练与证据</small>
</a>

<a class="chapter-card" href="../chapters/06-agent-security-tool-guard-privacy-and-red-teaming/">
  <span class="chapter-card__number">06</span>
  <h3>Agent 安全：纵深防御、Tool Guard 与红队验证</h3>
  <p>假设模型可能失守，以身份、权限交集、资源绑定、数据释放和红队回归限制实际影响。</p>
  <small>产物：Tool Guard、安全审计、隐私生命周期与红队证据</small>
</a>

</div>

## 第三部分：系统合龙与持续交付 { #part-three }

把分散组件合成一条因果链，用评测和生产运营持续验证，最终交付可复现、可追溯、可维护的系统。

<div class="chapter-grid chapter-grid--four">

<a class="chapter-card" href="../chapters/07-layered-multi-agent-supervisor-a2a-mcp-context-graph/">
  <span class="chapter-card__number">07</span>
  <h3>系统合龙：Supervisor、A2A、MCP 与 Context Graph</h3>
  <p>贯通目标、计划、委托、工具、状态、证据、错误和恢复语义，形成端到端可验收系统。</p>
  <small>产物：分层架构、Context Graph、系统合龙契约</small>
</a>

<a class="chapter-card" href="../chapters/08-multi-agent-evaluation-golden-dataset-and-continuous-regression/">
  <span class="chapter-card__number">08</span>
  <h3>质量工程：Golden Dataset、分层评测与持续回归</h3>
  <p>评估 Goal 到 Answer 的完整因果链，用确定性检查、Judge、N-run 和门禁控制随机性。</p>
  <small>产物：Golden Dataset、分层指标、持续回归门禁</small>
</a>

<a class="chapter-card" href="../chapters/09-agentops-incident-diagnosis-resilience-and-continuous-optimization/">
  <span class="chapter-card__number">09</span>
  <h3>AgentOps：事件诊断、系统韧性与成本治理</h3>
  <p>围绕用户目标重建事故因果链，执行受审计的控制、恢复、成本归因和持续优化。</p>
  <small>产物：目标级 SLO、Incident Bundle、GameDay 与 ORR</small>
</a>

<a class="chapter-card" href="../chapters/10-capstone-system-acceptance-and-open-source-delivery/">
  <span class="chapter-card__number">10</span>
  <h3>系统交付：验收证据、Release Gate 与开源治理</h3>
  <p>从需求追踪到干净环境复现，再以 SBOM、构建溯源和治理文件完成公共交付。</p>
  <small>产物：Evidence Package、Release Gate、可验证 v1.0</small>
</a>

</div>

## 贯穿项目：CaseOps

全书使用同一个复合理赔案例：调查案件 `C-102` 为什么未完成，确认缺失材料和适用规则；如需联系客户，只能生成草稿，不得自动发送。

CaseOps 从确定性领域内核开始，依次获得工具状态机、多 Agent 协作、受治理 Context、生产运行保证、安全控制、系统评测、AgentOps 和可验证发布。完整实现维护在独立的 [CaseOps 代码仓库](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops)，正式版本为 [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0)。

[开始阅读](../chapters/01-what-is-an-ai-agent.md){ .md-button .md-button--primary }
[运行 CaseOps](caseops-project.md){ .md-button }
[查看工程模板](../toolkit/agent-definition-card.md){ .md-button }
