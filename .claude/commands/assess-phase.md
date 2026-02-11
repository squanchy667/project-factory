# Assess Phase

Estimate token usage and cost for a phase before executing it. This is a standalone assessment — no execution occurs.

## Input

$ARGUMENTS — phase number (e.g., "1", "2")

## Process

### 1. Locate Project

Detect the project from the current working directory.
Identify:
- Code repo: `{project-slug}/`
- Docs repo: `{project-slug}-docs/`

If no project is detected from cwd, ask which project to assess.

### 2. Run Cost Assessment

Invoke the `cost-assessor` agent with:
- The target phase number
- Path to TASK_BOARD.md
- Path to the project's `.claude/agents/` directory

### 3. Display Results

Present the cost projection table showing:
- Per-task estimated tokens and cost by assigned model
- Alternative costs if models were swapped (upgrade/downgrade options)
- Total phase estimate with quality gate and orchestrator overhead

### 4. No Execution

This command is assessment only. To execute the phase, use `/execute-phase {N}`.

The user can use this assessment to:
- Review model assignments before committing to execution
- Identify tasks worth upgrading (complex work on haiku) or downgrading (simple work on sonnet)
- Get a cost estimate for budget planning
