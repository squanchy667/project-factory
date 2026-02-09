# Task Execute

Execute a task from the {{project_name}} task board autonomously.

## Input

Task ID: $ARGUMENTS (e.g., T001, T014)

## Process

### 1. Load Task Spec
Read the task specification from `{{docs_repo}}/tasks/`:
{{phase_mapping}}

### 2. Check Dependencies
Read `{{docs_repo}}/TASK_BOARD.md` and verify all "Depends On" tasks are marked DONE. If any are not, report which dependencies are missing and stop.

### 3. Understand Context
- Read the architecture docs referenced in the task
- Read existing code files that will be modified
- Read related files to understand patterns in use

### 4. Plan Implementation
Before writing any code:
- List all files to create/modify
- Identify the build sequence (what to implement first)
- Note any decisions that need user input

### 5. Execute
Implement the task following {{project_name}} conventions:
{{project_conventions}}

### 6. Verify
{{verify_commands}}

### 7. Report
Output a summary:
- What was implemented
- Files created/modified
- Any decisions made
- What to test manually
- Suggested next steps

## Important
- Always read the full task spec before starting
- Follow the acceptance criteria exactly
- Don't modify files outside the task's scope
- Create a git branch: `feat/{task-id}-{short-name}` (e.g., `feat/T001-scaffold`)
