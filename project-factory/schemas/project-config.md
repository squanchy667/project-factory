# Project Configuration Schema

Defines what a valid project configuration includes. Used by `/init-project` and `/plan-project` to understand project parameters.

## Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string (kebab-case) | Project slug used in paths and repos | `collabtool` |
| `displayName` | string | Human-readable project name | `CollabTool` |
| `description` | string | One-line project description | `Real-time collaboration tool` |
| `type` | enum | Project archetype | `react-express` |

## Type Values

| Type | Description | Default Stack |
|------|-------------|---------------|
| `react-express` | Web app with React frontend + Express backend | React, TypeScript, Vite, Tailwind, Express, Vitest |
| `fullstack-aws` | Full stack web app deployed to AWS | React, TypeScript, Vite, Tailwind, Express, AWS SAM, DynamoDB, Vitest |
| `unity-game` | Unity game with C# scripting | Unity, C#, Netcode, ScriptableObjects |
| `typescript-lib` | TypeScript library for npm | TypeScript, Vitest, tsup, npm |

## Optional Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `vision` | string | Extended vision statement | Expanded from description |
| `techStack` | object | Override default stack choices | Type defaults |
| `deployTarget` | string | Deployment platform | Inferred from type |
| `phaseEstimate` | number | Estimated phase count | 4-5 |
| `features` | string[] | Key feature list | Inferred from description |

## Directory Convention

```
/Users/ofek/Projects/Claude/{DisplayName}/
├── {name}/              ← Code repo (git)
└── {name}-docs/         ← Docs repo (git)
```

## Validation Rules

- `name` must be lowercase kebab-case (a-z, 0-9, hyphens)
- `displayName` must not contain special characters except hyphens and spaces
- `type` must be one of the supported values
- `description` should be 10-200 characters
- `phaseEstimate` must be 2-10

## Example Configs

### React-Express Web App
```
name: taskflow
displayName: TaskFlow
description: Task management tool with Kanban boards and team collaboration
type: react-express
features: [kanban-boards, task-assignment, team-chat, notifications]
```

### Full-Stack AWS Platform
```
name: chatagent
displayName: ChatAgent
description: AI-powered chat platform for organizations
type: fullstack-aws
deployTarget: AWS (Lambda + API Gateway + DynamoDB)
features: [chat-ui, agent-system, connectors, admin-dashboard]
```

### Unity Game
```
name: tarotbattlegrounds
displayName: TarotBattlegrounds
description: Tarot-themed card battler with multiplayer
type: unity-game
features: [card-combat, deck-building, multiplayer, tavern-social]
```

### TypeScript Library
```
name: zod-utils
displayName: ZodUtils
description: Utility library extending Zod with common patterns
type: typescript-lib
deployTarget: npm registry
features: [schema-helpers, validation-presets, type-utilities]
```
