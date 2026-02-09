# Deployment Guide

## Build Targets

| Platform | Build Path | Notes |
|----------|-----------|-------|
| WebGL | `Builds/WebGL/` | Primary for web play |
| Windows | `Builds/Windows/` | Development testing |
| macOS | `Builds/macOS/` | Development testing |

## WebGL Deployment

```bash
{{webgl_deploy_commands}}
```

### AWS Setup
- S3 bucket for WebGL files
- CloudFront distribution for CDN
- Custom domain with SSL

## Build Settings

{{build_settings}}

## Version Management

{{version_management}}
