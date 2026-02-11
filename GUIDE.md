# Project Factory — User Guide

A friendly, start-to-finish guide for building your first app with Project Factory.

---

## What Is This?

Project Factory is a set of AI-powered tools that sit on top of [Claude Code](https://docs.anthropic.com/en/docs/claude-code). You type one line describing the app you want, and it handles the rest — planning, scaffolding, coding, testing, and documentation.

It works by breaking your idea into dozens of small tasks, assigning each to a specialized AI agent, and running them in parallel with quality checks after every task.

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

### 1. Clone the repo

```bash
git clone https://github.com/squanchy667/project-factory.git
```

This gives you a `project-factory/` folder. Inside it (and in the parent `.claude/` directory) are all the commands, agents, and templates. There's nothing to install or configure — Claude Code detects them automatically.

### 2. Open Claude Code

Navigate to the **parent directory** (the one containing `.claude/` and `project-factory/`) and launch Claude Code:

```bash
cd project-factory/..    # or wherever you cloned it
claude
```

You should see the Claude Code interactive prompt. All the `/slash-commands` are now available.

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

You have two options: **autopilot** or **manual**. Both produce the same result.

### Option A: Autopilot (one command)

```
/build-app "TaskFlow" react-express "A kanban board with real-time collaboration"
```

This runs the entire pipeline. It pauses at key moments so you can review and adjust:
- After planning — so you can review the task list
- Before each build phase — so you can review the cost estimate
- After build failures — so you can decide what to fix

If it gets interrupted (you close the terminal, hit Ctrl+C, etc.), just run the same command again. It detects where you left off and resumes.

**That's it for Option A.** Skip ahead to [What You Get](#what-you-get-when-its-done) if you're using autopilot.

---

### Option B: Manual (step by step)

This gives you full control over each stage. Recommended if you want to understand what's happening or tweak things between steps.

#### Step 1 — Create the project

```
/init-project "TaskFlow" react-express "A kanban board with real-time collaboration"
```

**What happens:** Two folders appear:
```
TaskFlow/
  taskflow/          ← your code (git repo)
  taskflow-docs/     ← your documentation (git repo)
```

The code repo has a basic starter. The docs repo has a GitBook-compatible structure ready to be filled in.

**Time:** ~1 minute.

#### Step 2 — Plan the architecture

```
/plan-project TaskFlow
```

**What happens:** The AI architect (the only agent that runs on Opus, the most capable model) reads your description and designs:
- The full system architecture
- 20-80 individual tasks, grouped into phases
- A dependency graph showing which tasks can run in parallel

**What to check before moving on:**
- Open `TaskFlow/taskflow-docs/TASK_BOARD.md` — this is your task board
- Scan the phases and task names. Do they make sense for your app?
- Open a few task specs in `taskflow-docs/tasks/phase-1/` to see the detail level
- If something looks wrong, tell Claude and it will adjust the plan

**Time:** 3-10 minutes depending on project size.

#### Step 3 — Configure AI agents

```
/tailor-agents TaskFlow
```

**What happens:** For each type of work (frontend, backend, testing, etc.), the system:
1. Searches the internet for best practices specific to your stack and versions
2. Creates a specialized agent with those conventions baked in
3. Assigns a **model tier** to each agent based on task complexity:
   - **Haiku** ($1/$5 per MTok) — for simple, repetitive work (scaffolding, docs, tests)
   - **Sonnet** ($3/$15 per MTok) — for standard implementation (backend, frontend, types)
   - **Opus** ($5/$25 per MTok) — reserved for architecture design only

**What to check before moving on:**
- Open `TaskFlow/taskflow/.claude/CLAUDE.md` — your project's conventions file
- Browse `TaskFlow/taskflow/.claude/agents/` — each file is a specialized agent
- Each agent starts with a YAML header showing its model and allowed tools:
  ```yaml
  ---
  model: sonnet
  tools: Read, Write, Edit, Glob, Grep, Bash
  ---
  ```
- Want to change a model? Just edit the `model:` line. Values: `haiku`, `sonnet`, `opus`

**Time:** 5-15 minutes (includes web research).

#### Step 4 — Generate tests

```
/generate-tests TaskFlow
```

**What happens:** For every task, the system creates a test file based on its acceptance criteria. These tests are designed to **fail** right now (the code doesn't exist yet) and **pass** once the task is correctly implemented.

This is test-driven development at scale — the tests define "done" before any code is written.

**Time:** 3-8 minutes.

#### Step 5 — Check the cost (optional but recommended)

```
/assess-phase 1
```

**What happens:** The cost estimator reads every task in Phase 1, counts the files involved, estimates how many turns each agent will need, and shows you a table:

```
Phase 1 Cost Assessment
=========================

| Task   | Agent    | Model  | Context | Est. Turns | Est. Cost |
|--------|----------|--------|---------|------------|-----------|
| T001   | scaffold | haiku  | 12K     | 15         | $0.41     |
| T002   | types    | sonnet | 18K     | 25         | $2.48     |
| T003   | backend  | sonnet | 15K     | 20         | $1.80     |

Quality gates: ~$0.45
Orchestrator: ~$0.10

TOTAL ESTIMATED: $5.24

Model alternatives:
- T001 as sonnet: $1.22 (+$0.81) — upgrade if scaffold is complex
- T003 as haiku:  $0.60 (-$1.20) — downgrade if route is simple
```

No code runs at this step — it's just an estimate. Use it to:
- Get a rough budget for the phase
- Spot tasks that might benefit from a model upgrade or downgrade
- Decide if you want to override any assignments

**Estimates are approximate (plus or minus 30%).**

**Time:** ~1 minute.

#### Step 6 — Build!

```
/execute-phase 1
```

**What happens (in order):**

1. **Batch plan** — tasks are sorted by dependencies and grouped:
   ```
   Batch 1 (parallel): T001 [scaffold-agent/haiku], T002 [types-agent/sonnet]
   Batch 2 (parallel): T003 [backend-agent/sonnet], T004 [frontend-agent/sonnet]
   ```

2. **Cost check** — same projection table as `/assess-phase`, shown inline

3. **Your decision** — you choose one of:
   - **Approve** — go ahead with current model assignments
   - **Override** — change specific tasks (e.g., "T003:opus, T004:haiku")
   - **Cancel** — stop, make changes, come back later

4. **Execution** — agents run in parallel (3-5 at a time), each on its own branch

5. **Quality gates** — after each task, a validator checks:
   - All acceptance criteria met
   - TypeScript compiles
   - Tests pass
   - No security issues
   - Only the expected files were changed

6. **Report** — summary of results:
   ```
   Phase 1: 4/4 tasks complete
   T001 PASS, T002 PASS, T003 PASS, T004 PASS
   ```

Now repeat for each remaining phase:
```
/execute-phase 2
/execute-phase 3
/execute-phase 4
```

**Time:** Varies. A 5-task phase typically takes 10-20 minutes.

#### Step 7 — Sync documentation

```
/sync-docs full
```

**What happens:** The documentation repo is updated to match the actual code. Architecture diagrams, API references, setup guides — all refreshed.

**Time:** 2-5 minutes.

#### Step 8 — Capture what you learned

```
/capture-learnings TaskFlow
```

**What happens:** The system analyzes the project and extracts:
- What patterns worked well (added to the knowledge base for future projects)
- What went wrong and how it was fixed
- A retrospective document

Each project you build makes the next one better.

**Time:** 2-5 minutes.

---

## What You Get When It's Done

```
TaskFlow/
├── taskflow/                       ← Your app (ready to run)
│   ├── .claude/                    ← AI agents configured for YOUR project
│   │   ├── CLAUDE.md               ← Project conventions
│   │   ├── agents/                 ← Specialized agents (backend, frontend, etc.)
│   │   ├── commands/               ← Workflow shortcuts
│   │   └── skills/                 ← Always-on context
│   ├── src/                        ← Application source code
│   ├── tests/                      ← Test suites (all passing)
│   ├── package.json
│   └── ...
│
└── taskflow-docs/                  ← Full documentation (GitBook-compatible)
    ├── PLAN.md                     ← Architecture decisions
    ├── TASK_BOARD.md               ← All tasks (all DONE)
    ├── SUMMARY.md                  ← Table of contents
    ├── architecture/               ← System diagrams and data flow
    ├── developer/                  ← Setup guide, coding standards
    ├── product/                    ← Feature specs, roadmap
    ├── testing/                    ← Test strategy
    └── tasks/                      ← Individual task specs
```

The code repo has its own `.claude/` directory. This means you can keep using Claude Code to work on the project — the agents already know your codebase, conventions, and patterns.

---

## Controlling Costs

Project Factory routes each agent to the cheapest model that can do the job well.

| Model | Cost (input / output per million tokens) | Used for |
|-------|------------------------------------------|----------|
| Haiku | $1 / $5 | Scaffolding, docs, tests, orchestration, quality checks |
| Sonnet | $3 / $15 | Backend, frontend, types, security, infra |
| Opus | $5 / $25 | Architecture planning only |

**Typical project cost:** $60-120 for a medium project (25-40 tasks).

Without model routing, the same project on all-Opus would cost $200-350.

### How to adjust costs

**Before building** — use `/assess-phase` to preview:
```
/assess-phase 1
```

**During build** — when `/execute-phase` shows the cost table, type overrides:
```
Override: T005:haiku, T012:opus
```

**Permanently** — edit any agent's frontmatter:
```yaml
---
model: haiku    ← change this to sonnet or opus
tools: Read, Write, Edit, Glob, Grep, Bash
---
```

### Rules of thumb

- Scaffold/boilerplate tasks are fine on **Haiku**
- Standard implementation (routes, components, services) works well on **Sonnet**
- Only upgrade to **Opus** for genuinely complex architecture or cross-cutting concerns
- Security agents should stay on **Sonnet** minimum
- For simple projects (<15 tasks), downgrade everything to **Haiku** except security

---

## Tips and Tricks

### Resume after interruption
Just run the same command again. `/build-app` detects what's already done:
```
/build-app "TaskFlow" react-express "A kanban board with real-time collaboration"
```
It skips completed steps and picks up where it left off.

### Review the plan before building
After `/plan-project`, always look at `TASK_BOARD.md`. This is your chance to:
- Remove tasks you don't need
- Add tasks that are missing
- Adjust phase assignments
- Change agent type assignments

### Fix a failed task
If a task fails the quality gate:
1. Read the failure report (it tells you exactly what's wrong)
2. Fix the issue manually or ask Claude to fix it
3. Re-run `/execute-phase N` — it only re-runs PENDING/BLOCKED tasks

### Work on the project after it's built
The generated `.claude/` directory means Claude Code already knows your project:
```bash
cd TaskFlow/taskflow
claude
```
All the specialized agents, commands, and conventions are ready. You can keep building features, fixing bugs, or refactoring — with AI that understands your codebase.

### Add your own project type
1. Create a docs template: `project-factory/templates/docs/{your-type}/`
2. Create a code starter: `project-factory/templates/code/{your-type}/`
3. Add the type to `project-factory/schemas/project-config.md`

---

## Quick Reference

| Command | What it does | When to use it |
|---------|-------------|----------------|
| `/build-app "Name" type "desc"` | Runs everything automatically | First time, or to resume |
| `/init-project "Name" type "desc"` | Creates two repos | Manual mode, step 1 |
| `/plan-project Name` | Designs architecture + tasks | Manual mode, step 2 |
| `/tailor-agents Name` | Creates project-specific AI agents | Manual mode, step 3 |
| `/generate-tests Name` | Creates test suites from specs | Manual mode, step 4 |
| `/assess-phase N` | Previews cost for a phase | Before building (optional) |
| `/execute-phase N` | Builds all tasks in a phase | Manual mode, step 6 |
| `/sync-docs full` | Updates documentation | After building |
| `/capture-learnings Name` | Extracts patterns for next time | After project is done |

---

## Troubleshooting

**"Command not found" when typing /build-app**
You're not in the right directory. Make sure you're in the parent workspace that contains the `.claude/` folder, not inside `project-factory/` itself.

**A task keeps failing the quality gate**
Read the quality gate report — it lists exactly which acceptance criteria failed and why. Common fixes:
- Type errors → run `npm run typecheck` and fix the issues
- Test failures → check the test file, the assertion might need updating
- Missing files → the agent forgot to create a file listed in the spec

**Cost seems too high**
Use `/assess-phase` before building. Downgrade agents to Haiku where appropriate. Simple tasks (scaffolding, configuration, documentation) work well on the cheapest model.

**Want to change the plan mid-build**
Edit `TASK_BOARD.md` directly. Change task statuses, add new tasks, remove ones you don't need. `/execute-phase` reads the task board fresh each time.

**Agents conflict with each other**
This can happen when two agents modify the same file. The orchestrator detects this and moves one to the next batch. If it still happens, the report will flag it for manual resolution.
