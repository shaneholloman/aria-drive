---
name: drive:new-milestone
description: Start a new milestone cycle -- update project.md and route to requirements
argument-hint: "[milestone name, e.g., 'v1.1 Notifications']"
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - AskUserQuestion
---

# New Milestone

<objective>
Start a new milestone through unified flow: questioning -> research (optional) -> requirements -> roadmap.

This is the brownfield equivalent of new-project. The project exists, project.md has history. This command gathers "what's next", updates project.md, then continues through the full requirements -> roadmap cycle.

**Creates/Updates:**

- `.planning/project.md` -- updated with new milestone goals
- `.planning/research/` -- domain research (optional, focuses on NEW features)
- `.planning/requirements.md` -- scoped requirements for this milestone
- `.planning/roadmap.md` -- phase structure (continues numbering)
- `.planning/state.md` -- reset for new milestone

**After this command:** Run `/drive:plan-phase [N]` to start execution.
</objective>

<execution_context>
@~/.claude/drive/references/questioning.md
@~/.claude/drive/references/ui-brand.md
@~/.claude/drive/templates/project.md
@~/.claude/drive/templates/requirements.md
</execution_context>

<context>
Milestone name: $ARGUMENTS (optional - will prompt if not provided)

**Load project context:**
@.planning/project.md
@.planning/state.md
@.planning/milestones.md
@.planning/config.json

**Load milestone context (if exists):**
@.planning/MILESTONE-context.md
</context>

<process>

## Phase 1: Load Context

- Read project.md (existing project, Validated requirements, decisions)
- Read milestones.md (what shipped previously)
- Read state.md (pending todos, blockers)
- Check for MILESTONE-context.md (if user pre-created it)

## Phase 2: Gather Milestone Goals

**If MILESTONE-context.md exists:**

- Use features and scope from context file
- Present summary for confirmation

**If no context file:**

- Present what shipped in last milestone
- Ask: "What do you want to build next?"
- Use AskUserQuestion to explore features
- Probe for priorities, constraints, scope

## Phase 3: Determine Milestone Version

- Parse last version from milestones.md
- Suggest next version (v1.0 -> v1.1, or v2.0 for major)
- Confirm with user

## Phase 4: Update project.md

Add/update these sections:

```markdown
## Current Milestone: v[X.Y] [Name]

**Goal:** [One sentence describing milestone focus]

**Target features:**
- [Feature 1]
- [Feature 2]
- [Feature 3]
```

Update Active requirements section with new goals.

Update "Last updated" footer.

## Phase 5: Update state.md

```markdown
## Current Position

Phase: Not started (defining requirements)
Plan: --
Status: Defining requirements
Last activity: [today] -- Milestone v[X.Y] started
```

Keep Accumulated Context section (decisions, blockers) from previous milestone.

## Phase 6: Cleanup and Commit

Delete MILESTONE-context.md if exists (consumed).

Check planning config:

```sh
COMMIT_PLANNING_DOCS=$(cat .planning/config.json 2>/dev/null | grep -o '"commit_docs"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
git check-ignore -q .planning 2>/dev/null && COMMIT_PLANNING_DOCS=false
```

If `COMMIT_PLANNING_DOCS=false`: Skip git operations

If `COMMIT_PLANNING_DOCS=true` (default):

```sh
git add .planning/project.md .planning/state.md
git commit -m "docs: start milestone v[X.Y] [Name]"
```

## Phase 6.5: Resolve Model Profile

Read model profile for agent spawning:

```sh
MODEL_PROFILE=$(cat .planning/config.json 2>/dev/null | grep -o '"model_profile"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -o '"[^"]*"$' | tr -d '"' || echo "balanced")
```

Default to "balanced" if not set.

**Model lookup table:**

| Agent                      | quality | balanced | budget |
| -------------------------- | ------- | -------- | ------ |
| drive-project-researcher   | opus    | sonnet   | haiku  |
| drive-research-synthesizer | sonnet  | sonnet   | haiku  |
| drive-roadmapper           | opus    | sonnet   | sonnet |

Store resolved models for use in Task calls below.

## Phase 7: Research Decision

Use AskUserQuestion:

- header: "Research"
- question: "Research the domain ecosystem for new features before defining requirements?"
- options:
  - "Research first (Recommended)" -- Discover patterns, expected features, architecture for NEW capabilities
  - "Skip research" -- I know what I need, go straight to requirements

**If "Research first":**

Display stage banner:

```sh
---
Aria Drive > RESEARCHING
---

Researching [new features] ecosystem...
```

Create research directory:

```sh
mkdir -p .planning/research
```

