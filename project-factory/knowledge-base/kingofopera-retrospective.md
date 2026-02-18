# KingOfOpera — Build Retrospective

## Project Summary
- **Type**: Unity 2D local multiplayer party game
- **Description**: 2-4 opera singers compete on circular stage, one-button controls, push rivals off + spotlight scoring
- **Tasks**: 30/30 complete across 6 phases
- **Files**: 50 C# scripts, ~4,475 LOC (code only, excluding tests)
- **Tests**: 14 test files, ~3,133 lines (pre-implementation)
- **Agents**: 8 types (scaffold, systems, gameplay, content, ui, vfx, art, audio)
- **Model mix**: 1 haiku (scaffold, content), 6 sonnet (all others)
- **Build time**: Single session, ~6 phases executed sequentially

## Architecture
- **Pattern**: Singleton-Events-SO trinity (matches FlappyKookaburra gold standard)
- **EventBus**: Generic typed pub/sub, 13 event structs, zero-GC (struct events)
- **Managers**: 10 singletons (Game, Round, Match, Score, Player, Spotlight, GameMode, Stage, Audio, Time)
- **Game Modes**: 4 modes with SO-driven config (Classic, Spotlight Chase, Sumo Dash, Bounce Bowl)
- **Characters**: 4 with distinct stats via CharacterData SO (Soprano, Tenor, Baritone, Bass)
- **Input**: Unity Input System with 4 control schemes (2 keyboard + 2 gamepad)

## What Worked Well

### 1. All-Parallel Final Phases
Phases 4, 5, and 6 had no intra-phase dependencies, allowing all 5 tasks per phase to run simultaneously. This is the ideal batch structure — Phase 4 (game modes) and Phase 6 (polish) completed in single batches.

### 2. Detailed Agent Prompts with Full Code
Providing complete code in agent prompts (rather than just specs) produced consistent, correct output with minimal agent exploration time. Agents spent most time writing files rather than researching.

### 3. Centralized Git Operations
Having the orchestrator handle all git commits (not agents) eliminated branch contention entirely. Agents only write files; commits happen after batch completion. This is the lesson from FlappyKookaburra formalized.

### 4. Event-Driven Architecture
The EventBus made systems completely decoupled. VFX, audio, camera effects, and UI all work by subscribing to the same events — no direct references between systems. This enabled truly parallel implementation.

### 5. SO-Driven Configuration
GameModeData, CharacterData, GameConfig, AudioLibrary, UITheme — all ScriptableObjects. Every tunable value is externalized. This means gameplay balancing can happen in Unity Editor without touching code.

### 6. Runtime Fallbacks for Editor Assets
CharacterDatabase.CreateDefaultCharacters() provides runtime fallback when SO assets aren't created yet. This is essential for unity-game projects where .asset files require Editor.

## What Could Improve

### 1. Scene Setup Still Manual
Scripts are complete but scenes (MainMenu.unity, CharacterSelect.unity, ModeSelect.unity, Game.unity) require Unity Editor setup. Prefabs, Canvas hierarchies, and component wiring are all manual. This is inherent to Unity CLI limitations.

### 2. No Integration Testing Between Systems
Each system was built and tested in isolation. Cross-system integration (e.g., does GameModeManager correctly toggle FallDetector?) would catch wiring issues earlier. Consider a dedicated integration-test task in Phase 3.5.

### 3. BounceWall Dual-Mode Complexity
BounceWall toggles the same CircleCollider2D between trigger (fall detection) and solid (bounce). This shared collider approach works but is fragile — consider separate GameObjects for fall boundary vs bounce wall in future projects.

## Patterns to Catalog

### Pattern: Mode-Modifier Architecture
Game modes don't implement their own physics — they set multipliers on a central GameModeManager that other systems query. This decouples mode definitions from system implementations.

```
GameModeData SO → GameModeManager.LoadMode() → sets multipliers
                                              → configures SpotlightManager
                                              → configures FallDetector
Other systems query GameModeManager.KnockbackMultiplier, etc.
```

### Pattern: Score Attribution Chain
Hit → Fall → Score uses a LastAttackerId chain:
1. PlayerHitEvent → ScoreManager records LastAttackerId on victim
2. PlayerFellOffEvent → ScoreManager credits LastAttackerId with knock-off points
This solves the "who caused the fall?" attribution problem elegantly.

### Pattern: Round Lifecycle Coroutine
RoundManager uses a single coroutine chain:
```
StartRound() → CountdownCoroutine() → enable input → RoundTimerCoroutine() → EndRound()
```
Each phase is a separate coroutine for clean cancellation. PlayerState.Stunned doubles as "input locked during countdown."

### Pattern: UI State Machine per Slot
CharacterSelectUI manages 4 PlayerSlotUI instances, each with 3 states (Empty → Joined → Ready). State transitions are driven by events, not polling.

## Metrics

| Phase | Tasks | Batches | Agents | Time Est |
|-------|-------|---------|--------|----------|
| 1 — Foundation | 5 | 3 | 5 | ~$0.58 |
| 2 — Core Mechanics | 5 | 3 | 5 | ~$0.71 |
| 3 — Game Loop | 5 | 3 | 5 | ~$0.75 |
| 4 — Game Modes | 5 | 1 | 5 | ~$0.60 |
| 5 — UI & Menus | 5 | 1 | 5 | ~$0.75 |
| 6 — Polish & Juice | 5 | 1 | 5 | ~$0.75 |
| **Total** | **30** | **12** | **30** | **~$4.14** |

## Key Files

| Category | Files | LOC |
|----------|-------|-----|
| Systems (managers) | 12 | ~1,800 |
| Player (controller, input, collision, animation) | 7 | ~750 |
| Game Modes | 4 | ~150 |
| Data (SOs) | 4 | ~200 |
| UI | 10 | ~1,100 |
| Utils (EventBus, VFX, Physics) | 5 | ~475 |

## Lessons for Future Unity Projects

1. **Provide full code in agent prompts** for unity-game projects — agents can't run/test code, so reducing ambiguity in the prompt produces better first-pass results
2. **Phase 1 should establish all foundational types** — enums, events, SO definitions, and the EventBus. Everything else builds on these.
3. **Max parallelism in content/polish phases** — game modes, UI screens, and VFX/audio are naturally independent
4. **SO runtime factories** are essential for CLI-only development — always provide `CreateDefault*()` methods
5. **Single-session completion** is achievable for 30-task Unity games when agents receive detailed prompts with code
