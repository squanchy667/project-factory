# Patterns Catalog

Proven patterns extracted from completed projects. Each pattern includes context, implementation, and when to use it.

---

## Architecture Patterns

### Zod-First Validation
**Source:** ChatAgent
**Context:** TypeScript projects with API boundaries
**Pattern:** Define Zod schemas as the single source of truth. Infer TypeScript types from schemas. Validate at system boundaries only (API input, config loading, external data). Internal code trusts validated data.
```typescript
// Schema is source of truth
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});
// Type is derived
export type User = z.infer<typeof UserSchema>;
```
**When to use:** Any TypeScript project with data validation needs.

### Config-Driven Agents (YAML)
**Source:** ChatAgent
**Context:** AI-powered platforms with multiple agent personalities
**Pattern:** Agent behavior defined in YAML config files, not code. System prompts use template variables ({{org.name}}, {{today}}). Loaded and validated at runtime with caching.
**When to use:** Projects with multiple LLM-powered agents that need different configurations.

### Monorepo with Workspace Packages
**Source:** ChatAgent
**Context:** Full-stack TypeScript applications
**Pattern:** npm workspaces with package aliases (@project/shared, @project/server). Shared types package consumed by all others. Composite TypeScript builds for type checking. Build order enforced by dependencies.
**When to use:** Projects with shared types between frontend and backend.

### Services Bridge (Dependency Injection)
**Source:** ChatAgent
**Context:** Circular dependency between packages in a monorepo
**Pattern:** When package A needs package B and vice versa, use dependency injection. Package A exports a `register{Function}()` that B calls at startup.
**When to use:** Monorepos where two packages have a circular dependency.

### Connector Plugin Architecture
**Source:** ChatAgent
**Context:** Integrating with multiple external data sources
**Pattern:** Define a base interface (DataConnector) with standard CRUD operations. Each data source implements the interface. Registry resolves connectors at runtime.
**When to use:** Projects that need to support multiple external data sources.

---

## Process Patterns

### Phased Task Execution
**Source:** ChatAgent, TarotBattlegrounds, FlappyKookaburra
**Context:** Large projects requiring systematic implementation
**Pattern:** Break project into phases (Foundation → Core → Integration → Production). Each phase has tasks with dependency tracking. Tasks within a phase run in parallel batches. Before batching, cross-reference "Files to Create/Modify" to detect file conflicts — tasks touching the same file must be sequenced.
**Optimal batch size:** 3-5 concurrent agents.
**When to use:** Any project with more than 10 tasks.

### Batch-Based Sequential Execution
**Source:** ChatAgent v2
**Context:** Large upgrades (50+ tasks) on an established codebase with strong conventions
**Pattern:** Instead of per-task feature branches with parallel agents, execute tasks in sequential batches (4-8 tasks each) on a single branch. Each batch is a coherent commit grouping by implementation affinity, not strictly by phase number. Run typecheck + tests after every batch as a quality gate. Commit only when both pass.
**Benefits:** Zero git conflicts, clean bisectable history, no agent coordination overhead.
**Prerequisite:** Mature CLAUDE.md with strong conventions, supporting crew (agents, skills, commands) already established.
**When to use:** When one well-configured session handles execution (not parallel agents). Especially for upgrade/expansion work on existing codebases.

### Documentation-First Planning
**Source:** ChatAgent, TarotBattlegrounds
**Context:** Projects that benefit from upfront architecture design
**Pattern:** Create docs repo before coding. Write architecture docs, task specs, and TASK_BOARD.md. Use these as the execution blueprint. Keep docs in sync throughout.
**When to use:** All projects — the upfront investment pays off in execution speed.

### Test-First Task Execution
**Source:** Project Factory
**Context:** Projects using phased task execution
**Pattern:** After planning and agent configuration, generate test files from task acceptance criteria before implementation begins. Each task's acceptance criteria become executable test assertions. Implementation agents must pass these pre-written tests. Quality gate verifies pre-existing tests rather than trusting agent-written tests.
**When to use:** All projects — shifts quality left and makes acceptance criteria executable.

