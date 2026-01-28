---
name: drive:progress
description: Check project progress, show context, and route to next action (execute or plan)
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - SlashCommand
---

# Progress

<objective>
Check project progress, summarize recent work and what's ahead, then intelligently route to the next action - either executing an existing plan or creating the next one.

Provides situational awareness before continuing work.
</objective>

<process>

<step name="verify">
**Verify planning structure exists:**

Use Bash (not Glob) to check--Glob respects .gitignore but .planning/ is often gitignored:

```sh
test -d .planning && echo "exists" || echo "missing"
```

If no `.planning/` directory:

```
No planning structure found.

Run /drive:new-project to start a new project.
```

Exit.

If missing state.md: suggest `/drive:new-project`.

**If roadmap.md missing but project.md exists:**

This means a milestone was completed and archived. Go to **Route F** (between milestones).

If missing both roadmap.md and project.md: suggest `/drive:new-project`.
</step>

<step name="load">
**Load full project context:**

- Read `.planning/state.md` for living memory (position, decisions, issues)
- Read `.planning/roadmap.md` for phase structure and objectives
- Read `.planning/project.md` for current state (What This Is, Core Value, Requirements)
- Read `.planning/config.json` for settings (model_profile, flow toggles)
  </step>

<step name="recent">
**Gather recent work context:**

- Find the 2-3 most recent summary.md files
- Extract from each: what was accomplished, key decisions, any issues logged
- This shows "what we've been working on"
  </step>

<step name="position">
**Parse current position:**

- From state.md: current phase, plan number, status
- Calculate: total plans, completed plans, remaining plans
- Note any blockers or concerns
- Check for context.md: For phases without plan.md files, check if `{phase}-context.md` exists in phase directory
- Count pending todos: `ls .planning/todos/pending/*.md 2>/dev/null | wc -l`
- Check for active debug sessions: `ls .planning/debug/*.md 2>/dev/null | grep -v resolved | wc -l`
  </step>

<step name="report">
**Present rich status report:**

```
# [Project Name]

**Progress:** [########..] 8/10 plans complete
**Profile:** [quality/balanced/budget]

## Recent Work
- [Phase X, Plan Y]: [what was accomplished - 1 line]
- [Phase X, Plan Z]: [what was accomplished - 1 line]

## Current Position
Phase [N] of [total]: [phase-name]
Plan [M] of [phase-total]: [status]
CONTEXT: [✓ if context.md exists | - if not]

## Key Decisions Made
- [decision 1 from state.md]
- [decision 2]

## Blockers/Concerns
- [any blockers or concerns from state.md]

## Pending Todos
- [count] pending -- /drive:check-todos to review

## Active Debug Sessions
- [count] active -- /drive:debug to continue
(Only show this section if count > 0)

## What's Next
[Next phase/plan objective from ROADMAP]
```

</step>

<step name="route">
**Determine next action based on verified counts.**

**Step 1: Count plans, summaries, and issues in current phase**

List files in the current phase directory:

```sh
ls -1 .planning/phases/[current-phase-dir]/*-plan.md 2>/dev/null | wc -l
ls -1 .planning/phases/[current-phase-dir]/*-summary.md 2>/dev/null | wc -l
ls -1 .planning/phases/[current-phase-dir]/*-uat.md 2>/dev/null | wc -l
```

State: "This phase has {X} plans, {Y} summaries."

**Step 1.5: Check for unaddressed UAT gaps**

Check for uat.md files with status "diagnosed" (has gaps needing fixes).

```sh
# Check for diagnosed UAT with gaps
grep -l "status: diagnosed" .planning/phases/[current-phase-dir]/*-uat.md 2>/dev/null
```

Track:

- `uat_with_gaps`: uat.md files with status "diagnosed" (gaps need fixing)

**Step 2: Route based on counts**

| Condition                       | Meaning                 | Action            |
| ------------------------------- | ----------------------- | ----------------- |
| uat_with_gaps > 0               | UAT gaps need fix plans | Go to **Route E** |
| summaries < plans               | Unexecuted plans exist  | Go to **Route A** |
| summaries = plans AND plans > 0 | Phase complete          | Go to Step 3      |
| plans = 0                       | Phase not yet planned   | Go to **Route B** |

