# {{project_name}}

{{description}}

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + TypeScript (Lambda)
- **Database:** DynamoDB
- **Infrastructure:** AWS SAM
- **Validation:** Zod
- **Testing:** Vitest

## Getting Started

```bash
npm install
npm run dev
```

## Structure

```
{{project_slug}}/
├── client/          # React frontend (Vite)
├── server/          # Express backend (Lambda-ready)
│   └── src/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       └── lambda.ts
├── shared/          # Shared types and schemas
├── aws/             # SAM template and infra
└── package.json     # Workspace root
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build all packages |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests |
| `make deploy` | Deploy to AWS |
