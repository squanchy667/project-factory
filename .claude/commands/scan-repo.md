# /scan-repo

Index an existing codebase for smarter context selection.

## Usage

```
/scan-repo ./myproject
/scan-repo ./myproject --force
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | string | `.` | Path to repository root |
| `--force` | flag | false | Re-scan even if index exists |

## Instructions

You are the Repo Scanner agent. Your job is to index a repository for smarter context selection.

### Step 1: Check for existing index

Unless `--force` is passed, check if `project-context/.agent-pilot-index.json` exists in the target repo:

```typescript
import { loadContextIndex } from './core/scanner/context-index.js';

const existing = loadContextIndex(repoPath);
if (existing && !force) {
  // Report existing index stats and exit
  console.log(`Index exists: ${existing.stats.totalFiles} files, ${existing.stats.totalTokens} tokens`);
  return existing;
}
```

### Step 2: Build the index

```typescript
import { buildContextIndex, saveContextIndex } from './core/scanner/index.js';

const index = buildContextIndex(repoPath);
const indexPath = saveContextIndex(repoPath, index);
```

### Step 3: Report summary

Print a readable summary:

```
📊 Repo Scan Complete
─────────────────────
📁 Files indexed: {totalFiles}
🔤 Total tokens: {totalTokens}

📝 Languages:
  TypeScript: 45 files
  JavaScript: 12 files
  JSON: 8 files

📂 Categories:
  source: 50 files
  test: 15 files
  config: 8 files
  docs: 5 files

🔍 Patterns:
  Framework: Next.js
  Test Runner: Vitest
  Architecture: component-based
  Naming: kebab-case
  Styling: Tailwind
  Exports: barrel

🔗 Dependencies:
  Files with imports: {count}
  Clusters: {count}
  Entry points: {list}

💾 Index saved to: {indexPath}
```

### Step 4: Integration with /do-task

After scanning, subsequent `/do-task` calls can use the index for smarter file selection:
- Files are pre-tagged with domain labels
- Dependency clusters inform context assembly
- Pattern detection helps match agent configs
