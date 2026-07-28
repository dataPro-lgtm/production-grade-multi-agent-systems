# Reading guide

You can read this book from beginning to end or use it as an architecture and engineering handbook. If this is your first encounter with production-grade agent systems, I recommend working through all ten chapters in order. If you are tackling a specific problem, use the table below to go directly to the relevant chapters.

## Start with the problem

| The problem you are solving | Recommended chapters |
|---|---|
| You are unsure whether to use a workflow, a single agent, or a multi-agent system | Chapters 01–03 |
| Tool calls are out of control, state is difficult to recover, or MCP boundaries are unclear | Chapters 02, 05, and 06 |
| Multi-agent collaboration leads to state conflicts, lost evidence, or failure to converge | Chapters 03, 07, and 08 |
| RAG results are stale or conflicting, violate access controls, or cannot be traced to their sources | Chapters 04, 06, and 07 |
| The system works in a demo but cannot be deployed, diagnosed, or recovered reliably | Chapters 05, 07, and 09 |
| You lack a coherent approach to permissions, privacy, approvals, and red-team validation | Chapters 06, 08, and 10 |
| You cannot demonstrate whether a new model, prompt, or architecture is better | Chapters 08 and 09 |
| You are preparing the complete system for acceptance, release, or open-source publication | Chapters 07–10 |

## Start with your role

| Role | Recommended path |
|---|---|
| Architect / Technical lead | 01 → 03 → 05 → 07 → 08 → 10 |
| AI / LLM engineer | 02 → 04 → 06 → 07 → 08 |
| Platform / SRE / Security team | 05 → 06 → 07 → 09 → 10 |
| Data and knowledge engineer | 01 → 04 → 06 → 08 |
| Product technical lead / FDE | 01 → 03 → 07 → 08 → 10 |

## How to read each chapter

Each chapter follows three parallel tracks:

1. **Knowledge track**: Understand the concepts, principles, decision methods, and boundaries where the approach does not apply.
2. **Engineering track**: Examine contracts, state, code, failure paths, and runtime evidence.
3. **Application track**: Take the checklist or template at the end of the chapter and apply it to your own system.

As you read, first identify the risk the chapter is intended to address, then examine the responsibilities and control flow in the architecture diagram. Once you understand the conclusions, switch to the corresponding pinned version of CaseOps and run its acceptance checks. Getting the services to start is only the beginning. The real definition of done is captured in tests, evaluations, traces, audit records, and release evidence.

[Browse the full table of contents](book-roadmap.md){ .md-button .md-button--primary }
[Start with Chapter 01](../chapters/01-what-is-an-ai-agent.md){ .md-button }
[Run CaseOps](caseops-project.md){ .md-button }
