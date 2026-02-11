# Execute Phase

Run all tasks in a phase with parallel agent execution, quality gates, and automatic status tracking.

## Input

$ARGUMENTS — phase number (e.g., "1", "1.5", "2")

## Process

### 1. Load Phase Tasks
Read `{project-slug}-docs/TASK_BOARD.md` and extract all tasks for the specified phase.

If no project is detected from cwd, ask which project to execute.

### 2. Filter to Actionable Tasks
- Include only PENDING tasks
- Exclude DONE, IN_PROGRESS, or BLOCKED tasks
- Verify cross-phase dependencies (tasks from earlier phases) are DONE
- If any cross-phase dependencies are not DONE, report them and stop

### 3. Compute Execution Batches
Topological sort of the dependency graph within this phase:

```
Batch 1: Tasks with no intra-phase dependencies
Batch 2: Tasks that depend only on Batch 1 tasks
Batch 3: Tasks that depend on Batch 1+2 tasks
...
```

**Conflict detection**: If two tasks in the same batch modify the same file (check "Files to Create/Modify" in specs), move one to the next batch.

Display the batch plan before executing:
```
Phase {N} Execution Plan:
  Batch 1 (parallel): T001 [scaffold-agent/haiku], T008 [types-agent/sonnet]
  Batch 2 (parallel): T002 [backend-agent/sonnet], T003 [frontend-agent/sonnet]
  Batch 3 (sequential): T005 [infra-agent/sonnet] → T006 [test-agent/haiku]
  Quality gate: haiku
```

### 3.5. Cost Assessment

Before executing, run the `cost-assessor` agent to estimate token usage and cost for this phase.

Present the projection table to the user showing:
- Per-task estimated tokens and cost by assigned model
- Alternative costs if models were swapped
- Total phase estimate

**USER CHECKPOINT**: The user reviews the assessment and can:
- **Approve** — proceed with current model assignments
- **Override** — specify task:model pairs to change (e.g., "T005:opus, T008:haiku")
- **Cancel** — abort phase execution

If overrides are specified, update the task's agent invocation to use the overridden model.

### 4. Execute Each Batch
For each batch, launch parallel Task agents:

Each agent receives:
- The task spec file content
- The project's CLAUDE.md conventions
- Relevant existing code context (files referenced in task spec)
- The appropriate skill context

Each agent must:
1. Create branch: `feat/TXXX-task-name`
2. Implement the task following project conventions
3. Run verification (typecheck, tests, lint)
4. Commit: `[Phase X] TXXX: Brief description`
5. Report results

**Parallelism limit**: Maximum 3-5 concurrent agents per batch to manage merge complexity.

### 5. Quality Gate
After each task completes, run the `quality-gate` agent to validate:
- All acceptance criteria met
- Types pass
- Tests pass
- No hardcoded secrets
- No lint violations
- Files match the task spec's "Files to Create/Modify"

Results: **PASS** or **FAIL** with specifics.

### 6. Update Task Board
For each completed task:
- If quality gate PASS → mark DONE on TASK_BOARD.md
- If quality gate FAIL → mark BLOCKED with failure reason
- Add note about what failed for retry

### 7. Update Changelog
Append to `resources/changelog.md`:
```markdown
## [YYYY-MM-DD] Phase {N}, Batch {M}
- TXXX: Brief description — DONE
- TYYY: Brief description — DONE
- TZZZ: Brief description — FAILED (reason)
```

### 8. Report
Output summary:
```
Phase {N} Execution Report
========================
Batch 1: T001 ✓, T008 ✓
Batch 2: T002 ✓, T003 ✓, T004 ✗ (test failures)
Batch 3: T005 ✓, T006 (skipped — depends on T004)

Results: 5/7 tasks complete, 1 failed, 1 skipped
Failed: T004 — 2 test failures in auth.test.ts
Skipped: T006 — blocked by T004

Next: Fix T004 failures, then re-run `/execute-phase {N}`
```

## Important Notes
- Never force-push or overwrite another agent's work
- If a task fails, don't retry automatically — report for human review
- Keep branches separate (one per task) to avoid merge conflicts
- After all batches complete, consider merging task branches to main
