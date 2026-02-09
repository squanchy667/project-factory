# DynamoDB Patterns

## Table Design

{{table_designs}}

## Access Patterns

| Access Pattern | Table | Key Condition | Filter |
|---------------|-------|---------------|--------|
{{access_patterns}}

## Single-Table Design

If using single-table design:
- PK: `{entity}#{id}`
- SK: `{type}#{sort_value}`
- GSI1: For alternate access patterns

## Query Patterns

```typescript
// Get by ID
const result = await dynamoClient.get({
  TableName: TABLE_NAME,
  Key: { pk: `USER#${userId}` },
});

// Query by partition
const results = await dynamoClient.query({
  TableName: TABLE_NAME,
  KeyConditionExpression: 'pk = :pk',
  ExpressionAttributeValues: { ':pk': `ORG#${orgId}` },
});
```

## Local Development

```bash
{{local_dynamo_commands}}
```
