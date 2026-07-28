# The throughline project: CaseOps

CaseOps is the independently maintained, production-oriented reference system for this book:

[Open the CaseOps repository](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button .md-button--primary }

The manuscript and code use a two-repository structure. The book repository explains the problems, derives the architectural judgments, and organizes the reading experience; the code repository contains the runtime, tests, containers, CI, security controls, and releases. The chapters reference only verified tags or commits rather than copying source snapshots that can easily drift from reality.

## Stable release

| Item | Value |
|---|---|
| Chapter milestone | `chapter-10-slice-9` |
| Release | `v1.0.0` |
| Pinned commit | `d52f0e0` |
| Runtime | Docker Compose |
| Services | FastAPI, A2A HTTP+JSON, MCP Streamable HTTP, PostgreSQL 17, OTel Collector, Tempo, Prometheus, Grafana |
| License | MIT |

[View the official CaseOps v1.0.0 release](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0)

## System capabilities across the ten chapters

### Slice 0: Deterministic baseline

The C-102 investigation in Chapter 1 is completed by a deterministic domain kernel:

1. Obtain the tenant identity from the authentication result;
2. Read the case within the tenant boundary;
3. Pin the rule version that applied when the case was submitted;
4. Identify missing documents and draft a request for supplementary materials;
5. Save the investigation result, audit event, and Outbox event in the same transaction.

