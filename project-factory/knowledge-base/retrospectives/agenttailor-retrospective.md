# AgentTailor Retrospective

## Project Overview

| Field | Value |
|-------|-------|
| **Name** | AgentTailor |
| **Type** | fullstack-aws (Node.js/React/Chrome Extension) |
| **Stack** | Express + PostgreSQL + Redis + React + Chrome MV3 + MCP |
| **Completed** | 2026-02-18 (three sessions) |
| **Tasks** | 40/40 (100%) |
| **Phases** | 8 planned → 8 actual (exact match) |
| **Agents** | 10 types defined, all used |
| **Commits** | 42 (40 task + 2 config/setup) |

## Phase Completion Summary

| Phase | Theme | Tasks | Batches | Status |
|-------|-------|-------|---------|--------|
| 1 | Foundation | 8 (T001–T008) | 6 | DONE |
| 2 | Intelligence Engine | 7 (T009–T015) | 3 | DONE |
| 3 | Web Search Integration | 3 (T016–T018) | 3 | DONE |
| 4 | Dashboard Frontend | 6 (T019–T024) | 3 | DONE |
| 5 | Browser Extension | 6 (T025–T030) | 3 | DONE |
| 6 | MCP Server | 3 (T031–T033) | 2 | DONE |
| 7 | Custom GPT | 2 (T034–T035) | 2 | DONE |
| 8 | Polish & Launch | 5 (T036–T040) | 3 | DONE |
| **Total** | | **40** | **25** | **100%** |

## Planned vs Actual

### What Matched Plan
- All 8 phases executed in planned order, none added or removed
- All 40 tasks completed, none dropped or added
- Dependency graph held — no unexpected blockers
- Task numbering contiguous (T001–T040)
- Convention consistency maintained throughout (branch naming, commit format)

### What Diverged
- **Phase 8 batching**: T036 and T038 both modify `server/src/routes/tailor.ts` — file conflict detection moved T038 to Batch 2
- **Model routing**: All agents ran on Sonnet despite docs specifying 10 agent types with model assignments. Single-session execution made model routing less relevant
- **Execution strategy**: Planned for parallel agents per batch, but used batch-based sequential execution (single session). This was more practical and avoided git contention entirely

### Scope Changes
None. 40 tasks delivered exactly as scoped in planning.

## Agent Effectiveness

| Agent Type | Tasks | First-Try Typecheck | Notes |
|------------|-------|---------------------|-------|
| scaffold-agent | 1 | 1/1 | T001 monorepo scaffold |
| backend-agent | 6 | 5/6 | T038 needed ioredis import fix |
| pipeline-agent | 2 | 2/2 | Document processing pipeline |
| intelligence-agent | 7 | 7/7 | Core engine — best agent performance |
| search-agent | 3 | 3/3 | Web search + citations |
| frontend-agent | 8 | 7/8 | T037 needed Recharts type fixes |
| extension-agent | 6 | 6/6 | Chrome extension content scripts |
| integration-agent | 5 | 3/5 | T031 zodToJsonSchema fix, T034 gptAuth rewrite |
| polish-agent | 1 | 1/1 | Quality scoring system |
| test-agent | 1 | 1/1 | Tests + deployment config |

**Overall first-try typecheck rate**: 36/40 (90%)

### Common Fixes Needed
1. **Unused imports** — TypeScript strict mode catches these (zodToJsonSchema.ts)
2. **Type name vs runtime value conflicts** — Recharts Tooltip types are `ReactNode` not `string`
3. **Missing Prisma model** — gptAuth assumed ApiKey model existed; rewritten to use env vars
4. **Package version mismatch** — MCP SDK ^1.0.0 in package.json but 0.5.0 installed
5. **Zod .default() makes fields required in TS** — `includeScore` default(true) created required field

## Key Learnings

### What Worked Well

1. **Batch-based sequential execution on single branch**: Zero git conflicts, clean commit history, immediate typecheck feedback. No need for parallel agents when one well-configured session can execute.

2. **Typecheck as quality gate after every task**: Caught issues immediately rather than accumulating across batches. 4 of the 40 tasks needed fixes, all resolved within minutes.

3. **Non-fatal pipeline stages throughout the intelligence engine**: Every module in the 7-stage pipeline has try/catch with graceful fallbacks. The orchestrator never returns empty results.

4. **Zod-first schema design**: 26 schema files in `shared/src/schemas/` served as the single source of truth for both TypeScript types and runtime validation. No type drift between packages.

5. **File conflict detection before batching**: Checking "Files to Create/Modify" in task specs prevented merge conflicts (T036/T038 on tailor.ts).

6. **Adapter pattern for vector stores**: ChromaDB (dev) / Pinecone (prod) adapters behind a common interface made the switch trivial.

