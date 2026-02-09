# State Management

## Approach

{{state_approach}}

## Server State

Managed with React Query (@tanstack/react-query):
- Automatic caching and refetching
- Optimistic updates for mutations
- Loading and error states built-in

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
});
```

## Client State

{{client_state}}

## Form State

{{form_state}}
