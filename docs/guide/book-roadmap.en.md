# Book roadmap

The ten chapters follow a single engineering chain. Each chapter addresses a question that cannot be skipped and turns its conclusions into reviewable contracts, code, and runtime evidence.

<div class="book-spine" aria-label="The book's core knowledge path">
  <span>Judgment</span><b>→</b>
  <span>Execution</span><b>→</b>
  <span>Collaboration</span><b>→</b>
  <span>Evidence</span><b>→</b>
  <span>Runtime</span><b>→</b>
  <span>Defense</span><b>→</b>
  <span>Integration</span><b>→</b>
  <span>Evaluation</span><b>→</b>
  <span>Operations</span><b>→</b>
  <span>Delivery</span>
</div>

## Part I: architectural judgment and execution control { #part-one }

First decide whether the system needs autonomy, then place model-proposed actions in a controlled runtime, and finally address control and state ownership across multiple agents.

<div class="chapter-grid">

<a class="chapter-card" href="../chapters/01-what-is-an-ai-agent/">
  <span class="chapter-card__number">01</span>
  <h3>The essence of agents and architectural boundaries</h3>
  <p>Distinguish ordinary code, LLM workflows, single-agent systems, and multi-agent systems to determine where dynamic routing and execution autonomy should stop.</p>
  <small>Deliverables: agent decision framework, autonomy boundary matrix, ADR</small>
</a>

<a class="chapter-card" href="../chapters/02-tool-calling-state-machine-and-mcp/">
  <span class="chapter-card__number">02</span>
  <h3>Tool calling: state machine, control plane, and MCP</h3>
  <p>Turn a Tool Call from a model suggestion into execution that is authorized, recoverable, auditable, and does not repeatedly produce side effects.</p>
  <small>Deliverables: Tool Contract, state machine, Checkpoint, MCP boundary</small>
</a>

<a class="chapter-card" href="../chapters/03-multi-agent-patterns-collaboration-and-incident-response/">
  <span class="chapter-card__number">03</span>
  <h3>Multi-agent collaboration: architectural patterns, protocols, and incident response</h3>
  <p>Choose among Handoff, Supervisor, Router, Fan-out, and Join based on control, responsibility, state, and failure semantics.</p>
  <small>Deliverables: pattern decision record, delegation contract, deterministic Join</small>
</a>

</div>

## Part II: trustworthy context and production assurance { #part-two }

Ensure the system uses only information qualified to serve as evidence and can still uphold business boundaries when infrastructure fails or the model is misled.

<div class="chapter-grid">

<a class="chapter-card" href="../chapters/04-context-engineering-agentic-rag-and-graphrag/">
  <span class="chapter-card__number">04</span>
  <h3>Context engineering: Agentic RAG, GraphRAG, and evidence chains</h3>
  <p>Govern queries, hybrid retrieval, relational evidence, permissions, temporality, and citations so that Context becomes a traceable runtime product.</p>
  <small>Deliverables: Context Pack, retrieval gates, GraphRAG evidence paths</small>
</a>

<a class="chapter-card" href="../chapters/05-production-infrastructure-observability-and-recovery/">
  <span class="chapter-card__number">05</span>
  <h3>Production foundation: deployment, observability, and failure recovery</h3>
  <p>Clarify state ownership, health semantics, telemetry correlation, reliability safeguards, and recovery order to turn “it starts” into runtime guarantees.</p>
  <small>Deliverables: production-readiness contract, SLO, recovery drills, and evidence</small>
</a>

<a class="chapter-card" href="../chapters/06-agent-security-tool-guard-privacy-and-red-teaming/">
  <span class="chapter-card__number">06</span>
  <h3>Agent security: defense in depth, Tool Guard, and red-team validation</h3>
  <p>Assume the model may fail, and limit the real-world impact through identity, the intersection of permissions, resource binding, data release, and red-team regression testing.</p>
  <small>Deliverables: Tool Guard, security audit, privacy lifecycle, and red-team evidence</small>
</a>

</div>

## Part III: system integration and continuous delivery { #part-three }

Combine distributed components into a single causal chain, use evaluation and production operations for continuous validation, and ultimately deliver a reproducible, traceable, and maintainable system.

<div class="chapter-grid chapter-grid--four">

<a class="chapter-card" href="../chapters/07-layered-multi-agent-supervisor-a2a-mcp-context-graph/">
  <span class="chapter-card__number">07</span>
  <h3>System integration: Supervisor, A2A, MCP, and Context Graph</h3>
  <p>Connect goals, plans, delegation, tools, state, evidence, errors, and recovery semantics to create an end-to-end system with verifiable acceptance.</p>
  <small>Deliverables: layered architecture, Context Graph, system integration contract</small>
</a>

<a class="chapter-card" href="../chapters/08-multi-agent-evaluation-golden-dataset-and-continuous-regression/">
  <span class="chapter-card__number">08</span>
  <h3>Quality engineering: Golden Dataset, layered evaluation, and continuous regression testing</h3>
  <p>Evaluate the complete causal chain from Goal to Answer, using deterministic checks, Judge, N-run, and gates to control stochasticity.</p>
  <small>Deliverables: Golden Dataset, layered metrics, continuous regression gate</small>
</a>

<a class="chapter-card" href="../chapters/09-agentops-incident-diagnosis-resilience-and-continuous-optimization/">
  <span class="chapter-card__number">09</span>
  <h3>AgentOps: incident diagnosis, system resilience, and cost governance</h3>
  <p>Reconstruct the causal chain of an incident around the user's goal, and execute audited controls, recovery, cost attribution, and continuous optimization.</p>
  <small>Deliverables: goal-level SLO, Incident Bundle, GameDay, and ORR</small>
</a>

<a class="chapter-card" href="../chapters/10-capstone-system-acceptance-and-open-source-delivery/">
  <span class="chapter-card__number">10</span>
  <h3>System delivery: acceptance evidence, Release Gate, and open-source governance</h3>
  <p>Move from requirements traceability to reproduction in a clean environment, then complete the public delivery with an SBOM, build provenance, and governance files.</p>
  <small>Deliverables: Evidence Package, Release Gate, verifiable v1.0</small>
</a>

</div>

## Project throughout the book: CaseOps

The entire book uses the same complex claim-handling case: investigate why case `C-102` was not completed and confirm the missing materials and applicable rules; if the customer needs to be contacted, the system may only generate a draft and must not send it automatically.

CaseOps begins with a deterministic domain core and progressively gains a tool state machine, multi-agent collaboration, governed Context, production runtime guarantees, security controls, system evaluation, AgentOps, and verifiable releases. The complete implementation is maintained in the separate [CaseOps code repository](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops), with [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0) as the official release.

[Start reading](../chapters/01-what-is-an-ai-agent.md){ .md-button .md-button--primary }
[Run CaseOps](caseops-project.md){ .md-button }
[View engineering templates](../toolkit/agent-definition-card.md){ .md-button }
