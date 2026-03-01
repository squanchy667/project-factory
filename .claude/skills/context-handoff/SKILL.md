# Context Handoff

Always-on context for managing artifact handoff between phases in Agent Pilot.

## Two-Layer Phase Reports

Every phase produces a handoff report with exactly two layers:

### Layer 1: Summary (~1K tokens)
Human-readable overview of what was accomplished:
- Tasks completed with brief descriptions
- Key decisions made
- Files created/modified
- Issues or warnings

### Layer 2: Tagged Artifacts (variable size)
Machine-readable artifacts tagged by domain for selective retrieval:
- Each artifact tagged with domain(s): `[backend]`, `[auth]`, `[frontend]`
- File paths, type signatures, API contracts
- Only artifacts relevant to downstream phases are included

## Artifact Tagging

Artifacts are tagged by the domain they belong to:

```
[backend] POST /api/users → { id, email, name }
[auth] JWT payload: { userId, role, exp }
[database] User { id: uuid, email: unique, passwordHash, role }
[frontend] <UserProfile userId={string} /> → renders name, email, avatar
```

## Selective Retrieval

Downstream phases receive ONLY relevant artifacts:

- Phase 2 (Backend API) produced: `[backend]`, `[auth]`, `[database]` artifacts
- Phase 3 (Frontend) needs: `[backend]` (API contracts) + `[auth]` (token format)
- Phase 3 does NOT get: `[database]` artifacts (irrelevant to frontend)

Scoring: artifacts scored 0–1 for relevance to next phase's domains. Only artifacts scoring > 0.3 are included.

## Compression Rules

Handoff always compressed to fit within the receiving phase's token budget:
- Summary layer: always included (~1K, non-compressible)
- Artifacts: included by relevance score, highest first
- If over budget: drop lowest-scoring artifacts
- Minimum handoff: summary only (when budget is extremely tight)

## Example Phase Report

```markdown
# Phase 2 Report: Backend API

## Summary
Built REST API with 4 routes (users CRUD), JWT auth middleware,
Prisma schema with User + Session models. All routes tested.
Quality: 87/100. Token usage: 8,200/10,000.

## Artifacts
[backend] Routes: POST /api/users, GET /api/users/:id, PUT, DELETE
[backend] Response shape: { success: boolean, data?: T, error?: string }
[auth] Middleware: verifyToken() → req.user = { userId, role }
[auth] Token format: JWT { sub: userId, role: string, exp: number }
[database] Schema: User { id, email, passwordHash, role, createdAt }
[database] Schema: Session { id, userId, token, expiresAt }
[testing] Coverage: 4 route tests, 2 middleware tests, all passing
```

## Audit Trail

All handoff decisions are logged:
- Which artifacts were produced
- Which were selected for downstream
- Which were dropped and why (score < threshold or budget constraint)
