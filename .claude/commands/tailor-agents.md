# Tailor Agents

Auto-generate project-specific `.claude/` configuration based on tech stack and development plan.

## Input

$ARGUMENTS — project name (e.g., "CollabTool")

## Process

### 1. Locate Project
Find the project at `/Users/ofek/Projects/Claude/{ProjectName}/`.
Identify:
- Code repo: `{project-slug}/`
- Docs repo: `{project-slug}-docs/`

### 2. Read Project Context
- Read `{project-slug}-docs/PLAN.md` for tech stack and architecture
- Read `{project-slug}-docs/TASK_BOARD.md` for agent types needed
- Read `{project-slug}-docs/development-agents.md` for agent strategy
- Read code repo structure to understand what exists
- Identify the project type (react-express, fullstack-aws, unity-game, typescript-lib)

### 3. Audit the Stack
Create inventory (automates Step 1 from crew-customization-guide.md):

| Category | Value |
|----------|-------|
| Languages | (from project) |
| Frontend | (from project) |
| Backend | (from project) |
| Database | (from project) |
| Cloud | (from project) |
| Validation | (from project) |
| Testing | (from project) |
| Build | (from project) |
| Deployment | (from project) |

### 4. Generate Agents
For each agent type listed in development-agents.md:
1. Load role template from `project-factory/templates/claude-config/agents/`
2. Customize with project-specific details:
   - Replace file paths with actual project paths
   - Embed project-specific schemas and interfaces
   - Reference actual coding conventions from the codebase
   - Include build/test commands from the project
3. Write to `{project-slug}/.claude/agents/{agent-name}.md`

Use the `agent-tailor` agent for complex customization decisions.

### 5. Generate Commands
Always generate:
- `/task-execute` — Universal task execution workflow

Generate based on tech stack:
- React projects: `/build-component`
- Express projects: `/build-route`
- TypeScript projects: `/design-schema`
- Unity projects: `/build-system` (game system scaffold)
- AWS projects: `/update-sam` (infrastructure modifications)

Load templates from `project-factory/templates/claude-config/commands/`.
Customize with project-specific paths and conventions.

### 6. Generate Skills
Create:
- `{project-slug}-conventions/SKILL.md` — Project coding patterns (extracted from CLAUDE.md)
- `workspace/SKILL.md` — Project structure and navigation (for monorepos or complex structures)

Load templates from `project-factory/templates/claude-config/skills/`.

### 7. Generate CLAUDE.md
Create `{project-slug}/.claude/CLAUDE.md` with:
- What this project is (one sentence)
- Stack (all technologies with versions)
- Structure (directory layout)
- Key patterns (imports, validation, error handling)
- Commands (build, test, lint, deploy)
- File naming conventions

Reference ChatAgent's CLAUDE.md at `/Users/ofek/Projects/Claude/ChatAgent/chatagent/.claude/CLAUDE.md` as the gold standard.

### 8. Create settings.local.json
Generate `{project-slug}/.claude/settings.local.json` with appropriate permissions:
- Git operations
- Build commands
- Test commands
- Stack-specific tools

## Output

Report formatted as a catalog:

```
## Agent Catalog for {ProjectName}

### Agents ({count})
- agent-name.md — Description
- ...

### Commands ({count})
- /command-name — Description
- ...

### Skills ({count})
- skill-name — Description
- ...

### CLAUDE.md
- Generated with {N} sections

Next step: Run `/execute-phase 1` to begin Phase 1 execution.
```

## Quality Checklist
- [ ] No generic placeholders remain — everything references actual project paths
- [ ] Agents reference real file paths and schemas from the code repo
- [ ] Commands reference actual project conventions
- [ ] Skills contain concrete patterns (not generic descriptions)
- [ ] CLAUDE.md accurately describes the project's stack and structure
- [ ] All files are under `{project-slug}/.claude/`
