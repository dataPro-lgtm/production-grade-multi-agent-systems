---
title: Production readiness and recovery contract
description: A reusable template for state ownership, service runtime, deployment verification, and recovery drills
---

# Production readiness and recovery contract

This template turns “the service can start” into verifiable production guarantees. Each service should first complete a Service Runtime Contract, each type of persistent state should have an entry in the State Ownership Catalog, and the platform owner should then maintain the Deployment Verification and Restore Drill Record.

!!! tip "Usage principles"
    Do not have a model automatically fill out the entire template and then archive it without review. Every Owner, SLO, RPO, RTO, degradation strategy, and recovery invariant requires confirmation from the responsible team, with validation evidence retained in the target environment.

## 1. State Ownership Catalog

```yaml
state_id: task-checkpoint
description: Agent Task Graph, step state, approvals, and recovery cursor

ownership:
  business_owner: agent-platform
  runtime_writer: orchestration-service
  oncall: platform-oncall
  source_of_truth: postgres.agent_tasks
  other_writers_allowed: false

contract:
  schema_version: 42
  consistency: transactional
  ordering_scope: task_id
  durability: durable
  immutable_fields:
    - task_id
    - created_at
  pii_classification: internal
  residency: cn-east

dependencies:
  upstream:
    - gateway
  downstream:
    - worker
    - audit-export
  derived_views:
    - task_search_index

recovery:
  rebuildable: false
  backup_method: base-backup-plus-wal
  backup_interval: continuous
  retention: 35d
  rpo: 5m
  rto: 30m
  restore_order: 2
  runbook: runbooks/restore-task-store.md
  invariants:
    - completed tasks do not re-execute side effects
    - pending tasks resume from the latest valid checkpoint
    - approval decisions remain bound to the original policy version

deletion:
  retention: 365d
  tombstone_propagation:
    - task_search_index
    - audit_export
```

### Catalog review questions

- Who has final authority when conflicts arise?
- Are there two services that both believe they can write to the state?
- Can derived indexes be fully rebuilt from the SoT?
- How do deletions, permission changes, and corrections propagate?
- Do backups include the Schema, key versions, and dependent objects?
- Is there evidence from the most recent RPO / RTO drill?

## 2. Service Runtime Contract

```yaml
service:
  name: evidence-worker
  owner: knowledge-platform
  repository: org/agent-platform
  image: registry.example/evidence-worker@sha256:...
  build_revision: git:a6d42f1
  runtime: python-3.13
  run_as_non_root: true
  read_only_root_filesystem: true

interfaces:
  inbound:
    - protocol: queue
      contract: evidence-index-requested.v3
  outbound:
    - target: object-store
      operation: read-source
    - target: vector-store
      operation: upsert-index

identity:
  workload_identity: evidence-worker
  secrets:
    - name: vector-store-credential
      delivery: secret-manager
      rotation_slo: 24h
  permissions:
    - object:read:knowledge-source
    - vector:write:knowledge-index

startup:
  config_schema: worker-config.v5
  compatible_db_schema: ">=42,<44"
  migrations_run_by_service: false
  max_startup_seconds: 90
  failure_classes:
    - CONFIG_INVALID
    - SECRET_UNAVAILABLE
    - SCHEMA_INCOMPATIBLE

health:
  startup:
    path: /health/startup
    success: config-valid-and-client-initialized
  liveness:
    path: /health/live
    success: event-loop-progressing
  readiness:
    path: /health/ready
    hard_dependencies:
      - queue
      - object-store
    degradable_dependencies:
      - telemetry-collector

shutdown:
  stop_receiving_new_work: true
  checkpoint_inflight_work: true
  release_lease: true
  grace_period_seconds: 120

budgets:
  max_task_seconds: 600
  max_attempts: 5
  max_concurrency: 20
  max_queue_age_seconds: 300
  max_embedding_tokens_per_task: 100000

reliability:
  idempotency_key: source_id-plus-content_hash-plus-index_version
  retry_owner: worker
  retryable_errors:
    - RATE_LIMITED
    - TEMPORARY_UNAVAILABLE
  non_retryable_errors:
    - INVALID_SCHEMA
    - PERMISSION_DENIED
  backoff: exponential-with-full-jitter
  dlq: evidence-index-dlq

telemetry:
  trace_spans:
    - worker.consume
    - source.read
    - embedding.batch
    - vector.upsert
  metrics:
    - worker_tasks_total
    - worker_task_duration_seconds
    - worker_retry_total
    - worker_queue_age_seconds
  forbidden_attributes:
    - source_content
    - access_token
    - user_id

slo:
  indicator: valid index jobs completed within 5 minutes
  objective: 99.5%
  window: 28d
  runbook: runbooks/evidence-worker-slo.md
```

## 3. Deployment Verification

### 3.1 Build and supply chain

- [ ] The image uses a Digest or immutable version;
- [ ] The base image and language dependencies are locked;
- [ ] The SBOM has been generated and archived;
- [ ] Vulnerability scans meet the release policy;
- [ ] Secrets are absent from Git, image layers, and build logs;
- [ ] The Build Revision can be queried from a running instance;
- [ ] The runtime user, file system, and Linux Capabilities comply with least privilege.

### 3.2 Configuration and migration