### Paired Repos (Code + Docs)
**Source:** All projects
**Context:** Separating documentation from code for clarity
**Pattern:** Code repo contains source code and .claude/ config. Docs repo (GitBook-style) contains planning, architecture, tasks, and guides. Both repos are git-managed independently.
**When to use:** All projects.

---

## Agent Patterns

### Specialized Over General
**Source:** ChatAgent
**Context:** Designing Claude Code agents for a project
**Pattern:** Create narrow, specialized agents (react-component-builder, express-route-builder) rather than broad ones (full-stack-developer). Each agent knows one domain deeply.
**When to use:** Always — specialized agents produce better output.

### Convention-Heavy Agent Prompts
**Source:** ChatAgent
**Context:** Agent prompts that produce consistent output
**Pattern:** Include specific code examples, file path conventions, import patterns, and style rules in agent prompts. The more concrete the conventions, the more consistent the output.
**When to use:** Always — never write a generic agent prompt.

### Skills for Always-On Context
**Source:** ChatAgent
**Context:** Knowledge that every interaction needs
**Pattern:** Use skills (SKILL.md) for knowledge that applies to every task: coding conventions, workspace structure, validation patterns. Use agents for task-specific behavior.
**When to use:** When there's domain knowledge needed across all tasks.

### Research-First Agent Generation
**Source:** Project Factory
**Context:** Generating project-specific Claude Code agents from `/tailor-agents`
**Pattern:** Before falling back to local templates, search online for cursor rules, Claude Code configs, and stack-specific conventions. Score each source on Specificity (1-5) and Relevance (1-5). If 2+ independent sources score >= 7/10 combined, synthesize the best patterns into the agent (Mode A). Otherwise, fall back to local templates (Mode B). The synthesis algorithm takes the structure skeleton from the highest-scored source, merges conventions as a deduplicated union, and resolves conflicts by: project code > higher score > more specific > more recent. Research-sourced agents include `<!-- Research Sources: ... -->` attribution for traceability.
**When to use:** Always during `/tailor-agents` — research is the default path, templates are the fallback. Especially valuable for mainstream stacks (React, Next.js, Express, Unity) where high-quality public configs exist.

### Model Routing for Cost Optimization
**Source:** Project Factory
**Context:** Multi-agent pipeline with varying task complexity
**Pattern:** Assign model tiers (haiku/sonnet/opus) via YAML frontmatter in agent files. Match model capability to task complexity: haiku for algorithmic/template work (scaffold, docs, quality gate, orchestration), sonnet for standard implementation (backend, frontend, types, security, infra), opus only for architecture design (project planner). Run a cost-assessor agent (haiku, read-only) before each phase to project token usage and present a cost table with upgrade/downgrade alternatives. User reviews and can override model assignments per task before execution begins.
**Distribution:** Meta-layer: 1 opus, 2 sonnet, 4 haiku. Templates: 0 opus, 5 sonnet, 4 haiku.
**Override rules:** Upgrade haiku→sonnet if task has 5+ subtasks, 8+ criteria, cross-package coordination, or security-critical code. Downgrade sonnet→haiku for simple projects (<15 tasks) except security agents.
**Impact:** ~72% savings vs all-Opus, ~23% savings vs all-Sonnet baseline.
**When to use:** All projects using the `/build-app` pipeline. The cost-assessor adds negligible overhead (~$0.05 per phase).

---

## Code Patterns

### Barrel Exports
**Source:** ChatAgent
**Context:** TypeScript monorepo packages
**Pattern:** Every package has an index.ts that re-exports public API. No direct sub-path imports from other packages.
**When to use:** TypeScript monorepos with package imports.

### SSE Streaming for LLM Responses
**Source:** ChatAgent
**Context:** Real-time AI chat interfaces
**Pattern:** Server-Sent Events (SSE) for streaming LLM responses. Set Content-Type to text/event-stream. Stream chunks as JSON-encoded data events. Extended in v2 with block-typed events (form blocks, flow_complete events).
**When to use:** Chat applications with LLM-powered responses.

