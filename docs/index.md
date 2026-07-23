<div class="book-home" markdown>

<section class="book-hero" markdown>

  <p class="book-kicker">中文开源书 · 全十章</p>

# 生产级多智能体系统

  <p class="book-subtitle">从架构判断到工程落地</p>
  <p class="book-lead">多 Agent 的价值不在于角色数量，而在于能否把目标、权限、状态、证据与故障边界组织成一个可验证的系统。本书沿着一条完整工程主线，讲清楚何时使用 Agent、怎样可靠协作，以及如何把系统带到生产、运营和交付。</p>
  <div class="book-actions">
    <a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">开始阅读</a>
    <a class="md-button" href="guide/book-roadmap/">浏览全书目录</a>
  </div>
  <p class="book-meta">10 章完整正文 · 原创架构图 · 可复制工程契约 · GitHub 开源</p>
</section>

## 这本书解决什么

<div class="book-grid book-grid--four">
  <article class="book-card">
    <span class="book-card__index">01</span>
    <h3>先做对判断</h3>
    <p>区分工作流、单 Agent 与多 Agent，确定自治等级和真实拆分边界。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">02</span>
    <h3>再建立控制</h3>
    <p>把工具、状态、上下文、权限和恢复语义变成明确的运行契约。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">03</span>
    <h3>用证据验证</h3>
    <p>以 Trace、Golden Dataset、分层指标和回归门禁证明系统质量。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">04</span>
    <h3>完成生产交付</h3>
    <p>将可观测性、安全、AgentOps、系统验收和开源维护闭合成链路。</p>
  </article>
</div>

## 全书结构

<div class="book-grid book-grid--parts">
  <article class="part-card">
    <p class="part-card__label">第一部分 · 第 01—03 章</p>
    <h3>架构与执行边界</h3>
    <p>从 Agent 判定出发，建立工具调用状态机，再进入多 Agent 的拆分与协作。</p>
    <a href="guide/book-roadmap/#part-one">查看本部分 →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">第二部分 · 第 04—06 章</p>
    <h3>上下文与生产底座</h3>
    <p>治理模型看到的证据，把系统部署为可观测、可恢复且具备纵深防御的平台。</p>
    <a href="guide/book-roadmap/#part-two">查看本部分 →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">第三部分 · 第 07—10 章</p>
    <h3>合龙、验证与交付</h3>
    <p>完成端到端系统合龙，用持续评测和 AgentOps 运营，最终形成可独立验收的交付物。</p>
    <a href="guide/book-roadmap/#part-three">查看本部分 →</a>
  </article>
</div>

## 读完之后，你将能够

<div class="book-outcomes" markdown>

- 用可解释的标准判断一个问题是否需要 Agent，以及是否值得拆成多 Agent；
- 设计工具合同、状态机、协作协议、Context Pack 与安全执行边界；
- 建立覆盖部署、可观测性、恢复、评测和线上运营的生产保证；
- 交付 ADR、Golden Dataset、Evidence Package、Release Gates 等可审查产物。

</div>

!!! info "本书不绑定单一框架"
    LangGraph、AutoGen、CrewAI 等框架会持续变化。书中优先讨论稳定的架构责任、工程契约和验证方法，帮助你在更换模型或框架后仍然保有一套可靠的判断体系。

<div class="book-closing">
  <p>如果你第一次系统学习多 Agent 工程，建议从第一章顺序阅读；如果你正在解决具体问题，可以先查看阅读建议。</p>
  <a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">从第 01 章开始</a>
  <a class="md-button" href="guide/reading-path/">查看阅读建议</a>
</div>

</div>
