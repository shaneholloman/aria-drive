---
name: drive:help
description: Show available Aria Drive commands and usage guide
---

# Help

<objective>
Display the complete Aria Drive command reference.

Output ONLY the reference content below. Do NOT add:

- Project-specific analysis
- Git status or file context
- Next-step suggestions
- Any commentary beyond the reference
  </objective>

<reference>
# Aria Drive Command Reference

**Aria Drive** (Drive) creates hierarchical project plans optimized for solo agentic development with Claude Code.

## Quick Start

1. `/drive:new-project` - Initialize project (includes research, requirements, roadmap)
2. `/drive:plan-phase 1` - Create detailed plan for first phase
3. `/drive:execute-phase 1` - Execute the phase

## Staying Updated

Aria Drive evolves fast. Update periodically:

```sh
npx aria-drive@latest
```

## Core Flow

```
/drive:new-project -> /drive:plan-phase -> /drive:execute-phase -> repeat
```

### Project Initialization

**`/drive:new-project`**
Initialize new project through unified flow.

One command takes you from idea to ready-for-planning:

- Deep questioning to understand what you're building
- Optional domain research (spawns 4 parallel researcher agents)
- Requirements definition with v1/v2/out-of-scope scoping
- Roadmap creation with phase breakdown and success criteria

Creates all `.planning/` artifacts:

- `project.md` -- vision and requirements
- `config.json` -- flow mode (interactive/yolo)
- `research/` -- domain research (if selected)
- `requirements.md` -- scoped requirements with REQ-IDs
- `roadmap.md` -- phases mapped to requirements
- `state.md` -- project memory

Usage: `/drive:new-project`

**`/drive:map-codebase`**
Map an existing codebase for brownfield projects.

- Analyzes codebase with parallel Explore agents
- Creates `.planning/codebase/` with 7 focused documents
- Covers stack, architecture, structure, conventions, testing, integrations, concerns
- Use before `/drive:new-project` on existing codebases

Usage: `/drive:map-codebase`

### Phase Planning

**`/drive:discuss-phase <number>`**
Help articulate your vision for a phase before planning.

- Captures how you imagine this phase working
- Creates context.md with your vision, essentials, and boundaries
- Use when you have ideas about how something should look/feel

Usage: `/drive:discuss-phase 2`

**`/drive:research-phase <number>`**
Comprehensive ecosystem research for niche/complex domains.

- Discovers standard stack, architecture patterns, pitfalls
- Creates research.md with "how experts build this" knowledge
- Use for 3D, games, audio, shaders, ML, and other specialized domains
- Goes beyond "which library" to ecosystem knowledge

Usage: `/drive:research-phase 3`

**`/drive:list-phase-assumptions <number>`**
See what Claude is planning to do before it starts.

- Shows Claude's intended approach for a phase
- Lets you course-correct if Claude misunderstood your vision
- No files created - conversational output only

Usage: `/drive:list-phase-assumptions 3`

**`/drive:plan-phase <number>`**
Create detailed execution plan for a specific phase.

- Generates `.planning/phases/XX-phase-name/XX-YY-plan.md`
- Breaks phase into concrete, actionable tasks
- Includes verification criteria and success measures
- Multiple plans per phase supported (XX-01, XX-02, etc.)

Usage: `/drive:plan-phase 1`
Result: Creates `.planning/phases/01-foundation/01-01-plan.md`

### Execution

**`/drive:execute-phase <phase-number>`**
Execute all plans in a phase.

- Groups plans by wave (from frontmatter), executes waves sequentially
- Plans within each wave run in parallel via Task tool
- Verifies phase goal after all plans complete
- Updates requirements.md, roadmap.md, state.md

Usage: `/drive:execute-phase 5`

### Quick Mode

**`/drive:quick`**
Execute small, ad-hoc tasks with Aria Drive guarantees but skip optional agents.

Quick mode uses the same system with a shorter path:

- Spawns planner + executor (skips researcher, checker, verifier)
- Quick tasks live in `.planning/quick/` separate from planned phases
- Updates state.md tracking (not roadmap.md)

Use when you know exactly what to do and the task is small enough to not need research or verification.

Usage: `/drive:quick`
Result: Creates `.planning/quick/NNN-slug/plan.md`, `.planning/quick/NNN-slug/summary.md`

### Roadmap Management

**`/drive:add-phase <description>`**
Add new phase to end of current milestone.

- Appends to roadmap.md
- Uses next sequential number
- Updates phase directory structure

Usage: `/drive:add-phase "Add admin dashboard"`

