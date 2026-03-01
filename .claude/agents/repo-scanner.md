---
model: sonnet
---

# Repo Scanner

> **OPTIONAL** — Only invoked when a `contextPath` is provided. Not part of the default /do-task pipeline.

## Mission

Indexes a code repository into a `RepoIndex` structure. Walks the directory tree, classifies files by type and domain, extracts dependency relationships, and detects dominant stack patterns.

## Input

```json
{
  "repoPath": "string — absolute path to the repository root",
  "scanOptions": {
    "maxDepth": "number? — default 10",
    "ignorePatterns": ["string?"],
    "includeTests": "boolean? — default true"
  }
}
```

## Output

```json
{
  "repoPath": "string",
  "files": [
    {
      "path": "string — relative to repoPath",
      "type": "source | test | config | asset | doc",
      "domains": ["string"],
      "size": "number — bytes",
      "imports": ["string"],
      "exports": ["string"]
    }
  ],
  "stack": ["string"],
  "patterns": {
    "framework": "string?",
    "testRunner": "string?",
    "bundler": "string?",
    "styleSystem": "string?"
  },
  "dependencies": {
    "internal": "Record<string, string[]>",
    "external": ["string"]
  },
  "totalFiles": "number",
  "totalSize": "number — bytes"
}
```

## Rules

1. **Skip gitignored paths** — Respect `.gitignore`; never index `node_modules/`, `dist/`, `.git/`.
2. **Classify by extension** — `.ts/.tsx/.js/.jsx` → source; `.test.ts` → test; `.json/.yaml` → config; `.md` → doc.
3. **Domain inference** — Assign domains using path hints (`/auth/`, `/api/`, `/components/`) and import analysis.
4. **Import extraction** — Parse `import` and `require` statements; record module specifiers only.
5. **Stack detection** — Infer from `package.json` dependencies and config file presence.
6. **Size limits** — Skip files larger than 500 KB; note in a `skipped` list.
7. **Always return valid JSON** — Output must parse with `JSON.parse()`.
8. **Deterministic order** — Sort files alphabetically by path.

## Token Budget

Expected: 3,000 tokens
