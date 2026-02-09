# Component Library

## Component Conventions

- Functional components with named exports
- Props interface named `{ComponentName}Props`
- Tailwind CSS for styling
- Handle loading, error, and empty states
- Accessible: aria labels, keyboard navigation, semantic HTML

## Core Components

{{component_catalog}}

## Layout Components

{{layout_components}}

## Form Components

{{form_components}}

## Shared Patterns

### Loading State
```tsx
if (loading) return <Spinner />;
```

### Error State
```tsx
if (error) return <ErrorBanner message={error.message} />;
```

### Empty State
```tsx
if (items.length === 0) return <EmptyState message="No items found" />;
```
