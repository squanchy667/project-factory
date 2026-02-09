# Plan Project

Generate full planning artifacts for a project — architecture docs, phased task breakdown, dependency graph, and agent strategy.

## Input

$ARGUMENTS — project name (e.g., "CollabTool"). If omitted, detect from current working directory.

## Process

### 1. Locate Project
Find the project at `/Users/ofek/Projects/Claude/{ProjectName}/`.
Identify:
- Code repo: `{project-slug}/`
- Docs repo: `{project-slug}-docs/`

If the docs repo doesn't exist, tell the user to run `/init-project` first.

### 2. Read Existing Context
- Read `{project-slug}-docs/README.md` for vision and description
- Read `{project-slug}-docs/PLAN.md` for any existing planning (may have been manually enriched)
- Read code repo structure to understand what's already built
- Check project type from template markers or infer from tech stack

### 3. Generate Architecture Docs
Use the `project-planner` agent to produce:

**`architecture/system-overview.md`**:
- High-level architecture diagram (ASCII art)
- Component descriptions with responsibilities
- Technology choices and rationale
- Deployment topology
- Key design decisions

**`architecture/data-flow.md`**:
- Request/response flow diagrams
- Data transformation pipeline
- State management approach
- Error handling and propagation

### 4. Generate Phase Breakdown
Use the `project-planner` agent to break the project into phases:
- Phase 1 — Foundation (scaffold, types, core infra)
- Phase 2+ — Feature phases (based on project scope)
- Final phase — Production (security, deployment, monitoring)

Each phase should have:
- A clear theme/goal
- 3-12 tasks
- Logical dependency ordering

### 5. Generate Task Specs
For each task, create `tasks/phase-X/TXXX-task-name.md` with:
- Meta (phase, agent type, dependencies, blocks, branch)
- Objective (1-2 sentences)
- Context (why it matters)
- Numbered subtasks with concrete file paths
- Files to create/modify (with actual paths)
- Acceptance criteria (testable checkboxes)

### 6. Build TASK_BOARD.md
Phase tables with columns:
| ID | Task | Agent Type | Depends On | Status |

- Link task names to their spec files
- Mark all tasks as PENDING
- Add summary table at bottom

### 7. Generate development-agents.md
- List all agent types needed for this project
- Describe what each handles
- Map tasks to agent types
- Include batch execution plan:
  - Batch ordering (topological sort)
  - Parallelism recommendations
  - Estimated agent count per batch

### 8. Update SUMMARY.md
Rebuild the table of contents to include:
- All architecture docs
- All developer docs
- Product docs
- Testing docs
- Task board + phase directories

### 9. Update PLAN.md
Enrich with:
- Architecture summary (link to full docs)
- Phase overview with task counts
- Dependency graph summary
- Timeline estimate (phases, not dates)

## Output

Report:
- Phases: {count} phases
- Tasks: {count} total tasks
- Agent types: {list}
- Batch execution: {count} batches, max {N} parallel agents
- Files created: {list}
- Next step: "Run `/tailor-agents {ProjectName}` to generate project-specific .claude/ config"

## Quality Checklist
- [ ] Every task has a spec file in tasks/phase-X/
- [ ] Every task has concrete file paths (not generic)
- [ ] Every task has testable acceptance criteria
- [ ] Dependencies form a valid DAG (no cycles)
- [ ] Phase 1 produces a running application
- [ ] SUMMARY.md links are all valid
- [ ] TASK_BOARD.md matches task spec files
- [ ] No {{placeholder}} variables remain
