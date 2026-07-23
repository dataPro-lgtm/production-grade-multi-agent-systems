# Context Engineering 设计画布

> 用于设计一次 Agent 或 RAG 系统的上下文生产链路。先定义决策和证据，再选择检索技术。

## 1. 任务与决策

| 字段 | 内容 |
|---|---|
| Use Case |  |
| 用户要做出的决策 |  |
| Agent 要完成的目标 |  |
| `as_of` / 时间切面 |  |
| 验收标准 |  |
| 不允许发生的结果 |  |
| 最大检索轮数 |  |
| 截止时间与费用预算 |  |

## 2. Context Inventory

| 类型 | 必需信息 | 来源 | Owner | 生命周期 | 是否进入模型 |
|---|---|---|---|---|---|
| Environmental |  |  |  | Runtime |  |
| Task & Goal |  |  |  | Task |  |
| Historical / Memory |  |  |  | Thread / Cross-conversation |  |
| Agent State |  |  |  | Run |  |
| Orchestration |  |  |  | Task Graph |  |
| Temporal |  |  |  | Event / Valid Time |  |
| Policy & Normative |  |  |  | Versioned |  |

对每项上下文继续回答：

- 来源是否权威？
- 谁可以写入、更正和删除？
- 用户、Agent 和当前用途是否有权读取？
- 多久后过期？
- 是否存在替代版本？
- 超预算时怎样压缩或省略？
- 是否需要进入 Model Context，还是只进入 Tool Runtime？

## 3. Source Manifest

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

### 索引对象最低字段

- `source_id`
- `source_version`
- `content_hash`
- `observed_at`
- `valid_time`
- `acl_labels`
- `parser_version`
- `locator`

## 4. Evidence Contract

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

检查：

- [ ] Evidence 能回到原始来源；
- [ ] 时间范围覆盖待支持的 Claim；
- [ ] 权限在数据返回前执行；
- [ ] 压缩和脱敏步骤可见；
- [ ] 删除或更正可以传播。

## 5. Retrieval Plan

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

### 查询形状与通道

| 查询形状 | 首选通道 |
|---|---|
| 编号、错误码、精确术语 | FTS / BM25 |
| 同义表达、概念和描述 | Vector |
| 所属、依赖、路径、影响范围 | Graph |
| 计数、分组、时间窗口 | SQL / Analytics |
| 当前订单、部署或库存 | Operational API / DB |

## 6. Context Pack Manifest

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

### Pack 不变量

- [ ] 相关：每项内容服务当前任务；
- [ ] 授权：用户、Agent 和用途允许访问；
- [ ] 及时：满足 `as_of`、有效期和 Freshness；
- [ ] 可追溯：有来源、版本和 Locator；
- [ ] 有预算：按策略选择，没有随机截断；
- [ ] 可评测：Pack 可以保存、重放和比较。

## 7. Graph Query Guard

| 控制 | 配置 |
|---|---|
| 节点 Allowlist |  |
| 关系 Allowlist |  |
| 允许方向与路径模板 |  |
| 最大 Hop |  |
| `LIMIT` |  |
| 查询超时 |  |
| 只读事务 |  |
| Tenant / Object ACL |  |
| Valid Time 条件 |  |
| 成本上限 |  |
| 返回 Schema |  |

## 8. Context Trace

至少记录：

- `source_discovered`
- `retrieval_executed`
- `candidate_rejected`
- `evidence_transformed`
- `pack_built`
- `claim_generated`
- `answer_validated`

每个拒绝事件应包含 Candidate ID、原因、策略或替代版本。

## 9. 分段评测

### Retriever

- Required Evidence Recall：
- Exact Match Recall：
- Multi-hop Path Accuracy：
- Temporal Retrieval Accuracy：

### Context Pack

- Context Precision：
- Provenance Completeness：
- Freshness Accuracy：
- ACL Violation Rate：
- Token Efficiency：
- Compression Fidelity：

### Answer

- Claim Evidence Coverage：
- Faithfulness：
- Citation Correctness：
- Epistemic Status Accuracy：
- Missing Evidence Disclosure：

## 10. 故障注入

- [ ] 向量检索返回高相似旧版本；
- [ ] 正确证据位于原始 Top-k 之外；
- [ ] Graph 关系缺少 `valid_to`；
- [ ] 文档包含间接 Prompt Injection；
- [ ] Pack 超出预算；
- [ ] 压缩器删除否定词、金额或时间；
- [ ] 当前用户只能查看脱敏摘要；
- [ ] 两份来源给出互相冲突的结论；
- [ ] 文档删除后仍存在于缓存或 Memory；
- [ ] 动态检索连续两轮没有新证据。

## 11. 上线门禁

- [ ] 关键 Claim 100% 绑定 Evidence ID；
- [ ] ACL Violation Rate 为 0；
- [ ] 旧版、未来版和已删除证据不会进入 Pack；
- [ ] Graph 查询满足 Schema、Hop、时间和成本限制；
- [ ] Pack 可保存并重放；
- [ ] Retriever、Pack、Answer 失败能够分别定位；
- [ ] 动态检索具有轮数、时间、费用和无进展终止；
- [ ] 相比简单两步 RAG 的收益已被量化。
