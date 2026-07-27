<div class="book-home" markdown>

<section class="book-hero" markdown>

<div class="book-hero__content" markdown>
<p class="book-kicker">中文开源技术专著 · 全十章</p>

# 生产级多智能体系统

<p class="book-subtitle">从架构判断到工程落地</p>
<p class="book-lead">本书讨论的不是如何快速堆出一组 Agent，而是如何把目标、权限、状态、上下文、证据和故障边界组织成一个可验证的生产系统。十章沿同一条工程主线展开，从是否需要 Agent，一直走到评测、运营和公开交付。</p>
<div class="book-actions">
<a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">开始阅读</a>
<a class="md-button" href="guide/book-roadmap/">浏览全书</a>
<a class="md-button" href="guide/caseops-project/">运行 CaseOps</a>
</div>
<p class="book-meta">10 章完整正文 · 68 张原创架构图 · 10 份工程模板 · 1 套可运行参考系统</p>
</div>
<div class="book-hero__visual" aria-hidden="true"></div>

</section>

## 从一个判断开始

许多 Agent 项目从框架、角色和 Prompt 开始。本书把顺序反过来：先确认哪些路径需要动态决策，哪些状态必须由确定性系统拥有，哪些副作用无论模型多自信都不能越权执行。只有当责任边界成立，增加 Agent 才可能带来净收益。

<div class="book-grid book-grid--four">
  <article class="book-card">
    <span class="book-card__index">01</span>
    <h3>架构判断</h3>
    <p>区分工作流、单 Agent 与多 Agent，确定自治范围和真实拆分边界。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">02</span>
    <h3>受控执行</h3>
    <p>把工具、状态、上下文、权限和恢复语义写成可执行合同。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">03</span>
    <h3>生产保障</h3>
    <p>建立部署、可观测性、安全、评测和 AgentOps 运营闭环。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">04</span>
    <h3>可验证交付</h3>
    <p>让第三方能够复现系统、追溯证据并验证发布制品来源。</p>
  </article>
</div>

## 全书结构

<div class="book-grid book-grid--parts">
  <article class="part-card">
    <p class="part-card__label">第一部分 · 第 01—03 章</p>
    <h3>架构判断与执行控制</h3>
    <p>理解 Agent 的本质，建立工具调用控制面，再处理多 Agent 的控制权、状态所有权和协作合同。</p>
    <a href="guide/book-roadmap/#part-one">查看本部分 →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">第二部分 · 第 04—06 章</p>
    <h3>可信上下文与生产保障</h3>
    <p>把检索结果治理为证据，为系统建立可服务、可恢复且能够限制攻击影响的生产底座。</p>
    <a href="guide/book-roadmap/#part-two">查看本部分 →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">第三部分 · 第 07—10 章</p>
    <h3>系统合龙与持续交付</h3>
    <p>贯通跨 Agent 因果链，以评测和 AgentOps 持续验证，最终形成可复现、可维护的公开交付物。</p>
    <a href="guide/book-roadmap/#part-three">查看本部分 →</a>
  </article>
</div>

## 贯穿全书的 CaseOps

CaseOps 是本书独立维护的生产导向参考系统。它围绕理赔案件 `C-102` 展开：调查案件为何未完成，确认缺失材料与适用规则；如果需要联系客户，只生成草稿，不自动发送。

这条业务链同时包含动态调查、多源证据、租户隔离、审批边界、长任务、故障恢复和质量验证。读者可以用 [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0) 运行完整系统，也可以使用章节标签观察每项能力为何出现。

[查看 CaseOps 运行指南](guide/caseops-project.md){ .md-button .md-button--primary }
[打开代码仓库](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button }

## 读完之后，你将能够

<div class="book-outcomes" markdown>

- 用可解释的标准判断一个问题是否需要 Agent，以及是否值得拆成多 Agent；
- 设计 Tool Contract、状态机、协作协议、Context Pack 与安全执行边界；
- 建立覆盖部署、可观测性、恢复、安全、评测和线上运营的生产保证；
- 使用 ADR、Golden Dataset、Evidence Package 与 Release Gate 支撑架构决策；
- 在干净环境中构建、验收并验证一个多 Agent 系统的发布来源。

</div>

!!! info "原理优先，框架解耦"
    LangGraph、AutoGen、CrewAI 等框架会持续变化。本书优先讨论更稳定的架构责任、工程合同和验证方法，使这些判断在更换模型、协议实现或编排框架后仍然成立。

<div class="book-closing">
  <p>第一次系统学习，建议从第一章顺序阅读；正在解决具体问题，可以从阅读建议直接进入。</p>
  <a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">从第 01 章开始</a>
  <a class="md-button" href="guide/reading-path/">查看阅读建议</a>
</div>

</div>
