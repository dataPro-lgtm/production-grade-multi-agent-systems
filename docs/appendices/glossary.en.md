# Glossary

| Term | Meaning in this book |
|---|---|
| Agent | A system that observes state around a goal, selects and executes actions, updates state based on the results, and decides what to do next |
| Agentic Workflow | A workflow that introduces localized dynamic judgment into deterministic orchestration |
| Bounded Autonomy | Autonomy constrained by candidate actions, permissions, budgets, state machines, and evaluation gates |
| Context Contract | An agreement governing the types, sources, permissions, lifecycles, and trustworthiness of information that enters the model context |
| Context Engineering | The practice of building dynamic systems that provide models and tools with the information, capabilities, and constraints needed to complete a task, in the right format and at the right time |
| Context Pack | The typed input contract actually supplied to a model call, including the goal, state, evidence, tools, budget, omissions, and version information |
| Evidence | Decision evidence bound to its source, version, Locator, time, permissions, and the Claim it supports |
| Source Manifest | A registration contract for a data source's Owner, classification, ACL, refresh policy, valid time, deletion policy, parser, and Schema |
| RAG | Retrieval-Augmented Generation, which retrieves external knowledge at generation time and supplies it as model context |
| Agentic RAG | A pattern in which an Agent decides when and how to retrieve as reasoning progresses, supplementing evidence within a bounded loop |
| Hybrid Retrieval | A pattern that combines FTS, Vector, Graph, SQL, or API retrieval according to the query shape, then merges and reranks candidates from multiple paths |
| GraphRAG | A pattern that uses entities, relationships, paths, communities, or graph algorithms to retrieve and organize evidence; specific product implementations may differ |
| Knowledge Graph | A graph describing business entities, relationships, and rules that answers “what is true and what is connected” |
| Context Graph | A graph describing the causal relationships among Goal, Task, Tool, Evidence, and Claim within a single Agent execution |
| Handoff | The explicit transfer of task control and necessary state from one Agent to another |
| Supervisor | An orchestration role responsible for routing, delegation, aggregation, or control across multiple units of responsibility |
| Central Supervisor | A control-plane role responsible for cross-domain Goal decomposition, Team routing, global dependencies, budgets, and result aggregation |
| Team Supervisor | A role that selects a Worker within a single domain, allocates sub-budgets, validates local results, and returns a Team Result externally |
| Delegation Contract | An agreement governing a subtask's goal, acceptance criteria, scope, tools, budget, deadline, and escalation path |
| Result Contract | An agreement governing an Agent task's status, conclusions, evidence references, missing information, side effects, and recommended next steps |
| Join Contract | An aggregation agreement governing the wait set, completion threshold, timeout, conflicts, and late results for parallel tasks |
| Late Result | A result that arrives after a task has timed out or been canceled, or after the Plan has been updated; it should be recorded but must not be merged into the current state by default |
| Reconcile | When the state of an external side effect is unknown, querying the authoritative system and converging local state rather than retrying blindly |
| Artifact | A referenceable output produced by an Agent or tool; production systems should use immutable versions and content hashes |
| AgentOps | A production operations responsibility framework built around Goal, Plan, Route, Tool, Evidence, Decision, and Control to make systems diagnosable, amenable to intervention, recoverable, and continuously optimizable |
| Capstone | An integrated delivery that uses one complete project to close the loop across the problem, architecture, implementation, security, evaluation, release, operations, and maintenance evidence |
| Vertical Slice | An end-to-end slice that uses a minimal capability to traverse real boundaries such as identity, planning, delegation, tools, state, evidence, evaluation, and observability |
| Evidence Package | An acceptance package bound to a specific Release Candidate that brings together product, architecture, implementation, quality, security, resilience, operations, and traceability evidence |
| Traceability Matrix | A set of bidirectional relationships linking Requirement, ADR, Contract, Implementation, Verification, Runtime Evidence, and Sign-off |
| Release Candidate | A candidate release for which the versions of source code, contracts, Prompt, Model, Tool, Policy, Knowledge, artifacts, and evidence have been fixed |
| Clean-room Reproduction | An acceptance method in which an independent environment that does not rely on the author's local machine state or verbal guidance reproduces the system and its evidence by following public instructions |
| SBOM | Software Bill of Materials, an inventory describing the direct and transitive dependencies, versions, identifiers, and licenses contained in a release artifact |
| Build Provenance | Verifiable source information describing who produced an artifact, through which build process, and from which inputs |
| Artifact Attestation | A verifiable, signed statement about an artifact and its provenance, build, or other properties; it does not mean the artifact is free of vulnerabilities |
| Release Gate | A release gate that issues a Pass, Conditional Pass, or Fail decision for an independent risk involving the problem, design, slice, quality, security, or operations |
| System Acceptance | A formal judgment, based on requirements, evidence, risk, and independent reproduction, about whether a system is ready for delivery |
| Goal Outcome Event | A structured operational event describing the goal outcome, safety path, evidence coverage, latency, cost, versions, and correlation references |
| Tier 1 Metric | A goal-level metric that directly expresses the user commitment and overall system health and can change operational decisions |
| Tier 2 Metric | A diagnostic metric that explains changes in Tier 1 by responsibility layer, such as Planner, Router, Worker, Tool, Model, State, and Security |
| Incident Bundle | A transferable fact package that brings together an incident's impact, versions, evidence, control actions, rollback, and timeline |
| A2A | Agent2Agent Protocol, an interoperability protocol through which independent Agent instances discover capabilities, exchange messages, track tasks, and deliver artifacts |
| AgentCard | The discovery object in A2A that describes an Agent's identity, interfaces, capabilities, skills, and security schemes |
| Capability Snapshot | A snapshot derived from an AgentCard or Registry and supplied to the Planner after filtering by user, tenant, environment, version, and risk |
| Tool Call | A structured action proposal generated by a model; it must be parsed, validated, and authorized before execution |
| Tool Contract | The complete contract for a tool's name, purpose, input Schema, permissions, errors, idempotency, and side effects |
| State | Structured runtime data shared by an Agent across steps, including task, evidence, control, and correlation information |
| Checkpoint | A state snapshot saved at a state-graph step boundary for pausing, resuming, replay, and failure analysis |
| Idempotency | The property that repeated requests for the same business action produce no additional side effects or return the same result |
| MCP | Model Context Protocol, a standard protocol through which an AI Host and external Server discover, read, and invoke capabilities |
| Golden Dataset | A governed, repeatable collection of evaluation case contracts that represents critical risks; it includes inputs, facts, evidence, path invariants, tolerances, and provenance |
| Golden Entry | A single versioned case in a Golden Dataset that describes inputs, expected facts and evidence, allowed and prohibited behaviors, execution policies, and governance metadata |
| Evaluation Contract | An agreement governing quality attributes, affected populations, calculation methods, evaluators, slices, thresholds, gates, and Owner |
| Evaluator | Code, domain rules, an LLM Judge, or a human review mechanism that produces structured measurements or verdicts for one or more Agent runs |
| LLM-as-a-Judge | A measurement method that uses a language model to evaluate open-ended output or perform pairwise comparisons against an explicit Rubric; it requires calibration, versioning, abstention, and human review |
| Judge Calibration | The process of comparing Judge verdicts with independent human labels to assess agreement rate, Precision, Recall, Kappa, order stability, and slice-level error |
| Evaluation Slice | An evaluation subset divided by intent, risk, language, path, model, tool, or another dimension to reveal differences obscured by the overall average |
| Holdout Set | A reserved evaluation set isolated from development tuning and used for release validation or periodic audits |
| N-run | A method that repeats the same case under declared model parameters, Fixture, cache, and state-reset conditions and analyzes the result distribution |
| pass@k | The probability or observed metric that at least one of k attempts succeeds, commonly used in candidate-generation and search scenarios |
| pass^k | The notation used in this book to indicate that all k runs succeed, emphasizing stable execution; it is not a standardized industry term |
| Paired Evaluation | An evaluation design in which the Baseline and Candidate run on the same cases under controlled conditions and their differences are compared case by case |
| Regression Gate | A quality policy that determines whether a change may enter the next release stage based on hard gates, non-regression tolerances, and performance and cost budgets |
| Quality Drift | The phenomenon in which quality attributes such as goal success, faithfulness, safety, decision quality, or experience change over time or across versions |
| Data Leakage | The phenomenon in which evaluation cases or their semantic neighbors enter training, Few-shot examples, RAG, or Memory, inflating regression scores without representing generalization ability |
| Trace | The observable execution trajectory of planning, routing, tools, state, and output within a task |
| Control Plane | The control plane responsible for routing, planning, policy, budgets, approvals, and state transitions |
| Runtime Control Plane | The runtime control plane that converts production observations into audited actions such as circuit breaking, degradation, cancellation, rate limiting, rollback, and recovery |
| Control Action Contract | An agreement governing a control action's target, scope, reason, approval, expected version, duration, rollback, and recovery conditions |
| Execution Plane | The execution plane that actually runs Agent, Tool, Worker, Sandbox, and model-call workloads |
| Source of Truth | The authoritative source with final decision rights when facts conflict |
| Derived Index | A derived structure generated from an authoritative source to improve query or analysis efficiency and designed to be rebuilt for a specified version |
| Startup Probe | A probe that determines whether an application completes initialization within the allowed time; routine liveness and readiness probes should not run before it succeeds |
| Liveness Probe | A probe that determines whether a process is stuck in an internal failure that requires a restart to recover |
| Readiness Probe | A probe that determines whether the current instance can accept new traffic; failure usually removes it from traffic without restarting it |
| Synthetic Check | A proactive check that uses controlled test requests to validate a critical end-to-end business path |
| OpenTelemetry | An open observability framework for generating, propagating, collecting, and exporting telemetry data such as Trace, Metric, and Log |
| Baggage | Controlled key-value context propagated with a request; it may enter downstream network requests and must not carry sensitive data |
| SLO | Service Level Objective, a target for a user-perceived service metric over a specified window |
| SLI | Service Level Indicator, a computational definition of user-perceived service performance that must declare its population, numerator, denominator, window, and exclusions |
| Error Budget | The unreliability allowance represented by `1 - SLO`, used to balance the speed of change against investment in reliability |
| Error Budget Burn Rate | The rate at which an error budget is consumed within a given window, used to identify rapid or sustained reliability degradation |
| RPO | Recovery Point Objective, the acceptable span of data loss after a failure |
| RTO | Recovery Time Objective, the maximum allowed time from a failure until the target service is restored |
| Circuit Breaker | A mechanism that fails fast during sustained downstream failures and uses controlled probes to determine whether service has recovered |
| Bulkhead | A mechanism that isolates concurrency and failures by task, tenant, tool, or resource pool |
| Backpressure | A mechanism that suppresses upstream input through rejection, bounded queues, rate limiting, or degradation when the system is overloaded |
| Retry Amplification | The ratio of total physical attempts to unique logical operations, used to identify load and cost amplification caused by retries stacking across layers |
| Cost per Successful Goal | A unit-economics metric that divides total effective cost by the number of successful Goals, linking technical consumption to business outcomes |
| Wasted Cost | Model, tool, and platform costs incurred by work that fails, is discarded, is duplicated, or does not contribute to the final result |
| Semantic Cache | A cache that matches semantically equivalent requests or intermediate results by intent, entity, permissions, version, and valid time; every hit must re-satisfy isolation and evidence constraints |
| Experience Store | A store of reusable operational experience governed for provenance, human review, scope, validity period, privacy, and version compatibility |
| Prompt Release Manifest | A release manifest that records the Prompt version, code commit, variables, compatibility contracts, evaluations, canary rollout, excluded risks, rollback, and Owner |
| GameDay | An exercise that injects failures in a controlled, production-like environment to jointly validate the system, people, processes, alerts, Runbook, and recovery capabilities |
| ORR | Operational Readiness Review, a production-readiness review that uses SLO, quality, security, recovery, operations, cost, and exercise evidence to make a Go, Conditional Go, or No-Go decision |
| Break-glass | A controlled mechanism for temporarily elevating privileges or bypassing normal access procedures in an emergency; it must have an explicit scope, approval, TTL, and audit trail |
| DLQ | Dead Letter Queue, a queue that retains messages that have reached their retry limit or cannot be processed, pending diagnosis and controlled replay |
| Prompt Injection | An attack in which an attacker influences a model's goals, decisions, or output through user input, retrieved content, tool results, or other channels |
| Indirect Prompt Injection | Malicious instructions that do not come directly from the user but are hidden in web pages, emails, documents, OCR, tool results, or Peer Agent content |
| Least Agency | An Agent security principle that grants the minimum functionality, permissions, and autonomy, and only when genuinely necessary |
| Tool Guard | An architectural role between the model's Tool Intent and a privileged executor that enforces identity checks, policy, Schema validation, risk controls, approvals, and result gates |
| Policy Enforcement Point | A deterministic control point that intercepts access or action requests and enforces a Policy Decision |
| Workload Identity | A machine identity representing a service, Agent, Worker, or Tool Runtime, separate from the end user's identity |
| Effective Authority | The effective intersection of permissions from the user, Workload, delegation, task, tool, resource, environment, and approval |
| Bound Approval | An approval authorization bound to a specific action, resource, parameter hash, version, Scope, and validity period |
| TOCTOU | Time of Check to Time of Use, the problem in which a state change between a successful check and execution invalidates the earlier authorization |
| Confused Deputy | A problem in which a low-privilege principal induces a high-privilege service to use its own authority to perform an action that the original principal is not authorized to perform |
| Token Audience | The target resource service for which an Access Token is issued; the recipient must verify that it is the intended audience |
| DLP | Data Loss Prevention, the discovery, classification, transformation, blocking, and exfiltration monitoring of sensitive data |
| Security Invariant | A zero-tolerance security condition that cannot be consumed through a statistical error budget; for example, unauthorized side effects must remain at zero |
| Attack Success Rate | The proportion of attacks that achieve a prohibited objective within a specified attack set, version, and number of repetitions |
| Red Team | An activity that simulates attacks within an explicit scope and safety constraints to validate control, detection, response, and recovery capabilities |
| Fail Closed | Denying a protected action by default when a control or dependency fails, preventing policy bypass when a security component is unavailable |
| Nonce | A random or unique value used only once to detect replay of messages, approvals, or delegations |
| ADR | Architecture Decision Record, which records context, constraints, options, the decision, and the verification method |