Display spawning indicator:

```
> Spawning 4 researchers in parallel...
  -> Stack research (for new features)
  -> Features research
  -> Architecture research (integration)
  -> Pitfalls research
```

Spawn 4 parallel drive-project-researcher agents with milestone-aware context:

```
Task(prompt="
<research_type>
Project Research -- Stack dimension for [new features].
</research_type>

<milestone_context>
SUBSEQUENT MILESTONE -- Adding [target features] to existing app.

Existing validated capabilities (DO NOT re-research):
[List from project.md Validated requirements]

Focus ONLY on what's needed for the NEW features.
</milestone_context>

<question>
What stack additions/changes are needed for [new features]?
</question>

<project_context>
[project.md summary - current state, new milestone goals]
</project_context>

<downstream_consumer>
Your stack.md feeds into roadmap creation. Be prescriptive:
- Specific libraries with versions for NEW capabilities
- Integration points with existing stack
- What NOT to add and why
</downstream_consumer>

<quality_gate>
- [ ] Versions are current (verify with Context7/official docs, not training data)
- [ ] Rationale explains WHY, not just WHAT
- [ ] Integration with existing stack considered
</quality_gate>

<output>
Write to: .planning/research/stack.md
Use template: ~/.claude/drive/templates/research-project/stack.md
</output>
", subagent_type="drive-project-researcher", model="{researcher_model}", description="Stack research")

Task(prompt="
<research_type>
Project Research -- Features dimension for [new features].
</research_type>

<milestone_context>
SUBSEQUENT MILESTONE -- Adding [target features] to existing app.

Existing features (already built):
[List from project.md Validated requirements]

Focus on how [new features] typically work, expected behavior.
</milestone_context>

<question>
How do [target features] typically work? What's expected behavior?
</question>

<project_context>
[project.md summary - new milestone goals]
</project_context>

<downstream_consumer>
Your features.md feeds into requirements definition. Categorize clearly:
- Table stakes (must have for these features)
- Differentiators (competitive advantage)
- Anti-features (things to deliberately NOT build)
</downstream_consumer>

<quality_gate>
- [ ] Categories are clear (table stakes vs differentiators vs anti-features)
- [ ] Complexity noted for each feature
- [ ] Dependencies on existing features identified
</quality_gate>

<output>
Write to: .planning/research/features.md
Use template: ~/.claude/drive/templates/research-project/features.md
</output>
", subagent_type="drive-project-researcher", model="{researcher_model}", description="Features research")

Task(prompt="
<research_type>
Project Research -- Architecture dimension for [new features].
</research_type>

<milestone_context>
SUBSEQUENT MILESTONE -- Adding [target features] to existing app.

Existing architecture:
[Summary from project.md or codebase map]

Focus on how [new features] integrate with existing architecture.
</milestone_context>

<question>
How do [target features] integrate with existing [domain] architecture?
</question>

<project_context>
[project.md summary - current architecture, new features]
</project_context>

<downstream_consumer>
Your architecture.md informs phase structure in roadmap. Include:
- Integration points with existing components
- New components needed
- Data flow changes
- Suggested build order
</downstream_consumer>

<quality_gate>
- [ ] Integration points clearly identified
- [ ] New vs modified components explicit
- [ ] Build order considers existing dependencies
</quality_gate>

<output>
Write to: .planning/research/architecture.md
Use template: ~/.claude/drive/templates/research-project/architecture.md
</output>
", subagent_type="drive-project-researcher", model="{researcher_model}", description="Architecture research")

Task(prompt="
<research_type>
Project Research -- Pitfalls dimension for [new features].
</research_type>

<milestone_context>
SUBSEQUENT MILESTONE -- Adding [target features] to existing app.

Focus on common mistakes when ADDING these features to an existing system.
</milestone_context>

<question>
What are common mistakes when adding [target features] to [domain]?
</question>

<project_context>
[project.md summary - current state, new features]
</project_context>

<downstream_consumer>
Your pitfalls.md prevents mistakes in roadmap/planning. For each pitfall:
- Warning signs (how to detect early)
- Prevention strategy (how to avoid)
- Which phase should address it
</downstream_consumer>

<quality_gate>
- [ ] Pitfalls are specific to adding these features (not generic)
- [ ] Integration pitfalls with existing system covered
- [ ] Prevention strategies are actionable
</quality_gate>

<output>
Write to: .planning/research/pitfalls.md
Use template: ~/.claude/drive/templates/research-project/pitfalls.md
</output>
", subagent_type="drive-project-researcher", model="{researcher_model}", description="Pitfalls research")
```

After all 4 agents complete, spawn synthesizer to create summary.md:

