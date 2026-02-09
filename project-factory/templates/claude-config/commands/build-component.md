# Build Component

Scaffold a React component following {{project_name}}'s frontend conventions.

## Input

Component name: $ARGUMENTS (e.g., UserProfile, DataTable, SettingsPanel)

## Process

### 1. Understand Requirements
If just a name is given, infer the component's purpose from its name and context. If a description is also provided, use that.

### 2. Explore Existing Patterns
Read existing components in `{{components_path}}` to understand:
- File structure (functional components, hooks usage)
- Styling patterns (Tailwind classes used)
- Import conventions
- State management approach
- How components handle loading/error states

### 3. Scaffold the Component

Create `{{components_path}}/{ComponentName}.tsx` with:

```tsx
{{component_template}}
```

### 4. Conventions to Follow
{{component_conventions}}

### 5. Integration
- Export from the appropriate barrel file if one exists
- Note where in the app this component should be used
- If it needs a route, note the suggested route path

## Output
- The component file
- A brief note on how to integrate it into the app
