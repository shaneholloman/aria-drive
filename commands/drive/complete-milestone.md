---
type: prompt
name: drive:complete-milestone
description: Archive completed milestone and prepare for next version
argument-hint: <version>
allowed-tools:
  - Read
  - Write
  - Bash
---

# Complete Milestone

<objective>
Mark milestone {{version}} complete, archive to milestones/, and update roadmap.md and requirements.md.

Purpose: Create historical record of shipped version, archive milestone artifacts (roadmap + requirements), and prepare for next milestone.
Output: Milestone archived (roadmap + requirements), project.md evolved, git tagged.
</objective>

<execution_context>
**Load these files NOW (before proceeding):**

- @~/.claude/drive/flows/complete-milestone.md (main flow)
- @~/.claude/drive/templates/milestone-archive.md (archive template)
  </execution_context>

<context>
**Project files:**
- `.planning/roadmap.md`
- `.planning/requirements.md`
- `.planning/state.md`
- `.planning/project.md`

**User input:**

- Version: {{version}} (e.g., "1.0", "1.1", "2.0")
  </context>

<process>

**Follow complete-milestone.md flow:**

0. **Check for audit:**

   - Look for `.planning/v{{version}}-MILESTONE-audit.md`
   - If missing or stale: recommend `/drive:audit-milestone` first
   - If audit status is `gaps_found`: recommend `/drive:plan-milestone-gaps` first
   - If audit status is `passed`: proceed to step 1

   ```markdown
   ## Pre-flight Check

   {If no v{{version}}-MILESTONE-audit.md:}
   [!] No milestone audit found. Run `/drive:audit-milestone` first to verify
   requirements coverage, cross-phase integration, and E2E flows.

   {If audit has gaps:}
   [!] Milestone audit found gaps. Run `/drive:plan-milestone-gaps` to create
   phases that close the gaps, or proceed anyway to accept as tech debt.

   {If audit passed:}
   ✓ Milestone audit passed. Proceeding with completion.
   ```

1. **Verify readiness:**

   - Check all phases in milestone have completed plans (summary.md exists)
   - Present milestone scope and stats
   - Wait for confirmation

2. **Gather stats:**

   - Count phases, plans, tasks
   - Calculate git range, file changes, LOC
   - Extract timeline from git log
   - Present summary, confirm

3. **Extract accomplishments:**

   - Read all phase summary.md files in milestone range
   - Extract 4-6 key accomplishments
   - Present for approval

4. **Archive milestone:**

   - Create `.planning/milestones/v{{version}}-roadmap.md`
   - Extract full phase details from roadmap.md
   - Fill milestone-archive.md template
   - Update roadmap.md to one-line summary with link

5. **Archive requirements:**

   - Create `.planning/milestones/v{{version}}-requirements.md`
   - Mark all v1 requirements as complete (checkboxes checked)
   - Note requirement outcomes (validated, adjusted, dropped)
   - Delete `.planning/requirements.md` (fresh one created for next milestone)

6. **Update project.md:**

   - Add "Current State" section with shipped version
   - Add "Next Milestone Goals" section
   - Archive previous content in `<details>` (if v1.1+)

7. **Commit and tag:**

   - Stage: milestones.md, project.md, roadmap.md, state.md, archive files
   - Commit: `chore: archive v{{version}} milestone`
   - Tag: `git tag -a v{{version}} -m "[milestone summary]"`
   - Ask about pushing tag

8. **Offer next steps:**
   - `/drive:new-milestone` -- start next milestone (questioning -> research -> requirements -> roadmap)

</process>

<success_criteria>

- Milestone archived to `.planning/milestones/v{{version}}-roadmap.md`
- Requirements archived to `.planning/milestones/v{{version}}-requirements.md`
- `.planning/requirements.md` deleted (fresh for next milestone)
- roadmap.md collapsed to one-line entry
- project.md updated with current state
- Git tag v{{version}} created
- Commit successful
- User knows next steps (including need for fresh requirements)
  </success_criteria>

<critical_rules>

- **Load flow first:** Read complete-milestone.md before executing
- **Verify completion:** All phases must have summary.md files
- **User confirmation:** Wait for approval at verification gates
- **Archive before deleting:** Always create archive files before updating/deleting originals
- **One-line summary:** Collapsed milestone in roadmap.md should be single line with link
- **Context efficiency:** Archive keeps roadmap.md and requirements.md constant size per milestone
- **Fresh requirements:** Next milestone starts with `/drive:new-milestone` which includes requirements definition
  </critical_rules>
