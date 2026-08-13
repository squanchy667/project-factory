# JIG — stable layer

The development cycle: CEO states intent, four agent tiers turn it into a verified change,
one page comes back for review.

**This file is the contract. It describes roles, gates, and artifact shapes — never how to
launch an agent, which model to use, or which tool to call.** Those live in `ADAPTER.md`
and are expected to churn. If you find yourself writing a tool name here, it belongs there.

---

## 1. Tiers

| Tier | Owns | Must not |
|---|---|---|
| **CEO** (Ofek) | Intent, priorities, final verdict, push, deploy | Be handed a diff as the primary artifact |
| **Architect** | The CONTRACT — scope, acceptance lines, edge cases, explicit out-of-scope | Approve on assertion; only line-by-line against evidence |
| **Team Lead** | Dispatch, sequencing, the upward gate, owning that the check was real | Produce or edit evidence |
| **Executor** | Code, in an isolated worktree | Write or modify acceptance tests; talk past the Team Lead |
| **Tester** | Run acceptance + edge cases, emit raw evidence | Remove a case; see the Executor's reasoning |

Information flows **down** Architect → Team Lead → Executor/Tester, and **up** only through
the Team Lead. No side channels. No tier talks to a tier two levels away.

## 2. The three rules that make it hard to fake

**R1 — Evidence, not signatures.** Every upward claim carries the raw command output that
supports it, verbatim. The Team Lead attaches its verdict *on top of* the tester's output;
it never edits, summarizes, or restates it. A verdict without attached evidence is not a
verdict and does not pass the gate.

**R2 — The Architect defines success, not the tester.** Acceptance lines and edge cases are
written into the CONTRACT before any code exists. The Tester executes them. The Tester **may
add** cases it discovers and **may never remove** one. This is what stops the check from
drifting toward whatever is easy to pass.

**R3 — Nobody checks their own work.** The Executor does not test. The Architect does not
judge "is this good" about its own spec — it answers, per acceptance line, whether the
attached evidence covers it. Any line it cannot answer goes to the CEO flagged, not
silently accepted.

## 3. Ambiguity blocks — it never defaults

The Architect may not begin a task carrying an unresolved ambiguity. An unanswered question
**blocks the task**; a recommended default does not silently apply. Questions go to the CEO
in one batch, phrased as decisions with a marked recommendation.

Measure twice, cut once. Specification failures cause more damage than coordination
failures, and re-specification is cheap only before the cut.

## 4. Depth

| Change | Path |
|---|---|
| Small, reversible, no shared surface | **Fast lane** — Team Lead holds the contract, Architect not involved |
| Touches a shared file, schema, migration, or anything irreversible | **Full depth** — all four tiers |

The shared-surface trigger list is per-project and lives in `ADAPTER.md`. When in doubt,
full depth: the default is always the safer path, never the faster one.

## 5. Rejection path

The gate failing is a normal outcome, not an exception.

1. Team Lead rejects → back to the Executor **with the tester's raw evidence attached**,
   never a paraphrase of what went wrong.
2. **Two rounds.** A third failure stops being an execution problem and escalates to the
   Architect — two honest attempts failing a clear spec usually means the spec was wrong.
3. Architect escalation reaches the CEO as a **decision**, not a failure report:
   *"the contract says X, the code cannot do X without Y — which do you want?"*

Never loop past round two. Never report done on a failing gate.

## 6. Artifacts

Three files per task, all dated. **Nothing is ever written to a project root.** Every
artifact lives under a single `loop/` directory so the project stays readable:

```
<project>/
└── jig/
    ├── INDEX.md          ← one row per task, newest first. The only file you browse.
    ├── contracts/        ← <TASK-ID>.md
    ├── evidence/         ← <TASK-ID>.md — raw, never edited above the Tester
    └── packages/         ← <TASK-ID>.md — the one page for the CEO
```

`INDEX.md` is the entry point: task id, title, date, depth, verdict, package path. If you
need to know what happened, you read one file, not a directory listing.

### CONTRACT — written before any code
```
task id / title
what the CEO asked, in their words
scope: files and surfaces in play
acceptance lines: numbered, each independently checkable
edge cases: numbered, each with expected behaviour
explicitly out of scope
depth: fast | full
open questions: must be empty before execution starts
```

### EVIDENCE — produced by the Tester, never edited above
```
per acceptance line: command run, raw output, pass/fail
per edge case: command run, raw output, pass/fail
cases added by the Tester (with reason)
what could not be checked, and why
```

### PACKAGE — the one page the CEO receives
```
what you asked for, in your words
what shipped
how to see it yourself: commands, URLs, click paths
edge cases run, with results
what was NOT covered
open risk, if any
```

A PACKAGE without a "what was NOT covered" section is invalid. Any report that never says
what it skipped is claiming it checked everything, which is never true.

## 5a. Placement — decided before work starts

Every file a task creates has its destination chosen **at spec time, by the Architect, in the
CONTRACT**. Not by the Executor while building, and never by default to the project root.

