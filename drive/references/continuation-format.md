# Continuation Format

Standard format for presenting next steps after completing a command or flow.

## Core Structure

```
---

## > Next Up

**{identifier}: {name}** -- {one-line description}

`{command to copy-paste}`

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `{alternative option 1}` -- description
- `{alternative option 2}` -- description

---
```

## Format Rules

1. **Always show what it is** -- name + description, never just a command path
2. **Pull context from source** -- roadmap.md for phases, plan.md `<objective>` for plans
3. **Command in inline code** -- backticks, easy to copy-paste, renders as clickable link
4. **`/clear` explanation** -- always include, keeps it concise but explains why
5. **"Also available" not "Other options"** -- sounds more app-like
6. **Visual separators** -- `---` above and below to make it stand out

## Variants

### Execute Next Plan

```
---

## > Next Up

**02-03: Refresh Token Rotation** -- Add /api/auth/refresh with sliding expiry

`/drive:execute-phase 2`

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- Review plan before executing
- `/drive:list-phase-assumptions 2` -- check assumptions

---
```

### Execute Final Plan in Phase

Add note that this is the last plan and what comes after:

```
---

## > Next Up

**02-03: Refresh Token Rotation** -- Add /api/auth/refresh with sliding expiry
<sub>Final plan in Phase 2</sub>

`/drive:execute-phase 2`

<sub>`/clear` first -> fresh context window</sub>

---

**After this completes:**
- Phase 2 -> Phase 3 transition
- Next: **Phase 3: Core Features** -- User dashboard and settings

---
```

### Plan a Phase

```
---

## > Next Up

**Phase 2: Authentication** -- JWT login flow with refresh tokens

`/drive:plan-phase 2`

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:discuss-phase 2` -- gather context first
- `/drive:research-phase 2` -- investigate unknowns
- Review roadmap

---
```

### Phase Complete, Ready for Next

Show completion status before next action:

```
---

## ✓ Phase 2 Complete

3/3 plans executed

## > Next Up

**Phase 3: Core Features** -- User dashboard, settings, and data export

`/drive:plan-phase 3`

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:discuss-phase 3` -- gather context first
- `/drive:research-phase 3` -- investigate unknowns
- Review what Phase 2 built

---
```

### Multiple Equal Options

When there's no clear primary action:

```
---

## > Next Up

**Phase 3: Core Features** -- User dashboard, settings, and data export

**To plan directly:** `/drive:plan-phase 3`

**To discuss context first:** `/drive:discuss-phase 3`

**To research unknowns:** `/drive:research-phase 3`

<sub>`/clear` first -> fresh context window</sub>

---
```

### Milestone Complete

```
---

##  Milestone v1.0 Complete

All 4 phases shipped

## > Next Up

**Start v1.1** -- questioning -> research -> requirements -> roadmap

`/drive:new-milestone`

<sub>`/clear` first -> fresh context window</sub>

---
```

## Pulling Context

### For phases (from roadmap.md)

```markdown
### Phase 2: Authentication
**Goal**: JWT login flow with refresh tokens
```

Extract: `**Phase 2: Authentication** -- JWT login flow with refresh tokens`

### For plans (from roadmap.md)

```markdown
Plans:
- [ ] 02-03: Add refresh token rotation
```

Or from plan.md `<objective>`:

```xml
<objective>
Add refresh token rotation with sliding expiry window.

Purpose: Extend session lifetime without compromising security.
</objective>
```

Extract: `**02-03: Refresh Token Rotation** -- Add /api/auth/refresh with sliding expiry`

## Anti-Patterns

### Don't: Command-only (no context)

```
## To Continue

Run `/clear`, then paste:
/drive:execute-phase 2
```

User has no idea what 02-03 is about.

### Don't: Missing /clear explanation

```
`/drive:plan-phase 3`

Run /clear first.
```

Doesn't explain why. User might skip it.

### Don't: "Other options" language

```
Other options:
- Review roadmap
```

Sounds like an afterthought. Use "Also available:" instead.

### Don't: Fenced code blocks for commands

```
```

/drive:plan-phase 3

```
```

Fenced blocks inside templates create nesting ambiguity. Use inline backticks instead.
