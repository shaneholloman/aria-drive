---
name: drive:audit-milestone
description: Audit milestone completion against original intent before archiving
argument-hint: "[version]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Task
  - Write
---

# Audit Milestone

<objective>
Verify milestone achieved its definition of done. Check requirements coverage, cross-phase integration, and end-to-end flows.

**This command IS the orchestrator.** Reads existing verification.md files (phases already verified during execute-phase), aggregates tech debt and deferred gaps, then spawns integration checker for cross-phase wiring.
</objective>

<execution_context>
<!-- Spawns drive-integration-checker agent which has all audit expertise baked in -->
</execution_context>

<context>
Version: $ARGUMENTS (optional -- defaults to current milestone)

**Original Intent:**
@.planning/project.md
@.planning/requirements.md

**Planned Work:**
@.planning/roadmap.md
@.planning/config.json (if exists)

**Completed Work:**
Glob: .planning/phases/*/*-summary.md
Glob: .planning/phases/*/*-verification.md
</context>

<process>

## 0. Resolve Model Profile

Read model profile for agent spawning:

```sh
MODEL_PROFILE=$(cat .planning/config.json 2>/dev/null | grep -o '"model_profile"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -o '"[^"]*"$' | tr -d '"' || echo "balanced")
```

Default to "balanced" if not set.

**Model lookup table:**

| Agent                     | quality | balanced | budget |
| ------------------------- | ------- | -------- | ------ |
| drive-integration-checker | sonnet  | sonnet   | haiku  |

Store resolved model for use in Task call below.

## 1. Determine Milestone Scope

```sh
# Get phases in milestone
ls -d .planning/phases/*/ | sort -V
```

- Parse version from arguments or detect current from roadmap.md
- Identify all phase directories in scope
- Extract milestone definition of done from roadmap.md
- Extract requirements mapped to this milestone from requirements.md

## 2. Read All Phase Verifications

For each phase directory, read the verification.md:

```sh
cat .planning/phases/01-*/*-verification.md
cat .planning/phases/02-*/*-verification.md
# etc.
```

From each verification.md, extract:

- **Status:** passed | gaps_found
- **Critical gaps:** (if any -- these are blockers)
- **Non-critical gaps:** tech debt, deferred items, warnings
- **Anti-patterns found:** TODOs, stubs, placeholders
- **Requirements coverage:** which requirements satisfied/blocked

If a phase is missing verification.md, flag it as "unverified phase" -- this is a blocker.

## 3. Spawn Integration Checker

With phase context collected:

```
Task(
  prompt="Check cross-phase integration and E2E flows.

Phases: {phase_dirs}
Phase exports: {from SUMMARYs}
API routes: {routes created}

Verify cross-phase wiring and E2E user flows.",
  subagent_type="drive-integration-checker",
  model="{integration_checker_model}"
)
```

## 4. Collect Results

Combine:

- Phase-level gaps and tech debt (from step 2)
- Integration checker's report (wiring gaps, broken flows)

## 5. Check Requirements Coverage

For each requirement in requirements.md mapped to this milestone:

- Find owning phase
- Check phase verification status
- Determine: satisfied | partial | unsatisfied

## 6. Aggregate into v{version}-MILESTONE-audit.md

Create `.planning/v{version}-v{version}-MILESTONE-audit.md` with:

```yaml
---
milestone: {version}
audited: {timestamp}
status: passed | gaps_found | tech_debt
scores:
  requirements: N/M
  phases: N/M
  integration: N/M
  flows: N/M
gaps:  # Critical blockers
  requirements: [...]
  integration: [...]
  flows: [...]
tech_debt:  # Non-critical, deferred
  - phase: 01-auth
    items:
      - "TODO: add rate limiting"
      - "Warning: no password strength validation"
  - phase: 03-dashboard
    items:
      - "Deferred: mobile responsive layout"
---
```

Plus full markdown report with tables for requirements, phases, integration, tech debt.

**Status values:**

- `passed` -- all requirements met, no critical gaps, minimal tech debt
- `gaps_found` -- critical blockers exist
- `tech_debt` -- no blockers but accumulated deferred items need review

## 7. Present Results

Route by status (see `<offer_next>`).

</process>

<offer_next>
Output this markdown directly (not as a code block). Route based on status:

---

**If passed:**

## ✓ Milestone {version} -- Audit Passed

**Score:** {N}/{M} requirements satisfied
**Report:** .planning/v{version}-MILESTONE-audit.md

All requirements covered. Cross-phase integration verified. E2E flows complete.

---

## > Next Up

**Complete milestone** -- archive and tag

/drive:complete-milestone {version}

<sub>/clear first -> fresh context window</sub>

---

---

**If gaps_found:**

## [!] Milestone {version} -- Gaps Found

**Score:** {N}/{M} requirements satisfied
**Report:** .planning/v{version}-MILESTONE-audit.md

### Unsatisfied Requirements

{For each unsatisfied requirement:}

- **{REQ-ID}: {description}** (Phase {X})
  - {reason}

### Cross-Phase Issues

{For each integration gap:}

- **{from} -> {to}:** {issue}

### Broken Flows

{For each flow gap:}

- **{flow name}:** breaks at {step}

---

## > Next Up

**Plan gap closure** -- create phases to complete milestone

/drive:plan-milestone-gaps

<sub>/clear first -> fresh context window</sub>

---

**Also available:**

- cat .planning/v{version}-MILESTONE-audit.md -- see full report
- /drive:complete-milestone {version} -- proceed anyway (accept tech debt)

---

---

**If tech_debt (no blockers but accumulated debt):**

## AUTO: Milestone {version} -- Tech Debt Review

**Score:** {N}/{M} requirements satisfied
**Report:** .planning/v{version}-MILESTONE-audit.md

All requirements met. No critical blockers. Accumulated tech debt needs review.

### Tech Debt by Phase

{For each phase with debt:}
**Phase {X}: {name}**

- {item 1}
- {item 2}

### Total: {N} items across {M} phases

---

## > Options

**A. Complete milestone** -- accept debt, track in backlog

/drive:complete-milestone {version}

**B. Plan cleanup phase** -- address debt before completing

/drive:plan-milestone-gaps

<sub>/clear first -> fresh context window</sub>

---
</offer_next>

<success_criteria>

- [ ] Milestone scope identified
- [ ] All phase verification.md files read
- [ ] Tech debt and deferred gaps aggregated
- [ ] Integration checker spawned for cross-phase wiring
- [ ] v{version}-MILESTONE-audit.md created
- [ ] Results presented with actionable next steps
</success_criteria>
