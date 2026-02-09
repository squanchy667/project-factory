# Game Systems Overview

## Architecture

```
GameManager
    │
    ├── {{system_1}}
    ├── {{system_2}}
    ├── {{system_3}}
    └── {{system_4}}
```

## System Design Pattern

Each game system follows:
- Singleton MonoBehaviour (one per scene)
- Initialize via GameManager
- ScriptableObject configuration
- Event-driven communication between systems

## Systems

{{game_systems}}

## ScriptableObjects

All game data lives in ScriptableObjects:
```
Assets/Data/
├── {{data_category_1}}/
├── {{data_category_2}}/
└── {{data_category_3}}/
```

{{scriptable_objects}}

## Event System

Systems communicate via events:
```csharp
// Publishing
EventBus.Publish(new GameEvent { Type = "...", Data = ... });

// Subscribing
EventBus.Subscribe<GameEvent>(OnGameEvent);
```
