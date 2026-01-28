---
name: drive:update
description: Update Aria Drive to latest version with changelog display
---

# Update

<objective>
Check for Aria Drive updates, install if available, and display what changed.

Provides a better update experience than raw `npx aria-drive` by showing version diff and changelog entries.
</objective>

<process>

<step name="get_installed_version">
Read installed version:

```sh
cat ~/.claude/drive/VERSION 2>/dev/null
```

**If VERSION file missing:**

```
## Aria Drive Update

**Installed version:** Unknown

Your installation doesn't include version tracking.

Running fresh install...
```

Proceed to install step (treat as version 0.0.0 for comparison).
</step>

<step name="check_latest_version">
Check npm for latest version:

```sh
npm view aria-drive version 2>/dev/null
```

**If npm check fails:**

```
Couldn't check for updates (offline or npm unavailable).

To update manually: `npx aria-drive --global`
```

STOP here if npm unavailable.
</step>

<step name="compare_versions">
Compare installed vs latest:

**If installed == latest:**

```
## Aria Drive Update

**Installed:** X.Y.Z
**Latest:** X.Y.Z

You're already on the latest version.
```

STOP here if already up to date.

**If installed > latest:**

```
## Aria Drive Update

**Installed:** X.Y.Z
**Latest:** A.B.C

You're ahead of the latest release (development version?).
```

STOP here if ahead.
</step>

<step name="show_changes_and_confirm">
**If update available**, fetch and show what's new BEFORE updating:

1. Fetch changelog (same as fetch_changelog step)
2. Extract entries between installed and latest versions
3. Display preview and ask for confirmation:

```
## Aria Drive Update Available

**Installed:** 1.5.10
**Latest:** 1.5.15

### What's New
---

## [1.5.15] - 2026-01-20

### Added
- Feature X

## [1.5.14] - 2026-01-18

### Fixed
- Bug fix Y

---

WARNING  **Note:** The installer performs a clean install of Aria Drive folders:
- `~/.claude/commands/drive/` will be wiped and replaced
- `~/.claude/drive/` will be wiped and replaced
- `~/.claude/agents/drive-*` files will be replaced

Your custom files in other locations are preserved:
- Custom commands in `~/.claude/commands/your-stuff/` ✓
- Custom agents not prefixed with `drive-` ✓
- Custom hooks ✓
- Your claude.md files ✓

If you've modified any Aria Drive files directly, back them up first.
```

Use AskUserQuestion:

- Question: "Proceed with update?"
- Options:
  - "Yes, update now"
  - "No, cancel"

**If user cancels:** STOP here.
</step>

<step name="run_update">
Run the update:

```sh
npx aria-drive --global
```

Capture output. If install fails, show error and STOP.

Clear the update cache so statusline indicator disappears:

```sh
rm -f ~/.claude/cache/drive-update-check.json
```

</step>

<step name="display_result">
Format completion message (changelog was already shown in confirmation step):

```sh
---
Aria Drive Updated: v1.5.10 -> v1.5.15
---

WARNING  Restart Claude Code to pick up the new commands.

[View full changelog](https://github.com/shaneholloman/aria-drive/blob/main/changelog.md)
```

</step>

</process>

<success_criteria>

- [ ] Installed version read correctly
- [ ] Latest version checked via npm
- [ ] Update skipped if already current
- [ ] Changelog fetched and displayed BEFORE update
- [ ] Clean install warning shown
- [ ] User confirmation obtained
- [ ] Update executed successfully
- [ ] Restart reminder shown
</success_criteria>
