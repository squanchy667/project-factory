# /do-task

Execute a single task through Agent Pilot's 8-step pipeline.

## Usage

```
/do-task "Build a REST API endpoint for user authentication"
/do-task "Refactor the payment module" --context ./src --budget 12000
/do-task "Write unit tests for auth middleware" --skip-test --verbose
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task` | string | (required) | Plain text task description |
| `--context` | path | none | Path to project directory for context assembly |
| `--budget` | number | 10000 | Total token budget for this task |
| `--skip-test` | flag | false | Skip the test validation step (step 6) |
| `--verbose` | flag | false | Show detailed logging for each step |
| `--output-dir` | path | `output/` | Custom output directory |
| `--timeout` | number | 120000 | Execution timeout in milliseconds |

## The 8-Step Pipeline

### Step 1: Analyze Task
Parse the raw task text to extract structured metadata.
- **Module:** `core/pipeline/task-analyzer.ts`
- **Input:** Raw task string + optional context path
- **Output:** `TaskAnalysis` — domains, stack, taskType, complexity, expectedOutput
- **Domain detection:** 14 keyword categories (backend, frontend, database, auth, testing, devops, content, data-processing, ui-design, api-integration, security, performance, monitoring, mobile)
- **Task type classification:** Verb analysis maps to 6 types (implementation, refactor, test, content, research, debug)
- **On failure:** Use defaults (general domain, medium complexity, implementation type)

### Step 2: Build Agent
Search the config bank and assemble a purpose-built agent.
- **Module:** `core/pipeline/agent-builder.ts`
- **Input:** `TaskAnalysis` + optional project files
- **Output:** `AgentDefinition` — system prompt, token budget, context files
- **Config scoring:** Domain match (0.4) + Stack match (0.35) + Task type match (0.25)
- **Context compression:** FULL (relevance > 0.8) → SUMMARY (0.5–0.8) → REFERENCE (0.3–0.5) → SKIP (< 0.3)
- **On failure:** Minimal prompt with task description only

### Step 3: Assemble Context
Score and compress project files to fit within token budget.
- Uses context strategy matched to task domains
- Priority patterns boost relevance scores
- Progressive compression: start at FULL, downgrade until budget fits
- Token budget: 70% of total (default: 7,000 tokens)

### Step 4: Execute Agent
Run the agent in a clean context window.
- **Module:** `core/pipeline/agent-executor.ts`
- **Input:** `AgentDefinition` + task ID
- **Output:** Files written to `output/{taskId}/files/`
- Agent gets ONLY the assembled prompt — no conversation history
- Write access limited to output directory
- Read access to project-context/ if provided
- Configurable timeout (default: 120s)
- **On failure:** Capture partial output + error details

### Step 5: Capture Output
Collect all files and metadata from agent execution.
- **Module:** `core/pipeline/output-capture.ts`
- Scan output directory for all created files
- Record: name, path, size, extension, token estimate
- Handle binary files (metadata only, no content)
- Handle empty output gracefully

### Step 6: Test (skippable with --skip-test)
Independent validation agent checks output quality.
- **Module:** `core/pipeline/test-runner.ts`
- Test agent gets ONLY task spec + output files (not task agent's reasoning)
- Token budget: 20% of total (default: 2,000 tokens)
- Checks: completeness, correctness, conventions, file structure
- If test files exist in output, attempt to run them
- **On failure:** Continue to documentation + report with lower quality score

### Step 7: Document
Generate audit trail for the task execution.
- **Module:** `core/pipeline/documenter.ts`
- Token budget: 10% of total (default: 1,000 tokens)
- Generates 3 files: `task-spec.md`, `agent-config.md`, `summary.md`
- Documents what was asked, what was built, how it was tested
- Generated even on test failure
- **On failure:** Still proceed to report

### Step 8: Report
Calculate quality score and output metrics.
- **Module:** `core/pipeline/reporter.ts`
- Quality score 0–100: test pass rate (0.40) + completeness (0.25) + token efficiency (0.20) + convention compliance (0.15)
- Generates `output/{taskId}/metrics.json`
- Terminal output: summary, files, test results, token usage, quality score

## Output Structure

```
output/{taskId}/
├── files/          # Agent-produced files
├── task-spec.md    # Task metadata
├── agent-config.md # Agent configuration used
├── summary.md      # Human-readable summary
└── metrics.json    # Quality score + metrics
```

## Examples

### Simple task (no project context)
```
/do-task "Write a TypeScript function that validates email addresses"
```
Result: Single file with email validator, tests if generated, quality report.

### Task with project context
```
/do-task "Add error handling to the user routes" --context ./myproject
```
Result: Agent sees project structure, follows existing patterns, produces targeted fixes.

### High-budget complex task
```
/do-task "Implement a caching layer for the API" --budget 15000 --verbose
```
Result: Detailed logging, larger context window, more thorough validation.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| "No matching config" | Task too vague | Add domain/tech keywords to task description |
| "Budget exceeded" | Too many project files | Use --budget to increase or narrow --context path |
| Low quality score | Test agent found issues | Check summary.md for specific failures |
| Timeout | Complex task | Increase --timeout or break into smaller tasks |
| Empty output | Agent couldn't complete | Check verbose logs, simplify task description |