The CONTRACT carries an **Artifacts and destinations** table: one row per file the task will
create, with the path it lands at and the rule that put it there. If the task turns out to
need a file the table does not list, that is a scope question — the Executor stops and
reports, exactly as with any other scope expansion.

**The acceptance line that enforces it:** zero files created outside the declared
destinations. A task that scatters is a failed task even if its work is correct.

Why this is a protocol rule and not a convention: a documentation root reached 168 files
because 168 files were created with nobody deciding where any of them went. Placement left
to the moment of writing always resolves to "wherever I already am."

Two corollaries:

- **A destination that does not fit the taxonomy is a finding, not a free choice.** If the
  Architect cannot route a file, the taxonomy is wrong or the artifact is misconceived. Say
  so; do not invent a folder mid-task.
- **New files arriving from outside a task** — another session, a human, a tool — are the
  live scan's problem, not placement's. Placement governs what a task itself creates.

The routing table is per-project and lives in `ADAPTER.md`.

## 6a. Writing acceptance lines

Learned from JIG-001, where the Architect logged five defects against its own contract.
Specification failures are the largest failure bucket; these are the ways they show up.

**Disclosure obligations are not acceptance lines.** A line that requires the PACKAGE to
state something cannot be checked by the Tester, because the PACKAGE is produced after the
gate that judges it. Put those in a separate **"the PACKAGE must disclose"** section, which
the Architect checks in Mode B.

**When the baseline is known-dirty, gate on net-new.** Do not make pre-existing external
breakage a gate condition for work the contract forbade touching. Assert `NET_NEW: 0` and
record the pre-existing count as a disclosure. Otherwise the gate fails on damage the work
did not cause and was not allowed to repair.

**Do not conflate "documents an accurate command" with "runs from a clean checkout."** If
part of the toolchain is gitignored or otherwise unreproducible, executability is
unsatisfiable by construction. Split them into two lines and require executability only
where the toolchain actually reproduces.

**Assert over a list the check prints, never over a population you assumed.**
*(Supersedes "never hard-code a count from your own survey", which was necessary and
insufficient — it caught literal numbers but not formulas or relationships between numbers.)*
A count, a formula, or an arithmetic relationship between counts is only checkable if the set
it ranges over cannot change between specification and execution. On a live tree it always
can. So: make the check emit its own scope rule and its own enumerated file list, then assert
properties over *that* output — every member satisfies P, and nothing satisfying P is missing.
**If an acceptance line would fail because a file arrived, a file moved, or a tool brought its
dependencies with it, the line is wrong — not the tree.** A spec that can only pass on a frozen
tree is a spec for a tree nobody has.

> **Corollary.** When a contract already declares that the tree is shared, or that new files are
> expected, **every acceptance line must be read against those clauses before it is written
> down.** Defects of this class are self-contradictions, not surprises — the contradicting
> clause is already in the same document. This check is cheap, mechanical, and belongs in Mode A
> before the contract locks.

**A negative result must prove it could have detected presence.**
"No matches", "0 rows", "unchanged", "exit 0" are produced identically by an empty world and by
a malformed question. A positive result carries its own evidence — the rows are the proof. A
negative carries none. So any check reporting absence prints its own iteration count and
subject list, and **fails when the subject count is zero** rather than passing quietly. Exit
codes are captured from the command under test, never from a pipeline it feeds. Path probes use
`test -e` on a literal path, never a glob. Trust in results is asymmetric by design.

**An evidence artifact that feeds a later check is never overwritten by a regeneration of
itself.** A plan regenerated after the work it planned describes the world *after*; a check
reading it then runs over an empty population and reports success. Snapshot it, or make the
consumer read an immutable record.

> **Record progress additively.** When something has moved on, do not edit the original to say
> so. Write a **new, dated companion file that references it** and states what changed. The
> original stays as it was, the pointer tells a future reader where the story continued, and no
> record is destroyed to record that a record is stale. This is the same instinct as the archive
> principle — *nothing is deleted* — applied to updates rather than deletions.

**Assert on the thing, not on a proxy for the thing.** Counting records in an archive is not
counting files; counting matches of a pattern is not counting the property the pattern
approximates. If the formula can be right while the world is wrong, rewrite the line.

## 7. Standing rules

- **Agents never push, never deploy, never apply DB changes.** They build, verify, and
  report. The CEO reviews the diff and pushes.
- **Worktree isolation.** Every Executor works in its own worktree. Relay automation never
  implies a shared checkout.
- **Every number is re-derived live.** No count, SHA, or status is copied from a prior
  document. If a prior artifact stated it, the new artifact re-derives it and flags any
  mismatch rather than reusing the old value.
- **Deterministic over agentic.** If a check can be expressed as a script, it is a script.
  Models are used where judgment is genuinely required, not as a default.

## 8. Commands

| Command | Tier | Does |
|---|---|---|
| `/jig-spec` | CEO + Architect | Turn an ask into a CONTRACT. Interactive. Blocks on ambiguity. |
| `/jig-run` | Team Lead | Execute a CONTRACT through build → test → gate → package. Reports at each gate. |

`/jig-spec` is where you spend your attention. `/jig-run` is where you get updates but do not have
to be present.
