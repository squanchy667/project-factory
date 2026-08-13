# /jig-run

Execute a locked CONTRACT through build → test → gate → package. You get updates at each
gate but do not have to be present.

## Usage

```
/jig-run T042
/jig-run T042 --dry-run      # show the dispatch plan, build nothing
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `task-id` | string | (required) | A CONTRACT with no open questions |
| `--repo` | path | cwd | Project |
| `--dry-run` | flag | false | Print the plan and stop |

## Preflight

Refuse to start if any of these hold:

- The CONTRACT has a non-empty open-questions section
- The CONTRACT has no acceptance lines
- The working tree for the target repo is dirty in a way that would contaminate the worktree

## Sequence

| # | Tier | Action | You see |
|---|---|---|---|
| 1 | Team Lead | Provision worktree, dispatch Executor with scope only | *"building — worktree at …"* |
| 2 | Executor | Build. Report files changed | *"build done — N files"* |
| 3 | Team Lead | Dispatch Tester with acceptance + edge cases, **not** the Executor's reasoning | *"testing — A1..An + E1..Em"* |
| 4 | Tester | Run every case, emit raw evidence | *"evidence written — p pass / f fail"* |
| 5 | Team Lead | Verdict on unedited evidence | *"gate: PASS"* or *"gate: REJECT — round 1/2"* |
| 6 | Architect | Coverage check, line by line (full depth only) | *"coverage: n/n"* |
| 7 | — | PACKAGE written | *"ready for review"* |

## On rejection

Back to the Executor **with the Tester's raw evidence attached**, never a paraphrase.

**Two rounds maximum.** A third failure escalates to the Architect, and from there reaches
you as a decision — *"the contract says X, the code cannot do X without Y, which do you
want?"* — not as a failure report.

## What you get

`<repo>/jig/packages/<TASK-ID>.md` — one page:

- What you asked for, in your words
- What shipped
- How to see it yourself: commands, URLs, click paths
- Edge cases run, with results
- **What was NOT covered**
- Open risk

Raw evidence sits beside it at `jig/evidence/<TASK-ID>.md` if you want to audit the gate.

## Never

The loop builds, verifies, and reports. It does not push, does not deploy, and does not
apply DB changes. You review the diff and ship it.