### Non-Fatal Pipeline Stages
**Source:** ChatAgent v2
**Context:** Adding new processing stages to an existing pipeline
**Pattern:** When extending a pipeline (e.g., adding vector indexing after file upload), wrap the new stage in try/catch so the primary operation always completes. Log the failure for debugging but don't block the user-facing result.
```typescript
// Non-fatal: vector indexing failure doesn't block file processing
try {
  await indexFileChunks(fileId, text, metadata);
} catch (err) {
  log.error('Vector indexing failed', { fileId, error: (err as Error).message });
}
file.status = 'ready'; // Always mark ready
```
**When to use:** Any pipeline where a new stage is additive and the primary operation should never fail because of it.

### Hebrew-Aware Regex Patterns
**Source:** ChatAgent v2
**Context:** Multilingual keyword matching (Hebrew + Latin)
**Pattern:** JavaScript `\b` word boundaries only work with ASCII word characters `[a-zA-Z0-9_]`. Hebrew characters are non-word characters, so `\b(חוזה)\b` never matches. Additionally, Hebrew prefix letters (ה,ל,ב,מ,כ,ו,ש) attach directly without spaces. Fix: split patterns into Latin (with `\b`) and Hebrew (without boundaries) using alternation.
```typescript
// Before (broken for Hebrew):
{ pattern: /\b(invoice|חשבונית)\b/i, agentId: 'finance-agent' }
// After (works for both):
{ pattern: /\b(invoice|expense)\b|(חשבונית|הוצאה|תקציב)/i, agentId: 'finance-agent' }
```
**When to use:** Any regex keyword matching that must support non-Latin scripts.

### CSS Logical Properties for RTL
**Source:** ChatAgent v2
**Context:** Bilingual web apps (LTR + RTL)
**Pattern:** Use CSS logical properties instead of directional ones: `inset-inline-end` (not `right`), `border-inline-start` (not `border-left`), `padding-inline` (not `padding-left/right`), `margin-inline-start` (not `margin-left`). Combined with `dir="rtl"` on the HTML element, layout automatically mirrors without separate stylesheets.
**When to use:** Any web app that supports or may support RTL languages.

### Module-Level Config via Lazy Getters
**Source:** ChatAgent v2
**Context:** Module-level constants read from environment variables
**Pattern:** Avoid `const X = process.env.X || default` at module level — the value is cached at import time, making runtime reconfiguration impossible and breaking test stubs. Use a getter function or lazy initialization instead.
```typescript
// Bad: cached at import time, vi.stubEnv won't work
const DIMENSION = parseInt(process.env.EMBEDDING_DIMENSION || '256');

// Good: evaluated on each call
function getDimension(): number {
  return parseInt(process.env.EMBEDDING_DIMENSION || '256');
}
```
**When to use:** Any module that reads environment variables and needs testability or runtime reconfiguration.

### ScriptableObjects for Data
**Source:** TarotBattlegrounds, FlappyKookaburra
**Context:** Unity games with data-driven design
**Pattern:** Use ScriptableObjects for game data (cards, abilities, characters, tuning values). Load at runtime. Edit in Unity Inspector.
**When to use:** Unity games with configurable data.

### Singleton-Events-SO Trinity (Unity)
**Source:** FlappyKookaburra
**Context:** Unity 2D games with multiple manager systems
**Pattern:** Every manager follows the same template: static `Instance` property, `Awake` null-check/destroy duplicate, `static event Action<T>` for communication, `[SerializeField]` for ScriptableObject config. Subscribe in `OnEnable`, unsubscribe in `OnDisable`. Systems never poll — they react to events.
```csharp
public class XManager : MonoBehaviour {
    public static XManager Instance { get; private set; }
    public static event Action<T> OnSomethingChanged;
    [SerializeField] private XConfig _config;
    private void Awake() { if (Instance != null) { Destroy(gameObject); return; } Instance = this; }
    private void OnEnable() { GameManager.OnGameStateChanged += HandleGameStateChanged; }
    private void OnDisable() { GameManager.OnGameStateChanged -= HandleGameStateChanged; }
}
```
**When to use:** Unity games with 3+ interconnected systems.

