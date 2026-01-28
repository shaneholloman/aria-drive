#!/usr/bin/env node
/**
 * Claude Code Statusline - Aria Drive Edition
 * Shows: model | current task | directory | context usage
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

interface StatuslineInput {
    model?: {
        display_name?: string;
    };
    workspace?: {
        current_dir?: string;
    };
    session_id?: string;
    context_window?: {
        remaining_percentage?: number;
    };
}

interface TodoItem {
    status: string;
    activeForm?: string;
}

interface UpdateCache {
    update_available?: boolean;
}

// Read JSON from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk: string) => {
    input += chunk;
});
process.stdin.on('end', () => {
    try {
        const data: StatuslineInput = JSON.parse(input);
        const model = data.model?.display_name || 'Claude';
        const dir = data.workspace?.current_dir || process.cwd();
        const session = data.session_id || '';
        const remaining = data.context_window?.remaining_percentage;

        // Context window display (shows USED percentage)
        let ctx = '';
        if (remaining != null) {
            const rem = Math.round(remaining);
            const used = Math.max(0, Math.min(100, 100 - rem));

            // Build progress bar (10 segments)
            const filled = Math.floor(used / 10);
            const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);

            // Color based on usage
            if (used < 50) {
                ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
            } else if (used < 65) {
                ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
            } else if (used < 80) {
                ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
            } else {
                ctx = ` \x1b[5;31m[!!] ${bar} ${used}%\x1b[0m`;
            }
        }

        // Current task from todos
        let task = '';
        const homeDir = os.homedir();
        const todosDir = path.join(homeDir, '.claude', 'todos');
        if (session && fs.existsSync(todosDir)) {
            const files = fs
                .readdirSync(todosDir)
                .filter(
                    (f) => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'),
                )
                .map((f) => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

            if (files.length > 0) {
                try {
                    const todos: TodoItem[] = JSON.parse(
                        fs.readFileSync(path.join(todosDir, files[0].name), 'utf8'),
                    );
                    const inProgress = todos.find((t) => t.status === 'in_progress');
                    if (inProgress) task = inProgress.activeForm || '';
                } catch {
                    // Ignore parse errors
                }
            }
        }

        // Aria Drive update available?
        let driveUpdate = '';
        const cacheFile = path.join(homeDir, '.claude', 'cache', 'drive-update-check.json');
        if (fs.existsSync(cacheFile)) {
            try {
                const cache: UpdateCache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
                if (cache.update_available) {
                    driveUpdate = '\x1b[33m[UP] /drive:update\x1b[0m | ';
                }
            } catch {
                // Ignore parse errors
            }
        }

        // Output
        const dirname = path.basename(dir);
        if (task) {
            process.stdout.write(
                `${driveUpdate}\x1b[2m${model}\x1b[0m | \x1b[1m${task}\x1b[0m | \x1b[2m${dirname}\x1b[0m${ctx}`,
            );
        } else {
            process.stdout.write(
                `${driveUpdate}\x1b[2m${model}\x1b[0m | \x1b[2m${dirname}\x1b[0m${ctx}`,
            );
        }
    } catch {
        // Silent fail - don't break statusline on parse errors
    }
});
