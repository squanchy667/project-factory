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

### 4. Generate Agents (Research-First)

For each agent type listed in development-agents.md:

#### 4a. Research Phase
Invoke the `agent-researcher` agent with a search profile per agent:
- **Role**: agent's role from development-agents.md (e.g., "React component builder")
- **Stack**: relevant subset from the stack audit (e.g., "React 19, TypeScript 5.5, Tailwind v4")
- **Domain**: project domain from PLAN.md (e.g., "real-time collaboration platform")

The researcher executes 3-5 targeted web searches per role and returns a scored Research Report.

#### 4b. Decision Gate
For each agent, evaluate the Research Report:
- **Score >= 7/10 from 2+ independent sources** → proceed to 4c (research synthesis)
- **Score < 7/10 or < 2 viable sources** → proceed to 4d (template fallback)
- **No Research Report** (WebSearch unavailable, errors) → proceed to 4d

#### 4c. Synthesize from Research (Mode A)
Invoke `agent-tailor` in **Mode A** with the Research Report:
- Use highest-scored source's structure as skeleton
- Merge conventions from all passing sources, deduplicate by topic
- Resolve conflicts: project code > higher score > more specific > more recent
- Add `<!-- Research Sources: ... -->` attribution comment

#### 4d. Fallback to Template (Mode B)
Invoke `agent-tailor` in **Mode B**:
- Load role template from `project-factory/templates/claude-config/agents/`
- Proceed with standard template customization

#### 4e. Customize with Project Specifics
Regardless of mode, customize the agent with:
- Replace file paths with actual project paths
- Embed project-specific schemas and interfaces
- Reference actual coding conventions from the codebase
- Include build/test commands from the project

#### 4f. Quality Gate
Validate each agent:
- No `{{placeholders}}` remain — everything references actual project paths
- Real file paths and schemas from the code repo
- Code examples match project conventions
- (Mode A only) Source attribution comment present

Write to `{project-slug}/.claude/agents/{agent-name}.md`

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
- agent-name.md — Description — RESEARCH (confidence) / TEMPLATE
- ...

### Research Summary
| Agent | Mode | Top Source Score | Confidence |
|-------|------|-----------------|------------|
| {name} | RESEARCH / TEMPLATE | {X/10 or N/A} | HIGH / MEDIUM / LOW / N/A |

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
- [ ] Research-sourced agents include `<!-- Research Sources: ... -->` attribution
- [ ] Research patterns don't contradict established project code patterns
- [ ] Output catalog includes research summary per agent (RESEARCH or TEMPLATE)
