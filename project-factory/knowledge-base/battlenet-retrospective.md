# BattleNet / TarotBattlegrounds Retrospective

## Project Overview
- **Name:** TarotBattlegrounds (under BattleNet umbrella)
- **Type:** Unity Game (C# + Netcode for GameObjects)
- **Description:** Tarot-themed card battler with deck building, combat, tavern social systems, and multiplayer
- **Scope:** 75+ tasks, 11 phases, 17 agents, 6 commands
- **Sub-projects:** TarotBattlegrounds-POC (game), Tarot DevZone (React+Express editor), tarot-devzone-docs

## Tech Stack
Unity, C#, Netcode for GameObjects, ScriptableObjects, AWS (S3, CloudFront for WebGL deployment), React + Express (DevZone editor)

## Key Learnings

### What Worked

1. **ScriptableObjects for game data** — Cards, abilities, characters, and synergies all defined as ScriptableObjects. Made balancing and iteration fast without code changes.

2. **Separate DevZone editor** — Building a web-based editor (React+Express) for game data was the right call. Non-programmers could modify game balance without Unity knowledge.

3. **System-based architecture** — Game Manager, Card System, Combat System, Ability System, Synergy System, Tavern System — each as an independent system made parallel development possible.

4. **16 specialized agents** — Game development needs more agent types than web dev. Game auditor, deploy orchestrator, tarot test agent, etc. — each handled a distinct concern.

5. **WebGL deployment pipeline** — Automated Unity → WebGL build → S3 + CloudFront deployment. Once set up, deployments became one-command operations.

6. **Extensive documentation** — 15 developer guide files covering every system made onboarding and agent context rich. Architecture docs with multiplayer patterns were especially valuable.

### What Could Improve

1. **Multiplayer complexity** — Netcode for GameObjects added significant complexity. Should have started with single-player and added multiplayer as a later phase.

2. **Phase count (11)** — Too many phases. Made tracking and planning overhead high. Consolidate to 5-6 phases with more tasks per phase.

3. **Cross-project coordination** — Managing TarotBattlegrounds-POC + Tarot DevZone + tarot-devzone-docs as separate projects under BattleNet was complex. Consider monorepo for related projects.

4. **Game testing** — Automated testing in Unity is harder than web. More investment in the tarot-test-agent would have caught bugs earlier.

## Agent Effectiveness

| Agent Type | Count | Notes |
|-----------|-------|-------|
| game-auditor | 2 | Useful for system-wide consistency checks |
| deploy-* | 4 | Multiple deployment agents (orchestrator, validator, aws, unity-webgl) — could consolidate |
| unity-game-developer | 1 | Core workhorse, handled most game systems |
| debugger + log-analyzer | 2 | Essential for Unity debugging |
| game-designer | 1 | Useful for DevZone editor features |

## Patterns Extracted

1. **ScriptableObjects for game data** → Added to patterns-catalog.md
2. **System-based game architecture** → Pattern for any Unity game
3. **WebGL deployment pipeline** → Reusable for Unity web builds
4. **Separate editor tooling** → Consider for any data-driven game

## Template Contributions

- `unity-game` docs template patterns derived from TarotBattlegrounds-docs structure
- Game-specific developer guides (card-system, combat-system, etc.) as template reference
- Deployment agent patterns for Unity WebGL

## Recommendations for Similar Projects

1. **Start single-player** — Add multiplayer after core gameplay works
2. **Invest in ScriptableObjects early** — Data-driven design pays off in iteration speed
3. **Build editor tooling** — Web-based editors for game data accelerate balance iteration
4. **Consolidate deploy agents** — One deploy pipeline agent, not four
5. **Keep phases to 5-6** — 11 phases was too granular
