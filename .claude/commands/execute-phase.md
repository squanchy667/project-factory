# /execute-phase

Run all tasks in a phase with parallel execution and artifact handoff.

## Usage

```
/execute-phase 1
/execute-phase "Foundation"
```

## Description

Loads a phase from the execution plan and runs all its tasks through the /do-task pipeline:
1. Parse phase tasks and dependencies
2. Build execution batches (parallel groups using dependency graph)
3. Execute each batch — independent tasks run in parallel
4. Collect artifacts and prepare handoffs for downstream phases
5. Quality gate: determine phase pass/fail based on task results
6. Generate phase report with per-task metrics

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `phase` | number or string | (required) | Phase number or name |
| `--dry-run` | flag | false | Show execution plan without running |
| `--stop-on-failure` | flag | false | Halt remaining tasks if one fails |
| `--budget` | number | 10000 | Total token budget for the phase |

## Pipeline

### Step 1: Plan Execution (`PhaseRunner.planExecution`)
- Groups tasks into batches by dependency layers
- Tasks whose dependencies are all satisfied go in the same batch
- Batches execute sequentially; tasks within a batch run in parallel

### Step 2: Execute Batches (`PhaseRunner.runPhase`)
- Each task runs through the full 8-step do-task pipeline
- Per-task failures are captured but don't halt the phase
- Token budget split evenly across tasks in the phase

### Step 3: Artifact Collection (`ArtifactRegistry`)
- Task outputs stored as tagged artifacts
- Artifacts tagged by domain for relevance-based retrieval
- Persisted as JSON to output directory

### Step 4: Quality Gate
- Pass rate threshold: 60% of tasks must succeed
- Average quality threshold: 50/100 minimum
- Reports detailed reason for pass/fail

### Step 5: Phase Report
- Per-task results with quality scores
- Aggregate metrics (pass rate, avg quality, timing)
- Quality gate verdict

## Module Exports

```typescript
import {
  PhaseRunner,         // Phase execution engine
  ArtifactRegistry,    // Tagged artifact storage
  HandoffManager,      // Inter-phase handoff preparation
} from './core/orchestrator/index.js';
```

## Quality Gate Thresholds

| Metric | Threshold | Description |
|--------|-----------|-------------|
| Pass rate | ≥ 60% | Minimum percentage of tasks that must succeed |
| Avg quality | ≥ 50 | Minimum average quality score across tasks |
