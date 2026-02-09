# Publishing Guide

## npm Publishing

### Prerequisites
- npm account with publish access
- `NPM_TOKEN` configured

### Version Bump
```bash
npm version patch|minor|major
```

### Publish
```bash
npm run build && npm publish
```

## Package Configuration

```json
{
  "name": "{{package_name}}",
  "version": "{{version}}",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## Build System

{{build_system}}

## Release Checklist

- [ ] All tests passing
- [ ] Types compile cleanly
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] README examples tested
- [ ] Published to npm
