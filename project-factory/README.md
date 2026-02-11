# Project Factory

Meta-layer for building applications with Claude Code. Provides templates, schemas, a knowledge base, and 9 meta-commands that take a project from idea to production. Every agent has a model tier (haiku/sonnet/opus) assigned via YAML frontmatter for cost-optimized execution.

## Quick Start

### One command (recommended)

```
/build-app "Name" type "description"
```

Runs the full 7-step protocol with user checkpoints between major phases. Can be interrupted and re-run — automatically resumes from the last completed step.

### Or run the 7 commands individually:

```
1. /init-project "Name" type "description"   → Two repos (code + docs)
2. /plan-project Name                        → Architecture + 20-80 tasks
3. /tailor-agents Name                       → Project-specific .claude/ config (model-routed)
4. /generate-tests Name                      → Pre-implementation test suites
5. /assess-phase N                           → Cost projection before building (optional)
6. /execute-phase 1 (repeat per phase)       → Implemented code per phase
7. /sync-docs full                           → Docs ↔ code alignment
8. /capture-learnings Name                   → Retrospective + pattern catalog
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
├── commands/                     ← 9 meta-commands
│   ├── build-app.md
│   ├── init-project.md
│   ├── plan-project.md
│   ├── tailor-agents.md
│   ├── generate-tests.md
│   ├── assess-phase.md
│   ├── execute-phase.md
│   ├── sync-docs.md
│   └── capture-learnings.md
├── agents/                       ← 8 meta-agents (model tier in frontmatter)
│   ├── project-planner.md        ← opus
│   ├── docs-generator.md         ← haiku
│   ├── agent-researcher.md       ← haiku
│   ├── agent-tailor.md           ← sonnet
│   ├── test-generator.md         ← sonnet
│   ├── phase-orchestrator.md     ← haiku
│   ├── quality-gate.md           ← haiku
│   └── cost-assessor.md          ← haiku
└── skills/                       ← 2 skills
    ├── task-management/SKILL.md
    └── docs-repo-patterns/SKILL.md
```

## Orchestrator: `/build-app`

Single command that runs the full protocol with user checkpoints between major phases.
Can be interrupted and re-run — automatically resumes from the last completed step.

**Input:** `"ProjectName" project-type "Description"`

**Resumption logic** — `/build-app` detects project state and resumes:

| Check | Means | Resume From |
|-------|-------|-------------|
| No project directory | Fresh start | Step 1 (Birth) |
| Repos exist but no TASK_BOARD.md | Init done | Step 2 (Plan) |
| TASK_BOARD.md exists but no `.claude/` in code repo | Plan done | Step 3 (Configure) |
| `.claude/` exists but no test files | Configure done | Step 4 (Test) |
| Test files exist, tasks PENDING | Tests done | Step 5 (Build Phase 1) |
| Some phases DONE, some PENDING | Build in progress | Step 5 (Build next phase) |
| All tasks DONE | Build complete | Step 6 (Learn) |

**User checkpoints:**
- After planning (Step 2): pauses for user to review TASK_BOARD.md and task specs
- After each build phase (Step 5): pauses on failures so user can fix before continuing

## The Protocol (7 Steps)

| # | Phase | Command | Input | Output |
|---|-------|---------|-------|--------|
| 1 | Birth | `/init-project` | Name, type, description | Two git repos (code + docs) |
| 2 | Plan | `/plan-project` | Project name | PLAN.md, TASK_BOARD.md, 20-80 task specs |
| 3 | Configure | `/tailor-agents` | Project name | Project-specific `.claude/` with model-routed agents |
| 4 | Test | `/generate-tests` | Project name | Pre-implementation test suites from task specs |
| 5 | Assess | `/assess-phase` | Phase number | Cost projection table (optional, standalone) |
| 6 | Build | `/execute-phase` | Phase number | Implemented code with cost checkpoint + quality gates |
| 7 | Maintain | `/sync-docs` | Sync mode | Docs ↔ code alignment |
| 8 | Learn | `/capture-learnings` | Project name | Retrospective + pattern catalog updates |

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

Uses the `agent-researcher` (haiku) and `agent-tailor` (sonnet) agents to create the code repo's `.claude/` directory. For each agent role, the researcher searches online for cursor rules, Claude Code configs, and stack-specific conventions, then scores them. High-quality research is synthesized into agents (Mode A); when research is insufficient, local templates are used as fallback (Mode B).

Each generated agent gets a **model tier** (haiku/sonnet/opus) in its YAML frontmatter, assigned based on task complexity. Override by editing the `model:` field.

