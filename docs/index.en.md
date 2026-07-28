<div class="book-home" markdown>

<section class="book-hero" markdown>

<div class="book-hero__content" markdown>
<p class="book-kicker">Open-source technical monograph · Complete ten-chapter edition</p>

# Production-Grade Multi-Agent Systems

<p class="book-subtitle">From Architectural Judgment to Engineering Delivery</p>
<p class="book-lead">This book is not about quickly assembling a group of agents. It is about organizing goals, permissions, state, context, evidence, and failure boundaries into a verifiable production system. Its ten chapters follow a single engineering through line, beginning with whether an agent is needed and continuing through evaluation, operations, and public delivery.</p>
<div class="book-actions">
<a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">Start reading</a>
<a class="md-button" href="guide/book-roadmap/">Explore the book</a>
<a class="md-button" href="guide/caseops-project/">Run CaseOps</a>
</div>
<p class="book-meta">10 complete chapters · 68 original architecture diagrams · 10 engineering templates · 1 runnable reference system</p>
</div>
<div class="book-hero__visual" aria-hidden="true"></div>

</section>

## Start with a decision

Many agent projects begin with frameworks, roles, and prompts. This book reverses that order: first determine which paths require dynamic decisions, which state must remain under the ownership of deterministic systems, and which side effects must never be executed without authorization, no matter how confident the model is. Only when the boundaries of responsibility are sound can adding agents potentially deliver net value.

<div class="book-grid book-grid--four">
  <article class="book-card">
    <span class="book-card__index">01</span>
    <h3>Architectural judgment</h3>
    <p>Distinguish among workflows, single-agent systems, and multi-agent systems, then define the scope of autonomy and the true boundaries for decomposition.</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">02</span>
    <h3>Controlled execution</h3>
    <p>Express tools, state, context, permissions, and recovery semantics as executable contracts.</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">03</span>
    <h3>Production assurance</h3>
    <p>Establish a closed operational loop spanning deployment, observability, security, evaluation, and AgentOps.</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">04</span>
    <h3>Verifiable delivery</h3>
    <p>Enable third parties to reproduce the system, trace its evidence, and verify the provenance of its release artifacts.</p>
  </article>
</div>

## Book structure

<div class="book-grid book-grid--parts">
  <article class="part-card">
    <p class="part-card__label">Part I · Chapters 01–03</p>
    <h3>Architectural judgment and execution control</h3>
    <p>Understand the nature of agents, establish a control plane for tool calling, and then address control, state ownership, and collaboration contracts in multi-agent systems.</p>
    <a href="guide/book-roadmap/#part-one">View this part →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">Part II · Chapters 04–06</p>
    <h3>Trustworthy context and production assurance</h3>
    <p>Govern retrieved results as evidence and establish a production foundation that is serviceable, recoverable, and capable of limiting the impact of attacks.</p>
    <a href="guide/book-roadmap/#part-two">View this part →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">Part III · Chapters 07–10</p>
    <h3>System integration and continuous delivery</h3>
    <p>Connect causal chains across agents, continuously validate the system through evaluation and AgentOps, and ultimately produce a reproducible and maintainable public deliverable.</p>
    <a href="guide/book-roadmap/#part-three">View this part →</a>
  </article>
</div>

## CaseOps throughout the book

CaseOps is the independently maintained, production-oriented reference system for this book. It centers on insurance claim `C-102`: investigate why the case remains incomplete and identify the missing materials and applicable rules; if the customer needs to be contacted, generate a draft only and do not send it automatically.

This business flow brings together dynamic investigation, multi-source evidence, tenant isolation, approval boundaries, long-running tasks, failure recovery, and quality validation. Readers can run the complete system using [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0), or use the chapter tags to see why each capability was introduced.

[View the CaseOps run guide](guide/caseops-project.md){ .md-button .md-button--primary }
[Open the code repository](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button }

## What you will be able to do

<div class="book-outcomes" markdown>

- Use explainable criteria to determine whether a problem requires an agent and whether it is worth decomposing into multiple agents;
- Design Tool Contracts, state machines, collaboration protocols, Context Packs, and safe execution boundaries;
- Establish production assurance spanning deployment, observability, recovery, security, evaluation, and live operations;
- Use ADR, Golden Dataset, Evidence Package, and Release Gate practices to support architectural decisions;
- Build and accept a multi-agent system in a clean environment, then verify the provenance of its release.

</div>

!!! info "Principles first, decoupled from frameworks"
    Frameworks such as LangGraph, AutoGen, and CrewAI will continue to evolve. This book prioritizes the more stable architectural responsibilities, engineering contracts, and verification methods, so that these judgments remain valid even when the model, protocol implementation, or orchestration framework changes.

<div class="book-closing">
  <p>For your first systematic pass, read sequentially from Chapter 1. If you are solving a specific problem, you can go directly to the recommended reading paths.</p>
  <a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">Start with Chapter 01</a>
  <a class="md-button" href="guide/reading-path/">View reading paths</a>
</div>

</div>