**`/drive:insert-phase <after> <description>`**
Insert urgent work as decimal phase between existing phases.

- Creates intermediate phase (e.g., 7.1 between 7 and 8)
- Useful for discovered work that must happen mid-milestone
- Maintains phase ordering

Usage: `/drive:insert-phase 7 "Fix critical auth bug"`
Result: Creates Phase 7.1

**`/drive:remove-phase <number>`**
Remove a future phase and renumber subsequent phases.

- Deletes phase directory and all references
- Renumbers all subsequent phases to close the gap
- Only works on future (unstarted) phases
- Git commit preserves historical record

Usage: `/drive:remove-phase 17`
Result: Phase 17 deleted, phases 18-20 become 17-19

### Milestone Management

**`/drive:new-milestone <name>`**
Start a new milestone through unified flow.

- Deep questioning to understand what you're building next
- Optional domain research (spawns 4 parallel researcher agents)
- Requirements definition with scoping
- Roadmap creation with phase breakdown

Mirrors `/drive:new-project` flow for brownfield projects (existing project.md).

Usage: `/drive:new-milestone "v2.0 Features"`

**`/drive:complete-milestone <version>`**
Archive completed milestone and prepare for next version.

- Creates milestones.md entry with stats
- Archives full details to milestones/ directory
- Creates git tag for the release
- Prepares workspace for next version

Usage: `/drive:complete-milestone 1.0.0`

### Progress Tracking

**`/drive:progress`**
Check project status and intelligently route to next action.

- Shows visual progress bar and completion percentage
- Summarizes recent work from SUMMARY files
- Displays current position and what's next
- Lists key decisions and open issues
- Offers to execute next plan or create it if missing
- Detects 100% milestone completion

Usage: `/drive:progress`

### Session Management

**`/drive:resume-work`**
Resume work from previous session with full context restoration.

- Reads state.md for project context
- Shows current position and recent progress
- Offers next actions based on project state

Usage: `/drive:resume-work`

**`/drive:pause-work`**
Create context handoff when pausing work mid-phase.

- Creates .continue-here file with current state
- Updates state.md session continuity section
- Captures in-progress work context

Usage: `/drive:pause-work`

### Debugging

**`/drive:debug [issue description]`**
Systematic debugging with persistent state across context resets.

- Gathers symptoms through adaptive questioning
- Creates `.planning/debug/[slug].md` to track investigation
- Investigates using scientific method (evidence -> hypothesis -> test)
- Survives `/clear` -- run `/drive:debug` with no args to resume
- Archives resolved issues to `.planning/debug/resolved/`

Usage: `/drive:debug "login button doesn't work"`
Usage: `/drive:debug` (resume active session)

### Todo Management

**`/drive:add-todo [description]`**
Capture idea or task as todo from current conversation.

- Extracts context from conversation (or uses provided description)
- Creates structured todo file in `.planning/todos/pending/`
- Infers area from file paths for grouping
- Checks for duplicates before creating
- Updates state.md todo count

Usage: `/drive:add-todo` (infers from conversation)
Usage: `/drive:add-todo Add auth token refresh`

**`/drive:check-todos [area]`**
List pending todos and select one to work on.

- Lists all pending todos with title, area, age
- Optional area filter (e.g., `/drive:check-todos api`)
- Loads full context for selected todo
- Routes to appropriate action (work now, add to phase, brainstorm)
- Moves todo to done/ when work begins

Usage: `/drive:check-todos`
Usage: `/drive:check-todos api`

### User Acceptance Testing

**`/drive:verify-work [phase]`**
Validate built features through conversational UAT.

- Extracts testable deliverables from summary.md files
- Presents tests one at a time (yes/no responses)
- Automatically diagnoses failures and creates fix plans
- Ready for re-execution if issues found

Usage: `/drive:verify-work 3`

### Milestone Auditing

**`/drive:audit-milestone [version]`**
Audit milestone completion against original intent.

- Reads all phase verification.md files
- Checks requirements coverage
- Spawns integration checker for cross-phase wiring
- Creates MILESTONE-audit.md with gaps and tech debt

Usage: `/drive:audit-milestone`

**`/drive:plan-milestone-gaps`**
Create phases to close gaps identified by audit.

- Reads MILESTONE-audit.md and groups gaps into phases
- Prioritizes by requirement priority (must/should/nice)
- Adds gap closure phases to roadmap.md
- Ready for `/drive:plan-phase` on new phases

Usage: `/drive:plan-milestone-gaps`

### Configuration

**`/drive:settings`**
Configure flow toggles and model profile interactively.

