# AWS Infrastructure

## Architecture

```
CloudFront (CDN)
    │
    ├── /api/* → API Gateway → Lambda (Express)
    │                              │
    │                              ├── DynamoDB (data)
    │                              └── S3 (files)
    │
    └── /* → S3 (React static assets)
```

## Services

| Service | Purpose |
|---------|---------|
| **Lambda** | Express.js API server |
| **API Gateway** | HTTP API routing and throttling |
| **DynamoDB** | Primary data store |
| **S3** | Static assets and file storage |
| **CloudFront** | CDN for frontend and API |
| **SAM** | Infrastructure as Code |

## SAM Template

Location: `{{infra_path}}/template.yaml`

{{sam_resources}}

## Deployment

```bash
{{deploy_commands}}
```

## Environment Variables

{{env_vars}}

## Monitoring

{{monitoring_setup}}
