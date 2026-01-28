---
name: drive:resume-work
description: Resume work from previous session with full context restoration
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
  - SlashCommand
---

# Resume Work

<objective>
Restore complete project context and resume work seamlessly from previous session.

Routes to the resume-project flow which handles:

- state.md loading (or reconstruction if missing)
- Checkpoint detection (.continue-here files)
- Incomplete work detection (PLAN without SUMMARY)
- Status presentation
- Context-aware next action routing
  </objective>

<execution_context>
@~/.claude/drive/flows/resume-project.md
</execution_context>

<process>
**Follow the resume-project flow** from `@~/.claude/drive/flows/resume-project.md`.

The flow handles all resumption logic including:

1. Project existence verification
2. state.md loading or reconstruction
3. Checkpoint and incomplete work detection
4. Visual status presentation
5. Context-aware option offering (checks context.md before suggesting plan vs discuss)
6. Routing to appropriate next command
7. Session continuity updates
   </process>
