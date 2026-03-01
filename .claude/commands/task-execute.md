# Task Execute

Execute a task from the Agent Pilot task board autonomously.

## Input

Task ID: $ARGUMENTS (e.g., T001, T016, T027)

## Process

### 1. Load Task Spec
Read the task specification from `agentpilot-docs/TASK_BOARD.md`. Each task has:
- Type, Priority, Dependencies
- File(s) to create/modify
- Description with implementation details
- Acceptance criteria checklist

### 2. Check Dependencies
Verify all "Depends on" tasks are marked DONE. If any are not, report which dependencies are missing and stop.

### 3. Understand Context
- Read existing code files that will be modified or extended
- Read `core/shared/types.ts` for type definitions
- Read related modules to understand established patterns
- Check `PLAN.md` for architectural context

### 4. Plan Implementation
Before writing any code:
- List all files to create/modify
- Identify the implementation sequence
- Note any decisions that need user input

### 5. Execute
Implement the task following Agent Pilot conventions:
- Zod schemas first, then infer types
- Barrel exports in `index.ts`
- Relative imports within module, path-based across modules
- `import type` for type-only imports
- JSDoc on all public APIs
- No `any` — use `unknown` with type guards
- Result types for expected failures
- Custom error classes per domain

### 6. Verify
- Run `npm run typecheck` to verify types compile
- Run `npm test` if tests were written
- Check acceptance criteria from the task spec

### 7. Report
Output a summary:
- What was implemented
- Files created/modified
- Any decisions made
- Acceptance criteria status
- Suggested next steps

## Important
- Always read the full task spec before starting
- Follow the acceptance criteria exactly
- Don't modify files outside the task's scope
- Create a git branch: `feat/{task-id}-{short-name}` (e.g., `feat/T009-task-analyzer`)
- Commit format: `[Phase X] TXXX: Brief description`
