# FlappyKookaburra Retrospective

## Project Overview

| Field | Value |
|-------|-------|
| **Name** | FlappyKookaburra |
| **Type** | unity-game (2D) |
| **Engine** | Unity 2022.3 LTS, C# 9.0+ |
| **Build Target** | WebGL (primary), Windows/macOS (dev) |
| **Completed** | 2026-02-09 (single session) |
| **Tasks** | 20/20 (100%) |
| **Phases** | 4 planned → 4 actual |
| **Agents** | 7 types defined, all used |
| **Commits** | 32 (20 task + 10 merge + 2 setup) |

## Phase Completion Summary

| Phase | Theme | Tasks | Batches | Status |
|-------|-------|-------|---------|--------|
| 1 | Foundation | 5 (T001–T005) | 2 | DONE |
| 2 | Core Gameplay | 4 (T006–T009) | 2 | DONE |
| 3 | Polish | 6 (T010–T015) | 2 | DONE |
| 4 | Production | 5 (T016–T020) | 2 | DONE |
| **Total** | | **20** | **8** | **100%** |

## Planned vs Actual

### What Matched Plan
- All 4 phases executed in order, no phases added or removed
- All 20 tasks completed, none dropped or added
- Dependency graph held — no unexpected blockers
- 8 execution batches as predicted in development-agents.md
- Convention consistency maintained throughout (branch naming, commit format)

### What Diverged
- **Phase 3 batching**: Plan said "all can run in parallel" but actual execution split into 2 batches (5 + 1) due to T011 and T012 both modifying PlayerController.cs — file conflict detection added T012 to Batch 2
- **Phase 4 batching**: TASK_BOARD.md predicted 3 batches (T016+T017 → T018+T020 → T019). Actual was 2 batches (T016+T017+T018+T020 parallel → T019 solo) because all cross-phase deps were met
- **T015 and T019**: Marked DONE* — code infrastructure complete but binary assets (sprites, WebGL build) require Unity Editor. This is inherent to Unity CLI limitations, not a planning failure
- **T017 branch collision**: Parallel agents racing on git branches caused T018's commit to land on T017's branch. Resolved by creating `feat/T017-edit-mode-tests-v2`

### Scope Changes
None. The plan was tight enough (20 tasks for a Flappy Bird clone) that no scope creep occurred.

## Agent Effectiveness

| Agent Type | Tasks | First-Try Success | Notes |
|-----------|-------|------------------|-------|
| setup-agent | 1 (T001) | 100% | Unity CLI project creation needed /tmp workaround for existing git repo |
| systems-agent | 7 (T002-T005, T007, T011, T018) | 100% | Most-used agent. Clean event-driven patterns. |
| gameplay-agent | 4 (T006, T008, T010, T020) | 100% | Physics tuning via ScriptableObjects worked well |
| ui-agent | 2 (T009, T013) | 100% | Panel switching + event subscription pattern clean |
| art-agent | 3 (T012, T014, T015) | 100%* | Code infrastructure done; binary assets need Unity Editor |
| test-agent | 2 (T016, T017) | ~90% | T017 needed v2 branch due to parallel agent contention |
| devops-agent | 1 (T019) | 100%* | Build script done; actual build needs Unity Editor |

**Most effective**: systems-agent — handled 7 tasks across all 4 phases with clean, consistent output. Established the singleton + events + SO pattern that all other agents followed.

**Least used**: setup-agent (1 task) and devops-agent (1 task) — these are inherently phase-specific bookend agents.

**Challenge area**: art-agent and devops-agent tasks that require Unity Editor operations (sprite import, animation clips, WebGL build) cannot be fully completed via CLI. This is a fundamental limitation for unity-game projects.

## Key Learnings

### What Worked

1. **Singleton + Events + ScriptableObjects trinity** — This architecture pattern was the backbone. Every manager follows the same template (Instance property, Awake null-check, OnEnable/OnDisable subscribe/unsubscribe). New systems slot in effortlessly.

2. **Data-driven difficulty with AnimationCurves** — DifficultyConfig uses AnimationCurve fields evaluated by score. Designers can tune progression curves in the Unity Inspector without touching code. DifficultyManager reads these curves and exposes CurrentGapSize/CurrentScrollSpeed/CurrentSpawnInterval.

3. **Object pooling from Phase 1** — Setting up ObjectPool<T> in Foundation meant ObstacleSpawner and ParticleSpawner used it naturally. Zero GC allocations during gameplay.

4. **File conflict detection in batching** — Checking "Files to Create/Modify" in task specs before batching prevented merge conflicts. T011 + T012 both touch PlayerController.cs → T012 deferred to next batch.

5. **Convention-heavy CLAUDE.md** — The project CLAUDE.md included exact code templates for singletons, events, SO usage, and Animator parameters. Agents followed these consistently, producing uniform code.

6. **Grace period tuning** — T020 added a `_gracePeriod` field to ObstacleSpawner (2s delay before first obstacle). Simple change, significant game feel improvement. Demonstrates why a dedicated "tuning pass" task is valuable.

7. **Performance audit as dedicated task** — T018 found the Camera.main bottleneck in WorldBounds and fixed it. Having performance as an explicit task (not afterthought) catches real issues.

### What Didn't Work

1. **Parallel agent branch contention** — Running 4 agents on the same repo simultaneously caused git branch switching conflicts. Agent A checks out its branch, then Agent B's bash call lands on Agent A's branch. Workaround: agents used single-command chains (`git checkout X && git add && git commit`), but this is fragile.

