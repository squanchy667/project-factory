# AgentPilot Retrospective

## Project Overview

| Field | Value |
|-------|-------|
| **Name** | AgentPilot |
| **Type** | typescript-lib (AI task execution engine) |
| **Stack** | TypeScript 5.4+, Node.js 20+, tsup, Vitest, Zod |
| **Completed** | 2026-03-01 (three sessions) |
| **Tasks** | 41/41 (100%) |
| **Phases** | 7 planned → 7 actual |
| **Agents** | 16 types defined, 8 builder agents used for execution |
| **Source Files** | 34 files, ~5,833 LOC |
| **Test Files** | 28 files, 193 tests (all passing), ~2,869 LOC |
| **Config Bank** | 15 seed agent configs + 5 context strategies (JSON) |
| **Commands** | 9 slash commands |
| **Skills** | 4 always-on skills |
| **Commits** | 17 (code repo) + 11 (docs repo) |

## Phase Completion Summary

| Phase | Theme | Tasks | Status | Session |
|-------|-------|-------|--------|---------|
| 1 | Foundation | 8 (T001–T008) | DONE | Session 1 |
| 2 | Do-Task Pipeline (MVP) | 8 (T009–T016) | DONE | Session 1 |
| 3 | Repo Scanner (optional) | 5 (T017–T021) | DONE | Session 2 |
| 4 | Repo Converter (optional) | 5 (T022–T026) | DONE | Session 2 |
| 5 | Smart Planner | 5 (T027–T031) | DONE | Sessions 2-3 |
| 6 | Phase Orchestrator | 6 (T032–T037) | DONE | Session 3 |
| 7 | Polish & Ship | 4 (T038–T041) | DONE | Session 3 |
| **Total** | | **41** | **100%** |

## Planned vs Actual

### What Matched Plan
- All 7 phases executed in order, none added or removed
- All 41 tasks completed, none dropped
- Critical path (P1 → P2 → P5 → P6 → P7) held as planned
- Optional phases (P3, P4) also completed
- Dependency graph held — no unexpected blockers
- Pre-generated tests approach worked — tests existed before implementation for phases 3-6
- Commit convention (`[Phase X] TXXX: description`) maintained throughout

### What Diverged
- **Optional phases done before critical path**: User chose to do Phase 3 (optional scanner) before Phase 5 (critical planner), then Phase 4 before continuing to 5. This worked because the scanner/converter modules are standalone with no downstream dependencies on the critical path.
- **Pre-generated tests required defensive coding**: Mock objects in pre-generated tests were partial — missing fields like `layers`, `testCoverage`, `entryPoints`, `stack`. Required extensive optional chaining (`?.`, `?? []`, `?? 0`) throughout converter and planner modules. This is a recurring pattern across projects.
- **Template-based decomposition instead of LLM-based**: Task decomposer (T027) uses keyword analysis + domain templates rather than calling an LLM. This was chosen for deterministic testing — tests can assert exact task counts and field presence without LLM variability.
- **Session boundary at Phase 5**: Context limit hit mid-Phase 5 (4 files created, not yet tested). Resumed cleanly in Session 3 — only needed to create barrel export, fix one typecheck error (`'pending'` string vs `PhaseStatus` enum), and run tests.
- **Phase 6 tests ran actual pipeline**: Phase runner tests invoked `executePipeline()` for real (not mocked), producing full 8-step output. This was slower (~30ms per task × 3-4 tasks per test) but validated real integration.

### Scope Changes
None. The 41-task plan mapped well to the library scope. The only design decision was template-based decomposition (not LLM-based) for testability.

## Agent Effectiveness

Since this was built by a single orchestrating session (not separate agent processes), "agent types" here refers to the conceptual roles defined in `.claude/agents/`:

| Agent Role | Tasks Handled | Effectiveness | Notes |
|-----------|--------------|---------------|-------|
| foundation-builder | 8 (Phase 1) | Excellent | Clean scaffold, types, utilities in single session |
| pipeline-builder | 8 (Phase 2) | Excellent | MVP pipeline with 99 tests, all critical-path wiring |
| scanner-builder | 5 (Phase 3) | Excellent | File indexer, dependency mapper, pattern detector — 42 tests |
| converter-builder | 5 (Phase 4) | Good | Needed extensive defensive coding for pre-gen test mocks |
| planner-builder | 5 (Phase 5) | Good | One typecheck fix needed (enum vs string literal) |
| orchestrator-builder | 6 (Phase 6) | Excellent | Clean integration with existing pipeline, 14 new tests |
| documenter | 4 (Phase 7) | Good | README, CONTRIBUTING, LICENSE, examples — content-focused |

**Most effective**: pipeline-builder — handled 8 complex tasks including the 8-step pipeline orchestrator with 99 tests and full error handling at every step.

**Key pattern**: Single-session sequential execution worked well for a 41-task library project. No parallel agent contention, clean commits per phase.

## Key Learnings

### What Worked

1. **Pre-generated tests as acceptance criteria**: Having tests before implementation for phases 3-6 gave clear API contracts. Tests defined the public surface (function names, return types, expected behaviors) before a single line of implementation was written.

2. **Template-based decomposition for testability**: Choosing keyword templates over LLM-based decomposition made the task decomposer fully deterministic — tests can assert exact task counts, required fields, and domain detection without flaky LLM responses.

3. **Phased commits with full test suite**: Committing per-phase with `npm run typecheck && npm test` as a gate caught issues early. The Phase 5 enum issue was caught immediately by typecheck.

