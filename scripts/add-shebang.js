#!/usr/bin/env node
/**
 * Add shebang to built install.js file.
 * Bun build doesn't add shebangs automatically, so we do it post-build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHEBANG = '#!/usr/bin/env node\n';
const installPath = path.join(__dirname, '..', 'dist', 'bin', 'install.js');

if (fs.existsSync(installPath)) {
    const content = fs.readFileSync(installPath, 'utf8');
    if (!content.startsWith('#!')) {
        fs.writeFileSync(installPath, SHEBANG + content);
        console.log('Added shebang to dist/bin/install.js');
    }
} else {
    console.warn('Warning: dist/bin/install.js not found');
}
