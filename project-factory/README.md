# Project Factory

Meta-layer for building applications with Claude Code. Provides templates, schemas, a knowledge base, and 7 meta-commands that take a project from idea to production.

## Quick Start

Run the 7 commands in sequence:

```
1. /init-project "Name" type "description"   → Two repos (code + docs)
2. /plan-project Name                        → Architecture + 20-80 tasks
3. /tailor-agents Name                       → Project-specific .claude/ config
4. /generate-tests Name                      → Pre-implementation test suites
5. /execute-phase 1 (repeat per phase)       → Implemented code per phase
6. /sync-docs full                           → Docs ↔ code alignment
7. /capture-learnings Name                   → Retrospective + pattern catalog
```

## Architecture

```
project-factory/
├── templates/
│   ├── docs/
│   │   ├── base/                 ← Universal docs structure (GitBook-compatible)
│   │   ├── react-express/        ← React + Express overlay
│   │   ├── fullstack-aws/        ← AWS full-stack overlay
│   │   ├── unity-game/           ← Unity game overlay
│   │   └── typescript-lib/       ← TypeScript library overlay
│   ├── code/
│   │   ├── react-express/        ← Web app starter
│   │   ├── fullstack-aws/        ← AWS SAM starter
│   │   ├── unity-game/           ← Unity project starter
│   │   └── typescript-lib/       ← npm library starter
│   └── claude-config/
│       ├── agents/               ← 9 role templates (scaffold, types, backend, ...)
│       ├── commands/             ← Workflow command templates
│       └── skills/               ← Always-on context templates
├── schemas/
│   ├── project-config.md         ← Valid project configuration definition
│   └── task-spec.md              ← Canonical task spec format
└── knowledge-base/
    ├── patterns-catalog.md       ← Proven patterns from completed projects
    ├── chatagent-retrospective.md
    └── battlenet-retrospective.md
```

The meta-layer itself lives at `.claude/` in the workspace root:

```
.claude/
├── commands/                     ← 7 meta-commands
│   ├── init-project.md
│   ├── plan-project.md
│   ├── tailor-agents.md
│   ├── generate-tests.md
│   ├── execute-phase.md
│   ├── sync-docs.md
│   └── capture-learnings.md
├── agents/                       ← 6 meta-agents
│   ├── project-planner.md
│   ├── docs-generator.md
│   ├── agent-tailor.md
│   ├── test-generator.md
│   ├── phase-orchestrator.md
│   └── quality-gate.md
└── skills/                       ← 2 skills
    ├── task-management/SKILL.md
    └── docs-repo-patterns/SKILL.md
```

## The Protocol (7 Steps)

| # | Phase | Command | Input | Output |
|---|-------|---------|-------|--------|
| 1 | Birth | `/init-project` | Name, type, description | Two git repos (code + docs) |
| 2 | Plan | `/plan-project` | Project name | PLAN.md, TASK_BOARD.md, 20-80 task specs |
| 3 | Configure | `/tailor-agents` | Project name | Project-specific `.claude/` with agents, commands, skills |
| 4 | Test | `/generate-tests` | Project name | Pre-implementation test suites from task specs |
| 5 | Build | `/execute-phase` | Phase number | Implemented code with quality gates |
| 6 | Maintain | `/sync-docs` | Sync mode | Docs ↔ code alignment |
| 7 | Learn | `/capture-learnings` | Project name | Retrospective + pattern catalog updates |

### Step 1 — Birth (`/init-project`)

Creates the project directory structure with paired repositories:
- **Code repo** (`{project-slug}/`) — initialized with git, basic structure from type template
- **Docs repo** (`{project-slug}-docs/`) — initialized with GitBook-compatible structure from base + type overlay

**Prerequisites:** None — this is always the first command.

### Step 2 — Plan (`/plan-project`)

Uses the `project-planner` and `docs-generator` agents to produce:
- `PLAN.md` — Architecture vision, tech stack decisions, phase outline
- `TASK_BOARD.md` — Phase tables with task IDs, dependencies, agent assignments
- `development-agents.md` — Agent strategy and batch execution plan
- `tasks/phase-X/TXXX-task-name.md` — Individual task specs (20-80 total)

**Prerequisites:** `/init-project` (needs docs repo structure).

### Step 3 — Configure (`/tailor-agents`)

Uses the `agent-tailor` agent to create the code repo's `.claude/` directory:
- Agents customized with real file paths, schemas, and conventions
- Commands tailored to the project's tech stack
- Skills with project-specific patterns
- `CLAUDE.md` describing the project's stack and structure

**Prerequisites:** `/plan-project` (needs PLAN.md, TASK_BOARD.md, development-agents.md).

### Step 4 — Test (`/generate-tests`)

Uses the `test-generator` agent to produce test files from task specs:
- Reads each task's acceptance criteria
- Maps agent types to test approaches (schema tests, route tests, component tests, etc.)
- Generates one test file per task with assertions linked to acceptance criteria
- All tests fail before implementation — they define what "done" means

**Prerequisites:** `/tailor-agents` (needs `.claude/CLAUDE.md` for test conventions).

### Step 5 — Build (`/execute-phase`)

Uses the `phase-orchestrator` agent to execute tasks in dependency order:
- Computes execution batches from the dependency graph
- Launches 3-5 parallel agents per batch
- Runs `quality-gate` agent after each task
- Updates TASK_BOARD.md with results

