# Chat Handoff Protocol (long-running orchestration)

Companion to the phase-report handoff in `SKILL.md`. Use **this** when handing a
long-running **chat** — a Master / supervisor / orchestration role that re-grounds and
escalates over many turns — to a **fresh chat**. (Use the phase-report layers in `SKILL.md`
for build-app phase→phase artifact passing.)

Same principles as the phase-report model (two-layer/tiered, relevance, compress-to-budget,
audit trail) applied to a *conversation* instead of a pipeline stage.

## Why this matters: the cost is per-turn re-reading, not the one-time handoff
A fresh chat is operational on **~12–15K tokens IF the handoff is refined**. Unrefined, it
re-reads append-only ledgers/logs **every turn** (tens of K each). The win is hot/cold
separation + a self-contained, tiered handoff. Measured example: a 36K ledger → a 1.8K
generated digest (95% off) re-read each turn; an 8.5K turn-log → a ~1K state-header for
rehydration.

## Principles
- **Hot/cold.** Read the small live set each turn; cold history is on-demand only.
- **Generated > snapshot.** Derive hot views (digests) **read-only** from the source of
  truth; never hand-maintain a snapshot that drifts across parallel chats.
- **Self-contained.** A cold reader must be able to *act* from the handoff alone — every
  claim carries a re-derivation command, never "as I said earlier."
- **Verify the mergeable artifact, not a dirty worktree.** (cookbook below)
- **No redundant data.** Refine before handing off; distill, don't dump.

## The REFINE step — run BEFORE writing any handoff (the missing phase)
1. **Overwrite the CURRENT STATE block** at the top of your notes with verified-now facts.
2. **Regenerate derived digests** (ledger / risk register / etc.) from the source of truth.
3. **Archive resolved/dormant detail** out of the hot read-path (closed rows → archive;
   old turn-entries stay as audit but leave the read-path).
4. **Self-contained test:** "could a cold chat act from this alone, with zero access to
   mine?" Replace every "as discussed / as I said" with a command or a quoted fact.
5. **Budget check:** `wc -c` the HOT read-path; target **< ~15K tokens (~60 KB)**. Over → refine again.
   (See the `token-budgeting` skill for ceilings.)

## Handoff document structure (tiered)
- **Machine-readable STATE block** (top, ~10 lines): verified-now facts + per-lane
  next-action; tag each fact with how to re-verify.
- **HOT (read now, must):** this handoff + the state block + the digest + notes-tail.
- **WARM (skim once):** the operating contract / method.
- **COLD (on-demand only):** full ledger, full turn-log, frozen reference.
- **Re-derivation commands:** exact copy-paste to re-ground every key fact.

## Successor kickoff
A paste-prompt that names the role, points at the HOT tier **in order**, says
"RE-GROUND per the box before any claim," and gives 3–5 first actions. (template file)

## Per-turn hygiene (inside the running chat)
- Re-ground with the **reliable checks** (cookbook), not from memory/snapshot.
- Overwrite the CURRENT STATE block; regenerate the digest after the source changes.
- Keep escalations to the **§6 packet** (template file).

## Verify-ability cookbook — hard-won; bake into every project
- **`git ls-tree <ref> <path> && echo OK` LIES** — ls-tree exits 0 on no-match. Verify
  presence with `[ -n "$(git ls-tree ...)" ]`; merges with `gh pr list --state merged
  --search`, `git show <ref>:<file> | grep`, or `git merge-base --is-ancestor`.
- **Verify the COMMITTED mergeable ref, not a dirty worktree.** A fix applied-but-
  uncommitted passes your re-run yet is absent from what merges. Check `git show
  <branch>:<file>`, `git diff --name-only <base>..<branch>` (exact file set), and that the
  branch **tip advanced**.
- **Migrations: prove on a THROWAWAY DB** when canonical is dirty (orphaned cols / stamp
  drift). Apply at the real merge-slot revision, verify the schema, test `downgrade`. Never
  assume canonical schema.
- **Independent verification = re-derive, never lift a subordinate's numbers.** Query the
  DB / re-run yourself.
- **Stubs/fakes RAISE by default** — a no-op fake is a false-green factory.
- **Desync:** if a subordinate's claim contradicts the ledger or your verification,
  **re-issue + flag** — don't assume your earlier ruling landed.
- **Run from a fresh worktree off the integration branch**, never a stale/poisoned local venv.

## Conventions that make digests cheap + exact
- **Hot/cold digest generator:** a read-only script greps the append-only source → emits a
  small open-set + packed index (~95% smaller). **Never edits the source.** (Example impl:
  `DaraReports/ledger_digest.py` — project-specific; reimplement per project, don't depend on it.)
- **Status-token convention:** prefix each row's status with `[OPEN]` / `[CLOSED]` /
  `[DORMANT]` → the digest is exact, not heuristic.
- **Freshness markers:** tag each handed-off fact with its re-verify command + when verified.

## Reuse
This protocol is project-agnostic. Per project, instantiate: a `notes.md` with a CURRENT
STATE header, a generated digest of the append-only shared state, a dated handoff doc, and a
re-derivation command set. The discipline (re-ground, verify-mergeable-ref, no-silent-zeros)
is constant.
