# /build-app

Full orchestration: goal → plan → configure → execute → document → learn.

## Usage

```
/build-app "Build a real-time collaboration tool with shared documents and chat"
/build-app "Create a blog API" --repo ./existing-project
```

## Description

End-to-end project builder that chains all Agent Pilot capabilities:
1. **Plan** (`/plan-project`) — Decompose goal into phased tasks via template-based decomposition
2. **Cluster** — Group tasks by context affinity (shared domains, files, stack)
3. **Budget** — Assign token budgets per phase with handoff overhead
4. **Execute** (`/execute-phase`) — Run each phase sequentially with parallel task batches
5. **Handoff** — Pass relevant artifacts between phases via HandoffManager
6. **Report** — Quality gate per phase, aggregate metrics
7. **Learn** (`/capture-learnings`) — Extract patterns for the config bank flywheel

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `goal` | string | (required) | High-level project description |
| `--repo` | path | none | Existing repo for context (uses scan index) |
| `--resume` | flag | false | Resume from last incomplete phase |
| `--max-phases` | number | 8 | Maximum phases in the plan |
| `--budget` | number | 10000 | Default token budget per task |

## Pipeline

### Phase 1: Planning
- `decomposeTasks(goal)` → 15-60 granular tasks
- `buildDependencyGraph(tasks)` → DAG with cycle validation
- `clusterTasks(tasks)` → phases grouped by context affinity
- `budgetPhases(phases)` → token-budgeted phases with reports

### Phase 2: Execution (per phase)
- `PhaseRunner.planExecution(phase)` → ordered batches
- `PhaseRunner.runPhase(phase)` → execute through do-task pipeline
- `ArtifactRegistry.store()` → persist task outputs
- `HandoffManager.prepareHandoff()` → select relevant artifacts for next phase

### Phase 3: Quality & Learning
- Quality gate per phase (60% pass rate, 50 avg quality minimum)
- User checkpoint between phases for review
- Config bank quality history updates
- Retrospective document generation

## Resumption Logic

The pipeline is idempotent — it detects progress and resumes:
- No plan exists → start from planning
- Plan exists, no phases done → execute phase 1
- Some phases done → resume from last incomplete phase
- All phases done → skip to learnings capture

## Module Dependencies

```
/plan-project (planner module)
  → decomposeTasks, clusterTasks, budgetPhases

/execute-phase (orchestrator module)
  → PhaseRunner, ArtifactRegistry, HandoffManager

/capture-learnings
  → Config bank quality history updates
```
