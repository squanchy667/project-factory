# Task Board

## How This Works

Each task has a dedicated spec file in `tasks/` with full context for an autonomous agent to execute it independently. Tasks within a phase can run in parallel unless blocked by dependencies.

### Task Lifecycle
```
PENDING → IN_PROGRESS → IN_REVIEW → DONE
                ↓
            BLOCKED (waiting on dependency)
```

### Agent Assignment
Each task specifies a recommended agent type. When starting work, spin up an agent for each unblocked task and let them work in parallel.

---

{{phases_with_tasks}}

---

## Summary

{{phase_summary}}
