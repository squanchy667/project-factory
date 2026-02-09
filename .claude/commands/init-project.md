# Init Project

Create a new project structure with paired code + docs repositories.

## Input

$ARGUMENTS — `"ProjectName" project-type "Description paragraph"`

Supported types: `react-express`, `fullstack-aws`, `unity-game`, `typescript-lib`

**Examples:**
- `"CollabTool" fullstack-aws "Real-time collaboration tool with shared documents and chat"`
- `"PixelEditor" react-express "Browser-based pixel art editor with layers and export"`
- `"TarotBattle" unity-game "Tarot-themed card battler with multiplayer"`
- `"ZodUtils" typescript-lib "Utility library extending Zod with common patterns"`

## Process

### 1. Parse Arguments
Extract from $ARGUMENTS:
- `ProjectName` — display name (first quoted string or first word)
- `project-type` — one of: react-express, fullstack-aws, unity-game, typescript-lib
- `description` — project description (remaining quoted string or text)

Derive:
- `project-slug` — kebab-case of ProjectName (e.g., "CollabTool" → "collabtool")
- `parent-dir` — `/Users/ofek/Projects/Claude/{ProjectName}/`

### 2. Create Parent Directory
```
/Users/ofek/Projects/Claude/{ProjectName}/
```

### 3. Initialize Code Repository
Create `{parent-dir}/{project-slug}/` with structure from `project-factory/templates/code/{project-type}/`.

If no code template exists for the type, create a minimal structure:
- `README.md` with project name and description
- `.gitignore` appropriate for the tech stack
- Basic directory structure for the type

Initialize git: `git init && git add . && git commit -m "Initial scaffold"`

### 4. Initialize Docs Repository
Create `{parent-dir}/{project-slug}-docs/` using:
1. Base structure from `project-factory/templates/docs/base/`
2. Type-specific overlay from `project-factory/templates/docs/{project-type}/`

Replace all `{{placeholder}}` variables:
- `{{project_name}}` → ProjectName
- `{{project_slug}}` → project-slug
- `{{description}}` → description
- `{{tech_stack}}` → infer from project-type

Initialize git: `git init && git add . && git commit -m "Initial docs structure"`

### 5. Generate Initial README.md
In the docs repo, write README.md with:
- Project name and description
- Vision statement (expand from description)
- Architecture at a glance (placeholder for /plan-project to fill)
- Tech stack table
- Repo structure (code + docs)
- Link to SUMMARY.md

### 6. Generate Initial PLAN.md
In the docs repo, write PLAN.md with:
- Project vision (expanded from description)
- Tech stack details
- High-level feature list (inferred from description)
- Placeholder sections for phases (to be filled by /plan-project)

## Output

Report:
- Parent directory created
- Code repo initialized at `{path}`
- Docs repo initialized at `{path}`
- Project type: {type}
- Next step: "Run `/plan-project {ProjectName}` to generate full planning artifacts"

## Tech Stack Reference

| Type | Stack |
|------|-------|
| react-express | React, TypeScript, Vite, Tailwind CSS, Express.js, Vitest |
| fullstack-aws | React, TypeScript, Vite, Tailwind CSS, Express.js, AWS SAM, DynamoDB, Vitest |
| unity-game | Unity, C#, Netcode for GameObjects, ScriptableObjects |
| typescript-lib | TypeScript, Vitest, tsup/esbuild, npm publishing |
