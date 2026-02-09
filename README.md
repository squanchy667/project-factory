# Project Factory

A meta-layer for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that turns a one-line idea into a fully implemented, documented, and tested application. It provides 8 slash commands, 6 specialized agents, reusable templates, and a knowledge base of proven patterns — all orchestrated through a single `/build-app` command.

## What It Does

You describe an app. Project Factory handles the rest:

1. **Scaffolds** two paired repositories (code + documentation)
2. **Plans** the architecture and decomposes it into 20-80 phased tasks with dependencies
3. **Configures** project-specific AI agents tailored to your stack
4. **Generates** test suites from task specs (tests-first, before any implementation)
5. **Builds** each phase by running 3-5 parallel agents with quality gates
6. **Syncs** documentation with the codebase
7. **Captures** learnings and patterns for future projects

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

Open Claude Code in this directory and run:

```
/build-app "MyApp" react-express "A task management app with real-time collaboration"
```

This runs the full 7-step pipeline with user checkpoints between major phases. You can interrupt at any time and re-run the same command — it automatically detects progress and resumes from where it left off.

### Step by Step

If you prefer more control, run each command individually:

```
/init-project "MyApp" react-express "A task management app with real-time collaboration"
/plan-project MyApp
/tailor-agents MyApp
/generate-tests MyApp
/execute-phase 1
/execute-phase 2
...
/sync-docs full
/capture-learnings MyApp
```

### Project Types

| Type | Description | Stack |
|------|-------------|-------|
| `react-express` | Web app with React frontend + Express backend | React, TypeScript, Vite, Tailwind, Express, Vitest |
| `fullstack-aws` | Full-stack web app deployed to AWS | React, TypeScript, Vite, Tailwind, Express, AWS SAM, DynamoDB |
| `unity-game` | Unity game with C# scripting | Unity, C#, Netcode, ScriptableObjects |
| `typescript-lib` | TypeScript library for npm | TypeScript, Vitest, tsup |

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

### The 7-Step Protocol

| Step | Command | What Happens |
|------|---------|--------------|
| 1. Birth | `/init-project` | Creates code + docs repos from templates |
| 2. Plan | `/plan-project` | AI planner designs architecture, creates 20-80 task specs with dependencies |
| 3. Configure | `/tailor-agents` | Generates project-specific `.claude/` with agents tuned to your stack |
| 4. Test | `/generate-tests` | Creates failing test suites from task acceptance criteria |
| 5. Build | `/execute-phase N` | Runs parallel agents per phase, each task gets a quality gate |
| 6. Docs | `/sync-docs` | Aligns documentation with implemented code |
| 7. Learn | `/capture-learnings` | Extracts patterns and retrospective into the knowledge base |

### Resumption

`/build-app` is idempotent. It checks what already exists and resumes:

| State | Resumes From |
|-------|-------------|
| No project directory | Step 1 (Birth) |
| Repos exist, no TASK_BOARD.md | Step 2 (Plan) |
| TASK_BOARD.md exists, no `.claude/` in code repo | Step 3 (Configure) |
| `.claude/` exists, no test files | Step 4 (Test) |
| Tests exist, tasks still PENDING | Step 5 (Build) |
| All tasks DONE | Step 7 (Learn) |

### Parallel Execution

During the Build phase, tasks within a phase that have no dependencies on each other run in parallel (3-5 agents at a time). The dependency graph ensures correct ordering.

## Repository Structure

```
.
├── .claude/                        ← Meta-layer (the factory itself)
│   ├── commands/                   ← 8 slash commands
│   │   ├── build-app.md            ← Orchestrator: runs the full pipeline
│   │   ├── init-project.md         ← Create project structure
│   │   ├── plan-project.md         ← Generate planning artifacts
│   │   ├── tailor-agents.md        ← Generate project-specific AI config
│   │   ├── generate-tests.md       ← Generate test suites
│   │   ├── execute-phase.md        ← Run a build phase
│   │   ├── sync-docs.md            ← Sync documentation
│   │   └── capture-learnings.md    ← Extract patterns
│   ├── agents/                     ← 6 meta-agents
│   │   ├── project-planner.md
│   │   ├── docs-generator.md
│   │   ├── agent-tailor.md
│   │   ├── test-generator.md
│   │   ├── phase-orchestrator.md
│   │   └── quality-gate.md
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
2. Use `{{placeholder}}` variables for project-specific values
3. Follow the Mission / Workflow / Quality Standards structure

See [project-factory/README.md](project-factory/README.md) for the full reference.

## License

MIT