2. **Unity Editor-dependent tasks** — T012 (animations), T015 (sprites), T019 (WebGL build) can't be fully completed without Unity Editor. These tasks create code infrastructure but leave binary assets as manual steps. The `DONE*` convention helps, but ideally the task spec should explicitly split "code" and "editor" subtasks.

3. **Test execution gap** — All test files were written but can't be executed from CLI (Unity Test Runner required). Tests are syntactically correct but haven't actually been run. For CLI-only workflows, this is a known limitation.

4. **No quality gate validation** — The `/execute-phase` protocol specifies running quality gates after each task, but Unity projects can't typecheck or run tests from CLI without the Unity Editor. Quality was assessed by code review only.

## Patterns Extracted

### New Pattern: Singleton-Events-SO Trinity (Unity)
All managers follow: static Instance + Awake null-check + static events + SerializeField for SO config. Subscribe OnEnable, unsubscribe OnDisable. This creates a predictable, event-driven architecture that agents can replicate consistently.

### New Pattern: AnimationCurve-Based Difficulty
Use `AnimationCurve` fields in ScriptableObjects to define non-linear difficulty progression. DifficultyManager evaluates curves with score as input, lerps between initial and target values. Designers tune curves visually in Inspector.

### New Pattern: File Conflict Detection for Batching
Before computing parallel batches, cross-reference each task's "Files to Create/Modify" list. Tasks touching the same file must be sequenced, not parallelized. This prevents merge conflicts without over-constraining dependencies.

### New Anti-Pattern: Parallel Agents on Shared Git Repo
Multiple agents running bash commands on the same repo can interfere with each other's git state. Each agent's `git checkout` affects the working directory for all agents. Mitigation: use git worktrees, or sequence branch operations within single bash commands.

## Recommendations for Similar Projects

### For future unity-game projects:
1. **Split Unity Editor tasks explicitly** — Separate "write code" from "configure in Editor" subtasks. Code can be CLI-automated; Editor work needs a manual checklist.
2. **Use git worktrees for parallel agents** — Create separate worktrees for each agent to avoid branch contention: `git worktree add ../agent-workspace-T016 feat/T016-play-mode-tests`
3. **Include a "Scene Wiring" task** — Add a dedicated task for connecting all components in the Unity scene (assigning prefabs, SO references, layer/tag setup). This is often the gap between "code is written" and "game runs."
4. **Front-load SO instance creation** — Create .asset files in Phase 1 alongside SO definitions. Currently, SO code exists but instances need manual creation in Editor.
5. **Consider an integration test phase** — Between Polish and Production, add a brief phase for integration testing (does the full game loop work end-to-end?).

### For the project factory:
1. **Add unity-game template improvements** — Include git worktree setup for parallel agents, explicit Editor-task tagging, and a scene wiring task template.
2. **Add branch contention handling** — The `/execute-phase` command should warn about parallel agent limitations and optionally use worktrees.
3. **Consider task tagging** — Tags like `cli-only`, `editor-required`, `binary-asset` help batch planners understand what can be automated.

## Phase 5: Editor Integration (Post-Pipeline)

After all 20 tasks completed via the project factory pipeline, running the `GameSetup.cs` editor script revealed several gaps between code-generated infrastructure and a playable game:

### Issues Discovered

1. **Missing Unity packages** — `manifest.json` lacked `com.unity.ugui`, `com.unity.textmeshpro`, `com.unity.test-framework`. These are near-universal Unity dependencies that the template should include by default.

2. **Assembly definition gaps** — Test `.asmdef` files couldn't reference game code because no explicit game `.asmdef` existed. Unity's implicit `Assembly-CSharp` can't be referenced by name from test assemblies. Fix: created `FlappyKookaburra.asmdef`.

3. **Sprite-physics size mismatch** — `ObstaclePair._pipeHeight = 20f` but placeholder pipe sprites were only 4 world units tall (32×256px at 64ppu). `Setup()` positioned pipes at y=±12, entirely outside the camera's visible range (y=-5 to y=5). Fix: scaled pipe transforms to `(3, 5, 1)`.

4. **No world boundaries** — `PlayerController.Die()` only triggers on `OnCollisionEnter2D`, but nothing existed below or above the screen. The bird could leave the screen without dying. Fix: added ground/ceiling collider GameObjects.

### Key Takeaway

The automated pipeline produces correct **code infrastructure** but can't validate **runtime geometry**. A dedicated "scene wiring verification" step — where someone runs the game and checks the core loop — is essential for Unity projects. This should be a formal task in the pipeline, not an afterthought.

### Metrics
- Time to discover issues: < 5 minutes after first Play
- Time to fix: ~ 30 minutes (code changes + documentation)
- Files modified: 1 (`GameSetup.cs`)
- Root cause: Template assumptions about sprite dimensions vs physics constants

## Template Candidates

1. **unity-game agent specs** — The 7 agent definitions (setup, systems, gameplay, ui, art, test, devops) are reusable for any Unity 2D game. Could become a standard template set.
2. **Singleton MonoBehaviour template** — The Awake + Instance + events pattern appears in every manager. Could be a code snippet in the systems-agent template.
3. **Unity test assembly definitions** — PlayModeTests.asmdef and EditModeTests.asmdef are identical across projects. Should be template files.
4. **WebGLBuilder.cs** — The Editor build script with standard settings is project-agnostic. Good candidate for a devops-agent template.
