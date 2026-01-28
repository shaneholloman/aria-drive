# Aria Drive

A light-weight and powerful meta-prompting, context engineering and spec-driven development system for Claude Code and OpenCode.

Solves context rot - the quality degradation that happens as Claude fills its context window.

```sh
npx aria-drive
```

**Works on Mac, Windows, and Linux.**

## Why Aria Drive

Other spec-driven development tools exist; You know the names of them... But they all seem to make things way more complicated than they need to be (sprint ceremonies, story points, stakeholder syncs, retrospectives, Jira flows) or lack real big picture understanding of what you're building. I'm not a 50-person software company. I don't want to play enterprise theater. I'm just a creative person trying to build things that work.

The complexity is in the system, not in your flow. Behind the scenes: context engineering, XML prompt formatting, subagent orchestration, state management. What you see: a few commands that just work.

The system gives Claude everything it needs to do the work *and* verify it. I trust the flow. It just does a good job.

That's what this is. No enterprise roleplay bullshit. Just an effective system for building consistently using Claude Code.

## Getting Started

```sh
npx aria-drive
```

The installer prompts you to choose:

1. **Runtime** -- Claude Code, OpenCode, or both
2. **Location** -- Global (all projects) or local (current project only)

Verify with `/drive:help` inside your Claude Code or OpenCode interface.

### Staying Updated

Aria Drive evolves fast. Update periodically:

```sh
npx aria-drive@latest
```

Non-interactive Install (Docker, CI, Scripts)

```sh
# Claude Code
npx aria-drive --claude --global   # Install to ~/.claude/
npx aria-drive --claude --local    # Install to ./.claude/

# OpenCode (open source, free models)
npx aria-drive --opencode --global # Install to ~/.opencode/

# Both runtimes
npx aria-drive --both --global     # Install to both directories
```

Use `--global` (`-g`) or `--local` (`-l`) to skip the location prompt.
Use `--claude`, `--opencode`, or `--both` to skip the runtime prompt.

Development Installation

Clone the repository and run the installer locally:

```sh
git clone https://github.com/shaneholloman/aria-drive.git
cd aria-drive
node bin/install.js --claude --local
```

Installs to `./.claude/` for testing modifications before contributing.

</details>

### Recommended: Skip Permissions Mode

Aria Drive is designed for frictionless automation. Run Claude Code with:

```sh
claude --dangerously-skip-permissions
```

> [!TIP]
> This is how Aria Drive is intended to be used -- stopping to approve `date` and `git commit` 50 times defeats the purpose.

Alternative: Granular Permissions

