#!/usr/bin/env node
/**
 * Build script for Aria Drive hooks.
 * Copies hooks to dist directory for installation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_HOOKS_DIR = path.join(__dirname, '..', 'hooks');
const DIST_HOOKS_DIR = path.join(__dirname, '..', '..', 'dist', 'hooks');

const HOOKS_TO_COPY = ['drive-check-update.js', 'drive-statusline.js'];

function build(): void {
    // Ensure dist directory exists
    if (!fs.existsSync(DIST_HOOKS_DIR)) {
        fs.mkdirSync(DIST_HOOKS_DIR, { recursive: true });
    }

    // Copy hooks to dist
    for (const hook of HOOKS_TO_COPY) {
        const src = path.join(SRC_HOOKS_DIR, hook);
        const dest = path.join(DIST_HOOKS_DIR, hook);

        if (!fs.existsSync(src)) {
            console.warn(`Warning: ${hook} not found, skipping`);
            continue;
        }

        console.log(`Copying ${hook}...`);
        fs.copyFileSync(src, dest);
        console.log(`  -> ${dest}`);
    }

    console.log('\nBuild complete.');
}

build();