```
Task(prompt="
<task>
Synthesize research outputs into summary.md.
</task>

<research_files>
Read these files:
- .planning/research/stack.md
- .planning/research/features.md
- .planning/research/architecture.md
- .planning/research/pitfalls.md
</research_files>

<output>
Write to: .planning/research/summary.md
Use template: ~/.claude/drive/templates/research-project/summary.md
Commit after writing.
</output>
", subagent_type="drive-research-synthesizer", model="{synthesizer_model}", description="Synthesize research")
```

Display research complete banner and key findings:

```sh
---
Aria Drive > RESEARCH COMPLETE ✓
---

## Key Findings

**Stack additions:** [from summary.md]
**New feature table stakes:** [from summary.md]
**Watch Out For:** [from summary.md]

Files: `.planning/research/`
```

**If "Skip research":** Continue to Phase 8.

## Phase 8: Define Requirements

Display stage banner:

```sh
---
Aria Drive > DEFINING REQUIREMENTS
---
```

**Load context:**

Read project.md and extract:

- Core value (the ONE thing that must work)
- Current milestone goals
- Validated requirements (what already exists)

**If research exists:** Read research/features.md and extract feature categories.

**Present features by category:**

```
Here are the features for [new capabilities]:

## [Category 1]
**Table stakes:**
- Feature A
- Feature B

**Differentiators:**
- Feature C
- Feature D

**Research notes:** [any relevant notes]

---

## [Next Category]
...
```

**If no research:** Gather requirements through conversation instead.

Ask: "What are the main things users need to be able to do with [new features]?"

For each capability mentioned:

- Ask clarifying questions to make it specific
- Probe for related capabilities
- Group into categories

**Scope each category:**

For each category, use AskUserQuestion:

- header: "[Category name]"
- question: "Which [category] features are in this milestone?"
- multiSelect: true
- options:
  - "[Feature 1]" -- [brief description]
  - "[Feature 2]" -- [brief description]
  - "[Feature 3]" -- [brief description]
  - "None for this milestone" -- Defer entire category

Track responses:

- Selected features -> this milestone's requirements
- Unselected table stakes -> future milestone
- Unselected differentiators -> out of scope

**Identify gaps:**

Use AskUserQuestion:

- header: "Additions"
- question: "Any requirements research missed? (Features specific to your vision)"
- options:
  - "No, research covered it" -- Proceed
  - "Yes, let me add some" -- Capture additions

**Generate requirements.md:**

Create `.planning/requirements.md` with:

- v1 Requirements for THIS milestone grouped by category (checkboxes, REQ-IDs)
- Future Requirements (deferred to later milestones)
- Out of Scope (explicit exclusions with reasoning)
- Traceability section (empty, filled by roadmap)

**REQ-ID format:** `[CATEGORY]-[NUMBER]` (AUTH-01, NOTIF-02)

Continue numbering from existing requirements if applicable.

**Requirement quality criteria:**

Good requirements are:

- **Specific and testable:** "User can reset password via email link" (not "Handle password reset")
- **User-centric:** "User can X" (not "System does Y")
- **Atomic:** One capability per requirement (not "User can login and manage profile")
- **Independent:** Minimal dependencies on other requirements

**Present full requirements list:**

Show every requirement (not counts) for user confirmation:

```
## Milestone v[X.Y] Requirements

### [Category 1]
- [ ] **CAT1-01**: User can do X
- [ ] **CAT1-02**: User can do Y

### [Category 2]
- [ ] **CAT2-01**: User can do Z

[... full list ...]

---

Does this capture what you're building? (yes / adjust)
```

If "adjust": Return to scoping.

**Commit requirements:**

Check planning config (same pattern as Phase 6).

If committing:

```sh
git add .planning/requirements.md
git commit -m "$(cat <<'EOF'
docs: define milestone v[X.Y] requirements

[X] requirements across [N] categories
EOF
)"
```

## Phase 9: Create Roadmap

Display stage banner:

```sh
---
Aria Drive > CREATING ROADMAP
---

> Spawning roadmapper...
```

**Determine starting phase number:**

Read milestones.md to find the last phase number from previous milestone.
New phases continue from there (e.g., if v1.0 ended at phase 5, v1.1 starts at phase 6).

Spawn drive-roadmapper agent with context:

