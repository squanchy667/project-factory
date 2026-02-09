# Contributing

## Development Setup

```bash
git clone {{repo_url}}
cd {{project_slug}}
npm install
npm run build
npm test
```

## Project Structure

```
{{project_slug}}/
├── src/                # Source code
│   ├── index.ts        # Public API barrel export
│   └── ...
├── tests/              # Test files
├── dist/               # Build output (gitignored)
├── tsconfig.json       # TypeScript config
├── tsup.config.ts      # Build config
├── vitest.config.ts    # Test config
└── package.json
```

## Workflow

1. Create a branch: `feat/description` or `fix/description`
2. Make changes in `src/`
3. Add tests in `tests/`
4. Run `npm test` to verify
5. Run `npm run build` to check build
6. Submit PR

## Code Style

{{code_style}}
