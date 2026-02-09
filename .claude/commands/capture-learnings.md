# Capture Learnings

Extract reusable knowledge from a completed (or in-progress) project and feed it back into the project factory knowledge base.

## Input

$ARGUMENTS — project name (e.g., "ChatAgent", "BattleNet")

## Process

### 1. Locate Project
Find the project at `/Users/ofek/Projects/Claude/{ProjectName}/`.
Read both code and docs repos.

### 2. Gather Data

**From docs repo:**
- PLAN.md — original vision and planned phases
- TASK_BOARD.md — actual task execution (planned vs completed)
- resources/changelog.md — chronological record of changes
- resources/known-issues.md — problems encountered
- development-agents.md — agent strategy used

**From code repo:**
- .claude/CLAUDE.md — conventions that evolved
- .claude/agents/ — which agents were created and used
- .claude/commands/ — which commands were created
- .claude/skills/ — knowledge domains captured
- git log — commit patterns, branch history

### 3. Analyze: Planned vs Actual

Compare what was planned with what happened:
- Were phases added or removed?
- Were tasks added, modified, or dropped?
- Did scope change significantly?
- What took longer than expected?
- What was easier than expected?

### 4. Rate Agent Effectiveness

For each agent type used:
- How many tasks did it handle?
- Were its outputs accepted on first try or needed revision?
- What patterns did it establish that others followed?
- Were any agent types underused or unnecessary?

### 5. Extract Patterns

Identify reusable patterns:
- **Architecture patterns** — How was the system structured? What worked?
- **Code patterns** — What coding patterns emerged? (validation, error handling, etc.)
- **Process patterns** — What execution strategies worked? (batch size, parallelism)
- **Documentation patterns** — What docs were most useful? What was missing?
- **Agent patterns** — What made agents effective? What contexts did they need?

### 6. Update Knowledge Base

**Update `project-factory/knowledge-base/patterns-catalog.md`:**
- Add new patterns discovered
- Update existing patterns with refinements
- Remove patterns that proved unhelpful

**Create `project-factory/knowledge-base/{project}-retrospective.md`:**
- Project overview and tech stack
- Phase completion summary
- Key learnings (what worked, what didn't)
- Agent effectiveness ratings
- Patterns extracted
- Recommendations for similar projects

### 7. Identify Template Candidates

Look for structures that could become new templates:
- New project type? → Add to `templates/docs/{type}/`
- New agent role? → Add to `templates/claude-config/agents/`
- New command pattern? → Add to `templates/claude-config/commands/`
- New skill domain? → Add to `templates/claude-config/skills/`

Flag these for addition to project-factory.

### 8. Report

```
Learnings Captured: {ProjectName}
==================================

Project Stats:
  Phases: {planned} planned → {actual} actual
  Tasks: {planned} planned → {completed}/{total} completed
  Agent Types: {count} used
  Duration: {phases completed across N sessions}

Top Learnings:
  1. {Key insight}
  2. {Key insight}
  3. {Key insight}

Patterns Added to Catalog: {count}
  - Pattern Name: brief description
  - ...

Template Candidates: {count}
  - {type}: {description}
  - ...

Agent Effectiveness:
  Most effective: {agent-type} ({N} tasks, {success_rate}% first-try)
  Least used: {agent-type} ({N} tasks)

Retrospective written to:
  project-factory/knowledge-base/{project}-retrospective.md
```

## Important Notes
- Don't overwrite existing knowledge base entries — merge and update
- Patterns should be actionable, not vague ("use Zod-first validation" not "validation is important")
- Retrospectives should be honest — include what didn't work
- Template candidates should be flagged, not auto-created (human review first)
