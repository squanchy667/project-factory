# Design Schema

Design a Zod schema and its inferred TypeScript type following Agent Pilot's validation-first approach.

## Input

Schema name or entity: $ARGUMENTS (e.g., TaskAnalysis, AgentConfig, ContextStrategy)

## Process

### 1. Understand the Entity
If just a name is given, infer fields from the entity's domain within Agent Pilot. If requirements are provided, use those.

### 2. Read Existing Schemas
Read `core/shared/types.ts` to understand:
- Existing schema patterns (naming, field conventions)
- How enums and constants are defined
- How schemas compose (`.extend()`, `.pick()`, `.omit()`)
- ID format conventions
- Timestamp format (ISO datetime strings)

### 3. Design the Schema

Add to `core/shared/types.ts`:

```typescript
/** Description of what this schema represents */
export const TaskAnalysisSchema = z.object({
  /** Unique identifier */
  taskId: z.string(),
  /** Detected domains from task text */
  domains: z.array(z.string()),
  /** Detected tech stack */
  stack: z.array(z.string()),
  /** Classified task type */
  taskType: TaskTypeSchema,
  /** Estimated complexity */
  complexity: ComplexitySchema,
  /** Expected output type */
  expectedOutput: OutputTypeSchema,
  /** Generated title */
  taskTitle: z.string(),
  /** Brief summary */
  taskSummary: z.string(),
});

/** Structured task analysis result */
export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>;
```

### 4. Conventions
- **Schema name**: `PascalCaseSchema` (e.g., `TaskAnalysisSchema`)
- **Type name**: Same without "Schema" suffix (e.g., `TaskAnalysis`)
- **Enums**: Use `z.enum([...] as const)` for fixed sets
- **Optional fields**: `z.foo().optional()` — use sparingly, prefer required
- **Create variants**: Omit auto-generated fields with `.omit()`
- **JSDoc**: Every field gets a JSDoc comment
- **Token fields**: Include `tokenCount: z.number()` where relevant
- **Result types**: `z.discriminatedUnion('success', [successSchema, failureSchema])`

### 5. Export
Add to `core/shared/index.ts` barrel exports.

## Output
- The Zod schema definition with JSDoc
- Inferred TypeScript type
- Create/Update variants if applicable
- Updated barrel exports
