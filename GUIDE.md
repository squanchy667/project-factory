# Project Factory — User Guide

A start-to-finish guide for building apps with Project Factory, for solo developers and teams.

---

## What Is This?

Project Factory is a set of AI-powered tools that sit on top of [Claude Code](https://docs.anthropic.com/en/docs/claude-code). You describe what you want to build, and it handles planning, scaffolding, coding, testing, and documentation.

It works by breaking your idea into dozens of small tasks, assigning each to a specialized AI agent, and running them with quality checks after every task.

---

## Before You Start

You need three things installed:

1. **Claude Code CLI** — the terminal tool from Anthropic
   - Install: `npm install -g @anthropic-ai/claude-code`
   - Authenticate: run `claude` once and follow the prompts
   - Docs: https://docs.anthropic.com/en/docs/claude-code

2. **Git** — any recent version
   - Check: `git --version`

3. **Node.js 18+** *(only for web projects)*
   - Check: `node --version`
   - Or **Unity 2022+** if you're building a game

---

## Getting Started

### 1. Clone the workspace

```bash
git clone https://github.com/squanchy667/project-factory.git ~/Projects/Claude
cd ~/Projects/Claude
```

This gives you the full workspace with all commands, agents, skills, and templates. There's nothing else to install — Claude Code detects them automatically.

### 2. Launch Claude Code

```bash
cd ~/Projects/Claude
claude
```

You should see the Claude Code interactive prompt. All 9 `/slash-commands` are now available.

### 3. Pick what you want to build

You need three things:
- A **name** for your project (e.g., "TaskFlow")
- A **type** — one of:

| Type | Best for | Stack you get |
|------|----------|---------------|
| `react-express` | Web apps | React, TypeScript, Express, Tailwind, Vite |
| `fullstack-aws` | Web apps on AWS | Same as above + AWS SAM, DynamoDB, Lambda |
| `unity-game` | Games | Unity, C#, ScriptableObjects |
| `typescript-lib` | npm packages | TypeScript, Vitest, tsup |

- A **description** — one sentence about what the app does

---

## Building Your App

You have two options: **autopilot** or **step-by-step**. Both produce the same result.

### Option A: Autopilot (one command)

```
/build-app "TaskFlow" react-express "A kanban board with real-time collaboration"
```

This runs the entire pipeline. It pauses at key moments so you can review:
- After planning — so you can review the task list
- Before each build phase — so you can review the cost estimate
- After failures — so you can decide what to fix

If it gets interrupted, just run the same command again. It detects where it left off and resumes.

**That's it for Option A.** Skip to [What You Get](#what-you-get-when-its-done) if using autopilot.

---

### Option B: Step by Step (full control)

Recommended for teams and when you want to tweak between stages.

#### Step 1 — Plan the project

```
/plan-project TaskFlow
```

**What happens:** The AI architect designs:
- The full system architecture
- 20-80 individual tasks, grouped into phases
- A dependency graph showing which tasks can run in parallel

**What to check:**
- Open `TaskFlow/taskflow-docs/TASK_BOARD.md` — this is your task board
- Scan the phases and task names. Do they make sense?
- Open task specs in `taskflow-docs/tasks/phase-1/` for detail
- If something looks wrong, tell Claude and it will adjust

**Time:** 3-10 minutes depending on project size.

#### Step 2 — Scan existing code (optional)

If you already have code, index it for smarter context:

```
/scan-repo ./TaskFlow/taskflow
```

Skip this if starting from scratch.

#### Step 3 — Build phase by phase

```
/execute-phase 1
```

**What happens:**
1. **Batch plan** — tasks sorted by dependencies, grouped for parallel execution
2. **Cost preview** — estimated token usage per task
3. **Your decision** — approve, override model assignments, or cancel
4. **Execution** — agents run with quality gates after each task
5. **Report** — summary of pass/fail results

Repeat for each phase:
```
/execute-phase 2
/execute-phase 3
...
```

**Time:** 10-20 minutes per phase (varies by size).

#### Fix a failed task

If a task fails, run it individually:
```
/do-task "Rebuild the authentication middleware with JWT support"
```

Or pick from the task board:
```
/task-execute
```

#### Step 4 — Capture learnings

```
/capture-learnings TaskFlow
```

Extracts reusable patterns and adds them to the knowledge base for future projects.

---

## What You Get When It's Done

```
TaskFlow/
├── taskflow/                       ← Your app (ready to run)
│   ├── .claude/                    ← AI agents configured for YOUR project
│   │   ├── CLAUDE.md               ← Project conventions
│   │   ├── agents/                 ← Specialized agents
│   │   ├── commands/               ← Workflow shortcuts
│   │   └── skills/                 ← Always-on context
│   ├── src/                        ← Application source code
│   ├── tests/                      ← Test suites
│   └── ...
│
└── taskflow-docs/                  ← Full documentation (GitBook-compatible)
    ├── PLAN.md                     ← Architecture decisions
    ├── TASK_BOARD.md               ← All tasks with status
    ├── SUMMARY.md                  ← Table of contents
    ├── architecture/               ← System diagrams
    ├── developer/                  ← Setup guide, coding standards
    ├── product/                    ← Feature specs, roadmap
    ├── testing/                    ← Test strategy
    └── tasks/                      ← Individual task specs
```

The code repo has its own `.claude/` directory. You can keep using Claude Code on the project — the agents already know your codebase.

---

## Working as a Team

### Workspace Layout

Every team member has the same workspace structure:

```
~/Projects/Claude/                  ← Cloned from this repo
├── .claude/                        ← SHARED: 9 commands, 17 agents, 4 skills
├── project-factory/                ← SHARED: templates, knowledge base
├── ProjectA/                       ← Separate git repos (cloned per project)
│   ├── project-a/
│   └── project-a-docs/
└── ProjectB/
    ├── project-b/
    └── project-b-docs/
```

### What each team member does

1. **Clone the workspace** (once):
   ```bash
   git clone https://github.com/squanchy667/project-factory.git ~/Projects/Claude
   ```

2. **Clone the project repos** they're working on:
   ```bash
   cd ~/Projects/Claude/MyProject
   git clone <code-repo-url> myproject
   git clone <docs-repo-url> myproject-docs
   ```

3. **Launch Claude Code from the workspace root**:
   ```bash
   cd ~/Projects/Claude
   claude
   ```

4. All commands (`/execute-phase`, `/do-task`, etc.) work automatically.

### What's shared vs local

| What | Shared (this repo) | Local (your machine) |
|------|:---:|:---:|
| Commands (`/build-app`, `/execute-phase`, etc.) | Yes | — |
| Agents (17 specialized builders) | Yes | — |
| Skills (4 context modules) | Yes | — |
| Templates (4 project types) | Yes | — |
| Knowledge base (patterns, retrospectives) | Yes | — |
| `settings.local.json` (permissions, MCP servers) | — | Yes |
| Claude Code memory | — | Yes |
| Project code and docs | — | Separate git repos |

### Parallel development on the same project

For teams working on the same project simultaneously:

- **Each developer works on their assigned tasks** from `TASK_BOARD.md`
- **Branch per task:** `feat/TXXX-task-name` (e.g., `feat/T014-combo-system`)
- **Commit format:** `[Phase X] TXXX: Brief description`
- **No direct pushes to main** — use PRs or an integration branch
- **Tasks with no dependencies can run in parallel** across team members

### Task ownership

In `TASK_BOARD.md`, tasks are often grouped by developer role:
- **Dev 1:** Pillar 1 tasks (e.g., combat system)
- **Dev 2:** Pillar 2 tasks (e.g., progression system)
- **Dev 3:** Pillar 3 tasks (e.g., world and UI)

Each developer runs `/execute-phase` or `/do-task` for their assigned tasks only.

---

## Controlling Costs

Project Factory routes each agent to the cheapest model that can do the job well.

| Model | Cost (input / output per MTok) | Used for |
|-------|------|----------|
| Haiku | $1 / $5 | Scaffolding, docs, orchestration, quality checks |
| Sonnet | $3 / $15 | Backend, frontend, types, security, infra |
| Opus | $5 / $25 | Architecture planning only |

**Typical cost:** $60-120 for a medium project (25-40 tasks).

### How to adjust

**Before building** — `/execute-phase` shows a cost preview before execution starts.

**Override specific tasks** — when prompted, type overrides:
```
Override: T005:haiku, T012:opus
```

**Permanently** — edit any agent's frontmatter:
```yaml
---
model: haiku    ← change to sonnet or opus
tools: Read, Write, Edit, Glob, Grep, Bash
---
```

### Rules of thumb

- Scaffold/boilerplate tasks are fine on **Haiku**
- Standard implementation works well on **Sonnet**
- Only upgrade to **Opus** for genuinely complex architecture
- Security agents should stay on **Sonnet** minimum

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/build-app "Name" type "desc"` | Full pipeline on autopilot |
| `/plan-project Name` | Design architecture + create tasks |
| `/execute-phase N` | Build all tasks in a phase |
| `/do-task "description"` | Execute a single task |
| `/task-execute` | Pick a task from the board and execute it |
| `/scan-repo ./path` | Index existing code for context |
| `/convert-repo ./path` | Convert any repo to dual-repo format |
| `/design-schema` | Design a Zod schema with inferred types |
| `/capture-learnings Name` | Extract patterns for future projects |

---

## Troubleshooting

**"Command not found" when typing /build-app**
You're not in the right directory. Make sure Claude Code is launched from the workspace root that contains the `.claude/` folder.

**A task keeps failing**
Run it individually with `/do-task` and a more specific description. Or fix the issue manually and mark the task as DONE in `TASK_BOARD.md`.

**Cost seems too high**
Override expensive tasks to use Haiku. Simple tasks (scaffolding, configuration, documentation) work well on the cheapest model.

**Want to change the plan mid-build**
Edit `TASK_BOARD.md` directly. Change statuses, add or remove tasks. `/execute-phase` reads the task board fresh each time.

**Partners don't see the commands**
Make sure they cloned this repo and are running `claude` from the workspace root (`~/Projects/Claude/`), not from inside a project directory.
