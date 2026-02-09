# Ofek's Project Workspace — Conventions

## Workspace Structure

Each project lives in its own parent directory with paired repos:
```
/Users/ofek/Projects/Claude/
├── .claude/                    ← Meta layer (commands, agents, skills for project lifecycle)
├── project-factory/            ← Templates, schemas, knowledge base
├── {ProjectName}/              ← Project parent directory
│   ├── {project-name}/         ← Code repository (git)
│   └── {project-name}-docs/   ← Documentation repository (git, GitBook-style)
```

## Available Meta-Commands

| Command | Purpose |
|---------|---------|
| `/build-app` | Full pipeline: idea → production (orchestrates all commands below) |
| `/init-project` | Create project structure from idea |
| `/plan-project` | Generate full planning artifacts |
| `/tailor-agents` | Generate project-specific .claude/ config |
| `/generate-tests` | Generate tests from task specs before implementation |
| `/execute-phase` | Run a phase with parallel agents |
| `/sync-docs` | Keep docs in sync with code |
| `/capture-learnings` | Extract reusable knowledge |

## Docs Repo Standard

Every docs repo follows GitBook-compatible structure:
- `README.md` — Project overview and vision
- `SUMMARY.md` — Table of contents (GitBook navigation)
- `PLAN.md` — Architecture vision and phase outline
- `TASK_BOARD.md` — Phase tables with dependency tracking
- `development-agents.md` — Agent strategy and batch execution plan
- `architecture/` — System overview, data flow
- `developer/` — Setup guide, coding standards, crew guides
- `product/` — Features, roadmap
- `resources/` — Tech stack, changelog, known issues
- `testing/` — Test plans and strategies
- `tasks/phase-X/` — Individual task specs (TXXX-task-name.md)

## Code Repo Standard

Every code repo contains a `.claude/` directory with:
- `CLAUDE.md` — Project-specific conventions (stack, patterns, commands)
- `agents/` — Specialized subagent definitions
- `commands/` — Workflow slash commands
- `skills/` — Always-on context modules

## Task Conventions

### Numbering
- Tasks use `TXXX` format (T001, T002, ... T099, T100)
- Numbers are globally unique within a project

### Phases
- Phase 1, 1.5, 2, 3, 4, 5 (use .5 for inserted phases)
- Each phase has a theme: Foundation → Core Features → Integration → Polish → Production

### Dependencies
- `Depends On`: task IDs that must complete before this task starts
- `Blocks`: task IDs that cannot start until this task completes
- Tasks within a phase with no dependencies can run in parallel

### Branch Naming
- Format: `feat/TXXX-task-name` (e.g., `feat/T028-admin-dashboard`)

### Commit Convention
- Format: `[Phase X] TXXX: Brief description`

### Status Values
- `PENDING` → `IN_PROGRESS` → `IN_REVIEW` → `DONE`
- `BLOCKED` (waiting on dependency)

## Templates

Reference templates live in `project-factory/templates/`:
- `docs/base/` — Universal docs structure
- `docs/{type}/` — Type-specific overlays (react-express, fullstack-aws, unity-game, typescript-lib)
- `code/{type}/` — Code repo starters
- `claude-config/` — Agent, command, and skill templates
