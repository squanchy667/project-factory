# Research Strategy for Agent Generation

How the project factory uses online research to produce higher-quality, stack-specific agent configurations.

---

## Why Research-First

Local agent templates (`project-factory/templates/claude-config/agents/`) provide solid structure but are necessarily generic. Online sources — cursor rules, Claude Code configs, and community conventions — often contain:

- **Version-specific patterns** (e.g., React 19 Server Components, Tailwind v4 `@theme` syntax)
- **Battle-tested conventions** refined by real teams on real codebases
- **Role-specific workflows** that generic templates can't anticipate
- **Domain patterns** (e.g., real-time chat, e-commerce, game dev) absent from templates

Research is the **default** path. Templates are the **fallback** when research doesn't yield sufficient quality.

---

## Query Construction Rules

### Be Specific About Versions

| Bad | Good |
|-----|------|
| `React coding conventions` | `React 19 TypeScript coding conventions 2025` |
| `.cursorrules frontend` | `.cursorrules React TypeScript Tailwind v4` |
| `Claude Code agent` | `site:github.com .claude/agents React TypeScript` |

### Target Configuration Files

The highest-signal sources are actual config files that teams use daily:
- `.cursorrules` — Cursor IDE rules, highly transferable to Claude Code agents
- `.claude/CLAUDE.md` or `.claude/agents/*.md` — Direct Claude Code configs
- `.eslintrc`, `tsconfig.json` context — Infer conventions from tool configs

### Progressive Broadening

For niche stacks where exact-match results are scarce:
1. **Exact stack**: `Solid.js TypeScript .cursorrules`
2. **Framework family**: `reactive framework TypeScript conventions`
3. **Language level**: `TypeScript coding conventions 2025`

Each broadening step reduces relevance score by 1 point.

---

## Evaluation Criteria

### Specificity (1-5)

Measures how actionable the source's conventions are:

| Score | Signal | Example Content |
|-------|--------|-----------------|
| 1 | Platitudes only | "Write clean code. Use meaningful names." |
| 2 | Names technologies | "Use TypeScript. Prefer functional components." |
| 3 | Concrete rules | "Use `interface` over `type` for object shapes. Prefer named exports." |
| 4 | Paths and patterns | "Components at `src/components/{Feature}/index.tsx`. Always co-locate tests." |
| 5 | Full conventions | Code snippets, file trees, import maps, error patterns, testing templates |

### Relevance (1-5)

Measures stack and role alignment:

| Score | Signal | Example |
|-------|--------|---------|
| 1 | Wrong stack | Python rules for a TypeScript project |
| 2 | Right language, wrong framework | Vue patterns for a React project |
| 3 | Right framework, generic | React patterns without version specifics |
| 4 | Right framework + version | React 19 with hooks and Server Components |
| 5 | Exact stack + role + version | React 19 + TypeScript 5.5 + Tailwind v4 component builder patterns |

### Combined Score Interpretation

| Combined | Interpretation | Action |
|----------|---------------|--------|
| 8-10 | Excellent match | Use as primary structure for agent |
| 7 | Good match | Use patterns, supplement with template structure |
| 5-6 | Partial match | Extract individual useful patterns only |
| 1-4 | Poor match | Skip, use template fallback |

---

## Synthesis Algorithm

When research passes the quality gate (>= 7/10 from 2+ sources), synthesize as follows:

### 1. Structure Skeleton
Take from the **highest-scored source**. This provides the overall agent organization: mission statement, workflow steps, quality standards.

### 2. Mission Statement
Merge role description from research sources. Prefer the most specific description. Add project domain context.

### 3. Workflow Steps
Union of all unique workflow steps from sources, ordered by the most common sequence. Deduplicate steps that describe the same action differently.

### 4. Conventions Section
**Union** all conventions from all sources, deduplicated by topic:
- If two sources describe the same convention identically → keep one
- If two sources describe the same convention differently → use conflict resolution

### 5. Code Examples
Prefer examples from the highest-scored source. Replace framework-generic examples with stack-specific ones where available.

### Conflict Resolution

When sources disagree on a convention:

| Priority | Rule |
|----------|------|
| 1 (highest) | Project's existing code patterns always win |
| 2 | Higher-scored source wins |
| 3 | More specific rule wins over general rule |
| 4 | More recent source wins (check dates) |
| 5 | When tied, include both as alternatives with a note |

---

## Fallback Triggers

The system falls back to local templates (Mode B) when:

| Trigger | Example |
|---------|---------|
| WebSearch unavailable | Network error, rate limit, tool not available |
| Score too low | No source reaches combined 7/10 |
| Too few sources | Fewer than 2 independent sources pass threshold |
| Niche stack | Zig, Gleam, or other emerging languages with sparse online configs |
| Time constraint | User explicitly requests fast generation without research |

Fallback is not a failure — the local templates produce good agents. Research enhances them when possible.

---

## Per-Role Query Focus

Different agent roles benefit from different search emphases:

| Agent Role | Primary Query Focus | Secondary |
|------------|-------------------|-----------|
| Frontend / Component Builder | `.cursorrules`, component patterns, styling conventions | State management, testing |
| Backend / API Builder | Route patterns, error handling, validation | Auth patterns, middleware |
| Schema / Types | Validation libraries (Zod, Yup), type patterns | API contracts, shared types |
| Infrastructure | IaC conventions, deployment patterns | CI/CD, monitoring |
| Test Agent | Testing library configs, test patterns | Coverage, mocking strategies |
| LLM Integration | Prompt engineering patterns, streaming | Token management, caching |
| Security | OWASP conventions, auth patterns | Input validation, secrets management |
| Docs Agent | Documentation generators, API docs | README conventions, changelog |
| Scaffold Agent | Project structure conventions, monorepo patterns | Build tools, dev experience |
| Game Systems (Unity) | Unity coding standards, ECS patterns | ScriptableObject usage, event systems |

---

## Source Attribution

When research is used, agents include a source comment at the bottom:

```markdown
<!-- Research Sources:
  - [Source Title](URL) (score: X/10)
  - [Source Title](URL) (score: X/10)
  Synthesis date: YYYY-MM-DD
-->
```

This enables:
- Traceability back to original conventions
- Future re-research when stacks update
- Quality auditing of the research pipeline