4. **Defensive optional chaining for partial mocks**: Knowing pre-generated tests use partial objects, adding `?.`, `?? []`, `?? 0` defensively throughout source code made tests pass without modifying test files (except one case in Phase 4 where `repoPath` argument was genuinely missing).

5. **Barrel exports per module**: Every module having an `index.ts` made the final root `core/index.ts` trivial — just 6 re-export lines. Also made tests clean — import from `../module-name` not `../module-name/specific-file`.

6. **Class-based for stateful modules, function-based for stateless**: Pipeline steps (analyzer, builder, executor) are pure functions. Orchestrator components (ArtifactRegistry, HandoffManager, PhaseRunner) are classes with state. This distinction kept each module's API natural.

7. **Config bank as JSON, not code**: 15 agent configs + 5 strategies as JSON files means they can be updated without code changes. The scoring algorithm (domain 0.4 + stack 0.35 + type 0.25) is code, but the data is config.

### What Didn't Work

1. **Pre-generated test partial mocks caused extensive patching**: The converter and planner modules needed 20+ defensive `?.` additions because test fixtures passed incomplete objects. A better approach: generate test fixtures with all required fields, even if values are dummy/default.

2. **Context limit at phase boundaries**: Session 2 hit the context limit mid-Phase 5. While resumption was clean, it's better to commit and checkpoint before starting a new phase, not mid-phase.

3. **Agent executor is still a stub**: The core `executeAgent()` function uses a mock/stub rather than real Claude Code SDK integration. This means the pipeline works end-to-end for testing but doesn't actually execute LLM agents. This is the biggest gap for real-world usage.

4. **Docs changelog only covers phases 1-2**: The `resources/changelog.md` in the docs repo was only updated for phases 1-2. Phases 3-7 are tracked in TASK_BOARD.md but not in the changelog. A `/sync-docs` run would fix this.

5. **No individual task spec files**: Task specs live inline in TASK_BOARD.md rather than as separate `tasks/phase-X/TXXX-task-name.md` files. This is simpler but less granular than the Project Factory convention.

## Patterns Extracted

### New Patterns

1. **Weighted Config Bank Scoring** — Score agent configs by domain (0.4) + stack (0.35) + task type (0.25) match. Returns best-fit config for any task analysis. Enables a flywheel: quality history scores improve matching over time.

2. **Context Affinity Clustering** — Group tasks by shared domains (0.4), files (0.35), stack (0.25). Respects dependency ordering via topological sort. Merges small groups with high affinity, splits groups exceeding token budget. Produces balanced phases.

3. **Handoff Overhead Budgeting** — Reserve ~1K tokens per previous phase for handoff summaries. Later phases get less task budget but receive accumulated context. Handoff manager selects artifacts by relevance to target domains, compresses to fit remaining budget.

4. **Quality Gate Thresholds** — Phase pass/fail based on: task pass rate ≥ 60%, average quality score ≥ 50/100. Simple, tunable thresholds. Reports detailed reason for verdict.

5. **8-Step Never-Crash Pipeline** — Each of 8 pipeline steps wrapped in try/catch with meaningful fallbacks. Analysis fails → use defaults. Build fails → minimal prompt. Execute fails → capture partial. Tests fail → still document. Pipeline ALWAYS produces a report.

### Refinements to Existing Patterns

- **Pre-generated tests** (existing pattern): Added caveat — generate test fixtures with ALL required fields to avoid defensive coding in source. Partial mocks cause unnecessary `?.` noise.
- **Sequential phase execution** (existing pattern): Confirmed works well for 41-task projects — up from 20-25 threshold. The overhead of parallel agents exceeds benefit for any single-session project.
- **Zod-first validation** (existing pattern): AgentPilot has 16 Zod schemas with `z.infer<typeof Schema>` types — largest Zod-first project to date. Proved the pattern scales to complex type hierarchies (nested objects, arrays of objects with optional fields).

## Template Candidates

1. **typescript-lib template** — AgentPilot's project structure (tsup dual CJS/ESM, Vitest, Zod, barrel exports, CLI entry point) could be a standard typescript-lib template. Key files: tsup.config.ts, package.json with bin + exports, core/index.ts barrel.

2. **config-bank pattern** — The JSON-based config bank with weighted scoring could be extracted as a reusable module. Any AI tool that needs to match configs to tasks could use this pattern.

3. **pipeline-never-crashes agent** — The 8-step pipeline pattern with per-step try/catch and meaningful fallbacks could be a template for any multi-step AI pipeline.

## Recommendations for Similar Projects

1. **Start with full test fixtures**: When using pre-generated tests, ensure mock objects include ALL interface fields — even if values are trivial. This prevents 20+ defensive patches later.

2. **Commit before starting new phases**: Don't start Phase N+1 in the same breath as finishing Phase N. Commit, verify, then proceed. This creates clean resumption points.

3. **Keep the executor stubbed for testing**: A mock executor that produces deterministic output is essential for testing the pipeline. Real SDK integration should be a separate, final phase.

4. **Use classes for stateful, functions for stateless**: Pipeline steps that transform data → exported functions. Modules with persistence or accumulated state → exported classes.

5. **Template-based over LLM-based for deterministic components**: If a component needs to be tested deterministically (task decomposer, config scorer), use keyword/template approaches rather than LLM calls. LLM-based versions can be added later as alternatives.
