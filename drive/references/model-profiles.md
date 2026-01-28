# Model Profiles

Model profiles control which Claude model each Aria Drive agent uses. This allows balancing quality vs token spend.

## Profile Definitions

| Agent                      | `quality` | `balanced` | `budget` |
| -------------------------- | --------- | ---------- | -------- |
| drive-planner              | opus      | opus       | sonnet   |
| drive-roadmapper           | opus      | sonnet     | sonnet   |
| drive-executor             | opus      | sonnet     | sonnet   |
| drive-phase-researcher     | opus      | sonnet     | haiku    |
| drive-project-researcher   | opus      | sonnet     | haiku    |
| drive-research-synthesizer | sonnet    | sonnet     | haiku    |
| drive-debugger             | opus      | sonnet     | sonnet   |
| drive-codebase-mapper      | sonnet    | haiku      | haiku    |
| drive-verifier             | sonnet    | sonnet     | haiku    |
| drive-plan-checker         | sonnet    | sonnet     | haiku    |
| drive-integration-checker  | sonnet    | sonnet     | haiku    |

## Profile Philosophy

**quality** - Maximum reasoning power

- Opus for all decision-making agents
- Sonnet for read-only verification
- Use when: quota available, critical architecture work

**balanced** (default) - Smart allocation

- Opus only for planning (where architecture decisions happen)
- Sonnet for execution and research (follows explicit instructions)
- Sonnet for verification (needs reasoning, not just pattern matching)
- Use when: normal development, good balance of quality and cost

**budget** - Minimal Opus usage

- Sonnet for anything that writes code
- Haiku for research and verification
- Use when: conserving quota, high-volume work, less critical phases

## Resolution Logic

Orchestrators resolve model before spawning:

```
1. Read .planning/config.json
2. Get model_profile (default: "balanced")
3. Look up agent in table above
4. Pass model parameter to Task call
```

## Switching Profiles

Runtime: `/drive:set-profile <profile>`

Per-project default: Set in `.planning/config.json`:

```json
{
  "model_profile": "balanced"
}
```

## Design Rationale

**Why Opus for drive-planner?**
Planning involves architecture decisions, goal decomposition, and task design. This is where model quality has the highest impact.

**Why Sonnet for drive-executor?**
Executors follow explicit plan.md instructions. The plan already contains the reasoning; execution is implementation.

**Why Sonnet (not Haiku) for verifiers in balanced?**
Verification requires goal-backward reasoning - checking if code *delivers* what the phase promised, not just pattern matching. Sonnet handles this well; Haiku may miss subtle gaps.

**Why Haiku for drive-codebase-mapper?**
Read-only exploration and pattern extraction. No reasoning required, just structured output from file contents.
