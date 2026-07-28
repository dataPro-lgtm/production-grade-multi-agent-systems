# Agent definition card

Complete this card before creating an agent. If a field cannot be answered clearly, its boundary has usually not been fully designed.

| Field | What to enter |
|---|---|
| Agent name | Name it after its responsibility domain; avoid using only a persona name |
| Business objective | Whose problem it solves and what that problem is |
| Success criteria | How to determine that the work is complete and correct |
| Allowed inputs | Which tasks, context, and identities it accepts |
| Allowed outputs | What structure and evidence it must return |
| Allowed tools | Which tools it may invoke and whether they have read or write access |
| Data boundary | Which data it may access |
| Permission boundary | Which actions are forbidden or require approval |
| State | Which task state must be persisted |
| Budget | Limits on time, tokens, cost, and retries |
| Termination conditions | Conditions for success, failure, handoff to a human, and refusal |
| Evaluation | Which datasets and metrics are used for validation |
| Owner | Who maintains and approves it, and responds to incidents |

## Minimal example

```yaml
name: refund-analysis-agent
goal: Identify the main drivers of refund-rate changes within the specified scope
success:
  - Every conclusion is supported by query evidence
  - The denominator, time range, and filters are explicit
allowed_tools:
  - metadata_search
  - read_only_sql
forbidden:
  - Write to production databases
  - Bypass row- and column-level permissions
stop:
  - Evidence meets the release threshold
  - Budget is exhausted
  - Permissions are insufficient
  - Human clarification is required
```
