# Docs Repo Patterns Skill

Proven documentation structure used across all projects. Every docs repo follows this layout for consistency and GitBook compatibility.

## Directory Layout

```
{project-name}-docs/
├── README.md                          # Project overview, vision, tech stack
├── SUMMARY.md                         # GitBook table of contents (navigation)
├── PLAN.md                            # Architecture vision, phase outline
├── TASK_BOARD.md                      # Phase tables with dependency tracking
├── development-agents.md              # Agent types, batch strategy, coverage
├── architecture/
│   ├── system-overview.md             # High-level architecture + diagrams
│   └── data-flow.md                   # Data flow between components
├── developer/
│   ├── setup-guide.md                 # Prerequisites, env vars, first run
│   └── coding-standards.md            # Naming, patterns, conventions
├── product/
│   ├── features.md                    # Feature inventory
│   └── roadmap.md                     # Milestone timeline
├── resources/
│   ├── tech-stack.md                  # Technology choices + rationale
│   ├── changelog.md                   # Chronological change log
│   └── known-issues.md               # Active bugs and workarounds
├── testing/
│   └── test-plan.md                   # Test strategy, coverage goals
└── tasks/
    ├── phase-1/                       # Task specs by phase
    │   ├── T001-task-name.md
    │   └── T002-task-name.md
    ├── phase-1.5/
    └── phase-2/
```

## SUMMARY.md Format

GitBook table of contents. Links are relative. Indentation = nesting.

```markdown
# Summary

* [Overview](README.md)
* [Master Plan](PLAN.md)

## Architecture
* [System Overview](architecture/system-overview.md)
* [Data Flow](architecture/data-flow.md)

## Developer
* [Setup Guide](developer/setup-guide.md)
* [Coding Standards](developer/coding-standards.md)

## Product
* [Features](product/features.md)
* [Roadmap](product/roadmap.md)

## Resources
* [Tech Stack](resources/tech-stack.md)
* [Changelog](resources/changelog.md)
* [Known Issues](resources/known-issues.md)

## Testing
* [Test Plan](testing/test-plan.md)

## Task Board
* [Task Board](TASK_BOARD.md)
* [Phase 1 — Foundation](tasks/phase-1/)
* [Phase 2 — Core](tasks/phase-2/)
```

## TASK_BOARD.md Format

Phase tables with dependency tracking:

```markdown
# Task Board

## How This Works
Each task has a dedicated spec file in `tasks/` with full context for an autonomous agent to execute independently.

### Task Lifecycle
PENDING → IN_PROGRESS → IN_REVIEW → DONE
                ↓
            BLOCKED (waiting on dependency)

---

## Phase 1 — Foundation

| ID | Task | Agent Type | Depends On | Status |
|----|------|-----------|------------|--------|
| T001 | [Monorepo Scaffold](./tasks/phase-1/T001-monorepo-scaffold.md) | scaffold-agent | — | PENDING |
| T002 | [Shared Types](./tasks/phase-1/T002-shared-types.md) | types-agent | T001 | PENDING |

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1 — Foundation | 8 | 0/8 done |
| **Total** | **8** | **0/8 done** |
```

## Task Spec Format

Each task follows this canonical structure:

```markdown
# TXXX — Task Name

## Meta
- **Phase:** X — Phase Name
- **Agent Type:** agent-type
- **Depends On:** T001, T002
- **Blocks:** T010
- **Branch:** `feat/TXXX-task-name`

## Objective
One to two sentences describing what this task delivers.

## Context
Why this matters. What it connects to. Background needed to implement.

## Tasks
1. **Subtask name** (`path/to/file`)
   - Concrete deliverable
   - Implementation detail

2. **Another subtask** (`path/to/file`)
   - Detail

## Files to Create/Modify
path/to/new-file.ts          # Description
path/to/existing-file.ts     # What changes

## Acceptance Criteria
- [ ] Testable criterion 1
- [ ] Testable criterion 2
- [ ] Types pass (`npm run typecheck`)
- [ ] Tests pass (`npm run test`)
```

## Agent Type Conventions

Common agent types used across projects:
- `scaffold-agent` — Project setup, configs, boilerplate
- `types-agent` — Schemas, interfaces, validation
- `backend-agent` — API routes, services, data layers
- `frontend-agent` — Components, hooks, UI patterns
- `fullstack-agent` — Cross-cutting frontend + backend features
- `llm-agent` — LLM integration, streaming, prompts
- `infra-agent` — IaC, deployment, CI/CD
- `test-agent` — Tests, coverage, E2E
- `security-agent` — Auth, hardening, validation
- `tooling-agent` — Dev experience, supporting tools
- `connector-agent` — Data connector implementations
- `agent-builder` — Product agent YAML configs