---

**Route A: Unexecuted plan exists**

Find the first plan.md without matching summary.md.
Read its `<objective>` section.

```
---

## > Next Up

**{phase}-{plan}: [Plan Name]** -- [objective summary from plan.md]

`/drive:execute-phase {phase}`

<sub>`/clear` first -> fresh context window</sub>

---
```

---

**Route B: Phase needs planning**

Check if `{phase}-context.md` exists in phase directory.

**If context.md exists:**

```
---

## > Next Up

**Phase {N}: {Name}** -- {Goal from roadmap.md}
<sub>✓ Context gathered, ready to plan</sub>

`/drive:plan-phase {phase-number}`

<sub>`/clear` first -> fresh context window</sub>

---
```

**If context.md does NOT exist:**

```
---

## > Next Up

**Phase {N}: {Name}** -- {Goal from roadmap.md}

`/drive:discuss-phase {phase}` -- gather context and clarify approach

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:plan-phase {phase}` -- skip discussion, plan directly
- `/drive:list-phase-assumptions {phase}` -- see Claude's assumptions

---
```

---

**Route E: UAT gaps need fix plans**

uat.md exists with gaps (diagnosed issues). User needs to plan fixes.

```
---

## [!] UAT Gaps Found

**{phase}-uat.md** has {N} gaps requiring fixes.

`/drive:plan-phase {phase} --gaps`

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:execute-phase {phase}` -- execute phase plans
- `/drive:verify-work {phase}` -- run more UAT testing

---
```

---

**Step 3: Check milestone status (only when phase complete)**

Read roadmap.md and identify:

1. Current phase number
2. All phase numbers in the current milestone section

Count total phases and identify the highest phase number.

State: "Current phase is {X}. Milestone has {N} phases (highest: {Y})."

**Route based on milestone status:**

| Condition                     | Meaning            | Action            |
| ----------------------------- | ------------------ | ----------------- |
| current phase < highest phase | More phases remain | Go to **Route C** |
| current phase = highest phase | Milestone complete | Go to **Route D** |

---

**Route C: Phase complete, more phases remain**

Read roadmap.md to get the next phase's name and goal.

```
---

## ✓ Phase {Z} Complete

## > Next Up

**Phase {Z+1}: {Name}** -- {Goal from roadmap.md}

`/drive:discuss-phase {Z+1}` -- gather context and clarify approach

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:plan-phase {Z+1}` -- skip discussion, plan directly
- `/drive:verify-work {Z}` -- user acceptance test before continuing

---
```

---

**Route D: Milestone complete**

```
---

##  Milestone Complete

All {N} phases finished!

## > Next Up

**Complete Milestone** -- archive and prepare for next

`/drive:complete-milestone`

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:verify-work` -- user acceptance test before completing milestone

---
```

---

**Route F: Between milestones (roadmap.md missing, project.md exists)**

A milestone was completed and archived. Ready to start the next milestone cycle.

Read milestones.md to find the last completed milestone version.

```
---

## ✓ Milestone v{X.Y} Complete

Ready to plan the next milestone.

## > Next Up

**Start Next Milestone** -- questioning -> research -> requirements -> roadmap

`/drive:new-milestone`

<sub>`/clear` first -> fresh context window</sub>

---
```

</step>

<step name="edge_cases">
**Handle edge cases:**

- Phase complete but next phase not planned -> offer `/drive:plan-phase [next]`
- All work complete -> offer milestone completion
- Blockers present -> highlight before offering to continue
- Handoff file exists -> mention it, offer `/drive:resume-work`
  </step>

</process>

<success_criteria>

- [ ] Rich context provided (recent work, decisions, issues)
- [ ] Current position clear with visual progress
- [ ] What's next clearly explained
- [ ] Smart routing: /drive:execute-phase if plans exist, /drive:plan-phase if not
- [ ] User confirms before any action
- [ ] Seamless handoff to appropriate drive command
      </success_criteria>
