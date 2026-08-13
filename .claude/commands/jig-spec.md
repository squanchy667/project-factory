# /jig-spec

Turn an ask into a CONTRACT. Interactive — this is the step where your attention actually
matters.

## Usage

```
/jig-spec "the map should remember the last city I looked at"
/jig-spec "fix the pace metric double-counting presales" --repo DaraReports
/jig-spec --resume T042        # answer open questions on an existing contract
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `ask` | string | (required) | What you want, in your own words |
| `--repo` | path | cwd | Project the change lands in |
| `--id` | string | auto | Task ID; auto-derived from the project's convention |
| `--resume` | string | — | Answer open questions on an existing CONTRACT |

## What happens

**Step 1 — Ground.** Re-derive live: current branch, head SHA, the files actually in play.
Nothing is copied from a prior document. If the graph is available it is used for the
structural sweep, then file reads for anything source-level.

**Step 2 — Draft.** The Architect writes scope, acceptance lines, edge cases, and explicit
out-of-scope. Acceptance lines must be checkable by someone who did not build the change.

**Step 3 — Classify depth.** Shared-surface trigger hit (`ADAPTER.md` §4) → full depth.
Otherwise fast lane. When in doubt, full depth.

**Step 4 — Ask.** Every ambiguity comes back to you as a decision with a marked
recommendation. Answer with one word each.

> **Execution cannot start while open questions remain.** No recommended default silently
> applies. This is deliberate — bad specs cause more damage than anything downstream, and
> respecifying is only cheap before the cut.

**Step 5 — Write.** CONTRACT lands at `<repo>/jig/contracts/<TASK-ID>.md` and an INDEX row
is added. Nothing is written to the project root.

## Output

A CONTRACT path, the depth classification, and — if anything was unclear — a short list of
questions. Answer them and the contract locks.

## Then

```
/jig-run <TASK-ID>
```
