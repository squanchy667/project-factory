# Token Budgeting

Always-on context for token budget management in Agent Pilot.

## Default Budget: 10,000 Tokens

Why 10K: A focused 10K-token agent with exactly the right context outperforms a 100K-token agent drowning in irrelevant information. The sweet spot is enough context for the task, no more.

## Allocation Split

| Agent | Share | Default | Purpose |
|-------|-------|---------|---------|
| Task agent | 70% | 7,000 | Primary task execution |
| Test agent | 20% | 2,000 | Independent validation |
| Doc agent | 10% | 1,000 | Audit trail generation |

## Hard Ceiling: 15,000 Tokens

No agent ever exceeds 15K tokens regardless of budget override. Beyond this threshold, quality degrades — agents lose focus, hallucinate, and produce inconsistent output.

## Compression Levels

Applied per-file based on relevance score:

| Level | Relevance | What's Included | Example |
|-------|-----------|-----------------|---------|
| FULL | > 0.8 | Complete file content | `auth.ts` for an auth task (2,400 tokens) |
| SUMMARY | 0.5–0.8 | Signatures + key types | `user.model.ts` → exports + interface (600 tokens from 2,000) |
| REFERENCE | 0.3–0.5 | File path + export list | `utils/helpers.ts` → path + 5 exports (80 tokens from 1,200) |
| SKIP | < 0.3 | Excluded entirely | `README.md` for a backend task (0 tokens) |

## Progressive Compression

When assembled context exceeds budget:

1. Start with all relevant files at FULL
2. Calculate total tokens
3. If over budget: downgrade lowest-relevance FULL files to SUMMARY
4. Recalculate — still over? Downgrade lowest SUMMARY to REFERENCE
5. Still over? SKIP lowest REFERENCE files
6. Continue until within budget

**Example**: Task budget 7K tokens, 12 relevant files totaling 15K at FULL:
- 3 files stay FULL (8K → 8K, relevance > 0.9)
- 4 files → SUMMARY (4K → 1.2K, relevance 0.6–0.8)
- 3 files → REFERENCE (2K → 240 tokens, relevance 0.35–0.5)
- 2 files → SKIP (1K → 0, relevance < 0.3)
- **Total: ~6,440 tokens** — fits in 7K budget

## Budget Override

Users can override via `--budget`:
- `--budget 5000` — Tight budget, aggressive compression
- `--budget 15000` — Maximum allowed, minimal compression
- Default 10K is right for 80% of tasks