```
Task(prompt="
<planning_context>

**Project:**
@.planning/project.md

**Requirements:**
@.planning/requirements.md

**Research (if exists):**
@.planning/research/summary.md

**Config:**
@.planning/config.json

**Previous milestone (for phase numbering):**
@.planning/milestones.md

</planning_context>

<instructions>
Create roadmap for milestone v[X.Y]:
1. Start phase numbering from [N] (continues from previous milestone)
2. Derive phases from THIS MILESTONE's requirements (don't include validated/existing)
3. Map every requirement to exactly one phase
4. Derive 2-5 success criteria per phase (observable user behaviors)
5. Validate 100% coverage of new requirements
6. Write files immediately (roadmap.md, state.md, update requirements.md traceability)
7. Return ROADMAP CREATED with summary

Write files first, then return. This ensures artifacts persist even if context is lost.
</instructions>
", subagent_type="drive-roadmapper", model="{roadmapper_model}", description="Create roadmap")
```

**Handle roadmapper return:**

**If `## ROADMAP BLOCKED`:**

- Present blocker information
- Work with user to resolve
- Re-spawn when resolved

**If `## ROADMAP CREATED`:**

Read the created roadmap.md and present it nicely inline:

```
---

## Proposed Roadmap

**[N] phases** | **[X] requirements mapped** | All milestone requirements covered ✓

| #     | Phase  | Goal   | Requirements | Success Criteria |
| ----- | ------ | ------ | ------------ | ---------------- |
| [N]   | [Name] | [Goal] | [REQ-IDs]    | [count]          |
| [N+1] | [Name] | [Goal] | [REQ-IDs]    | [count]          |
...

### Phase Details

**Phase [N]: [Name]**
Goal: [goal]
Requirements: [REQ-IDs]
Success criteria:
1. [criterion]
2. [criterion]

[... continue for all phases ...]

---
```

**CRITICAL: Ask for approval before committing:**

Use AskUserQuestion:

- header: "Roadmap"
- question: "Does this roadmap structure work for you?"
- options:
  - "Approve" -- Commit and continue
  - "Adjust phases" -- Tell me what to change
  - "Review full file" -- Show raw roadmap.md

**If "Approve":** Continue to commit.

**If "Adjust phases":**

- Get user's adjustment notes
- Re-spawn roadmapper with revision context:

  ```
  Task(prompt="
  <revision>
  User feedback on roadmap:
  [user's notes]

  Current roadmap.md: @.planning/roadmap.md

  Update the roadmap based on feedback. Edit files in place.
  Return ROADMAP REVISED with changes made.
  </revision>
  ", subagent_type="drive-roadmapper", model="{roadmapper_model}", description="Revise roadmap")
  ```

- Present revised roadmap
- Loop until user approves

**If "Review full file":** Display raw `cat .planning/roadmap.md`, then re-ask.

**Commit roadmap (after approval):**

Check planning config (same pattern as Phase 6).

If committing:

```sh
git add .planning/roadmap.md .planning/state.md .planning/requirements.md
git commit -m "$(cat <<'EOF'
docs: create milestone v[X.Y] roadmap ([N] phases)

Phases:
[N]. [phase-name]: [requirements covered]
[N+1]. [phase-name]: [requirements covered]
...

All milestone requirements mapped to phases.
EOF
)"
```

## Phase 10: Done

Present completion with next steps:

```sh
---
Aria Drive > MILESTONE INITIALIZED ✓
---

**Milestone v[X.Y]: [Name]**

| Artifact     | Location                    |
| ------------ | --------------------------- |
| Project      | `.planning/project.md`      |
| Research     | `.planning/research/`       |
| Requirements | `.planning/requirements.md` |
| Roadmap      | `.planning/roadmap.md`      |

**[N] phases** | **[X] requirements** | Ready to build ✓

---

## > Next Up

**Phase [N]: [Phase Name]** -- [Goal from roadmap.md]

`/drive:discuss-phase [N]` -- gather context and clarify approach

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:plan-phase [N]` -- skip discussion, plan directly

---
```

</process>

<success_criteria>

- [ ] project.md updated with Current Milestone section
- [ ] state.md reset for new milestone
- [ ] MILESTONE-context.md consumed and deleted (if existed)
- [ ] Research completed (if selected) -- 4 parallel agents spawned, milestone-aware
- [ ] Requirements gathered (from research or conversation)
- [ ] User scoped each category
- [ ] requirements.md created with REQ-IDs
- [ ] drive-roadmapper spawned with phase numbering context
- [ ] Roadmap files written immediately (not draft)
- [ ] User feedback incorporated (if any)
- [ ] roadmap.md created with phases continuing from previous milestone
- [ ] All commits made (if planning docs committed)
- [ ] User knows next step is `/drive:discuss-phase [N]`

**Atomic commits:** Each phase commits its artifacts immediately. If context is lost, artifacts persist.
</success_criteria>
