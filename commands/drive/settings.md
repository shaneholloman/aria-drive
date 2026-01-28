---
name: drive:settings
description: Configure Aria Drive flow toggles and model profile
allowed-tools:
  - Read
  - Write
  - AskUserQuestion
---

# Settings

<objective>
Allow users to toggle flow agents on/off and select model profile via interactive settings.

Updates `.planning/config.json` with flow preferences and model profile selection.
</objective>

<process>

## 1. Validate Environment

```sh
ls .planning/config.json 2>/dev/null
```

**If not found:** Error - run `/drive:new-project` first.

## 2. Read Current Config

```sh
cat .planning/config.json
```

Parse current values (default to `true` if not present):

- `flow.research` -- spawn researcher during plan-phase
- `flow.plan_check` -- spawn plan checker during plan-phase
- `flow.verifier` -- spawn verifier during execute-phase
- `model_profile` -- which model each agent uses (default: `balanced`)

## 3. Present Settings

Use AskUserQuestion with current values shown:

```
AskUserQuestion([
  {
    question: "Which model profile for agents?",
    header: "Model",
    multiSelect: false,
    options: [
      { label: "Quality", description: "Opus everywhere except verification (highest cost)" },
      { label: "Balanced (Recommended)", description: "Opus for planning, Sonnet for execution/verification" },
      { label: "Budget", description: "Sonnet for writing, Haiku for research/verification (lowest cost)" }
    ]
  },
  {
    question: "Spawn Plan Researcher? (researches domain before planning)",
    header: "Research",
    multiSelect: false,
    options: [
      { label: "Yes", description: "Research phase goals before planning" },
      { label: "No", description: "Skip research, plan directly" }
    ]
  },
  {
    question: "Spawn Plan Checker? (verifies plans before execution)",
    header: "Plan Check",
    multiSelect: false,
    options: [
      { label: "Yes", description: "Verify plans meet phase goals" },
      { label: "No", description: "Skip plan verification" }
    ]
  },
  {
    question: "Spawn Execution Verifier? (verifies phase completion)",
    header: "Verifier",
    multiSelect: false,
    options: [
      { label: "Yes", description: "Verify must-haves after execution" },
      { label: "No", description: "Skip post-execution verification" }
    ]
  }
])
```

**Pre-select based on current config values.**

## 4. Update Config

Merge new settings into existing config.json:

```json
{
  ...existing_config,
  "model_profile": "quality" | "balanced" | "budget",
  "flow": {
    "research": true/false,
    "plan_check": true/false,
    "verifier": true/false
  }
}
```

Write updated config to `.planning/config.json`.

## 5. Confirm Changes

Display:

```sh
---
Aria Drive > SETTINGS UPDATED
---

| Setting            | Value                     |
| ------------------ | ------------------------- |
| Model Profile      | {quality/balanced/budget} |
| Plan Researcher    | {On/Off}                  |
| Plan Checker       | {On/Off}                  |
| Execution Verifier | {On/Off}                  |

These settings apply to future /drive:plan-phase and /drive:execute-phase runs.

Quick commands:
- /drive:set-profile <profile> -- switch model profile
- /drive:plan-phase --research -- force research
- /drive:plan-phase --skip-research -- skip research
- /drive:plan-phase --skip-verify -- skip plan check
```

</process>

<success_criteria>

- [ ] Current config read
- [ ] User presented with 4 settings (profile + 3 toggles)
- [ ] Config updated with model_profile and flow section
- [ ] Changes confirmed to user
</success_criteria>
