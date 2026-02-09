# Patterns Catalog

Proven patterns extracted from completed projects. Each pattern includes context, implementation, and when to use it.

---

## Architecture Patterns

### Zod-First Validation
**Source:** ChatAgent
**Context:** TypeScript projects with API boundaries
**Pattern:** Define Zod schemas as the single source of truth. Infer TypeScript types from schemas. Validate at system boundaries only (API input, config loading, external data). Internal code trusts validated data.
```typescript
// Schema is source of truth
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});
// Type is derived
export type User = z.infer<typeof UserSchema>;
```
**When to use:** Any TypeScript project with data validation needs.

### Config-Driven Agents (YAML)
**Source:** ChatAgent
**Context:** AI-powered platforms with multiple agent personalities
**Pattern:** Agent behavior defined in YAML config files, not code. System prompts use template variables ({{org.name}}, {{today}}). Loaded and validated at runtime with caching.
**When to use:** Projects with multiple LLM-powered agents that need different configurations.

### Monorepo with Workspace Packages
**Source:** ChatAgent
**Context:** Full-stack TypeScript applications
**Pattern:** npm workspaces with package aliases (@project/shared, @project/server). Shared types package consumed by all others. Composite TypeScript builds for type checking. Build order enforced by dependencies.
**When to use:** Projects with shared types between frontend and backend.

### Services Bridge (Dependency Injection)
**Source:** ChatAgent
**Context:** Circular dependency between packages in a monorepo
**Pattern:** When package A needs package B and vice versa, use dependency injection. Package A exports a `register{Function}()` that B calls at startup.
**When to use:** Monorepos where two packages have a circular dependency.

### Connector Plugin Architecture
**Source:** ChatAgent
**Context:** Integrating with multiple external data sources
**Pattern:** Define a base interface (DataConnector) with standard CRUD operations. Each data source implements the interface. Registry resolves connectors at runtime.
**When to use:** Projects that need to support multiple external data sources.

---

## Process Patterns

### Phased Task Execution
**Source:** ChatAgent, TarotBattlegrounds
**Context:** Large projects requiring systematic implementation
**Pattern:** Break project into phases (Foundation → Core → Integration → Production). Each phase has tasks with dependency tracking. Tasks within a phase run in parallel batches.
**Optimal batch size:** 3-5 concurrent agents.
**When to use:** Any project with more than 10 tasks.

### Documentation-First Planning
**Source:** ChatAgent, TarotBattlegrounds
**Context:** Projects that benefit from upfront architecture design
**Pattern:** Create docs repo before coding. Write architecture docs, task specs, and TASK_BOARD.md. Use these as the execution blueprint. Keep docs in sync throughout.
**When to use:** All projects — the upfront investment pays off in execution speed.

### Test-First Task Execution
**Source:** Project Factory
**Context:** Projects using phased task execution
**Pattern:** After planning and agent configuration, generate test files from task acceptance criteria before implementation begins. Each task's acceptance criteria become executable test assertions. Implementation agents must pass these pre-written tests. Quality gate verifies pre-existing tests rather than trusting agent-written tests.
**When to use:** All projects — shifts quality left and makes acceptance criteria executable.

### Paired Repos (Code + Docs)
**Source:** All projects
**Context:** Separating documentation from code for clarity
**Pattern:** Code repo contains source code and .claude/ config. Docs repo (GitBook-style) contains planning, architecture, tasks, and guides. Both repos are git-managed independently.
**When to use:** All projects.

---

## Agent Patterns

### Specialized Over General
**Source:** ChatAgent
**Context:** Designing Claude Code agents for a project
**Pattern:** Create narrow, specialized agents (react-component-builder, express-route-builder) rather than broad ones (full-stack-developer). Each agent knows one domain deeply.
**When to use:** Always — specialized agents produce better output.

### Convention-Heavy Agent Prompts
**Source:** ChatAgent
**Context:** Agent prompts that produce consistent output
**Pattern:** Include specific code examples, file path conventions, import patterns, and style rules in agent prompts. The more concrete the conventions, the more consistent the output.
**When to use:** Always — never write a generic agent prompt.

### Skills for Always-On Context
**Source:** ChatAgent
**Context:** Knowledge that every interaction needs
**Pattern:** Use skills (SKILL.md) for knowledge that applies to every task: coding conventions, workspace structure, validation patterns. Use agents for task-specific behavior.
**When to use:** When there's domain knowledge needed across all tasks.

---

## Code Patterns

### Barrel Exports
**Source:** ChatAgent
**Context:** TypeScript monorepo packages
**Pattern:** Every package has an index.ts that re-exports public API. No direct sub-path imports from other packages.
**When to use:** TypeScript monorepos with package imports.

### SSE Streaming for LLM Responses
**Source:** ChatAgent
**Context:** Real-time AI chat interfaces
**Pattern:** Server-Sent Events (SSE) for streaming LLM responses. Set Content-Type to text/event-stream. Stream chunks as JSON-encoded data events.
**When to use:** Chat applications with LLM-powered responses.

### ScriptableObjects for Data
**Source:** TarotBattlegrounds
**Context:** Unity games with data-driven design
**Pattern:** Use ScriptableObjects for game data (cards, abilities, characters). Load at runtime. Edit in Unity Inspector.
**When to use:** Unity games with configurable data.

---

## Anti-Patterns (What NOT to Do)

### Generic Agent Prompts
**Problem:** "You are a helpful coding assistant" produces inconsistent results.
**Fix:** Include specific file paths, schemas, code examples, and conventions.

### Over-Constraining Dependencies
**Problem:** Making every task depend on the previous one creates serial execution.
**Fix:** Only add dependencies where there's a real data/API dependency.

### Skipping Quality Gates
**Problem:** Marking tasks DONE without validation leads to cascading failures.
**Fix:** Always run typecheck + tests before marking DONE.

### Monolithic Tasks
**Problem:** Tasks that take hours with dozens of subtasks are hard to parallelize.
**Fix:** Break into 15-60 minute tasks with clear boundaries.
