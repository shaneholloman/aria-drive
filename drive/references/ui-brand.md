# Ui Brand

<ui_patterns>

Visual patterns for user-facing Aria Drive output. Orchestrators @-reference this file.

## Stage Banners

Use for major flow transitions.

```sh
---
Aria Drive > {STAGE NAME}
---
```

**Stage names (uppercase):**

- `QUESTIONING`
- `RESEARCHING`
- `DEFINING REQUIREMENTS`
- `CREATING ROADMAP`
- `PLANNING PHASE {N}`
- `EXECUTING WAVE {N}`
- `VERIFYING`
- `PHASE {N} COMPLETE ✓`
- `MILESTONE COMPLETE ✓`

---

## Checkpoint Boxes

User action required. 62-character width.

```sh
---
CHECKPOINT: {Type}
---

{Content}

---
-> {ACTION PROMPT}
---
```

**Types:**

- `CHECKPOINT: Verification Required` -> `-> Type "approved" or describe issues`
- `CHECKPOINT: Decision Required` -> `-> Select: option-a / option-b`
- `CHECKPOINT: Action Required` -> `-> Type "done" when complete`

---

## Status Symbols

```sh
✓ Complete / Passed / Verified
✗ Failed / Missing / Blocked
> In Progress
o Pending
AUTO: Auto-approved
[!] Warning
 Milestone complete (only in banner)
```

---

## Progress Display

**Phase/milestone level:**

```sh
Progress: ########.. 80%
```

**Task level:**

```sh
Tasks: 2/4 complete
```

**Plan level:**

```sh
Plans: 3/5 complete
```

---

## Spawning Indicators

```sh
> Spawning researcher...

> Spawning 4 researchers in parallel...
  -> Stack research
  -> Features research
  -> Architecture research
  -> Pitfalls research

✓ Researcher complete: stack.md written
```

---

## Next Up Block

Always at end of major completions.

```
---

## > Next Up

**{Identifier}: {Name}** -- {one-line description}

`{copy-paste command}`

<sub>`/clear` first -> fresh context window</sub>

---

**Also available:**
- `/drive:alternative-1` -- description
- `/drive:alternative-2` -- description

---
```

---

## Error Box

```sh
---
ERROR
---

{Error description}

**To fix:** {Resolution steps}
```

---

## Tables

````md
| Phase | Status | Plans | Progress |
| ----- | ------ | ----- | -------- |
| 1     | ✓      | 3/3   | 100%     |
| 2     | >      | 1/4   | 25%      |
| 3     | o      | 0/2   | 0%       |
````

---

## Anti-Patterns

- Varying box/banner widths
- Mixing banner styles (`===`, `---`, `***`)
- Skipping `Aria Drive >` prefix in banners
- Random emoji (`` , ``, ``)
- Missing Next Up block after completions

</ui_patterns>
