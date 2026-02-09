# {{project_name}}

{{description}}

## Installation

```bash
npm install {{project_slug}}
```

## Usage

```typescript
import { {{main_export}} } from '{{project_slug}}';

{{usage_example}}
```

## Development

```bash
git clone <repo-url>
cd {{project_slug}}
npm install
npm run build
npm test
```

## Structure

```
{{project_slug}}/
├── src/              # Source code
│   ├── index.ts      # Public API
│   └── ...
├── tests/            # Test files
├── dist/             # Build output
├── tsconfig.json
├── tsup.config.ts    # Build config
├── vitest.config.ts  # Test config
└── package.json
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build library |
| `npm run dev` | Watch mode |
| `npm test` | Run tests |
| `npm run typecheck` | Type check |
