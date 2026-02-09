# Task Management Skill

Task lifecycle, numbering, dependency management, and parallel execution knowledge.

## TXXX Numbering Scheme

- Format: `T` + three-digit zero-padded number (T001, T002, ... T099, T100)
- Numbers are sequential within a project
- Never reuse a number, even if a task is deleted
- Tasks are globally unique within a project

## Dependency Graph Rules

### Declaring Dependencies
- **Depends On**: List of task IDs that must be DONE before this task starts
- **Blocks**: List of task IDs that cannot start until this task is DONE
- These are inverse references — if T002 depends on T001, then T001 blocks T002
- A task with no dependencies can start immediately

### Dependency Validation
- No circular dependencies allowed
- Cross-phase dependencies are valid (Phase 2 task can depend on Phase 1 task)
- Within a phase, tasks with no inter-dependencies form parallel batches

## Branch Naming

Format: `feat/TXXX-task-name`
- Use kebab-case for the task name portion
- Branch from `main` (or the project's default branch)
- Examples:
  - `feat/T001-monorepo-scaffold`
  - `feat/T014-agent-executor`
  - `feat/T028-admin-dashboard`

## Batch Execution Strategy

Tasks are organized into execution batches using topological sort of the dependency DAG:

```
Batch 1: [T001]              ← No dependencies, runs first
Batch 2: [T002, T008]        ← Both depend only on T001
Batch 3: [T003, T004, T005]  ← Depend on T001+T002, can run in parallel
Batch 4: [T006]              ← Depends on tasks from batch 3
```

### Computing Batches
1. Find all tasks with no unresolved dependencies → Batch N
2. Mark those as "scheduled"
3. Repeat: find tasks whose dependencies are all scheduled → Batch N+1
4. Continue until all tasks are batched

### Parallel Execution Rules
- Tasks in the same batch can run simultaneously
- Each parallel agent gets: task spec + CLAUDE.md + relevant existing code
- If two tasks in a batch modify the same file, they must be serialized
- Maximum parallelism is typically 3-5 agents (context and merge conflict management)

## Task Handoff Pattern

Each task follows this execution flow:
1. **Read** task spec and understand requirements
2. **Check** dependencies are DONE
3. **Branch** — create `feat/TXXX-task-name`
4. **Implement** — write code following project conventions
5. **Test** — run typecheck, tests, lint
6. **Commit** — `[Phase X] TXXX: Brief description`
7. **Update** — mark task DONE on TASK_BOARD.md

## Commit Convention

Format: `[Phase X] TXXX: Brief description`

Examples:
- `[Phase 1] T001: Scaffold monorepo with shared, server, client workspaces`
- `[Phase 2] T014: Implement agent executor with streaming support`
- `[Phase 4] T032: Add rate limiting, input validation, and security headers`

For multi-task commits (rare): `[Phase X] TXXX, TYYY: Brief description`

## Task Status Values

| Status | Meaning |
|--------|---------|
| `PENDING` | Not started, waiting to be picked up |
| `IN_PROGRESS` | Currently being worked on by an agent |
| `IN_REVIEW` | Implementation done, awaiting quality gate |
| `DONE` | Accepted, merged, quality gate passed |
| `BLOCKED` | Cannot proceed — dependency not met or issue found |

## Phase Conventions

Standard phase progression:
1. **Phase 1 — Foundation**: Project scaffold, types, core infrastructure
2. **Phase 1.5** (optional): UX layer, developer experience additions
3. **Phase 2 — Core Features**: Primary business logic and systems
4. **Phase 3 — Integration**: Connecting systems, external integrations
5. **Phase 4 — Production**: Security, monitoring, deployment pipeline
6. **Phase 5 — Polish**: Developer experience, documentation, optimization

Use `.5` phases when scope is discovered mid-project (e.g., Phase 1.5, Phase 2.5).
