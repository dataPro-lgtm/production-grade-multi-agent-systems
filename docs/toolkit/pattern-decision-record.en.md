# Multi-Agent Pattern Decision Record (PDR)

> Use this template to document a multi-agent collaboration pattern decision. The goal is not to prove that the design is “advanced,” but to explain why it fits the current constraints better than a simpler baseline and when to fall back.

## 1. Basic information

| Field | Content |
|---|---|
| PDR ID | PDR-000 |
| Decision name |  |
| Status | Proposed / Accepted / Superseded |
| Date |  |
| Decision makers |  |
| Related ADR / requirement / incident |  |

## 2. Task and constraints

### Objective

<!-- Describe the objective in terms of an acceptance-testable outcome. Avoid vague statements such as “improve intelligence.” -->

### Why consider multiple agents

| Candidate boundary | Present? | Evidence |
|---|---|---|
| Domain boundary |  |  |
| Data boundary |  |  |
| Tool boundary |  |  |
| Permission boundary |  |  |
| State boundary |  |  |
| Failure boundary |  |  |
| Team boundary |  |  |

### Key constraints

- Latency / SLO:
- Cost budget:
- Data and permissions:
- Risk and approval:
- Availability and degradation:
- Evidence and audit:

## 3. Control model

| Question | Decision |
|---|---|
| Who decides the next step? |  |
| Who owns the global objective and outcome? |  |
| How are the agents connected? |  |
| What is the actual boundary of each agent? |  |
| How does the system complete, partially complete, or stop? |  |

## 4. Candidate options

| Option | Benefits | Risks / costs | Advance to validation? |
|---|---|---|---|
| Deterministic workflow |  |  |  |
| Single agent |  |  |  |
| Handoff |  |  |  |
| Supervisor |  |  |  |
| Router + Fan-Out/Join |  |  |  |
| Other |  |  |  |

## 5. Decision

### Selected pattern and composition

<!-- Example: deterministic backbone + Supervisor + three-way Fan-Out/Join. -->

### Why not choose a simpler baseline

### Ownership and state writers

| State / artifact | Owner | Concurrency and versioning strategy |
|---|---|---|
| Global Task |  |  |
| Agent Local State |  |  |
| Delegation Ledger |  |  |
| Artifact / Evidence |  |  |
| Policy / Approval |  |  |

### Collaboration contracts

- Delegation Contract:
- Result Contract:
- Evidence Contract:
- Join Contract:

### Permission and risk boundaries

- Effective permissions after delegation:
- Whether further delegation is allowed:
- Maximum risk level for automatic execution:
- Human approval points:

## 6. Failure and convergence

| Scenario | Handling |
|---|---|
| Single-agent timeout |  |
| Invalid Result Schema |  |
| Conflicting evidence |  |
| Dependency unavailable |  |
| Duplicate message / result |  |
| Budget exhausted |  |
| Repeated lack of progress |  |
| Unapproved high-risk action |  |

## 7. Validation plan

| Metric | Simple baseline | Target | Observation window |
|---|---:|---:|---|
| Task success rate |  |  |  |
| Result evidence coverage |  |  |  |
| End-to-end latency P95 |  |  |  |
| Cost per task P95 |  |  |  |
| Completion rate under degraded operation |  |  |  |
| Unauthorized side effects |  | 0 |  |

### Fault injection

- [ ] One agent times out;
- [ ] One agent returns an invalid Schema;
- [ ] Two agents submit conflicting conclusions;
- [ ] A message or result is delivered more than once;
- [ ] The Supervisor exceeds the depth, width, or budget limit;
- [ ] A high-risk action lacks approval;
- [ ] The Artifact hash or version does not match.

## 8. Fallback and review

### Fallback plan

<!-- Explain how to return to a deterministic workflow or a single agent, including how data and interface compatibility will be maintained. -->

### Review triggers

- Multi-agent collaboration does not materially improve quality or latency;
- Collaboration costs exceed the benefits;
- The Supervisor / Join becomes the primary bottleneck;
- Permission, evidence, or state boundaries can no longer be sustained;
- Business objectives, risk levels, or team ownership change.

## 9. Outcome

<!-- After release, add the actual metrics, deviations, incidents, and final conclusion. -->
