# DiraFinder Retrospective

## Project Overview

| Field | Value |
|-------|-------|
| **Name** | DiraFinder |
| **Type** | typescript-lib (Chrome Extension) |
| **Stack** | TypeScript 5.4, Vite 5, CRXJS, Vitest, jsPDF, Chrome Manifest V3 |
| **Completed** | 2026-02-23 (two sessions) |
| **Tasks** | 20/20 (100%) |
| **Phases** | 5 planned → 5 actual |
| **Agents** | 8 types defined (scaffold, asset, test, scraper, feature, frontend, devops, qa) |
| **Source Files** | 19 files, ~5,244 LOC |
| **Test Files** | 10 files, 80 tests (all passing) |
| **Commits** | 8 (batched per phase) |

## Phase Completion Summary

| Phase | Theme | Tasks | Status |
|-------|-------|-------|--------|
| 1 | Foundation & Testing | 4 (T001–T004) | DONE |
| 2 | Scanner Calibration | 4 (T005–T008) | DONE |
| 3 | UI Enhancement | 5 (T009–T013) | DONE |
| 4 | Export & Storage | 3 (T014–T016) | DONE |
| 5 | Production Polish | 4 (T017–T020) | DONE |
| **Total** | | **20** | **100%** |

## Planned vs Actual

### What Matched Plan
- All 5 phases executed in order, none added or removed
- All 20 tasks completed, none dropped
- Dependency graph held — no unexpected blockers
- Convention consistency maintained (commit format, file naming)
- Pre-generated tests approach worked — 80 tests defined before implementation, all pass

### What Diverged
- **Phase execution was sequential, not batched**: Due to context constraints and interdependencies, tasks within each phase were executed sequentially rather than through parallel agents. This was more efficient for a 20-task project.
- **Yad2 DOM research required workaround**: Direct WebFetch of Yad2 pages failed due to bot protection (ShieldSquare/PerimeterX). Had to research DOM structure from GitHub repos (Matanga1-2/yad2-apartment-scraper) rather than scraping live pages.
- **Specs parser bug**: Initial regex `[•·.]` split on `.` breaking half-room values like "2.5 חדרים". Fixed to `[•·]`.
- **Phase 2-5 batched into larger commits**: Instead of one commit per task, used per-phase commits (T005-T008, T009-T013, etc.) which reduced git overhead.

### Scope Changes
None. The 20-task plan mapped well to the Chrome extension scope.

## Agent Effectiveness

| Agent Type | Tasks | First-Try Success | Notes |
|-----------|-------|------------------|-------|
| scaffold-agent | 1 (T001) | 100% | Vite + CRXJS + Vitest pipeline clean setup |
| asset-agent | 1 (T002) | 100% | SVG-derived PNG icons at 3 sizes |
| test-agent | 4 (T003, T004, T008, T016) | 100% | Chrome API mocking pattern worked well |
| scraper-agent | 1 (T005) | ~80% | Required web research fallback due to bot protection |
| feature-agent | 6 (T006, T007, T011, T012, T014, T018) | 100% | Cross-component features spanning popup/content/background |
| frontend-agent | 5 (T009, T010, T013, T015, T017) | 100% | Popup UI consistently clean |
| devops-agent | 1 (T019) | 100% | Package script, store descriptions |
| qa-agent | 1 (T020) | N/A | Manual testing task — documented known issues |

**Most effective**: feature-agent — handled 6 tasks spanning all extension components with clean integration patterns.

## Key Learnings

### 1. Bot-Protected Sites Need Research-First Approach
Yad2 uses ShieldSquare/PerimeterX bot protection, making direct page fetching impossible. For scraper-type projects targeting modern sites, always start with GitHub repo research for DOM structure rather than attempting to fetch live pages.

### 2. CSS Modules Require Partial Class Selectors
Yad2 (Next.js) uses CSS Modules with hashed suffixes. Selectors must use `[class*="stable_prefix"]` patterns since hash values change per deploy. Prefer `data-*` attributes (e.g., `data-nagish`, `data-testid`) when available.

### 3. Hebrew Text Parsing Needs Special Care
- Regex `\b` doesn't work for Hebrew characters — use alternation without word boundaries
- CSV needs UTF-8 BOM (`\uFEFF`) prefix for Excel Hebrew display
- Spec strings use bullet separators (`•`, `·`) — never split on `.` which breaks decimals like "2.5 חדרים"
- City extraction from location: last comma-separated part in "propertyType, neighborhood, subarea, city" format

### 4. Chrome Extension Architecture Patterns
- Content script ↔ Service Worker ↔ Popup messaging requires `return true` for async responses
- Chrome Storage API with typed wrapper functions (load/save per key) keeps code clean
- Multiple content script handlers in one `onMessage` listener with switch/case
- Badge updates from both popup (via message) and service worker (on tab change)

### 5. Sequential Execution Beats Parallel for Small Projects
For a 20-task Chrome extension, sequential per-phase execution with batched commits was more efficient than parallel agents. The overhead of worktree management and merge resolution exceeds the benefit when total task count is under ~25.

### 6. Pre-Implementation Tests Work Well for Typed Projects
Generating test suites from acceptance criteria before implementation provided clear "done" definitions. In a TypeScript project with Vitest, the test → implement → verify cycle caught real bugs (like the decimal split issue).

## Patterns Catalog Additions

### Chrome Extension Messaging Pattern
```
Popup → chrome.runtime.sendMessage → Service Worker
Service Worker → chrome.tabs.sendMessage → Content Script
Content Script → chrome.runtime.sendMessage → Service Worker (for badge, progress)
Always: return true for async, check chrome.runtime.lastError
```

### Yad2-Specific Selectors (as of 2026-02)
```
Feed items: [data-nagish="feed-item-list-box"]
Price: [data-testid="price"], [class*="price_price__"]
Street: [class*="item-data-content_heading__"]
Location: [class*="item-data-content_itemInfoLine__"][class*="first__"]
Specs: [class*="item-data-content_itemInfoLine__"]:not([class*="first__"])
Tags: [class*="item-tags_itemTagsBox__"]
Promoted: data-testid='yad1-listing'
Agency: [class*="price-and-extra_box__"]
Pagination: nav[data-nagish="pagination-navbar"]
```

### Chrome Storage Typed Wrapper Pattern
```typescript
const STORAGE_KEY = 'prefix_entity';
export async function loadEntity(): Promise<Entity | null> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as Entity) ?? null;
}
export async function saveEntity(entity: Entity): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: entity });
}
```

## Metrics

| Metric | Value |
|--------|-------|
| Total tasks | 20 |
| Tasks completed | 20 (100%) |
| Test assertions | 80 |
| Test pass rate | 100% |
| Source files | 19 |
| Lines of code | ~5,244 |
| Build output | 382 modules, 21 chunks |
| Known issues | 5 (all Low-Medium severity) |
| Sessions | 2 |
