# Generate Tests

Generate pre-implementation test suites from task specifications. Tests define "done" before any code is written — implementation agents must pass these pre-existing tests.

## Input

$ARGUMENTS — project name (e.g., "CollabTool"). If omitted, detect from cwd.

## Process

### 1. Locate Project

Find the project at `/Users/ofek/Projects/Claude/{ProjectName}/`.
Identify:
- Code repo: `{project-slug}/`
- Docs repo: `{project-slug}-docs/`

If no docs repo or no TASK_BOARD.md, tell user to run `/plan-project` first.
If no `.claude/` in code repo, tell user to run `/tailor-agents` first.

### 2. Read Context

- Read `{project-slug}-docs/TASK_BOARD.md` for all tasks and phases
- Read `{project-slug}/.claude/CLAUDE.md` for test conventions (framework, file patterns, commands)
- Read any existing test files in code repo for style matching
- Identify test framework from stack (Vitest, Jest, Unity Test Runner, etc.)

### 3. Generate Tests Per Phase

For each phase in TASK_BOARD.md, for each task:
1. Read the task spec file (`tasks/phase-X/TXXX-task-name.md`)
2. Extract acceptance criteria (the `- [ ]` checkboxes)
3. Extract files to create/modify (these are the modules under test)
4. Use the `test-generator` agent to produce test file(s)

### 4. Test Mapping Strategy

Map agent types from task specs to test approaches:

| Agent Type | Test Approach |
|------------|---------------|
| `scaffold-agent` | Config validation tests (files exist, exports correct) |
| `types-agent` | Schema validation tests (valid/invalid inputs) |
| `backend-agent` | Route tests (HTTP method, status codes, response shape) |
| `frontend-agent` | Component tests (renders, interactions, props) |
| `llm-agent` | Integration tests (mock LLM, verify streaming/parsing) |
| `infra-agent` | Config tests (template valid, env vars present) |
| `security-agent` | Security tests (auth required, input sanitized, headers set) |
| `connector-agent` | Integration tests (mock source, verify CRUD ops) |

### 5. Place Test Files

- Follow project's file conventions from CLAUDE.md
- Default: adjacent to source (`src/routes/auth.test.ts` next to `src/routes/auth.ts`)
- Group by task: `describe('TXXX — Task Name', () => { ... })`
- Each test has a comment linking to its criterion: `// Acceptance: "criterion text"`

### 6. Handle Non-Testable Criteria

Skip criteria that aren't unit/integration testable:
- `"Types pass (npm run typecheck)"` — skip, covered by typecheck
- `"Tests pass (npm run test)"` — skip, meta-reference
- `"Lint clean"` — skip, covered by lint command
- Flag these as "covered by tooling" in the report

### 7. Commit

Commit test files to main branch: `[Pre-impl] Generate acceptance tests`

## Output

Report formatted as a summary:

```
Tests Generated: {ProjectName}
==============================
Phase 1: {N} test files ({M} assertions)
Phase 2: {N} test files ({M} assertions)
...
Total: {N} test files, {M} assertions across {K} tasks
Skipped: {list of tasks with no testable criteria}

Test command: npm run test (all will fail until implementation)
Next step: Run `/execute-phase 1` to begin implementation
```

## Quality Checklist
- [ ] Every task with testable acceptance criteria has a test file
- [ ] Test files use the project's actual test framework and patterns
- [ ] Tests are syntactically valid (correct imports, valid describe/it blocks)
- [ ] Tests reference the correct file paths (where source will be created)
- [ ] All tests fail before implementation (asserting on not-yet-existing code)
- [ ] No `{{placeholder}}` variables in test files
- [ ] Tests are grouped by task ID with comments linking to criteria
