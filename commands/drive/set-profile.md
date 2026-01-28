---
name: set-profile
description: Switch model profile for Aria Drive agents (quality/balanced/budget)
arguments:
  - name: profile
    description: "Profile name: quality, balanced, or budget"
    required: true
---

# Set Profile

<objective>
Switch the model profile used by Aria Drive agents. This controls which Claude model each agent uses, balancing quality vs token spend.
</objective>

<profiles>
| Profile      | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| **quality**  | Opus everywhere except read-only verification                  |
| **balanced** | Opus for planning, Sonnet for execution/verification (default) |
| **budget**   | Sonnet for writing, Haiku for research/verification            |
</profiles>

<process>

## 1. Validate argument

```
if $ARGUMENTS.profile not in ["quality", "balanced", "budget"]:
  Error: Invalid profile "$ARGUMENTS.profile"
  Valid profiles: quality, balanced, budget
  STOP
```

## 2. Check for project

```sh
ls .planning/config.json 2>/dev/null
```

If no `.planning/` directory:

```
Error: No Aria Drive project found.
Run /drive:new-project first to initialize a project.
```

## 3. Update config.json

Read current config:

```sh
cat .planning/config.json
```

Update `model_profile` field (or add if missing):

```json
{
  "model_profile": "$ARGUMENTS.profile"
}
```

Write updated config back to `.planning/config.json`.

## 4. Confirm

```
✓ Model profile set to: $ARGUMENTS.profile

Agents will now use:
[Show table from model-profiles.md for selected profile]

Next spawned agents will use the new profile.
```

</process>

<examples>

**Switch to budget mode:**

```
/drive:set-profile budget

✓ Model profile set to: budget

Agents will now use:
| Agent          | Model  |
| -------------- | ------ |
| drive-planner  | sonnet |
| drive-executor | sonnet |
| drive-verifier | haiku  |
| ...            | ...    |
```

**Switch to quality mode:**

```
/drive:set-profile quality

✓ Model profile set to: quality

Agents will now use:
| Agent          | Model  |
| -------------- | ------ |
| drive-planner  | opus   |
| drive-executor | opus   |
| drive-verifier | sonnet |
| ...            | ...    |
```

</examples>