### AnimationCurve-Based Difficulty Progression
**Source:** FlappyKookaburra
**Context:** Games with score-driven difficulty ramp
**Pattern:** Define `AnimationCurve` fields in a DifficultyConfig ScriptableObject. DifficultyManager evaluates curves with player score as input, lerps between initial and target values. Designers tune curves visually in Inspector without code changes.
```csharp
float gapT = _config.gapSizeCurve.Evaluate(score);
CurrentGapSize = Mathf.Lerp(_config.initialGapSize, _config.minimumGapSize, gapT);
```
**When to use:** Any game with progressive difficulty that needs designer-friendly tuning.

### Editor Setup Script Pattern (Unity)
**Source:** FlappyKookaburra
**Context:** Unity projects where the automated pipeline generates code but can't wire the scene
**Pattern:** Create an Editor script (`Assets/Editor/GameSetup.cs`) with a `[MenuItem]` entry that automates scene wiring: creating ScriptableObject instances, building prefabs with correct component references, setting up managers with serialized field bindings, configuring camera/UI hierarchy. The script bridges the gap between code-generated infrastructure and a playable game. Key considerations:
- Scale placeholder sprites to match physics constants (e.g., `_pipeHeight`)
- Create world boundary colliders (ground, ceiling, walls)
- Wire all `[SerializeField]` references via `SerializedObject`
- Create UI hierarchy with Canvas, panels, and event system

**When to use:** Any Unity project using the project factory pipeline. Run after all code tasks complete and packages are imported.

### DOTween Sequence Choreography (Unity UI)
**Source:** FlappyKookaburra (Phase 5-6)
**Context:** Unity games with staged UI reveals (game over screens, title screens, death effects)
**Pattern:** Use DOTween Sequences to choreograph multi-step UI animations. Each step is appended (sequential) or joined (parallel) with precise timing. Use `InsertCallback` for non-tween actions mid-sequence. Always use `SetUpdate(true)` on UI tweens so they work during `timeScale = 0` or slow-mo. Kill sequences before scene transitions.
```csharp
var seq = DOTween.CreateSequence();
seq.Append(panel.DOAnchorPosY(targetY, 0.3f).SetEase(Ease.OutBack));
seq.InsertCallback(0.3f, () => PlaySFX());
seq.Append(scoreText.DOCounter(0, finalScore, 1f));
seq.Append(medal.DOScale(1f, 0.3f).SetEase(Ease.OutElastic));
seq.OnComplete(() => ShowButtons());
```
**When to use:** Any Unity UI that needs staged reveals, count-up effects, or choreographed transitions.

### Custom Library Implementation (CLI-Automatable)
**Source:** FlappyKookaburra (Phase 5-6)
**Context:** Unity projects where importing packages requires Editor (OpenUPM, .unitypackage)
**Pattern:** Instead of importing external packages that require Unity Editor, build a lightweight compatible library in `Assets/Plugins/`. Implement only the API surface needed. Use own `.asmdef` for assembly isolation. Auto-initialize via `[RuntimeInitializeOnLoadMethod]`. This is fully CLI-automatable — no Editor dependency for the import step.
**Tradeoff:** Simpler implementation (no caching/pooling), but covers all needed use cases and is fully automatable.
**When to use:** Unity CLI-driven pipelines that need external library functionality without Editor access.

### Graceful Degradation via Null Checks (Unity Premium Features)
**Source:** FlappyKookaburra (Phase 5-6)
**Context:** Adding optional premium UI/visual features to a working game
**Pattern:** Every premium component (TitleScreenAnimator, DeathSequence, GameOverSequence, MedalDisplay) is `[SerializeField]` with null-check guards. The game works with or without premium features wired. This enables incremental testing — wire one feature at a time and verify.
```csharp
if (_deathSequence != null) {
    _deathSequence.Play(ShowGameOver);
} else {
    ShowGameOver(); // Fallback: immediate transition
}
```
**When to use:** When layering premium visual/UI features onto a working base game.