- Agents enriched with battle-tested, version-specific conventions from online sources
- Model tier assigned per complexity rules (scaffold→haiku, backend→sonnet, etc.)
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

### Step 5 — Assess (`/assess-phase`) *(optional)*

Uses the `cost-assessor` agent (haiku, read-only) to estimate token cost before building:
- Reads task specs and agent model assignments
- Projects per-task token usage and cost
- Shows upgrade/downgrade alternatives per task
- No execution — assessment only

**Prerequisites:** `/tailor-agents` (needs agent model assignments).

### Step 6 — Build (`/execute-phase`)

Uses the `phase-orchestrator` agent (haiku) to execute tasks in dependency order:
- Computes execution batches from the dependency graph
- Runs cost assessment and presents a **user checkpoint** before execution
- User can approve, override model assignments per task, or cancel
- Launches 3-5 parallel agents per batch, each on its assigned model
- Runs `quality-gate` agent (haiku) after each task
- Updates TASK_BOARD.md with results

**Prerequisites:** `/generate-tests` (recommended) or `/tailor-agents` (minimum).

### Step 7 — Maintain (`/sync-docs`)

Keeps documentation synchronized with the codebase:
- `full` — Complete docs refresh
- `changelog` — Update changelog from recent commits
- `tasks` — Update task statuses on TASK_BOARD.md
- `status` — Quick status report

**Prerequisites:** Some implementation exists to document.

### Step 8 — Learn (`/capture-learnings`)

Extracts patterns and insights from a completed project:
- Produces a retrospective document in the knowledge base
- Identifies reusable patterns for the patterns catalog
- Records anti-patterns and what to avoid

**Prerequisites:** Project substantially complete.

## Meta-Agents Reference

| Agent | Model | Mission | Invoked By |
|-------|-------|---------|------------|
| `project-planner` | opus | Design architecture and decompose into phased tasks | `/plan-project` |
| `agent-tailor` | sonnet | Synthesize research or customize templates into project-specific agents | `/tailor-agents` |
| `test-generator` | sonnet | Generate test files from task acceptance criteria | `/generate-tests` |
| `agent-researcher` | haiku | Search online for best-practice coding configs, evaluate quality | `/tailor-agents` |
| `phase-orchestrator` | haiku | Execute task batches with dependency ordering | `/execute-phase` |
| `quality-gate` | haiku | Validate task completion against acceptance criteria | `/execute-phase` |
| `docs-generator` | haiku | Create GitBook-compatible documentation structure | `/plan-project`, `/sync-docs` |
| `cost-assessor` | haiku | Estimate token usage and cost for a phase | `/assess-phase`, `/execute-phase` |

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

Agent role templates (`templates/claude-config/agents/`), each with a default model tier:
- `scaffold-agent` — Project setup and boilerplate — **haiku**
- `types-agent` — Schema and type design — **sonnet**
- `backend-agent` — API routes and services — **sonnet**
- `frontend-agent` — UI components and hooks — **sonnet**
- `llm-agent` — LLM integration — **sonnet**
- `infra-agent` — Infrastructure and deployment — **sonnet**
- `test-agent` — Testing — **haiku**
- `security-agent` — Security hardening — **sonnet**
- `docs-agent` — Documentation — **haiku**

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
- **Process Patterns** — Phased execution, documentation-first planning, test-first execution, model routing for cost optimization, etc.
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
2. Add YAML frontmatter with `model:` (haiku/sonnet/opus) and `tools:` fields
3. Follow the Mission → Workflow → Quality Standards structure
4. Include `{{placeholder}}` variables for project-specific customization
5. Add the agent type to the mapping in `agent-tailor.md`

### Adding a New Pattern

1. Edit `knowledge-base/patterns-catalog.md`
2. Add under the appropriate category (Architecture, Process, Agent, Code)
3. Follow the format: Source, Context, Pattern, When to use
4. Include a code example if applicable

### Improving Agent Research

The research-first pipeline (`agent-researcher` → `agent-tailor` Mode A) can be extended:

1. **Add query types**: Edit the search query taxonomy in `agent-researcher.md` to target new config file formats
2. **Tune scoring thresholds**: Adjust the 7/10 decision gate in `tailor-agents.md` Step 4b based on observed quality
3. **Add per-role queries**: Update the per-role query focus table in `knowledge-base/research-strategy.md`
4. **Review research quality**: Check `<!-- Research Sources: ... -->` comments in generated agents to audit what research contributed