If you prefer not to use that flag, add this to your project's `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(date:*)",
      "Bash(echo:*)",
      "Bash(cat:*)",
      "Bash(ls:*)",
      "Bash(mkdir:*)",
      "Bash(wc:*)",
      "Bash(head:*)",
      "Bash(tail:*)",
      "Bash(sort:*)",
      "Bash(grep:*)",
      "Bash(tr:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status:*)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git tag:*)"
    ]
  }
}
```

## How It Works

> **Already have code?** Run `/drive:map-codebase` first. It spawns parallel agents to analyze your stack, architecture, conventions, and concerns. Then `/drive:new-project` knows your codebase -- questions focus on what you're adding, and planning automatically loads your patterns.

### 1. Initialize Project

```sh
/drive:new-project
```

One command, one flow. The system:

1. **Questions** -- Asks until it understands your idea completely (goals, constraints, tech preferences, edge cases)
2. **Research** -- Spawns parallel agents to investigate the domain (optional but recommended)
3. **Requirements** -- Extracts what's v1, v2, and out of scope
4. **Roadmap** -- Creates phases mapped to requirements

You approve the roadmap. Now you're ready to build.

**Creates:** `project.md`, `requirements.md`, `roadmap.md`, `state.md`, `.planning/research/`

---

### 2. Discuss Phase

```sh
/drive:discuss-phase 1
```

**This is where you shape the implementation.**

Your roadmap has a sentence or two per phase. That's not enough context to build something the way *you* imagine it. This step captures your preferences before anything gets researched or planned.

The system analyzes the phase and identifies gray areas based on what's being built:

- **Visual features** -> Layout, density, interactions, empty states
- **APIs/CLIs** -> Response format, flags, error handling, verbosity
- **Content systems** -> Structure, tone, depth, flow
- **Organization tasks** -> Grouping criteria, naming, duplicates, exceptions

For each area you select, it asks until you're satisfied. The output -- `context.md` -- feeds directly into the next two steps:

1. **Researcher reads it** -- Knows what patterns to investigate ("user wants card layout" -> research card component libraries)
2. **Planner reads it** -- Knows what decisions are locked ("infinite scroll decided" -> plan includes scroll handling)

The deeper you go here, the more the system builds what you actually want. Skip it and you get reasonable defaults. Use it and you get *your* vision.

**Creates:** `{phase}-context.md`

### 3. Plan Phase

```sh
/drive:plan-phase 1
```

The system:

1. **Researches** -- Investigates how to implement this phase, guided by your context.md decisions
2. **Plans** -- Creates 2-3 atomic task plans with XML structure
3. **Verifies** -- Checks plans against requirements, loops until they pass

Each plan is small enough to execute in a fresh context window. No degradation, no "I'll be more concise now."

**Creates:** `{phase}-research.md`, `{phase}-{N}-plan.md`

### 4. Execute Phase

```sh
/drive:execute-phase 1
```

The system:

1. **Runs plans in waves** -- Parallel where possible, sequential when dependent
2. **Fresh context per plan** -- 200k tokens purely for implementation, zero accumulated garbage
3. **Commits per task** -- Every task gets its own atomic commit
4. **Verifies against goals** -- Checks the codebase delivers what the phase promised

Walk away, come back to completed work with clean git history.

**Creates:** `{phase}-{N}-summary.md`, `{phase}-verification.md`

### 5. Verify Work

```sh
/drive:verify-work 1
```

**This is where you confirm it actually works.**

Automated verification checks that code exists and tests pass. But does the feature *work* the way you expected? This is your chance to use it.

The system:

1. **Extracts testable deliverables** -- What you should be able to do now
2. **Walks you through one at a time** -- "Can you log in with email?" Yes/no, or describe what's wrong
3. **Diagnoses failures automatically** -- Spawns debug agents to find root causes
4. **Creates verified fix plans** -- Ready for immediate re-execution

If everything passes, you move on. If something's broken, you don't manually debug -- you just run `/drive:execute-phase` again with the fix plans it created.

**Creates:** `{phase}-uat.md`, fix plans if issues found

### 6. Repeat -> Complete -> Next Milestone

```sh
/drive:discuss-phase 2
/drive:plan-phase 2
/drive:execute-phase 2
/drive:verify-work 2
...
/drive:complete-milestone
/drive:new-milestone
```

Loop **discuss -> plan -> execute -> verify** until milestone complete.

Each phase gets your input (discuss), proper research (plan), clean execution (execute), and human verification (verify). Context stays fresh. Quality stays high.

When all phases are done, `/drive:complete-milestone` archives the milestone and tags the release.

Then `/drive:new-milestone` starts the next version -- same flow as `new-project` but for your existing codebase. You describe what you want to build next, the system researches the domain, you scope requirements, and it creates a fresh roadmap. Each milestone is a clean cycle: define -> build -> ship.

### Quick Mode

```sh
/drive:quick
```

**For ad-hoc tasks that don't need full planning.**

Quick mode gives you Aria Drive guarantees (atomic commits, state tracking) with a faster path:

- **Same agents** -- Planner + executor, same quality
- **Skips optional steps** -- No research, no plan checker, no verifier
- **Separate tracking** -- Lives in `.planning/quick/`, not phases

Use for: bug fixes, small features, config changes, one-off tasks.

```sh
/drive:quick
> What do you want to do? "Add dark mode toggle to settings"
```

**Creates:** `.planning/quick/001-add-dark-mode-toggle/plan.md`, `summary.md`

## Why It Works

### Context Engineering

Claude Code is incredibly powerful *if* you give it the context it needs. Most people don't.

Aria Drive handles it for you:

| File              | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `project.md`      | Project vision, always loaded                                 |
| `research/`       | Ecosystem knowledge (stack, features, architecture, pitfalls) |
| `requirements.md` | Scoped v1/v2 requirements with phase traceability             |
| `roadmap.md`      | Where you're going, what's done                               |
| `state.md`        | Decisions, blockers, position -- memory across sessions       |
| `plan.md`         | Atomic task with XML structure, verification steps            |
| `summary.md`      | What happened, what changed, committed to history             |
| `todos/`          | Captured ideas and tasks for later work                       |

Size limits based on where Claude's quality degrades. Stay under, get consistent excellence.

### XML Prompt Formatting

Every plan is structured XML optimized for Claude:

```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken - CommonJS issues).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

