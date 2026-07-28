# Context engineering design canvas

> Use this canvas to design the context production pipeline for an agent or RAG system. Define decisions and evidence first, then select retrieval techniques.

## 1. Task and decision

| Field | Content |
|---|---|
| Use Case |  |
| Decision the User Must Make |  |
| Goal the Agent Must Accomplish |  |
| `as_of` / Time Slice |  |
| Acceptance Criteria |  |
| Disallowed Outcomes |  |
| Maximum Retrieval Rounds |  |
| Deadline and Cost Budget |  |

## 2. Context inventory

| Type | Required Information | Source | Owner | Lifecycle | Included in Model |
|---|---|---|---|---|---|
| Environmental |  |  |  | Runtime |  |
| Task & Goal |  |  |  | Task |  |
| Historical / Memory |  |  |  | Thread / Cross-conversation |  |
| Agent State |  |  |  | Run |  |
| Orchestration |  |  |  | Task Graph |  |
| Temporal |  |  |  | Event / Valid Time |  |
| Policy & Normative |  |  |  | Versioned |  |

For each context item, also answer:

- Is the source authoritative?
- Who may write, correct, and delete it?
- Do the user, the agent, and the current purpose have read access?
- When does it expire?
- Are alternative versions available?
- How should it be compressed or omitted when over budget?
- Does it need to enter the Model Context, or only the Tool Runtime?

## 3. Source manifest

```yaml
source_id:
source_type: doc | git | db | api | graph
owner_team:
classification:
acl_policy:
refresh_sla:
valid_time_field:
deletion_mode:
parser_version:
schema_version:
```

### Minimum fields for indexed objects

- `source_id`
- `source_version`
- `content_hash`
- `observed_at`
- `valid_time`
- `acl_labels`
- `parser_version`
- `locator`

## 4. Evidence contract

```yaml
evidence_id:
source_id:
source_version:
locator:
content:
claims_supported:
  -
observed_at:
valid_time:
  from:
  to:
access_label:
retrieval_scores:
transformations:
content_hash:
```

Checks:

- [ ] Evidence can be traced back to the original source;
- [ ] The time range covers the Claim to be supported;
- [ ] Authorization is enforced before data is returned;
- [ ] Compression and redaction steps are visible;
- [ ] Deletions or corrections can propagate.

## 5. Retrieval plan

```yaml
question:
intents:
  -
entities:
  - type:
    id:
time_scope:
  from:
  to:
  as_of:
channels:
  - fts
  - vector
  - graph
  - sql
  - api
filters:
required_graph_paths:
evidence_requirements:
  -
max_rounds:
deadline:
token_budget:
termination:
  no_progress_rounds:
  on_missing_evidence: partial
```

### Query shapes and channels

| Query Shape | Preferred Channel |
|---|---|
| IDs, error codes, and exact terms | FTS / BM25 |
| Synonymous expressions, concepts, and descriptions | Vector |
| Ownership, dependencies, paths, and impact scope | Graph |
| Counts, groupings, and time windows | SQL / Analytics |
| Current orders, deployments, or inventory | Operational API / DB |

## 6. Context pack manifest

```yaml
pack_id:
task_id:
purpose:
as_of:
instruction_version:
goal_ref:
state_version:
evidence:
  - evidence_id:
tools:
  - name:
    version:
omissions:
  - candidate:
    reason:
token_allocation:
  instructions:
  task_state:
  evidence:
  tools:
  response_reserve:
built_at:
builder_version:
pack_hash:
```

### Pack invariants

- [ ] Relevant: every item serves the current task;
- [ ] Authorized: the user, agent, and use are permitted access;
- [ ] Timely: satisfies `as_of`, validity periods, and Freshness requirements;
- [ ] Traceable: includes Source, Version, and Locator;
- [ ] Budgeted: selected according to policy, with no random truncation;
- [ ] Evaluable: the Pack can be saved, replayed, and compared.

## 7. Graph query guard

| Control | Configuration |
|---|---|
| Node Allowlist |  |
| Relationship Allowlist |  |
| Allowed Directions and Path Templates |  |
| Maximum Hop Count |  |
| `LIMIT` |  |
| Query Timeout |  |
| Read-Only Transaction |  |
| Tenant / Object ACL |  |
| Valid Time Conditions |  |
| Cost Limit |  |
| Return Schema |  |

## 8. Context trace

Record at least:

- `source_discovered`
- `retrieval_executed`
- `candidate_rejected`
- `evidence_transformed`
- `pack_built`
- `claim_generated`
- `answer_validated`

Each rejection event should include the Candidate ID, reason, policy, or alternative version.

## 9. Layered evaluation

### Retriever

- Required Evidence Recall:
- Exact Match Recall:
- Multi-hop Path Accuracy:
- Temporal Retrieval Accuracy:

### Context pack

- Context Precision:
- Provenance Completeness:
- Freshness Accuracy:
- ACL Violation Rate:
- Token Efficiency:
- Compression Fidelity:

### Answer

- Claim Evidence Coverage:
- Faithfulness:
- Citation Correctness:
- Epistemic Status Accuracy:
- Missing Evidence Disclosure:

## 10. Fault injection

- [ ] Vector retrieval returns an outdated version with high similarity;
- [ ] The correct evidence falls outside the original Top-k;
- [ ] A Graph relationship lacks `valid_to`;
- [ ] A document contains indirect Prompt Injection;
- [ ] The Pack exceeds its budget;
- [ ] The compressor removes a negation, monetary amount, or time reference;
- [ ] The current user may view only a redacted summary;
- [ ] Two sources present conflicting conclusions;
- [ ] A deleted document remains in a cache or Memory;
- [ ] Dynamic retrieval produces no new evidence for two consecutive rounds.

## 11. Release gates

- [ ] 100% of critical Claims are bound to Evidence IDs;
- [ ] ACL Violation Rate is 0;
- [ ] Outdated, future-version, and deleted evidence cannot enter the Pack;
- [ ] Graph queries satisfy Schema, Hop, time, and cost constraints;
- [ ] The Pack can be saved and replayed;
- [ ] Retriever, Pack, and Answer failures can be isolated independently;
- [ ] Dynamic retrieval has round, time, cost, and no-progress termination limits;
- [ ] Benefits over a simple two-step RAG pipeline have been quantified.