7. **Platform-specific formatting**: XML tags for ChatGPT, Markdown + `<document>` tags for Claude maximized each platform's context handling.

### What Didn't Work Well

1. **Recharts typing**: Recharts has poor TypeScript support. Tooltip `labelFormatter` and `formatter` props have complex union types that don't accept simple functions. Required `String(label)` and `Number(value)` casts.

2. **ioredis import style**: `import Redis from 'ioredis'` fails because the default export is a namespace. Must use `import { Redis } from 'ioredis'`. Easy fix but not obvious from docs.

3. **Zod .default() behavior**: `z.boolean().default(true)` in a Zod schema makes the TypeScript type `boolean` (required), not `boolean | undefined`. When constructing objects manually (like in gptActions.ts), you must include the field even though it has a default at parse time.

4. **No existing Prisma model verification**: T034 (GPT auth) assumed an ApiKey Prisma model existed because the task spec mentioned "API key validation." Should have checked schema.prisma first. Environment variable-based auth was simpler anyway.

5. **Landing page as separate package**: Landing page scaffold existed from Phase 1 but was nearly empty. For a marketing page, a static site generator or even plain HTML might have been simpler than a full React+Vite setup.

## Architecture Patterns Extracted

### 1. Multi-Stage Intelligence Pipeline
7-module pipeline: analyze → budget → retrieve → gaps → (web search) → compress → synthesize → format. Each module is independently testable, has its own Zod schemas, and degrades gracefully. The orchestrator wraps each call in try/catch with meaningful fallbacks.

### 2. Hierarchical Context Compression
4 levels (FULL > SUMMARY > KEYWORDS > REFERENCE) based on relevance score thresholds. Token budget drives compression aggressiveness. Preserves high-relevance content verbatim while summarizing lower-relevance material.

### 3. Gap-Triggered Web Search
Gap detector analyzes coverage of task domains. When coverage drops below threshold or critical gaps are detected, web search is automatically triggered with domain-specific queries. Results are scored and merged into the main scoring pool.

### 4. Weighted Multi-Dimensional Quality Scoring
4 sub-scores (coverage 0.35, relevance 0.30, diversity 0.20, compression 0.15) produce a 0-100 composite. Each sub-scorer is pure function. Suggestions generated from low sub-scores. Lightweight enough (<50ms) to run on every request.

### 5. Redis Fail-Open Rate Limiting
Redis INCR + EXPIRE for atomic daily counter. Key format: `ratelimit:{userId}:{YYYY-MM-DD}`. Fail-open: if Redis is unavailable, requests pass through (availability over correctness for rate limiting). X-RateLimit headers on all responses.

### 6. Plan Tier Enforcement Middleware
Separate middleware for rate limiting (daily request count) vs structural limits (max projects, max docs, max file size). Plan tier cached in Redis (5-min TTL) to avoid repeated DB lookups. Clean separation allows applying different enforcement to different routes.

## Template Candidates

1. **fullstack-saas template**: The AgentTailor structure (monorepo with shared/server/dashboard/landing + Clerk auth + Prisma + Redis + rate limiting) is a complete SaaS starter template. Could extract as `templates/code/fullstack-saas/`.

2. **intelligence-pipeline agent**: The 7-module intelligence engine pattern (analyze → budget → retrieve → gaps → compress → synthesize → format) with graceful degradation could become a reusable agent template for projects that assemble context from multiple sources.

3. **chrome-extension-mv3 template**: The extension package structure (background/content/{platform}/sidepanel/popup with typed messaging) is reusable for any Chrome extension that injects into web apps.

4. **quality-scorer utility**: The weighted multi-dimensional scorer pattern (sub-scorers + weights + suggestions) is reusable beyond context quality — could apply to search result quality, recommendation quality, etc.

## Recommendations for Similar Projects

1. **Start with Zod schemas**: Define all shared types in a shared package with Zod before writing any business logic. The type safety payoff is immediate.

2. **Use batch-based sequential execution**: For projects up to 40 tasks, single-session execution with typecheck gates is faster and more reliable than parallel agents. Reserve parallel execution for 50+ task projects.

3. **Design for graceful degradation from day one**: Every pipeline stage should have a fallback. The pattern is simple: try the smart path, catch errors, return a reasonable default.

4. **File conflict detection is essential**: Always check "Files to Create/Modify" across tasks in the same batch. Move conflicting tasks to sequential batches.

5. **Verify external dependencies before implementing**: Check Prisma schema, installed package versions, and actual API signatures before writing code that depends on them. This would have prevented 3 of the 4 typecheck failures.

6. **Redis singleton with fail-open**: For rate limiting and caching, always implement fail-open. Users should never be blocked by a Redis outage.