Precise instructions. No guessing. Verification built in.

### Multi-Agent Orchestration

Every stage uses the same pattern: a thin orchestrator spawns specialized agents, collects results, and routes to the next step.

| Stage        | Orchestrator does                  | Agents do                                                                  |
| ------------ | ---------------------------------- | -------------------------------------------------------------------------- |
| Research     | Coordinates, presents findings     | 4 parallel researchers investigate stack, features, architecture, pitfalls |
| Planning     | Validates, manages iteration       | Planner creates plans, checker verifies, loop until pass                   |
| Execution    | Groups into waves, tracks progress | Executors implement in parallel, each with fresh 200k context              |
| Verification | Presents results, routes next      | Verifier checks codebase against goals, debuggers diagnose failures        |

The orchestrator never does heavy lifting. It spawns agents, waits, integrates results.

**The result:** You can run an entire phase -- deep research, multiple plans created and verified, thousands of lines of code written across parallel executors, automated verification against goals -- and your main context window stays at 30-40%. The work happens in fresh subagent contexts. Your session stays fast and responsive.

### Atomic Git Commits

Each task gets its own commit immediately after completion:

```sh
abc123f docs(08-02): complete user registration plan
def456g feat(08-02): add email confirmation flow
hij789k feat(08-02): implement password hashing
lmn012o feat(08-02): create registration endpoint
```

> [!NOTE]
> **Benefits:** Git bisect finds exact failing task. Each task independently revertable. Clear history for Claude in future sessions. Better observability in AI-automated flow.

Every commit is surgical, traceable, and meaningful.

### Modular by Design

- Add phases to current milestone
- Insert urgent work between phases
- Complete milestones and start fresh
- Adjust plans without rebuilding everything

You're never locked in. The system adapts.

## Commands

### Core Flow

| Command                       | What it does                                                          |
| ----------------------------- | --------------------------------------------------------------------- |
| `/drive:new-project`          | Full initialization: questions -> research -> requirements -> roadmap |
| `/drive:discuss-phase [N]`    | Capture implementation decisions before planning                      |
| `/drive:plan-phase [N]`       | Research + plan + verify for a phase                                  |
| `/drive:execute-phase <N>`    | Execute all plans in parallel waves, verify when complete             |
| `/drive:verify-work [N]`      | Manual user acceptance testing [1]                                    |
| `/drive:audit-milestone`      | Verify milestone achieved its definition of done                      |
| `/drive:complete-milestone`   | Archive milestone, tag release                                        |
| `/drive:new-milestone [name]` | Start next version: questions -> research -> requirements -> roadmap  |

### Navigation

| Command               | What it does                        |
| --------------------- | ----------------------------------- |
| `/drive:progress`     | Where am I? What's next?            |
| `/drive:help`         | Show all commands and usage guide   |
| `/drive:update`       | Update Aria Drive with changelog preview |
| `/drive:join-discord` | Join the Aria Drive Discord community    |

### Brownfield

| Command               | What it does                                 |
| --------------------- | -------------------------------------------- |
| `/drive:map-codebase` | Analyze existing codebase before new-project |

### Phase Management

