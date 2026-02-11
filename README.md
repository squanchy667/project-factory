# Project Factory

A meta-layer for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that turns a one-line idea into a fully implemented, documented, and tested application. It provides 9 slash commands, 8 specialized agents, reusable templates, and a knowledge base of proven patterns — all orchestrated through a single `/build-app` command.

**New here?** Read the [User Guide](GUIDE.md) for a friendly, start-to-finish walkthrough.

## What It Does

You describe an app. Project Factory handles the rest:

1. **Scaffolds** two paired repositories (code + documentation)
2. **Plans** the architecture and decomposes it into 20-80 phased tasks with dependencies
3. **Configures** project-specific AI agents tailored to your stack, each assigned an optimal model tier
4. **Generates** test suites from task specs (tests-first, before any implementation)
5. **Estimates cost** before each build phase so you can review and override model assignments
6. **Builds** each phase by running 3-5 parallel agents with quality gates
7. **Syncs** documentation with the codebase
8. **Captures** learnings and patterns for future projects

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated
- Git
- Node.js 18+ (for web project types)
- Unity 2022+ (for unity-game project type only)

## Setup

1. **Clone the repository:**

```bash
git clone https://github.com/squanchy667/project-factory.git
cd project-factory
```

2. **That's it.** The `.claude/` directory contains all the commands, agents, and skills. Claude Code picks them up automatically when you run it from this directory.

## Usage

### One Command (Recommended)

Open Claude Code in the workspace root (`Projects/Claude/`) and run:

```
/build-app "MyApp" react-express "A task management app with real-time collaboration"
```

This runs the full pipeline with user checkpoints between major phases. You can interrupt at any time and re-run the same command — it automatically detects progress and resumes from where it left off.

### Step by Step

If you prefer more control, run each command individually:

```
/init-project "MyApp" react-express "A task management app with real-time collaboration"
/plan-project MyApp
/tailor-agents MyApp
/generate-tests MyApp
/assess-phase 1              ← (optional) preview cost before building
/execute-phase 1
/execute-phase 2
...
/sync-docs full
/capture-learnings MyApp
```

### Step-by-Step Walkthrough (First Time)

If you've never used Project Factory before, here's exactly what to expect at each step:

#### 1. Start Claude Code in the workspace

```bash
cd /path/to/project-factory    # or the parent workspace directory
claude                          # launches Claude Code CLI
```

You should see the Claude Code prompt. All `/commands` are loaded from `.claude/commands/`.

#### 2. Create your project

```
/init-project "TaskFlow" react-express "A kanban board with real-time collaboration"
```

This creates two directories:
- `TaskFlow/taskflow/` — your code repo (git initialized)
- `TaskFlow/taskflow-docs/` — your docs repo (GitBook structure)

#### 3. Generate the plan

```
/plan-project TaskFlow
```

The `project-planner` agent (runs on **Opus** — the only agent that does) designs the architecture and breaks it into 20-80 tasks across phases. You'll find:
- `taskflow-docs/PLAN.md` — architecture vision
- `taskflow-docs/TASK_BOARD.md` — all tasks with dependencies
- `taskflow-docs/tasks/phase-1/T001-*.md` — individual task specs

**Review TASK_BOARD.md before continuing.** This is your chance to adjust scope.

#### 4. Configure AI agents for your project

```
/tailor-agents TaskFlow
```

This does two things per agent role:
1. **Searches online** (via `agent-researcher` on Haiku) for cursor rules, Claude configs, and stack-specific conventions
2. **Synthesizes or templates** (via `agent-tailor` on Sonnet) a project-specific agent

Each generated agent gets a **model tier** in its YAML frontmatter:

```yaml
---
model: sonnet
tools: Read, Write, Edit, Glob, Grep, Bash
---
```

Model assignment follows complexity rules — scaffold agents get Haiku, backend/frontend get Sonnet, security always gets at least Sonnet. You can override any agent's model by editing its frontmatter.

Output: `taskflow/.claude/` with agents, commands, skills, and CLAUDE.md.

#### 5. Generate tests

```
/generate-tests TaskFlow
```

Creates failing test files from each task's acceptance criteria. These define "done" — implementation agents must make them pass.

#### 6. Preview cost (optional but recommended)

```
/assess-phase 1
```

The `cost-assessor` agent (Haiku, read-only) estimates token usage for the phase:

```
Phase 1 Cost Assessment
=========================

| Task   | Agent    | Model  | Context | Est. Turns | Est. Cost |
|--------|----------|--------|---------|------------|-----------|
| T001   | scaffold | haiku  | 12K     | 15         | $0.41     |
| T002   | types    | sonnet | 18K     | 25         | $2.48     |
| T003   | backend  | sonnet | 15K     | 20         | $1.80     |

TOTAL ESTIMATED: $5.20

Model alternatives:
- T001 as sonnet: $1.22 (+$0.81)
- T003 as haiku: $0.60 (-$1.20)
```

