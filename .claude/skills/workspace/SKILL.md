# Agent Pilot Workspace Skill

This skill provides context about Agent Pilot's project structure and navigation.

## Directory Layout

```
agentpilot/
├── .claude/
│   ├── commands/          ← /task-execute, /design-schema
│   ├── agents/            ← 8 development agents
│   └── skills/            ← agentpilot-conventions, workspace
├── core/
│   ├── pipeline/          ← 8-step do-task pipeline (MVP)
│   │   ├── task-analyzer.ts
│   │   ├── agent-builder.ts
│   │   ├── agent-executor.ts
│   │   ├── output-capture.ts
│   │   ├── test-runner.ts
│   │   ├── documenter.ts
│   │   ├── reporter.ts
│   │   └── index.ts       ← executePipeline()
│   ├── scanner/           ← OPTIONAL: repo scanning
│   ├── converter/         ← OPTIONAL: repo conversion
│   ├── planner/           ← Smart phase planner
│   │   ├── task-decomposer.ts
│   │   ├── context-affinity.ts
│   │   ├── token-budgeter.ts
│   │   └── dependency-graph.ts
│   ├── orchestrator/      ← Phase execution + handoffs
│   │   ├── artifact-registry.ts
│   │   ├── handoff-manager.ts
│   │   └── phase-runner.ts
│   └── shared/            ← Foundation
│       ├── types.ts        ← All interfaces + Zod schemas
│       ├── token-counter.ts
│       ├── file-utils.ts
│       ├── logger.ts
│       ├── config-bank.ts
│       └── index.ts
├── config-bank/
│   ├── agents/            ← 15 seed agent JSON configs
│   └── strategies/        ← 5 context strategy JSONs
├── output/                ← Task outputs (gitignored)
└── project-context/       ← User project files (gitignored)
```

## Build Order

All modules share the same dependency root: `core/shared/`.

```
core/shared → core/pipeline → core/planner → core/orchestrator
                            → core/scanner → core/converter
```

## Key Commands

```bash
npm run build       # tsup: CJS + ESM output to dist/
npm run dev         # tsup --watch
npm test            # vitest run
npm run test:watch  # vitest
npm run typecheck   # tsc --noEmit
```

## Paired Docs Repo

Architecture docs, task board, and specs live in `agentpilot-docs/`:
- `PLAN.md` — Architecture vision and phase outline
- `TASK_BOARD.md` — 41 tasks across 7 phases
- `SUMMARY.md` — GitBook navigation