- Toggle researcher, plan checker, verifier agents
- Select model profile (quality/balanced/budget)
- Updates `.planning/config.json`

Usage: `/drive:settings`

**`/drive:set-profile <profile>`**
Quick switch model profile for Aria Drive agents.

- `quality` -- Opus everywhere except verification
- `balanced` -- Opus for planning, Sonnet for execution (default)
- `budget` -- Sonnet for writing, Haiku for research/verification

Usage: `/drive:set-profile budget`

### Utility Commands

**`/drive:help`**
Show this command reference.

**`/drive:update`**
Update Aria Drive to latest version with changelog preview.

- Shows installed vs latest version comparison
- Displays changelog entries for versions you've missed
- Highlights breaking changes
- Confirms before running install
- Better than raw `npx aria-drive`

Usage: `/drive:update`

**`/drive:join-discord`**
Join the Aria Drive Discord community.

- Get help, share what you're building, stay updated
- Connect with other Aria Drive users

Usage: `/drive:join-discord`

## Files & Structure

```
.planning/
|-------- project.md            # Project vision
|-------- roadmap.md            # Current phase breakdown
|-------- state.md              # Project memory & context
|-------- config.json           # Flow mode & gates
|-------- todos/                # Captured ideas and tasks
|   |-------- pending/          # Todos waiting to be worked on
|   `-------- done/             # Completed todos
|-------- debug/                # Active debug sessions
|   `-------- resolved/         # Archived resolved issues
|-------- codebase/             # Codebase map (brownfield projects)
|   |-------- stack.md          # Languages, frameworks, dependencies
|   |-------- architecture.md   # Patterns, layers, data flow
|   |-------- structure.md      # Directory layout, key files
|   |-------- conventions.md    # Coding standards, naming
|   |-------- testing.md        # Test setup, patterns
|   |-------- integrations.md   # External services, APIs
|   `-------- concerns.md       # Tech debt, known issues
`-------- phases/
    |-------- 01-foundation/
    |   |-------- 01-01-plan.md
    |   `-------- 01-01-summary.md
    `-------- 02-core-features/
        |-------- 02-01-plan.md
        `-------- 02-01-summary.md
```

## Flow Modes

Set during `/drive:new-project`:

**Interactive Mode**

- Confirms each major decision
- Pauses at checkpoints for approval
- More guidance throughout

**YOLO Mode**

- Auto-approves most decisions
- Executes plans without confirmation
- Only stops for critical checkpoints

Change anytime by editing `.planning/config.json`

## Planning Configuration

Configure how planning artifacts are managed in `.planning/config.json`:

**`planning.commit_docs`** (default: `true`)

- `true`: Planning artifacts committed to git (standard flow)
- `false`: Planning artifacts kept local-only, not committed

When `commit_docs: false`:

- Add `.planning/` to your `.gitignore`
- Useful for OSS contributions, client projects, or keeping planning private
- All planning files still work normally, just not tracked in git

**`planning.search_gitignored`** (default: `false`)

- `true`: Add `--no-ignore` to broad ripgrep searches
- Only needed when `.planning/` is gitignored and you want project-wide searches to include it

Example config:

```json
{
  "planning": {
    "commit_docs": false,
    "search_gitignored": true
  }
}
```

## Common flows

**Starting a new project:**

```
/drive:new-project        # Unified flow: questioning -> research -> requirements -> roadmap
/clear
/drive:plan-phase 1       # Create plans for first phase
/clear
/drive:execute-phase 1    # Execute all plans in phase
```

**Resuming work after a break:**

```
/drive:progress  # See where you left off and continue
```

**Adding urgent mid-milestone work:**

```
/drive:insert-phase 5 "Critical security fix"
/drive:plan-phase 5.1
/drive:execute-phase 5.1
```

**Completing a milestone:**

```
/drive:complete-milestone 1.0.0
/clear
/drive:new-milestone  # Start next milestone (questioning -> research -> requirements -> roadmap)
```

**Capturing ideas during work:**

```
/drive:add-todo                    # Capture from conversation context
/drive:add-todo Fix modal z-index  # Capture with explicit description
/drive:check-todos                 # Review and work on todos
/drive:check-todos api             # Filter by area
```

**Debugging an issue:**

```
/drive:debug "form submission fails silently"  # Start debug session
# ... investigation happens, context fills up ...
/clear
/drive:debug                                    # Resume from where you left off
```

## Getting Help

- Read `.planning/project.md` for project vision
- Read `.planning/state.md` for current context
- Check `.planning/roadmap.md` for phase status
- Run `/drive:progress` to check where you're up to
  </reference>
