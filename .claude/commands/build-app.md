# Build App

Full pipeline orchestrator: idea → production. Chains all 7 meta-commands with user checkpoints between major phases. Can be interrupted and re-run — automatically resumes from the last completed step.

## Input

$ARGUMENTS — `"ProjectName" project-type "Description"`

Same format as `/init-project`.

Supported types: `react-express`, `fullstack-aws`, `unity-game`, `typescript-lib`

**Examples:**
- `"CollabTool" react-express "Real-time collaboration tool with Kanban boards"`
- `"CloudNotes" fullstack-aws "Note-taking app with real-time sync and AI summaries"`
- `"TarotBattle" unity-game "Tarot-themed card battler with multiplayer"`
- `"ZodUtils" typescript-lib "Utility library extending Zod with common patterns"`

## Process

### 1. Parse & Validate

Extract from $ARGUMENTS:
- `ProjectName` — display name (first quoted string or first word)
- `project-type` — one of: react-express, fullstack-aws, unity-game, typescript-lib
- `description` — project description (remaining quoted string or text)

Derive:
- `project-slug` — kebab-case of ProjectName (e.g., "CollabTool" → "collabtool")
- `parent-dir` — `/Users/ofek/Projects/Claude/{ProjectName}/`

Validate:
- Project type is one of the 4 supported types
- If project already exists at `parent-dir`, detect current state and ask user: **resume from last completed step**, or **abort**?

### 2. Detect State (Resumption Logic)

Check the project's current state to determine where to resume:

| Check | Means | Resume From |
|-------|-------|-------------|
| No `{parent-dir}` directory | Fresh start | Step 3 (Birth) |
| Repos exist but no `TASK_BOARD.md` in docs repo | Init done | Step 4 (Plan) |
| `TASK_BOARD.md` exists but no `.claude/` in code repo | Plan done | Step 5 (Configure) |
| `.claude/` exists in code repo but no test files | Configure done | Step 6 (Test) |
| Test files exist, all tasks PENDING | Tests done | Step 7 (Build Phase 1) |
| Some phases DONE, some PENDING | Build in progress | Step 7 (Build next incomplete phase) |
| All tasks DONE | Build complete | Step 8 (Learn) |

For resumption, report: "Detected project state: {state}. Resuming from Step {N} ({name})."

### 3. Birth (runs `/init-project`)

Run `/init-project "{ProjectName}" {project-type} "{description}"`.

This creates:
- Code repo at `{parent-dir}/{project-slug}/`
- Docs repo at `{parent-dir}/{project-slug}-docs/`

**Checkpoint:** Report repos created, show directory structure.

**Abort condition:** If directory creation fails, stop and report the error.

### 4. Plan (runs `/plan-project`)

Run `/plan-project {ProjectName}`.

This generates:
- `PLAN.md` — Architecture vision, tech stack, phase outline
- `TASK_BOARD.md` — Phase tables with task IDs, dependencies, agent assignments
- `development-agents.md` — Agent strategy and batch execution plan
- `tasks/phase-X/TXXX-task-name.md` — Individual task specs

**Checkpoint:** Report task count, phase count, show phase summary.

**USER REVIEW POINT — STOP HERE AND WAIT.**

Display a summary of TASK_BOARD.md showing:
- Total tasks and phases
- Phase breakdown (phase number, theme, task count)
- Key architectural decisions from PLAN.md

Tell the user:
> Planning complete. Please review the artifacts in `{project-slug}-docs/` before continuing:
> - `PLAN.md` — Architecture and phase outline
> - `TASK_BOARD.md` — Full task breakdown
> - `tasks/` — Individual task specs
>
> When ready, re-run `/build-app` to resume from the Configure step.

**Do NOT auto-continue past this point.** The user must explicitly re-invoke `/build-app` to proceed.

### 5. Configure (runs `/tailor-agents`)

Run `/tailor-agents {ProjectName}`.

This generates the code repo's `.claude/` directory:
- Agents customized with real file paths and conventions
- Commands tailored to the tech stack
- Skills with project-specific patterns
- `CLAUDE.md` describing the project's stack and structure

**Checkpoint:** Report agent count, command count, skill count.

### 6. Test (runs `/generate-tests`)

Run `/generate-tests {ProjectName}`.

This generates pre-implementation test suites:
- One test file per task with assertions linked to acceptance criteria
- All tests fail before implementation (they define "done")

**Checkpoint:** Report test file count, total assertion count.

### 7. Build (runs `/execute-phase` for each phase)

Read `TASK_BOARD.md` to determine the total phase count and phase numbers.

For each phase in order (1, 1.5, 2, 3, ...):

1. Run `/execute-phase {N}`
2. Report results: tasks passed / failed / skipped
3. **If any tasks FAILED:**
   - Pause and report failures with details
   - Tell the user: "Phase {N} has failures. Fix the issues, then re-run `/build-app` to resume."
   - **Do NOT advance to the next phase.** Stop execution.
4. **If all tasks PASSED:** advance to next phase

After ALL phases complete successfully, run `/sync-docs full` to synchronize documentation.

### 8. Learn (runs `/capture-learnings`)

Run `/capture-learnings {ProjectName}`.

This produces:
- Retrospective document in `project-factory/knowledge-base/{project-slug}-retrospective.md`
- Updates to patterns catalog if new patterns were identified

**Checkpoint:** Report patterns added, retrospective location.

## Output

Final report after all steps complete:

```
Build Complete: {ProjectName}
==============================
Type: {project-type}
Description: {description}

Step 1 — Birth:     ✓ Code repo + docs repo created
Step 2 — Plan:      ✓ {N} tasks across {M} phases
Step 3 — Configure: ✓ {A} agents, {B} commands, {C} skills
Step 4 — Test:      ✓ {T} test files, {U} assertions
Step 5 — Build:     ✓ {D}/{N} tasks complete across {M} phases
Step 6 — Docs:      ✓ Synced
Step 7 — Learn:     ✓ Retrospective at project-factory/knowledge-base/{slug}-retrospective.md

Project: /Users/ofek/Projects/Claude/{ProjectName}/
Code:    {project-slug}/
Docs:    {project-slug}-docs/
```

## Important Notes

- **Never skip a step** — each step depends on the output of the previous
- **User review after planning is mandatory** — don't auto-continue past Step 4
- **Failed phases halt the pipeline** — fix failures before advancing
- **Resumption is automatic** — re-running `/build-app` detects state and picks up where it left off
- **All sub-commands execute with their full logic** — this orchestrator delegates, it doesn't duplicate
