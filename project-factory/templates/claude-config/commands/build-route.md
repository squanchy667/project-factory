# Build Route

Scaffold an Express API route following {{project_name}}'s backend conventions.

## Input

Route path: $ARGUMENTS (e.g., /api/users, /api/projects/:id)

## Process

### 1. Understand Requirements
Parse the route path to determine:
- Resource name (e.g., "users", "projects")
- Whether it's a collection or individual resource route
- Required HTTP methods (GET, POST, PUT, DELETE)

### 2. Explore Existing Patterns
Read existing routes in `{{routes_path}}` to understand:
- Router setup and export patterns
- Middleware usage (auth, validation)
- Error handling approach
- Response format

### 3. Scaffold the Route

Create `{{routes_path}}/{resource}.ts` with:

```typescript
{{route_template}}
```

### 4. Register the Route
Add to the route registration file (typically `{{routes_path}}/index.ts` or `app.ts`).

### 5. Conventions to Follow
{{route_conventions}}

## Output
- The route file
- Updated route registration
- Note on what service/data layer is needed
