# Project Factory

A meta-layer for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that turns a one-line idea into a fully implemented, documented, and tested application. It provides 9 slash commands, 17 specialized agents, reusable templates, and a knowledge base of proven patterns — all orchestrated through a single `/build-app` command or run step-by-step for full control.

**New here?** Read the [User Guide](GUIDE.md) for a friendly, start-to-finish walkthrough.

## What It Does

You describe an app. Project Factory handles the rest:

1. **Plans** the architecture and decomposes it into 20-80 phased tasks with dependencies
2. **Scaffolds** two paired repositories (code + documentation)
3. **Builds** each phase by running parallel agents with quality gates
4. **Captures** learnings and patterns for future projects

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated
- Git
- Node.js 18+ (for web project types)
- Unity 2022+ (for unity-game project type only)

## Setup

### Solo Developer

```bash
git clone https://github.com/squanchy667/project-factory.git
cd project-factory
claude
```

That's it. The `.claude/` directory contains all the commands, agents, and skills. Claude Code picks them up automatically.

### Team Setup

Every team member clones the same repo. Each person gets the full command suite:

```bash
# 1. Clone the workspace
git clone https://github.com/squanchy667/project-factory.git ~/Projects/Claude
cd ~/Projects/Claude

# 2. Launch Claude Code from the workspace root
claude
```

All `/slash-commands` are now available for every team member.

**Project repos live inside the workspace** as separate git repos (not submodules):
```
~/Projects/Claude/
├── .claude/              ← Shared: commands, agents, skills (from this repo)
├── project-factory/      ← Shared: templates, knowledge base (from this repo)
├── MyProject/            ← Your project (separate git repo, not tracked here)
│   ├── myproject/        ← Code repo
│   └── myproject-docs/   ← Docs repo
└── AnotherProject/       ← Another project (separate git repo)
```

**What's shared (in this repo):**
- All 9 commands, 17 agents, 4 skills
- Templates for 4 project types
- Knowledge base with patterns from completed projects

**What's local (never shared):**
- `.claude/settings.local.json` — your machine's permissions and MCP servers
- `.claude/memory/` — Claude Code's auto-memory
- Individual project directories

## Usage

### One Command (Autopilot)

```
/build-app "MyApp" react-express "A task management app with real-time collaboration"
```

This runs the full pipeline with user checkpoints between phases. You can interrupt at any time — it detects progress and resumes.

### Step by Step (Full Control)

For teams or when you want to review and tweak at each stage:

```
/plan-project MyApp                ← Design architecture, create 20-80 tasks
  → Review TASK_BOARD.md, adjust scope, tweak task specs

/scan-repo ./myapp                 ← Index existing code (if any)

/execute-phase 1                   ← Build Phase 1 tasks (with cost preview)
  → Review output, fix issues, re-run failed tasks with /do-task

/execute-phase 2                   ← Build Phase 2
  → Review, tweak, repeat...

/capture-learnings MyApp           ← Extract patterns for future projects
```

#### Individual Task Execution

```
/do-task "Build the authentication middleware"     ← Execute a single task
/task-execute                                      ← Pick and execute from the task board
```

#### Utility Commands

```
/scan-repo ./existing-project      ← Index a codebase for smarter context
/convert-repo ./legacy-app         ← Convert any repo to dual-repo format
/design-schema                     ← Design a Zod schema with inferred types
```

### Project Types

| Type | Description | Stack |
|------|-------------|-------|
| `react-express` | Web app with React frontend + Express backend | React, TypeScript, Vite, Tailwind, Express, Vitest |
| `fullstack-aws` | Full-stack web app deployed to AWS | Same as above + AWS SAM, DynamoDB, Lambda |
| `unity-game` | Unity game with C# scripting | Unity, C#, Netcode, ScriptableObjects |
| `typescript-lib` | TypeScript library for npm | TypeScript, Vitest, tsup |

## Commands Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/build-app` | Full orchestration: plan → build → learn | Start a new project on autopilot |
| `/plan-project` | Decompose a goal into phased tasks | Manual mode — design the plan |
| `/execute-phase N` | Run all tasks in a phase with quality gates | Manual mode — build phase by phase |
| `/do-task` | Execute a single task through the pipeline | Fix a failed task or run one-off work |
| `/task-execute` | Pick and execute a task from the task board | Work through the task board |
| `/scan-repo` | Index a codebase for smarter context | Before building on existing code |
| `/convert-repo` | Convert any repo to dual-repo format | Adopt an existing project |
| `/design-schema` | Design a Zod schema with inferred types | Data modeling |
| `/capture-learnings` | Extract patterns into the knowledge base | After completing a project |

## Model Routing

Every agent has a `model:` field in its YAML frontmatter that controls which Claude model runs it:

| Tier | Model | Cost (in/out per MTok) | Used For |
|------|-------|------------------------|----------|
| **Lite** | Haiku | $1 / $5 | Scaffolding, docs, orchestration, quality gates |
| **Standard** | Sonnet | $3 / $15 | Backend, frontend, types, security, infra |
| **Premium** | Opus | $5 / $25 | Architecture design (planning only) |

### Overriding Models

**Per agent:** Edit the `model:` field in any agent's frontmatter:
```yaml
---
model: opus      # was sonnet — upgrading for a complex task
tools: Read, Write, Edit, Glob, Grep, Bash
---
```

**During phase execution:** When `/execute-phase` shows the cost table, you can override:
```
Override: T005:opus, T008:haiku
```

## What Gets Created

When you build a project called "MyApp":

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

## Repository Structure

```
.
├── .claude/                        ← Meta-layer (the factory itself)
│   ├── CLAUDE.md                   ← Workspace conventions
│   ├── commands/                   ← 9 slash commands
│   ├── agents/                     ← 17 specialized agents
│   └── skills/                     ← 4 always-on context modules
├── project-factory/                ← Templates and knowledge base
│   ├── templates/
│   │   ├── docs/                   ← Documentation templates (base + type overlays)
│   │   ├── code/                   ← Code starter templates per project type
│   │   └── claude-config/          ← Agent, command, and skill templates
│   ├── schemas/                    ← Project config and task spec schemas
│   └── knowledge-base/             ← Proven patterns and project retrospectives
├── README.md                       ← This file
└── GUIDE.md                        ← User-friendly walkthrough
```

## Extending

### Add a New Project Type

1. Create a docs overlay in `project-factory/templates/docs/{new-type}/`
2. Create a code starter in `project-factory/templates/code/{new-type}/`
3. Add the type to `project-factory/schemas/project-config.md`

### Add a New Agent Template

1. Create `project-factory/templates/claude-config/agents/{agent-name}.md`
2. Add YAML frontmatter with `model:` (haiku/sonnet/opus) and `tools:` fields
3. Follow the Mission / Workflow / Quality Standards structure

## License

MIT
