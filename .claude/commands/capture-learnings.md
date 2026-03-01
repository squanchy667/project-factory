# /capture-learnings

Extract reusable patterns from a completed project to improve future agent building.

## Usage

```
/capture-learnings AgentPilot
/capture-learnings --project ./myproject
```

## Description

Analyzes completed task results to extract patterns for the flywheel:
1. **Config scoring** — Which config bank entries performed best → update qualityHistory scores
2. **Strategy analysis** — Which context strategies worked → refine strategy weights
3. **Failure patterns** — Common failure modes → add to quality gate heuristics
4. **Retrospective** — Generate readable project retrospective document

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `project` | string or path | (required) | Project name or path to output directory |
| `--output` | path | none | Custom output path for retrospective |

## Pipeline

### Step 1: Collect Metrics
- Load all task metrics from output directory (`metrics.json` per task)
- Load artifact registry for artifact statistics
- Load phase reports for quality gate results

### Step 2: Analyze Config Performance
- Group tasks by config sources used
- Calculate average quality score per config
- Identify top-performing and under-performing configs
- Update `qualityHistory` arrays in config bank JSON files

### Step 3: Analyze Strategy Effectiveness
- Group tasks by context strategy used
- Measure token efficiency (usage vs budget)
- Identify strategies that led to over/under-budget executions
- Suggest strategy weight adjustments

### Step 4: Identify Failure Patterns
- Categorize failed tasks by failure type (timeout, low quality, missing output)
- Identify common domains/stacks in failures
- Generate heuristics for quality gate improvements

### Step 5: Generate Retrospective
- Project overview (tasks, phases, total tokens, total time)
- Per-phase summary with quality gate results
- Top patterns discovered
- Config bank updates applied
- Recommendations for future projects

## Output

### Config Bank Updates
```json
{
  "configId": "backend-api",
  "qualityHistory": [85, 90, 78, 92],
  "avgScore": 86.25
}
```

### Retrospective Document
Written to `output/retrospective.md` with:
- Summary statistics
- Phase-by-phase results
- Patterns and learnings
- Config bank score updates

## Flywheel Effect

```
Better configs → Better agents → Better output → Better configs
     ↑                                              |
     └──────────── /capture-learnings ──────────────┘
```