This is standalone — no execution happens. Use it to budget or adjust models.

#### 7. Build

```
/execute-phase 1
```

What happens in order:
1. **Batch plan** — tasks sorted by dependencies, displayed with agent/model:
   ```
   Batch 1 (parallel): T001 [scaffold-agent/haiku], T002 [types-agent/sonnet]
   Batch 2 (parallel): T003 [backend-agent/sonnet], T004 [frontend-agent/sonnet]
   ```
2. **Cost assessment** — projection table (same as `/assess-phase` but inline)
3. **User checkpoint** — you approve, override models, or cancel
4. **Execution** — parallel agents run, each on its assigned model
5. **Quality gates** — each task validated against acceptance criteria
6. **Report** — summary of pass/fail results

Repeat for each phase:
```
/execute-phase 2
/execute-phase 3
...
```

#### 8. Sync docs and capture learnings

```
/sync-docs full
/capture-learnings TaskFlow
```

Updates documentation to match the implemented code, then extracts reusable patterns into the knowledge base.

### Project Types

| Type | Description | Stack |
|------|-------------|-------|
| `react-express` | Web app with React frontend + Express backend | React, TypeScript, Vite, Tailwind, Express, Vitest |
| `fullstack-aws` | Full-stack web app deployed to AWS | React, TypeScript, Vite, Tailwind, Express, AWS SAM, DynamoDB |
| `unity-game` | Unity game with C# scripting | Unity, C#, Netcode, ScriptableObjects |
| `typescript-lib` | TypeScript library for npm | TypeScript, Vitest, tsup |

## Model Routing

Every agent has a `model:` field in its YAML frontmatter that controls which Claude model runs it. This matches model capability to task complexity:

| Tier | Model | Cost (in/out per MTok) | Used For |
|------|-------|------------------------|----------|
| **Lite** | Haiku | $1 / $5 | Scaffolding, docs, orchestration, quality gates, cost assessment |
| **Standard** | Sonnet | $3 / $15 | Backend, frontend, types, security, infra, LLM integration |
| **Premium** | Opus | $5 / $25 | Architecture design (project planner only) |

### Default assignments

**Meta-layer agents** (the factory itself):

| Agent | Model | Why |
|-------|-------|-----|
| `project-planner` | opus | Architecture decisions require the strongest model |
| `agent-tailor` | sonnet | Synthesizes research into customized configs |
| `test-generator` | sonnet | Test correctness matters |
| `agent-researcher` | haiku | Web search + rubric scoring, no code generation |
| `phase-orchestrator` | haiku | Algorithmic batch scheduling |
| `quality-gate` | haiku | Checklist validation |
| `docs-generator` | haiku | Template-based doc filling |
| `cost-assessor` | haiku | Read-only estimation |

**Template agents** (defaults for generated project agents):

| Template | Model | Why |
|----------|-------|-----|
| `types-agent` | sonnet | Schemas are the project's contract |
| `backend-agent` | sonnet | Routes, services, middleware |
| `frontend-agent` | sonnet | Components, hooks, state |
| `llm-agent` | sonnet | AI SDK integration |
| `infra-agent` | sonnet | Cloud infra precision |
| `security-agent` | sonnet | Security must be correct |
| `scaffold-agent` | haiku | Configs, boilerplate |
| `test-agent` | haiku | Pattern-following test writing |
| `docs-agent` | haiku | Markdown docs |

### Overriding models

**Per agent:** Edit the `model:` field in any agent's frontmatter:

```yaml
---
model: opus      # was sonnet — upgrading for a complex task
tools: Read, Write, Edit, Glob, Grep, Bash
---
```

**Per phase execution:** When `/execute-phase` shows the cost assessment, you can override specific tasks:

```
Override: T005:opus, T008:haiku
```

**Automatic upgrades** during `/tailor-agents`:
- Tasks with 5+ subtasks or 8+ acceptance criteria: haiku upgrades to sonnet
- Cross-package coordination (3+ packages): haiku upgrades to sonnet
- Security-critical code: minimum sonnet
- Simple projects (<15 tasks): sonnet downgrades to haiku (except security)

### Cost impact

| Scenario | Estimated Cost | Savings |
|----------|---------------|---------|
| All Opus (no routing) | ~$290 | — |
| All Sonnet (no routing) | ~$103 | 64% vs Opus |
| **With model routing** | **~$80** | **72% vs Opus, 23% vs Sonnet** |

## What Gets Created

When you build a project called "MyApp", the factory creates:

