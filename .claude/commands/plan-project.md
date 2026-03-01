# /plan-project

Decompose a high-level goal into a phased, token-budgeted execution plan.

## Usage

```
/plan-project "Build a REST API for a blog platform"
/plan-project "Convert legacy Express app to TypeScript" --repo ./myproject
```

## Description

Takes a high-level project goal and produces a complete execution plan:
1. Decompose goal into 15–60 individual tasks via keyword analysis and domain templates
2. Build dependency graph with cycle detection and validation
3. Cluster tasks by context affinity (shared domains, files, stack) respecting topological order
4. Assign token budgets per phase with handoff overhead accounting
5. Generate human-readable budget reports

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `goal` | string | (required) | High-level project description |
| `--repo` | path | none | Path to existing repo (uses scan index for file context) |
| `--max-phases` | number | 8 | Maximum number of phases |
| `--max-tokens` | number | 15000 | Token ceiling per agent |

## Pipeline

### Step 1: Task Decomposition (`task-decomposer.ts`)
- Detects domains from goal text (database, backend, frontend, auth, testing, devops, styling)
- Detects tech stack (typescript, express, react, nextjs, prisma, postgres, etc.)
- Selects templates: Foundation → Database → Backend → Frontend → Testing → DevOps → Polish
- Builds inter-task dependency chains based on phase ordering
- If `--repo` provided, enriches tasks with repo file references and framework info

### Step 2: Dependency Graph (`dependency-graph.ts`)
- Builds DAG from task dependencies
- Validates for cycles (DFS coloring) and missing references
- Produces topological sort for execution ordering
- Identifies parallel groups (tasks with all deps satisfied concurrently)

### Step 3: Context Affinity Clustering (`context-affinity.ts`)
- Uses parallel groups from dependency graph as base layers
- Computes affinity scores: shared domains (0.4), files (0.35), stack (0.25)
- Merges small groups with high affinity into existing phases
- Splits groups exceeding 15K token budget
- Outputs Phase objects with task assignments and estimated tokens

### Step 4: Token Budgeting (`token-budgeter.ts`)
- Assigns per-task budgets by complexity: low=5K, medium=8K, high=12K
- Accounts for handoff overhead: 1K per previous phase
- Enforces 15K agent ceiling
- Generates human-readable budget report per phase

## Output

Returns an array of `BudgetedPhase` objects, each containing:
- `tokenBudget` — total tokens for the phase
- `maxAgentBudget` — ceiling for any single agent in the phase
- `handoffOverhead` — tokens consumed by previous phase summaries
- `perTaskBudgets` — per-task token allocations
- `report` — human-readable budget summary

## Module Exports

All planner functionality is available from `core/planner/index.ts`:

```typescript
import {
  decomposeTasks,          // Goal → DecomposedTask[]
  buildDependencyGraph,    // Tasks → DependencyGraph
  validateGraph,           // Graph → ValidationResult
  topologicalSort,         // Graph → ordered tasks
  getParallelGroups,       // Graph → concurrent groups
  clusterTasks,            // Tasks → Phase[]
  budgetPhases,            // Phases → BudgetedPhase[]
} from './core/planner/index.js';
```
