# JIG — volatile layer

**Everything here is expected to break.** Model names, launch mechanics, tool names, and
context budgets change with every harness release. When something in the protocol stops
working after an upgrade, the fix is almost always in this file and only in this file.

`PROTOCOL.md` must never reference anything below. If it does, the split has leaked and the
protocol will rot again.

Last reviewed: 2026-08-09

---

## 1. Model routing

| Tier | Model | Why |
|---|---|---|
| Architect | top model | Spec quality is the highest-leverage thing in the cycle |
| Team Lead | top model | Pure judgment; the gate is where rubber-stamping happens |
| Executor | Sonnet | Bounded, specified work against a written contract |
| Tester | Sonnet | Executes defined cases; most of its work is running commands |

Set the model explicitly on every launch. Never rely on inheritance — a silently
inherited model is the kind of thing that changes under you on an upgrade.

## 2. Launch mechanics

Tiers run as subagents. Each gets **only** its declared read-set — this is the context
contract, and it is what keeps each agent's window small enough to do its job well.

| Tier | Reads | Never reads |
|---|---|---|
| Architect | The ask, the repo, prior CONTRACTs, the graph | — |
| Team Lead | CONTRACT, EVIDENCE | The Executor's reasoning trace |
| Executor | CONTRACT scope section, its worktree | Other lanes, sprint history, the vault |
| Tester | CONTRACT acceptance + edge cases, the built worktree | **The Executor's reasoning or narrative** |

The Tester's blindness to the Executor's reasoning is load-bearing, not stylistic. A tester
that reads why the builder thinks it works inherits the builder's blind spots.

Subagent reports back at **1,000–2,000 tokens**. Raw evidence goes to a file and is
referenced by path, never pasted into the conversation.

## 3. Worktrees

```
git -C <repo> worktree add <path> -b <branch> <base>
```

One per Executor. Branch name follows the project's convention (workspace default:
`feat/TXXX-task-name`). Removed after the PACKAGE is accepted, never before — the CEO may
want to look at it.

Always `git -C`. Never `cd`.

## 4. Shared-surface triggers — full depth required

Per project. Touching any of these forces full depth regardless of change size.

**Workspace default**
```
**/models.py
**/alembic/versions/*.py
**/validator*
**/schema*
**/migrations/**
.claude/**
```

**DaraReports** — add:
```
dara_v2/presentation_routes.py
dara_v2/config.py
scripts/fh_verify_*.py
```

**BattleNet** — add:
```
**/Assets/Scripts/Core/**
```

## 4a. Placement routing — DaraReports

The Architect routes every artifact a task creates per PROTOCOL §5a. Most specific rule
wins. Anything that routes nowhere is a finding, not a new folder.

**The routing table and the human-usable decision guide are one document, not two**
(JIG-004 S-decision + E9 — two sources of truth for placement is the condition that
produced a 168-file root): `DaraReports/specs/PLACEMENT.md`. This file is a pointer, not
a copy — read that page for the 12 artifact classes, the "root is closed" rule and its
named exceptions, and the archive-not-delete convention. If this pointer and
`specs/PLACEMENT.md` ever disagree, `specs/PLACEMENT.md` is authoritative; fix this line,
never fork the table.

## 5. Evidence capture

What counts as raw evidence, by change type.

| Change type | Evidence |
|---|---|
| Backend / logic | Command + full stdout/stderr, exit code |
| Data / DB | The `SELECT` and its result rows, plus the integrity gate's pass line |
| API | `curl` invocation + full response body |
| UI | Screenshot **plus** the click path to reproduce it — a screenshot alone is not evidence, because it does not prove reproducibility |
| Build / types | The build or `tsc` command and its complete output |

Open question as of 2026-08-09: whether a screenshot plus click path is sufficient for
visual work, or whether the Tester should assert on DOM state instead. Revisit after the
first UI task runs through the loop.

## 6. Graph access

**Corrected 2026-08-11 (JIG-005 A7) — the "~90% quality at ~10% tokens" figure below was
never measured and did not hold when it was.** 5 real structural questions run both ways
against the rebuilt DaraReports graph (`jig/evidence/JIG-005-token-measurement.md`, raw
output in `jig/evidence/JIG-005-a7-raw/`): file exploration (`grep`/`find`) was cheaper on
4 of 5 by 17×–48×; the graph missed one question outright (root-level `scripts/*.py` is
not indexed by any graph on this system); it could not answer a cross-worktree question at
all via the tool below (no merged graph exists — see the correction two paragraphs down);
and on the one question it won on bytes, it also had lower recall than the file search.
Aggregate: the graph used **≈7× more bytes than file exploration**, not one tenth.

**Do not default to the graph for structural questions.** It is a plausible option for
"what calls/references X" *within a single worktree you already know*, where the fuller
edge-level answer is worth the extra bytes — that is the one shape it won cleanly on
correctness in the 2026-08-11 sample (Q1/Q2, still 17–48× more expensive than `grep`).
For locating a file, anything spanning more than one worktree, or anything needing high
recall, file exploration (`grep`/`find`) tested cheaper and at least as correct every time.
Re-measure before trusting either direction again — this correction is one sample, not a
permanent verdict.

```
graphify query "<question>" --budget 2000 --graph <path>/graphify-out/<source>/graph.json
graphify affected "<symbol>" --depth 2
```

**No merged graph exists.** The single `<path>/graphify-out/graph.json` this section used
to show does not exist and never has — only per-worktree graphs do
(`graphify-out/dara-v2/graph.json`, `graphify-out/dara-v2-ui-packs/graph.json`, …), so
using this tool at all requires already knowing which worktree's graph holds the answer,
and it cannot see across worktrees in one call. For cross-source questions (e.g. "which
worktrees hold alembic versions"), Project Atlas's `atlas-data.json` → `source_meta[*]`
(read via a bounded prefix, see `jig/scripts/atlas_lib.py`) answered correctly in 38 bytes
where the per-worktree `graphify query` could not answer at all — a different mechanism
than the two commands above, and worth reaching for first on anything cross-worktree.

Available graphs: `DaraReports/project-atlas/` (rebuilt 2026-08-11 by JIG-005 — 174 MB →
~26 MB, 47,353 → 12,527 nodes, stale-worktree references gone; manifest at
`project-atlas/graph-manifest.json`, freshness check `jig/scripts/check_graph_fresh.py`),
`BattleNet/graph-index/`.
Not required — the loop runs without it.

## 7. Known harness facts

Things that were true at last review and are the first suspects after an upgrade:

- Subagents are launched via the Agent tool; `model` and `subagent_type` are set per call
- Slash commands live in `.claude/commands/*.md`
- Agent definitions live in `.claude/agents/*.md` with `model:` frontmatter
- Skills live in `.claude/skills/<name>/SKILL.md`
- Enforcement (things that must not happen) belongs in hooks/permissions, not prompts
