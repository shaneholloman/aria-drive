#!/usr/bin/env node

/**
 * Check for Aria Drive updates in background, write result to cache.
 * Called by SessionStart hook - runs once per session.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

interface UpdateCache {
    update_available: boolean;
    installed: string;
    latest: string;
    checked: number;
}

const homeDir = os.homedir();
const cwd = process.cwd();
const cacheDir = path.join(homeDir, '.claude', 'cache');
const cacheFile = path.join(cacheDir, 'drive-update-check.json');

// VERSION file locations (check project first, then global)
const projectVersionFile = path.join(cwd, '.claude', 'drive', 'VERSION');
const globalVersionFile = path.join(homeDir, '.claude', 'drive', 'VERSION');

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

// Run check in background (spawn background process, windowsHide prevents console flash)
const child = spawn(
    process.execPath,
    [
        '-e',
        `
  const fs = require('fs');
  const { execSync } = require('child_process');

  const cacheFile = ${JSON.stringify(cacheFile)};
  const projectVersionFile = ${JSON.stringify(projectVersionFile)};
  const globalVersionFile = ${JSON.stringify(globalVersionFile)};

  // Check project directory first (local install), then global
  let installed = '0.0.0';
  try {
    if (fs.existsSync(projectVersionFile)) {
      installed = fs.readFileSync(projectVersionFile, 'utf8').trim();
    } else if (fs.existsSync(globalVersionFile)) {
      installed = fs.readFileSync(globalVersionFile, 'utf8').trim();
    }
  } catch (e) {}

  let latest = null;
  try {
    latest = execSync('npm view aria-drive version', { encoding: 'utf8', timeout: 10000, windowsHide: true }).trim();
  } catch (e) {}

  const result = {
    update_available: latest && installed !== latest,
    installed,
    latest: latest || 'unknown',
    checked: Math.floor(Date.now() / 1000)
  };

  fs.writeFileSync(cacheFile, JSON.stringify(result));
`,
    ],
    {
        stdio: 'ignore',
        windowsHide: true,
    },
);

child.unref();

// Export for type checking (unused at runtime)
export type { UpdateCache };
