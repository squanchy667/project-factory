# Truth Audit — playbook

A reusable, **read-only, non-destructive** process for establishing *confident truths* about a
sprawling codebase: find contradictions and everything **built on top of an old thing instead of
replacing it** (dead code, competing implementations, superseded docs/sources/schema). Output is an
**in-depth report** — it recommends, it never deletes.

**Workflow:** `.claude/workflows/truth-audit.js` · **Spine principle:** ground truth = code + live DB
+ passing tests; docs are claims to verify, never trusted alone.

## When to run
On a **settled** tree (not mid-sprint): clean working dir, suite at its known baseline, migrations on
a single head. Auditing a moving target produces noise.

## How to run
```
# DaraReports defaults (no args needed):
Workflow({ name: 'truth-audit' })

# Another project / different scope — pass args:
Workflow({ name: 'truth-audit', args: {
  repo: '/abs/path/to/code', docsRoot: '/abs/path/to/docs-root',
  db: 'postgresql://user:pw@host:5432/dbname', pg: 'pw',
  scope: 'whatever scope', counts: 'canonical numbers to check claims against',
  suspects: 'semicolon-separated known leads',   // optional but high-leverage
  dims: [ {key, brief}, ... ]                     // optional — override the 5 dimensions
}})
```
Runs in the background; watch with `/workflows`. Returns structured reports — **the Master chat
writes the report**, it is not produced by a workflow agent.

## The 5 steps
1. **Census** — snapshot surface area (docs/modules/tables/migrations/test baseline) = the denominator.
2. **Gather (parallel, D1–D5)** — five self-contained read-only agents, one per artifact type:
   D1 docs↔docs↔reality · D2 code-on-code · D3 data sources · D4 schema/DB · D5 tests↔truth.
   Each returns verified ground truth + contradictions + layered/dead candidates, all evidence-anchored.
3. **Verify** — **3-lens panel** (correctness / source-wiring / reproduce; majority rules) on every
   **Critical** finding; **single independent refuter** on every **Major** + every dead/superseded
   candidate. Survives → `Confirmed`. This is what makes the truths *confident*.
4. **Synthesis (Master)** — join D1 claims against D2–D5 ground truth + verify verdicts; write
   `PROJECT_TRUTH_REPORT_<date>.md`; personally spot-check the top Critical/Major findings.
5. **Human review** — recommendations are advisory; any cleanup is a separate, approved pass.

## Rubrics
- **Confidence:** `Confirmed` (raw evidence + survived verify) · `Probable` (single-agent evidence) ·
  `Suspected` (claim-level only — follow-up).
- **Severity:** `Critical` (affects reported numbers / data correctness) · `Major` (competing impl /
  source wiring / dead code on a live path) · `Minor` (doc-only drift). Critical/Major must be
  `Confirmed` before being stated as truth.

## Report template (`PROJECT_TRUTH_REPORT_<date>.md`)
1. Executive summary (counts by severity; top risks) · 2. Confident truths (evidence-anchored) ·
3. Contradictions ledger (claim A vs B · verified truth · confidence · severity · advisory rec) ·
4. Layered-not-replaced inventory (dead/competing/superseded + advisory rec) · 5. Open questions ·
6. Evidence appendix (raw command/SQL/test output).

## Guarantees
Read-only. Modifies nothing. Every Critical/Major truth is independently verified. The report is the
deliverable; deletion/cleanup is always a separate, human-approved decision.
