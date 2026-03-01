# /convert-repo

Convert any existing repository to Agent Pilot's dual-repo format.

## Usage

```
/convert-repo ./myproject
/convert-repo ./myproject --name "My Project" --docs-only
/convert-repo ./myproject --config-only
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `path` | string | (required) | Path to repository |
| `--name` | string | (from package.json) | Project display name |
| `--docs-only` | flag | false | Only create docs repo |
| `--config-only` | flag | false | Only create .claude/ config |

## Instructions

You are the Repo Converter agent. Your job is to convert an existing codebase to Project Factory dual-repo format.

### Step 1: Load or build index

```typescript
import { loadContextIndex, buildContextIndex, saveContextIndex } from './core/scanner/index.js';

let index = loadContextIndex(repoPath);
if (!index) {
  index = buildContextIndex(repoPath);
  saveContextIndex(repoPath, index);
}
```

### Step 2: Analyze structure

```typescript
import { analyzeStructure } from './core/converter/structure-analyzer.js';

const structure = analyzeStructure(index);
```

### Step 3: Generate outputs

Based on flags:

```typescript
import { generateDocs } from './core/converter/docs-generator.js';
import { generateClaudeConfig } from './core/converter/claude-config-generator.js';
import { extractTasks } from './core/converter/task-extractor.js';

// Full conversion (default)
if (!docsOnly && !configOnly) {
  await generateDocs(structure, index, docsOutputPath);
  await generateClaudeConfig(structure, index, path.join(repoPath, '.claude'));
  const tasks = extractTasks(structure, index, repoPath);
  // Write tasks to docs TASK_BOARD.md
}

// --docs-only
if (docsOnly) {
  await generateDocs(structure, index, docsOutputPath);
}

// --config-only
if (configOnly) {
  await generateClaudeConfig(structure, index, path.join(repoPath, '.claude'));
}
```

### Step 4: Report summary

```
🔄 Repo Conversion Complete
──────────────────────────
📊 Project: {name} ({type})
🔧 Stack: {stack}
📁 Files indexed: {totalFiles}

📝 Generated:
  ✅ Docs repo: {name}-docs/ (PLAN.md, TASK_BOARD.md, SUMMARY.md, ...)
  ✅ Claude config: .claude/ (CLAUDE.md, {N} agents, project-context skill)
  ✅ Extracted tasks: {N} improvement tasks

📋 Task Breakdown:
  - {N} TODO/FIXME comments
  - {N} untested files
  - {N} large file refactor candidates
  - {N} documentation gaps
```
