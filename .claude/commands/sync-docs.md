# Sync Docs

Keep documentation in sync with code. Detects divergence between code repo state and docs repo, then auto-updates or flags for review.

## Input

$ARGUMENTS — sync mode: `"full"` | `"changelog"` | `"tasks"` | `"status"`

Modes:
- **full** — Complete sync: tasks, changelog, known issues, architecture check
- **changelog** — Update changelog from recent git commits
- **tasks** — Sync task statuses from git branches and commits
- **status** — Read-only report of what's out of date (no modifications)

If no project is detected from cwd, ask which project to sync.

## Process

### 1. Locate Repos
Find the project's code repo and docs repo:
- Code: `{project-slug}/`
- Docs: `{project-slug}-docs/`

### 2. Read Code Repo State
Gather from the code repo:
```bash
# Recent commits
git log --oneline -50

# Current branches
git branch -a

# Test results (if available)
npm run test 2>&1 || true

# File structure changes
git diff --stat HEAD~10
```

### 3. Read Docs Repo State
Gather from the docs repo:
- TASK_BOARD.md — current task statuses
- resources/changelog.md — last changelog entry
- resources/known-issues.md — active issues
- architecture/ docs — architecture descriptions

### 4. Compute Divergence

#### Task Status Sync
For each task in TASK_BOARD.md:
- Check if a branch `feat/TXXX-*` exists
- Check if commits with `TXXX:` exist on main
- If branch exists + merged to main → status should be DONE
- If branch exists + not merged → status should be IN_PROGRESS
- If no branch → status should be PENDING or BLOCKED
- Flag mismatches

#### Changelog Sync
- Find commits since last changelog entry
- Group by task ID (from commit message `[Phase X] TXXX:`)
- Generate changelog entries for missing commits

#### Known Issues Sync
- Check if any tests are failing → add to known issues
- Check if any previously known issues are now fixed → move to resolved
- Check for TODO/FIXME/HACK comments added recently

#### Architecture Sync (full mode only)
- Compare file structure to architecture docs
- Flag if new directories/modules exist that aren't documented
- Flag if documented components were removed or renamed

### 5. Apply Updates (non-status modes)

#### Tasks Mode
Update TASK_BOARD.md:
- Change statuses based on git branch/commit analysis
- Add completion dates where applicable

#### Changelog Mode
Append to resources/changelog.md:
```markdown
## [YYYY-MM-DD] — Sync Update

### Completed
- TXXX: Description (from commit message)
- TYYY: Description (from commit message)

### In Progress
- TZZZ: Description (branch exists)
```

#### Full Mode
All of the above, plus:
- Update known-issues.md
- Flag architecture divergence for human review
- Update SUMMARY.md if new docs files were added

### 6. Report

```
Docs Sync Report
================
Mode: {mode}

Task Status Changes:
  T005: PENDING → DONE (branch merged)
  T006: PENDING → IN_PROGRESS (branch exists)

Changelog:
  3 new entries added (T005, T007, T008)

Known Issues:
  1 new issue: auth.test.ts failing (2 tests)
  1 resolved: CORS config fixed

Architecture:
  ⚠ New directory `services/notifications/` not in system-overview.md
  ⚠ Component `LegacyDashboard` removed but still in docs

Action needed:
  - Update architecture/system-overview.md for notifications service
  - Remove LegacyDashboard from component-library.md
```

## Important Notes
- **status** mode never modifies files — read-only analysis
- Always commit docs changes with message: `docs: sync — {description}`
- Don't auto-update architecture docs — flag for human review
- Preserve existing changelog entries — only append new ones
- If task board has manual annotations, preserve them