| Command                             | What it does                                   |
| ----------------------------------- | ---------------------------------------------- |
| `/drive:add-phase`                  | Append phase to roadmap                        |
| `/drive:insert-phase [N]`           | Insert urgent work between phases              |
| `/drive:remove-phase [N]`           | Remove future phase, renumber                  |
| `/drive:list-phase-assumptions [N]` | See Claude's intended approach before planning |
| `/drive:plan-milestone-gaps`        | Create phases to close gaps from audit         |

### Session

| Command              | What it does                           |
| -------------------- | -------------------------------------- |
| `/drive:pause-work`  | Create handoff when stopping mid-phase |
| `/drive:resume-work` | Restore from last session              |

### Utilities

| Command                        | What it does                                   |
| ------------------------------ | ---------------------------------------------- |
| `/drive:settings`              | Configure model profile and flow agents    |
| `/drive:set-profile <profile>` | Switch model profile (quality/balanced/budget) |
| `/drive:add-todo [desc]`       | Capture idea for later                         |
| `/drive:check-todos`           | List pending todos                             |
| `/drive:debug [desc]`          | Systematic debugging with persistent state     |
| `/drive:quick`                 | Execute ad-hoc task with Aria Drive guarantees      |

<sup>[1] Contributed by reddit user OracleGreyBeard</sup>

## Configuration

Aria Drive stores project settings in `.planning/config.json`. Configure during `/drive:new-project` or update later with `/drive:settings`.

### Core Settings

| Setting | Options                              | Default       | What it controls                       |
| ------- | ------------------------------------ | ------------- | -------------------------------------- |
| `mode`  | `yolo`, `interactive`                | `interactive` | Auto-approve vs confirm at each step   |
| `depth` | `quick`, `standard`, `comprehensive` | `standard`    | Planning thoroughness (phases x plans) |

### Model Profiles

Control which Claude model each agent uses. Balance quality vs token spend.

| Profile              | Planning | Execution | Verification |
| -------------------- | -------- | --------- | ------------ |
| `quality`            | Opus     | Opus      | Sonnet       |
| `balanced` (default) | Opus     | Sonnet    | Sonnet       |
| `budget`             | Sonnet   | Sonnet    | Haiku        |

Switch profiles:

```sh
/drive:set-profile budget
```

Or configure via `/drive:settings`.

### Flow Agents

These spawn additional agents during planning/execution. They improve quality but add tokens and time.

| Setting               | Default | What it does                                        |
| --------------------- | ------- | --------------------------------------------------- |
| `flow.research`   | `true`  | Researches domain before planning each phase        |
| `flow.plan_check` | `true`  | Verifies plans achieve phase goals before execution |
| `flow.verifier`   | `true`  | Confirms must-haves were delivered after execution  |

Use `/drive:settings` to toggle these, or override per-invocation:

- `/drive:plan-phase --skip-research`
- `/drive:plan-phase --skip-verify`

### Execution

| Setting                   | Default | What it controls                     |
| ------------------------- | ------- | ------------------------------------ |
| `parallelization.enabled` | `true`  | Run independent plans simultaneously |
| `planning.commit_docs`    | `true`  | Track `.planning/` in git            |

## Troubleshooting

**Commands not found after install?**

- Restart Claude Code to reload slash commands
- Verify files exist in `~/.claude/commands/drive/` (global) or `./.claude/commands/drive/` (local)

**Commands not working as expected?**

- Run `/drive:help` to verify installation
- Re-run `npx aria-drive` to reinstall

**Updating to the latest version?**

```sh
npx aria-drive@latest
```

**Using Docker or containerized environments?**

If file reads fail with tilde paths (`~/.claude/...`), set `CLAUDE_CONFIG_DIR` before installing:

```sh
CLAUDE_CONFIG_DIR=/home/youruser/.claude npx aria-drive --global
```

This ensures absolute paths are used instead of `~` which may not expand correctly in containers.

### Uninstalling

To remove Aria Drive completely:

```sh
# Global installs
npx aria-drive --claude --global --uninstall
npx aria-drive --opencode --global --uninstall

# Local installs (current project)
npx aria-drive --claude --local --uninstall
npx aria-drive --opencode --local --uninstall
```

That removes all `drive` commands, agents, hooks, and settings while preserving your other configurations.