The pinned version is [`chapter-01-slice-0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/tree/chapter-01-slice-0). It determines that `ACCIDENT_CERTIFICATE` is missing, establishing a baseline for correctness, cost, and complexity before agents are introduced.

### Slice 1: Controlled agent and MCP tool surface

Chapter 2 introduces the first constrained Investigation Agent:

1. In each round, the Planner proposes only one tool call or terminal state;
2. The runtime validates the schema, allowlist, scope, risk, and case boundary;
3. A standalone MCP Server exposes four read-only tools;
4. Short-lived task tokens bind the tenant, task, subject, scope, and audience;
5. Every state transition and tool call is persisted;
6. Timeout, bounded retry, a step budget, and action fingerprints prevent runaway execution;
7. Read-only tools support safe recovery from the crash window;
8. The unstructured document name “道路交通事故认定书” is normalized to `ACCIDENT_CERTIFICATE`.

The final conclusion is `DOCUMENTS_COMPLETE_AFTER_NORMALIZATION`. This does not replace rules with a model. The Planner decides what to inspect next, while deterministic tools still provide the rules and evidence.

### Slice 2: Governed multi-agent collaboration

Chapter 3 does not mechanically copy Slice 1 three times. Instead, it first identifies the control boundaries that must remain separate:

1. The Supervisor owns the global objective, deadline, delegation ledger, and final result;
2. The coverage, document, and risk specialist Agents answer only their respective bounded questions;
3. A2A 1.0 carries `DelegationTask` and `SpecialistResult`, while the server persists protocol Tasks;
4. Each Agent uses a short-lived token bound to the task and minimum scope to read facts through MCP;
5. Evidence Join converges deterministically using a quorum, required specialists, evidence prefixes, and conflict rules;
6. The start of the run, completion of the three delegations, and global completion produce five CloudEvents 1.0 Outbox events;
7. C-102's high amount and short policy duration trigger human review, but the system does not deny the claim, freeze it, or send a notification.

This chain clearly separates three types of state: the A2A Task manages the protocol lifecycle, the Delegated Task manages the business delegation, and the CloudEvent carries facts across services. The final result is `COMPLETE_WITH_REVIEW_REQUIRED`, and the execution fact is `side_effect = none`.

### Slice 3: Governed Context Pack

Chapter 4 brings the retrieval system into the agent control plane:

1. The Source Registry records the Owner, classification, refresh SLA, and Parser Version;
2. The Knowledge Object preserves the source version, effective time, ACL, purpose, Locator, and content hash;
3. The Planner permits only structured queries, PostgreSQL full-text search, and explicit Graph Path Templates;
4. Multi-channel candidates are fused with RRF to avoid mixing incomparable raw scores;
5. The Context Builder enforces scope, purpose, temporal, completeness, trust, deduplication, and budget gates;
6. Evidence Sufficiency calculates gaps by required evidence type and limits supplementary retrieval to two rounds;
7. All three critical Claims are bound to Evidence IDs in the Context Pack;
8. Historical rules and an external email containing prompt injection are rejected deterministically, while the Context Trace is retained.

The Hybrid Retrieval in `v1.0.0` consists of structured queries, full-text search, and graph paths. The Vector Channel is already part of the type contract, but it is not enabled by default until real domain corpora, a pinned Embedding version, ACL policies, and reproducible evaluations are ready.

### Slice 4: Executable production runtime guarantees

Chapter 5 does not pass off more YAML as production readiness. Instead, it turns four categories of guarantees into acceptance checks that can fail:

1. The API, A2A, and MCP parse and propagate W3C Trace Context consistently;
2. A relative timeout becomes an absolute deadline at ingress, and downstream services use only the remaining budget;
3. Startup, liveness, and readiness are separated, with different semantics for database failure and optional-dependency degradation;
4. OpenTelemetry Collector aggregates Spans, and Tempo reconstructs the causal chain across services;
5. Prometheus uses low-cardinality SLIs, recording rules, and actionable alerts, while Grafana provides a preconfigured operations dashboard;
6. Acceptance testing actually stops A2A, confirms that the API remains live while readiness degrades, and then restores the service;
7. PostgreSQL custom-format backups include a manifest containing the revision, size, and SHA-256;
8. Isolated recovery compares content signatures between the source and restored databases and verifies the `C-102` business invariants for tenant `tenant-demo`.

This local platform slice proves that the runtime contracts are executable. It does not present single-machine recovery times or local thresholds as enterprise production RTOs or SLOs.

### Slice 5: Security control plane beyond the model

Chapter 6 does not hand security responsibility to another model. Instead, it keeps deterministic boundaries in the execution path:

1. Five read-only tools are each bound to a version, definition digest, scope, purpose, resource type, classification, risk, and side effect;
2. Every MCP tool execution passes through a default-deny ToolGuard;
3. Effective permissions are the intersection of the user's, workload's, and current delegation's scopes;
4. Short-lived tokens bind the tenant, task, audience, workload, purpose, and case resource;
5. Drift in a tool definition, scope, or risk declaration causes execution to be denied;
6. Every allow and deny decision is written to a digest-based security audit without copying Prompts, arguments, or tool payloads;
7. OutputGuard minimizes email addresses and phone numbers and blocks synthetic canary secrets and unauthorized Restricted data;
8. Eleven versioned red-team cases and one real malicious collaboration objective jointly verify zero unauthorized side effects.

This evidence covers only the implementation boundaries declared for `v1.0.0`. The repository does not represent its development HS256 task tokens as an enterprise IdP, nor does it represent regex-based detection as a complete DLP system.

### Slice 6: Layered system integration and Runtime Context Graph

Chapter 7 does not add another “universal Agent.” Instead, it integrates the existing Context Team and Collaboration Team into an acceptable system:

1. The Central Supervisor creates and validates an acyclic three-step DAG;
2. The Context Team delivers a Context Pack and evidence-bound Claims;
3. The Collaboration Team dispatches Coverage, Document, and Risk through a real A2A → MCP chain;
4. The system Reducer verifies the rule version, document status, risk gate, evidence, and side effects;
5. `system_runs` and `system_steps` persist parent-child runs, dependencies, attempts, and result summaries;
6. The Runtime Context Graph connects Goal, Plan, Step, Task, Claim, Evidence, Acceptance, and Result;
7. The graph retains only references, classifications, and SHA-256 digests rather than copying raw Prompts or business payloads;
8. Replaying the same idempotency key does not create duplicate system runs, child runs, or provenance graphs.

C-102 passes seven system checks and ends as `SYSTEM_ACCEPTED_WITH_HUMAN_REVIEW`. This means the system proves that human review is a required gate; it does not mean that the system performed any external action.

### Slice 7: Golden Dataset and system-level release gate

Chapter 8 does not create a simplified path solely for evaluation. It runs regression tests directly against Slice 6's real API, A2A → MCP collaboration chain, PostgreSQL, and Runtime Context Graph:

1. The Golden Dataset, Quality Contract, and v0.7.0 Baseline are versioned independently;
2. Five scenario types execute 13 independent HTTP runs;
3. The contract, outcome, path, evidence, security, and efficiency layers are scored separately;
4. Every successful run verifies the three-step DAG, seven acceptance checks, and Claim → Evidence graph invariants;
5. Accessing the Context Graph of each successful run from another tenant must return 404;
6. N-run checks the semantic fingerprints for consistency after excluding run identity and timestamps;
7. Candidate and Baseline are compared in pairs by Case and by Layer, and hard gates cannot offset one another;
8. CI retains each Trial's diagnostics and release decision as a JSON Artifact.

The Conformance runner is deterministic. These 13 runs verify the stability of the control plane and system path; they do not masquerade as an evaluation of the overall distribution of a real stochastic model.

### Slice 8: Incident evidence, resource attribution, and recovery validation

Chapter 9 does not add an “incident analysis Agent” that can freely read logs. Instead, it turns runtime diagnostics into an explicit, idempotent, tenant-isolated persistent product:

1. Only a terminal system run can generate `caseops.operational-assessment.v1`;
2. The report has a fixed structure covering impact, a factual timeline, the first point of failure, an evidence inventory, resource attribution, control recommendations, and a version snapshot;
3. Diagnostics drill down from `system_runs` and `system_steps` to `collaboration_runs` and `delegated_tasks`;
4. The Incident Bundle stores only references, digests, and counts rather than copying Prompts, tool arguments, or business payloads;
5. Step attempts, Context Runs, delegation attempts, and security decisions are accounted for separately instead of combining unlike units;
6. When token usage and a versioned price table are unavailable, monetary cost is explicitly `null`;
7. GameDay actually stops A2A and verifies that the three delegated tasks fail in a controlled manner, the first failure occurs in the collaboration layer, and external side effects remain at 0;
8. After A2A is restored, a new system run must once again produce a healthy assessment;
9. CI retains the three baseline, incident, and recovery assessments as versioned JSON evidence.

One measured run produced three operational assessments, 12 resource cost events, and three audit records; all 62 engineering tests passed, with branch-aware coverage at 85.99%.

### Slice 9: Clean-environment reproduction and verifiable release

Chapter 10 does not add more business Agents. Instead, it closes the delivery evidence chain from source code to consumer:

1. The Python base image is pinned to an immutable digest, while separate hash-locked files constrain runtime and development dependencies;
2. Final review builds only from the committed `git archive HEAD`, without reading `.env`, local databases, caches, or historical reports;
3. The clean image verifies UID 10001, package version, OCI version, source revision, and migration head;
4. Syft scans the actual runtime image and generates an SPDX 2.3 JSON SBOM;
5. The Release Evidence Manifest binds the Commit, image Digest, OpenAPI, evaluation, GameDay, SBOM, and file digests;
6. The GitHub Release Workflow reruns the full set of gates before pushing the GHCR image and download bundle;
7. The image receives build provenance and an SBOM Attestation, while the download bundle receives an independent provenance Attestation;
8. `gh attestation verify` and `SHA256SUMS` let consumers verify provenance and integrity without relying on the author's word.

This slice preserves explicit boundaries: an SBOM is not a vulnerability report, and an Attestation is not a security certification. They make “what is included” and “where it was built from” verifiable; consumers and business Owners still decide whether to accept the residual risk.

## Run the complete acceptance suite

```bash
git clone https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops.git
cd production-grade-multi-agent-caseops
git checkout v1.0.0

docker compose up --build --wait --wait-timeout 120 -d
make acceptance-chapter-08
make acceptance-chapter-09
make acceptance-chapter-10
```

The three final gates establish system quality, incident recovery, and clean-environment delivery in sequence. The successful terminal output for Chapter 10 is:

```text
clean-room runtime import accepted
chapter 10 accepted: clean archive -> pinned image -> non-root runtime
-> SPDX SBOM -> checksummed release evidence
```

For detailed commands, the evidence inventory, and consumer verification, see the [Chapter 10 runbook](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/blob/v1.0.0/docs/chapter-10-runbook.md). Incident diagnosis and recovery can still be run separately with `make acceptance-chapter-09`.

## Engineering boundaries of the reference implementation

CaseOps does not prove that it is “production-grade” by counting components. It supports the book's conclusions with engineering responsibilities that can fail and can be reviewed:

- **Domain and state**: FastAPI, PostgreSQL, Alembic, tenant boundaries, idempotency, auditing, and transactional Outbox;
- **Agent execution**: explicit state machines, Checkpoints, tool-execution ledgers, MCP Streamable HTTP, and A2A Tasks;
- **Context and security**: Source Registry, full-text and graph retrieval, Context Pack, Tool Guard, Output Guard, and red-team regression tests;
- **Production runtime**: non-root containers, health contracts, W3C Trace Context, Prometheus, Tempo, dependency degradation, and isolated recovery;
- **Quality and operations**: Golden Dataset, layered Graders, N-run, operational assessments, Incident Bundle, and GameDay;
- **Release and supply chain**: hash-locked files, pinned base images, clean Git archives, SPDX SBOM, Release Evidence, and Artifact Attestation.

`v1.0.0` also declares its limitations explicitly: it does not provide enterprise identity integration, capacity certification, PITR, cross-region disaster recovery, evaluation of the overall distribution of a real model, or complete DLP. The public contract covers only capabilities that have been implemented and supported by evidence.

## How the ten chapters share one repository

`main` always remains runnable, and each chapter publishes an immutable milestone tag. Readers can inspect the system's evolution tag by tag or use the complete stable implementation in `v1.0.0`.

| Chapter | Main code increment |
|---|---|
| 1 | Deterministic domain kernel, API, transactions, auditing, Outbox |
| 2 | Tool state machine, MCP, timeout, circuit breaking, and read-only recovery |
| 3 | Supervisor, delegation, parallelism, and Join Contract |
| 4 | Context Pipeline, Hybrid / Agentic RAG, GraphRAG, and evidence |
| 5 | Platform deployment, telemetry, SLOs, and recovery |
| 6 | Tool Guard, permission intersection, privacy release, security auditing, and red teaming |
| 7 | Layered DAG, team integration, system acceptance, and Runtime Context Graph |
| 8 | Golden Dataset, N-run, and continuous regression testing |
| 9 | AgentOps, incident diagnosis, and cost governance |
| 10 | Clean-room acceptance, SBOM, and release provenance |
