# Agent Pilot Conventions Skill

This skill provides context about Agent Pilot's coding patterns and conventions. Use this knowledge whenever working on the codebase.

## Zod-First Validation

All data validation uses Zod schemas as the source of truth. Types are inferred, never hand-written:

```typescript
// core/shared/types.ts — define schema
export const TaskAnalysisSchema = z.object({
  taskId: z.string(),
  domains: z.array(z.string()),
  taskType: TaskTypeSchema,
  complexity: ComplexitySchema,
});

// Infer type
export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>;
```

Validate at system boundaries only: config loading, CLI input, external data. Internal functions trust validated data.

## Module System

Each module directory has an `index.ts` barrel export. Modules:
- `core/shared/` — Types, token counter, file utils, logger, config bank
- `core/pipeline/` — The 8-step do-task pipeline
- `core/scanner/` — Repo scanning (optional)
- `core/converter/` — Repo conversion (optional)
- `core/planner/` — Task decomposition + affinity clustering
- `core/orchestrator/` — Phase execution + artifact handoffs

## Token Budget Discipline

- Default: 10K tokens per task (70% task / 20% test / 10% doc)
- Hard ceiling: 15K tokens per agent, no exceptions
- Compression: FULL (>0.8) → SUMMARY (0.5-0.8) → REFERENCE (0.3-0.5) → SKIP (<0.3)
- Budget check at every pipeline stage

## Error Handling

- Custom error classes per domain (extend `Error`)
- Result types for expected failures: `{ success: true, data } | { success: false, error }`
- Throw only for programming errors
- Pipeline never crashes — always produces a report

## Config Bank

Agent configs are JSON files in `config-bank/agents/` (15 seed configs).
Context strategies are JSON files in `config-bank/strategies/` (5 strategies).

Scoring: domain match (0.4) + stack match (0.35) + task type match (0.25).

## Import Conventions

```typescript
// Relative within module
import { estimateTokens } from './token-counter';

// Path-based across modules
import { analyzeTask } from '../pipeline/task-analyzer';

// Type-only imports
import type { TaskAnalysis, AgentDefinition } from '../shared/types';
```

## File Naming

- Source: `kebab-case.ts` (e.g., `task-analyzer.ts`, `config-bank.ts`)
- Tests: `kebab-case.test.ts` in `__tests__/` directories
- Configs: `kebab-case.json` in `config-bank/`