- [ ] Configuration passes type and range validation;
- [ ] The current application is compatible with the Schema version;
- [ ] The Expand—Migrate—Contract stages have been declared;
- [ ] Data backfill progress and validation are observable;
- [ ] Prompt, Policy, Model Route, Embedding, and Index versions are recorded;
- [ ] A rollback will not read incompatible data.

### 3.3 Health and traffic

- [ ] The Startup Probe passes within the maximum slow-start duration;
- [ ] Liveness detects only internal failures that can be recovered through a restart;
- [ ] Readiness prevents incompatible instances from receiving traffic;
- [ ] Degradable dependencies are separated from hard dependencies;
- [ ] No new tasks are accepted during graceful termination;
- [ ] A Synthetic Check validates the real business path.

### 3.4 State and messaging

- [ ] All persistent state has a single Owner;
- [ ] The SoT and Derived Index are explicit;
- [ ] Consumers remain idempotent under at-least-once delivery;
- [ ] Queue depth, age, Attempt, and DLQ are observable;
- [ ] Replay requires authorization and idempotency validation;
- [ ] A Checkpoint supports recovery after instance replacement.

### 3.5 Observability and alerting

- [ ] Traces span the Gateway, Agent, Tool, Queue, and DB;
- [ ] Metric Labels contain no high-cardinality or sensitive data;
- [ ] Logs use stable error classes and carry a Trace ID;
- [ ] Dashboards show releases and configuration changes;
- [ ] Alerts connect to an Owner, Runbook, and validation action;
- [ ] The SLO and error-budget policy have been approved.

### 3.6 Security

- [ ] The service uses a dedicated Workload Identity;
- [ ] Permissions are narrowed to target resources and allowed actions;
- [ ] The network is default-deny and restricts egress;
- [ ] The Secret rotation drill has passed, and the old version has been revoked;
- [ ] Baggage, Traces, and Logs contain no Secrets / PII;
- [ ] High-risk Tools require policy controls and approval.

## 4. Fault Injection Record

```yaml
experiment_id: fi-model-rate-limit-001
date: 2026-07-23
owner: agent-platform
environment: staging

hypothesis:
  when: primary model route returns 429 for 10 minutes
  system_should:
    - honor retry-after
    - apply bounded jittered retry
    - switch compatible route after retry budget
    - preserve request deadline
    - avoid duplicate tool side effects

injection:
  target: model-gateway
  method: response-fault
  duration: 10m
  blast_radius: test-tenant-only
  abort_condition: production-traffic-detected

observed:
  request_success_rate: 99.2%
  p95_seconds: 74
  retry_amplification: 1.6
  duplicate_side_effects: 0
  alert_fired_seconds: 125
  trace_complete: true

result: passed
evidence:
  dashboard: https://...
  trace_query: https://...
  artifact: s3://...
follow_ups: []
```

## 5. Restore Drill Record

```yaml
drill:
  id: dr-primary-region-loss-001
  scenario: primary-region-loss
  owner: platform-oncall
  started_at: 2026-07-23T01:50:00Z
  completed_at: 2026-07-23T02:07:24Z
  environment: recovery-test

objectives:
  rpo: 5m
  rto: 30m

restore:
  point: 2026-07-23T01:48:28Z
  data_loss_seconds: 92
  service_restore_seconds: 1044
  order:
    - workload-identity
    - postgres
    - object-store
    - queue
    - graph
    - vector-index
    - agent-runtime
    - gateway

versions:
  application: 2.4.1
  db_schema: 42
  tool_contract: v7
  prompt: incident-investigator-v12
  embedding: text-embed-v7
  vector_index: knowledge-2026-07-22
  encryption_key_versions:
    - key-v11
    - key-v12

invariants:
  - name: completed-task-no-replay
    result: passed
    evidence: artifact://...
  - name: pending-task-safe-resume
    result: passed
    evidence: trace://...
  - name: artifact-hash-match
    result: passed
    evidence: report://...
  - name: graph-critical-paths
    result: passed
    evidence: query://...
  - name: vector-source-version-alignment
    result: passed
    evidence: report://...
  - name: synthetic-incident-investigation
    result: passed
    evidence: trace://...

exceptions: []
result: passed
approved_by:
  - platform-owner
  - application-owner
next_drill_due: 2026-10-23
```

## 6. Production Evolution Map

| Local implementation | Target platform implementation | Guarantees to add | Owner | Validation evidence |
|---|---|---|---|---|
| Compose Service |  | Multiple replicas, scheduling, rolling updates |  |  |
| Named Volume |  | Persistence, replication, backup, recovery |  |  |
| Local Secret |  | Identity, rotation, audit |  |  |
| Internal Network |  | Default-deny, egress restrictions |  |  |
| Local Collector |  | High availability, buffering, retention |  |  |
| Manual Snapshot |  | RPO / RTO and Restore Drill |  |  |

## 7. Final sign-off

```yaml
release_candidate: 2.4.1
decision: approved | approved-with-conditions | rejected
conditions: []

evidence:
  build: artifact://...
  contract_tests: artifact://...
  migration_test: artifact://...
  synthetic_test: trace://...
  fault_injection: artifact://...
  restore_drill: artifact://...
  slo_dashboard: https://...

signoff:
  application_owner:
  platform_owner:
  security_owner:
  data_owner:
  approved_at:
```

Only when these fields can be traced back to actual evidence is “production readiness” an engineering conclusion rather than a subjective judgment made in a meeting.
