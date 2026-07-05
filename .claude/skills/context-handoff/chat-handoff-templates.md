# Chat Handoff — Templates

Fill-in skeletons for `chat-handoff-protocol.md`. Copy, replace `<…>`, delete guidance.

---

## 1. CURRENT STATE block (top of your notes; OVERWRITE each turn)
```markdown
<!-- ═══ CURRENT STATE — overwrite each turn; rehydrate from HERE, not the turn-log below ═══ -->
## ⚡ CURRENT STATE (turn <N>, <YYYY-MM-DD>)
- <integration-branch> `<sha>` · <schema/migration head> · <key counts>
- <workstream A>: <status + PR# / branch@sha>
- <workstream B>: <status>
- Open PRs: <#nn (mine), #nn (theirs)>
- Blocked on (inbound only): <who/what>
- Next: <the single next action>
<!-- ═══ end CURRENT STATE ═══ -->
```

---

## 2. Handoff document (the dated file you hand off)
```markdown
# <Role> — Chat Handoff (<YYYY-MM-DD>)

<1-2 lines: who you are, what you own, who you escalate to.>

## RE-GROUND every turn (do not trust this snapshot)
```
<copy-paste commands: fetch + log + heads + open PRs + key counts>
```
⚠ Gotchas: <e.g. `ls-tree && echo` lies; main venv poisoned; verify mergeable ref>.

## MACHINE-READABLE STATE (verified <when>)
<the CURRENT STATE block, with each fact's re-verify command>

## READ TIERS
- HOT (now): this doc · <digest file> · <notes-tail>
- WARM (skim): <operating contract / method>
- COLD (on-demand): <full ledger> · <full turn-log> · <frozen reference>

## STATUS — <workstreams, each: state · PR/branch · what's verified · what's pending>

## OPEN ITEMS / NEXT ACTIONS (numbered, each with a re-derivation command)

## LESSONS THIS SESSION (the hard-won ones — see protocol cookbook)

## RE-DERIVATION COMMANDS (see template 4)
```

---

## 3. Successor kickoff prompt (paste to boot the fresh chat)
```
You are <ROLE> — a FRESH CHAT continuing <scope> under <supervisor/peer topology>,
human-relayed through <human>. You do NOT <forbidden: merge / edit ledger / etc.>.

READ FIRST (in order): <handoff file> (your full state + next actions), then its READ
TIERS — HOT now, WARM skim, COLD on-demand. RE-GROUND per the box in that handoff before
any "current state" claim (snapshots drift; <ls-tree-lies / verify-mergeable-ref>).

HEADLINES: <3-5 one-liners of where things stand>.

KEY LESSON: <the one that bit you, e.g. verify the committed ref not a dirty worktree>.

FIRST ACTIONS: (1) re-ground; (2) read <handoff + notes-tail + digest>; (3) <next action>;
(4) report state to <human>, then run your loop.
```

---

## 4. Re-derivation command library (per-project; copy into the handoff)
```
# every key fact → the command that re-derives it (verification = lookup, not re-invention)
integration head   : git -C <repo> log --oneline origin/<branch> -1
schema/mig head    : <alembic ls-tree | head -1   OR   migrate status>
merged?            : gh pr list --state merged --search "<id>"      # NOT ls-tree && echo
committed value    : git show <branch>:<file> | grep "<token>"
branch file-set    : git diff --name-only <base>..<branch>
key data counts    : <db query>
ground-truth anchor: <db query for the spine/invariant row>
```

---

## 5. Escalation packet (§6) — what flows UP each cycle
```markdown
## §6 SIGN-OFF — <task> — <from> → <to>
RECOMMENDATION: <accept/hold + 1 line>.
── INDEPENDENT VERIFICATION (my own re-derivation, not lifted) ──
- <raw artifact: query result / test tail / migration log — NOT a verdict>
── DRAFT LEDGER ROW (ledger-owner writes it) ──
  <one-line proposed row + bucket>
── RESIDUAL (evidence + bucket: unsolved | n_a | terminal_manual) ──
── ASKING FOR ── (numbered, so each is addressed)
  1. <decision needed>
I do not merge / push / edit the ledger. Stop point: <state>.
```