```
MyApp/
├── myapp/                  ← Code repository (git)
│   ├── .claude/            ← Project-specific agents, commands, skills
│   │   ├── CLAUDE.md       ← Conventions for this project
│   │   ├── agents/         ← Specialized agents (backend, frontend, etc.)
│   │   ├── commands/       ← Workflow commands
│   │   └── skills/         ← Always-on context
│   ├── src/                ← Application source code
│   └── tests/              ← Test suites
└── myapp-docs/             ← Documentation repository (git, GitBook-compatible)
    ├── PLAN.md             ← Architecture and phase outline
    ├── TASK_BOARD.md       ← All tasks with status tracking
    ├── SUMMARY.md          ← GitBook navigation
    ├── architecture/       ← System overview, data flow
    ├── developer/          ← Setup guide, coding standards
    ├── product/            ← Features, roadmap
    ├── testing/            ← Test plans
    └── tasks/phase-X/      ← Individual task specs (T001, T002, ...)
```

## How It Works

### The Pipeline

| Step | Command | What Happens | Key Agent (Model) |
|------|---------|--------------|-------------------|
| 1. Birth | `/init-project` | Creates code + docs repos from templates | — |
| 2. Plan | `/plan-project` | Designs architecture, creates 20-80 task specs | `project-planner` (opus) |
| 3. Configure | `/tailor-agents` | Generates project-specific `.claude/` with model-routed agents | `agent-researcher` (haiku) + `agent-tailor` (sonnet) |
| 4. Test | `/generate-tests` | Creates failing test suites from acceptance criteria | `test-generator` (sonnet) |
| 5. Assess | `/assess-phase N` | Estimates token cost for a phase (optional, standalone) | `cost-assessor` (haiku) |
| 6. Build | `/execute-phase N` | Runs parallel agents per phase with cost checkpoint + quality gates | `phase-orchestrator` (haiku) + per-task agents |
| 7. Docs | `/sync-docs` | Aligns documentation with implemented code | `docs-generator` (haiku) |
| 8. Learn | `/capture-learnings` | Extracts patterns and retrospective into the knowledge base | — |

### Resumption

`/build-app` is idempotent. It checks what already exists and resumes:

| State | Resumes From |
|-------|-------------|
| No project directory | Step 1 (Birth) |
| Repos exist, no TASK_BOARD.md | Step 2 (Plan) |
| TASK_BOARD.md exists, no `.claude/` in code repo | Step 3 (Configure) |
| `.claude/` exists, no test files | Step 4 (Test) |
| Tests exist, tasks still PENDING | Step 6 (Build) |
| All tasks DONE | Step 8 (Learn) |

### Parallel Execution

During the Build phase, tasks within a phase that have no dependencies on each other run in parallel (3-5 agents at a time). The dependency graph ensures correct ordering. Each agent runs on the model specified in its frontmatter.

## Repository Structure

```
.
├── .claude/                        ← Meta-layer (the factory itself)
│   ├── commands/                   ← 9 slash commands
│   │   ├── build-app.md            ← Orchestrator: runs the full pipeline
│   │   ├── init-project.md         ← Create project structure
│   │   ├── plan-project.md         ← Generate planning artifacts
│   │   ├── tailor-agents.md        ← Generate project-specific AI config
│   │   ├── generate-tests.md       ← Generate test suites
│   │   ├── assess-phase.md         ← Estimate phase cost (standalone)
│   │   ├── execute-phase.md        ← Run a build phase
│   │   ├── sync-docs.md            ← Sync documentation
│   │   └── capture-learnings.md    ← Extract patterns
│   ├── agents/                     ← 8 meta-agents
│   │   ├── project-planner.md      ← opus
│   │   ├── agent-tailor.md         ← sonnet
│   │   ├── test-generator.md       ← sonnet
│   │   ├── agent-researcher.md     ← haiku
│   │   ├── phase-orchestrator.md   ← haiku
│   │   ├── quality-gate.md         ← haiku
│   │   ├── docs-generator.md       ← haiku
│   │   └── cost-assessor.md        ← haiku
│   └── skills/                     ← 2 always-on skills
│       ├── task-management/
│       └── docs-repo-patterns/
└── project-factory/                ← Templates, schemas, knowledge base
    ├── templates/
    │   ├── docs/                   ← Documentation templates (base + type overlays)
    │   ├── code/                   ← Code starter templates per project type
    │   └── claude-config/          ← Agent, command, and skill templates
    ├── schemas/                    ← Project config and task spec schemas
    └── knowledge-base/             ← Proven patterns and project retrospectives
```

## Extending

### Add a New Project Type

1. Create a docs overlay in `project-factory/templates/docs/{new-type}/`
2. Create a code starter in `project-factory/templates/code/{new-type}/`
3. Add the type to `project-factory/schemas/project-config.md`

### Add a New Agent Template

1. Create `project-factory/templates/claude-config/agents/{agent-name}.md`
2. Add YAML frontmatter with `model:` (haiku/sonnet/opus) and `tools:` fields
3. Use `{{placeholder}}` variables for project-specific values
4. Follow the Mission / Workflow / Quality Standards structure

### Override Model Defaults

Edit the `model:` field in any agent's YAML frontmatter. Values: `haiku`, `sonnet`, `opus`.

See [project-factory/README.md](project-factory/README.md) for the full reference.

## License

MIT