**Prerequisites:** `/generate-tests` (recommended) or `/tailor-agents` (minimum).

### Step 6 — Maintain (`/sync-docs`)

Keeps documentation synchronized with the codebase:
- `full` — Complete docs refresh
- `changelog` — Update changelog from recent commits
- `tasks` — Update task statuses on TASK_BOARD.md
- `status` — Quick status report

**Prerequisites:** Some implementation exists to document.

### Step 7 — Learn (`/capture-learnings`)

Extracts patterns and insights from a completed project:
- Produces a retrospective document in the knowledge base
- Identifies reusable patterns for the patterns catalog
- Records anti-patterns and what to avoid

**Prerequisites:** Project substantially complete.

## Meta-Agents Reference

| Agent | Mission | Invoked By |
|-------|---------|------------|
| `project-planner` | Design architecture and decompose into phased tasks | `/plan-project` |
| `docs-generator` | Create GitBook-compatible documentation structure | `/plan-project`, `/sync-docs` |
| `agent-tailor` | Customize agent templates with project-specific details | `/tailor-agents` |
| `test-generator` | Generate test files from task acceptance criteria | `/generate-tests` |
| `phase-orchestrator` | Execute task batches with dependency ordering | `/execute-phase` |
| `quality-gate` | Validate task completion against acceptance criteria | `/execute-phase` |

## Skills Reference

| Skill | Purpose |
|-------|---------|
| `task-management` | Task status tracking, TASK_BOARD.md conventions, dependency rules |
| `docs-repo-patterns` | GitBook structure, SUMMARY.md navigation, docs repo conventions |

## Project Types

| Type | Description | Default Stack |
|------|-------------|---------------|
| `react-express` | Web app with React frontend + Express backend | React, TypeScript, Vite, Tailwind, Express, Vitest |
| `fullstack-aws` | Full stack web app deployed to AWS | React, TypeScript, Vite, Tailwind, Express, AWS SAM, DynamoDB, Vitest |
| `unity-game` | Unity game with C# scripting | Unity, C#, Netcode, ScriptableObjects |
| `typescript-lib` | TypeScript library for npm | TypeScript, Vitest, tsup, npm |

## Templates

### Docs Templates

**Base** (`templates/docs/base/`) — every project gets these:
- README.md, SUMMARY.md, PLAN.md, TASK_BOARD.md, development-agents.md
- architecture/ (system-overview, data-flow)
- developer/ (setup-guide, coding-standards)
- product/ (features, roadmap)
- resources/ (tech-stack, changelog, known-issues)
- testing/ (test-plan)

**Type overlays** add specialized docs:
- `react-express/` — API reference, component library, state management, routing patterns
- `fullstack-aws/` — API reference, AWS infrastructure, DynamoDB patterns
- `unity-game/` — Game systems, multiplayer, deployment
- `typescript-lib/` — API reference, publishing, contributing

### Code Templates

Each type has a starter in `templates/code/{type}/` with project scaffolding, configuration files, and a README.

### Claude Config Templates

Agent role templates (`templates/claude-config/agents/`):
- `scaffold-agent` — Project setup and boilerplate
- `types-agent` — Schema and type design
- `backend-agent` — API routes and services
- `frontend-agent` — UI components and hooks
- `llm-agent` — LLM integration
- `infra-agent` — Infrastructure and deployment
- `test-agent` — Testing
- `security-agent` — Security hardening
- `docs-agent` — Documentation

Command templates (`templates/claude-config/commands/`):
- `task-execute` — Universal task execution workflow
- `build-component` — React component scaffold
- `build-route` — Express route scaffold
- `design-schema` — Zod schema design

Skill templates (`templates/claude-config/skills/`):
- `project-conventions` — Coding patterns extracted from CLAUDE.md
- `workspace` — Directory layout and navigation

## Knowledge Base

### Patterns Catalog (`knowledge-base/patterns-catalog.md`)

Proven patterns extracted from completed projects, organized by category:
- **Architecture Patterns** — Zod-first validation, config-driven agents, monorepo workspaces, etc.
- **Process Patterns** — Phased execution, documentation-first planning, test-first execution, etc.
- **Agent Patterns** — Specialized agents, convention-heavy prompts, skills for context
- **Code Patterns** — Barrel exports, SSE streaming, ScriptableObjects
- **Anti-Patterns** — Generic prompts, over-constrained dependencies, skipping quality gates

### Retrospectives

Post-project analyses for completed projects:
- `chatagent-retrospective.md` — Full-stack AWS platform (33 tasks)
- `battlenet-retrospective.md` — Unity multiplayer game

## Extending the Factory

### Adding a New Project Type

1. Create docs overlay: `templates/docs/{new-type}/developer/` with type-specific guides
2. Create code starter: `templates/code/{new-type}/` with scaffold and README
3. Add type to `schemas/project-config.md` type enum with default stack
4. Update agent templates if the type needs new agent roles

### Adding a New Agent Template

1. Create template: `templates/claude-config/agents/{agent-name}.md`
2. Follow the Mission → Workflow → Quality Standards structure
3. Include `{{placeholder}}` variables for project-specific customization
4. Add the agent type to the mapping in `agent-tailor.md`

### Adding a New Pattern

1. Edit `knowledge-base/patterns-catalog.md`
2. Add under the appropriate category (Architecture, Process, Agent, Code)
3. Follow the format: Source, Context, Pattern, When to use
4. Include a code example if applicable
