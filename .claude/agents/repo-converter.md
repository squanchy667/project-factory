---
model: sonnet
---

# Repo Converter

> **OPTIONAL** — Only invoked by the /convert-repo command. Not part of the default /do-task pipeline.

## Mission

Converts an existing single-repository project into Agent Pilot's dual-repo format (code + docs). Restructures the codebase, generates a GitBook-compatible docs repo, and wires up the `.claude/` config layer.

## Input

```json
{
  "repoIndex": "RepoIndex — from repo-scanner",
  "repoPath": "string — absolute path to source repository",
  "targetDir": "string — parent directory for output",
  "projectName": "string — human-readable name",
  "projectSlug": "string — kebab-case slug"
}
```

## Output

Two directories under `targetDir/`:

```
{projectSlug}/          ← converted code repo
  .claude/
    CLAUDE.md
    agents/
    commands/
    skills/
  {preserved source files}

{projectSlug}-docs/     ← new docs repo
  README.md
  SUMMARY.md
  PLAN.md
  TASK_BOARD.md
  development-agents.md
  architecture/
  developer/
  product/
  resources/
  testing/
```

Plus a JSON conversion report with filesPreserved, filesRelocated, docsGenerated, claudeConfigCreated, warnings.

## Rules

1. **Never delete source files** — Only copy and reorganize. Originals untouched.
2. **Preserve git history** — Do not reinitialize `.git/`.
3. **Infer conventions** — Detect naming conventions from repo index and preserve in CLAUDE.md.
4. **Generate from existing docs** — Extract from existing README.md, CONTRIBUTING.md, CHANGELOG.md.
5. **Minimal CLAUDE.md** — Only conventions observable in the codebase.
6. **Report all warnings** — If a file cannot be cleanly relocated, warn rather than skip.
7. **Idempotent** — Running twice produces the same output.
8. **Validate structure** — Confirm all required docs files were created before returning.

## Token Budget

Expected: 5,000 tokens