### Mode-Modifier Architecture (Unity)
**Source:** KingOfOpera
**Context:** Unity party games with multiple game modes that modify physics/gameplay
**Pattern:** Game modes don't implement their own physics — they set multipliers on a central GameModeManager that other systems query. Mode definitions are ScriptableObjects with knockback/speed multipliers and boolean toggles (spotlight, elimination, bouncy walls). GameModeManager.LoadMode() applies all modifiers and configures dependent systems.
```csharp
// GameModeData SO defines the rules
public float knockbackMultiplier = 1.0f;
public bool spotlightEnabled = true;
public bool eliminationEnabled = true;

// GameModeManager applies them
public void LoadMode(GameModeData mode) {
    KnockbackMultiplier = mode.knockbackMultiplier;
    SpeedMultiplier = mode.speedMultiplier;
    SpotlightManager.Instance?.Activate(mode.spotlightPattern);
    FallDetector.Instance.enabled = mode.eliminationEnabled;
}
```
**When to use:** Games with multiple modes that share core mechanics but modify parameters.

### Score Attribution Chain
**Source:** KingOfOpera
**Context:** Party games where the player who caused a fall should get credit
**Pattern:** Use a LastAttackerId chain: (1) PlayerHitEvent → ScoreManager records last attacker on victim, (2) PlayerFellOffEvent → ScoreManager credits LastAttackerId with knock-off points. This cleanly separates hit detection from fall attribution.
**When to use:** Games with indirect causation chains (A hits B, B falls off, A gets credit).

### Full-Code Agent Prompts (Unity)
**Source:** KingOfOpera
**Context:** Unity CLI-only development where agents can't compile or test
**Pattern:** Provide complete implementation code in agent prompts rather than just specifications. Agents write files with minimal exploration. This produces consistent, correct output in a single pass because agents can't run/test Unity code from CLI.
**Trade-off:** Higher prompt token cost, but dramatically faster execution and fewer retries.
**When to use:** Unity projects where agents cannot verify their output via compilation/tests.

### Centralized Git for Parallel Agents
**Source:** KingOfOpera (evolved from FlappyKookaburra lesson)
**Context:** Multiple agents writing files in parallel on the same repo
**Pattern:** Agents only write files — no git operations. The orchestrator commits after each batch completes. This eliminates branch contention entirely. Combined with file-conflict detection before batching (tasks in same batch must create distinct files).
**When to use:** Always when running parallel agents on a single git repo.

---

## Anti-Patterns (What NOT to Do)

### Generic Agent Prompts
**Problem:** "You are a helpful coding assistant" produces inconsistent results.
**Fix:** Include specific file paths, schemas, code examples, and conventions.

### Over-Constraining Dependencies
**Problem:** Making every task depend on the previous one creates serial execution.
**Fix:** Only add dependencies where there's a real data/API dependency.

### Skipping Quality Gates
**Problem:** Marking tasks DONE without validation leads to cascading failures.
**Fix:** Always run typecheck + tests before marking DONE.

### Monolithic Tasks
**Problem:** Tasks that take hours with dozens of subtasks are hard to parallelize.
**Fix:** Break into 15-60 minute tasks with clear boundaries.

### Parallel Agents on Shared Git Working Directory
**Source:** FlappyKookaburra
**Problem:** Multiple agents running `git checkout` in the same repo directory interfere with each other's branch state. Agent A checks out its branch, then Agent B's bash call runs on Agent A's branch instead of its own.
**Fix:** Use single-command chains (`git checkout X && git add && git commit`) to minimize race windows. Better: use `git worktree` to give each agent an isolated working directory. Best: sequence agents that modify different branches.

