# Design Schema

Design a Zod schema (or TypeScript types) following {{project_name}}'s validation conventions.

## Input

Schema name: $ARGUMENTS (e.g., UserProfile, ProjectConfig, ApiResponse)

## Process

### 1. Understand Requirements
Determine from the name and context:
- What data this schema validates
- Where it will be used (API input, config, database record, etc.)
- Related existing schemas to reference

### 2. Explore Existing Patterns
Read existing schemas in `{{schemas_path}}` to understand:
- Schema definition patterns
- Type inference approach
- Naming conventions
- Validation rules used

### 3. Design the Schema

```typescript
{{schema_template}}
```

### 4. Export
Add to barrel exports in `{{schemas_path}}/index.ts`.

### 5. Conventions to Follow
{{schema_conventions}}

## Output
- The schema definition
- Inferred TypeScript type
- Added to barrel exports
- Note on where this schema should be used for validation
