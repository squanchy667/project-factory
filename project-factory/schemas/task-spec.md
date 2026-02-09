# Task Specification Schema

Defines the canonical format for task specs. Every task file in `tasks/phase-X/TXXX-task-name.md` must follow this structure.

## Template

```markdown
# TXXX — Task Name

## Meta
- **Phase:** X — Phase Name
- **Agent Type:** agent-type
- **Depends On:** TXXX, TXXX (or "—" if none)
- **Blocks:** TXXX (or "None")
- **Branch:** `feat/TXXX-task-name`

## Objective

One to two sentences describing what this task delivers and why.

## Context

Background needed to implement this task:
- What system/feature this is part of
- What already exists that this builds on
- Key decisions or constraints

## Tasks

1. **Subtask name** (`path/to/file.ts`)
   - Concrete deliverable description
   - Implementation detail or pattern to follow

2. **Another subtask** (`path/to/other-file.ts`)
   - Detail
   - Detail

## Files to Create/Modify

\`\`\`
path/to/new-file.ts           # What this file contains
path/to/existing-file.ts      # What changes needed
\`\`\`

## Acceptance Criteria

- [ ] Testable criterion 1
- [ ] Testable criterion 2
- [ ] Types pass (`npm run typecheck`)
- [ ] Tests pass (`npm run test`)
```

## Field Definitions

### Meta Section

| Field | Required | Description |
|-------|----------|-------------|
| Phase | Yes | Phase number and name |
| Agent Type | Yes | Recommended agent type for execution |
| Depends On | Yes | Task IDs that must be DONE first ("—" if none) |
| Blocks | Yes | Task IDs that wait on this task ("None" if none) |
| Branch | Yes | Git branch name format: `feat/TXXX-task-name` |

### Objective
- 1-2 sentences maximum
- States what is delivered, not how
- Example: "Create the Express API server with health check, CORS, and auth middleware."

### Context
- Explains WHY this task matters
- References related architecture docs or features
- Mentions prior art or patterns to follow
- 3-5 sentences typical

### Tasks (Subtasks)
- Numbered list of concrete deliverables
- Each subtask references specific file paths
- Implementation details guide the agent
- Typically 2-6 subtasks per task

### Files to Create/Modify
- Exact file paths relative to code repo root
- Comment describing what the file contains or what changes
- Distinguish new files from modifications

### Acceptance Criteria
- Checkbox format (`- [ ]`)
- Each criterion must be independently testable
- Always include type-checking criterion
- Include test criterion if tests are part of the task
- 4-8 criteria typical

## Quality Rules

1. **Concrete paths**: Never use "create a file for X" — specify the exact path
2. **Testable criteria**: Never use "works correctly" — specify what "correct" means
3. **Minimal dependencies**: Don't depend on tasks you don't actually need
4. **Single agent**: Each task should be completable by one agent type
5. **Right-sized**: Tasks should take 15-60 minutes of focused agent work
6. **Self-contained context**: The spec should provide enough context to work independently

## Reference: ChatAgent T023

See `/Users/ofek/Projects/Claude/ChatAgent/chatagent-docs/tasks/phase-3/T023-property-lookup.md` for a real-world example of a well-structured task spec.