### Sprite-Physics Size Mismatch (Unity)
**Source:** FlappyKookaburra
**Problem:** Code assumes sprite dimensions that don't match actual assets. `ObstaclePair._pipeHeight = 20f` but the placeholder pipe sprite is only 4 world units tall (32×256px at 64ppu). Pipes get positioned entirely offscreen, making obstacles invisible.
**Fix:** When creating placeholder sprites in an editor setup script, always scale transforms to match physics constants. Add comments linking sprite dimensions to the physics values they must match. Consider adding runtime assertions: `Debug.Assert(spriteRenderer.bounds.size.y >= _pipeHeight)`.

### Marking Editor-Only Tasks as Done
**Source:** FlappyKookaburra
**Problem:** Unity tasks requiring Editor operations (sprite import, animation clips, WebGL build) are marked DONE when only code infrastructure exists. Binary assets are missing.
**Fix:** Split tasks into explicit "code" and "editor" subtasks. Tag editor-required subtasks. Use `DONE*` convention with clear notes about what remains.

### Assembly Definition (.asmdef) Isolation Gaps
**Source:** FlappyKookaburra (Phase 5-6)
**Problem:** Adding new code directories (e.g., `Assets/Plugins/DOTween/`) without creating a matching `.asmdef` causes CS0246 "namespace not found" errors when existing assemblies try to reference the new code. The new code is invisible across assembly boundaries.
**Fix:** When adding any new code directory that will be referenced by existing assemblies: (1) create a `.asmdef` in the new directory, (2) add it to the `references` list of all consuming `.asmdef` files. Always verify assembly references after adding new directories.

### Opaque Placeholder Sprites
**Source:** FlappyKookaburra (Phase 5-6)
**Problem:** CLI-generated placeholder sprites created as solid-color rectangles appear as opaque blocks in-game, obscuring other sprites and looking obviously broken.
**Fix:** Generate placeholder sprites with transparency and approximate shapes (ellipse for organic objects, rounded rectangle for UI elements). Use RGBA32 format with alpha channel. Fill only the shape interior, leave exterior pixels transparent.

### Complex Art Rig Before Art Exists
**Source:** FlappyKookaburra (Phase 5-6)
**Problem:** Building a 5-part bird rig (body, 2 wings, tail, eye) with rotation-based animation before knowing the final art format. When real art arrived as a single sprite, the entire rig was scrapped in favor of simple scale animation.
**Fix:** Implement the simplest viable animation first (scale-based squash/stretch). Only upgrade to complex rigs (multi-part, rotation-based) after confirming that decomposed art assets are available. Design the code to support both paths via strategy pattern or component swapping.

### Stale Task Board
**Source:** ChatAgent v2
**Problem:** All 80 v2 tasks remained PENDING in the task board until final sync, even though 15 batches had been committed. Anyone checking the board would think no work was done.
**Fix:** Update task statuses after each batch commit. If using batch execution, mark all tasks in the batch as DONE in the same session. Consider automating this via a post-commit hook or a `/sync-docs tasks` command.

### Test Files in Production Build
**Source:** ChatAgent v2
**Problem:** Test files using `import.meta.url` or Vitest-specific imports caused TypeScript compilation errors (`TS1470: 'import.meta' not allowed in CommonJS output`) when included in the production tsconfig.
**Fix:** Exclude test files from all workspace tsconfigs from the start: `"exclude": ["*.test.ts", "src/**/*.test.ts"]`. Vitest uses its own config and doesn't need these tsconfigs. Establish this pattern in the project scaffold, not as a retroactive fix.

### PPU (Pixels Per Unit) Assumptions
**Source:** FlappyKookaburra (Phase 5-6)
**Problem:** Real pixel art assets (784×1168px) imported at default PPU 100 result in sprites 7-8 world units wide — far too large for a game with camera orthographic size 5. PPU cannot be reliably set from CLI.
**Fix:** (1) Document expected PPU values in known-issues and task specs. (2) Include PPU tuning as an explicit Editor-only subtask. (3) Consider adding runtime size assertions: `Debug.Assert(sr.bounds.size.x < maxExpectedSize)`. (4) Design GameSetup.cs to apply transform scale as a fallback when PPU can't be changed programmatically.
