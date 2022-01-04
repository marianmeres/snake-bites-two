import { TestRunner } from 'test-runner';
import { fileURLToPath } from 'url';
import * as path from 'path';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.clear();

const args = process.argv.slice(2);
const verbose = args.includes('-v');
const whitelist = args.filter((v) => !/^-v$/.test(v));

TestRunner.runAll(__dirname, {
	whitelist,
	verbose,
	rootDir: __dirname,
	enableErrorsSummaryOnNonVerbose: true,
});

export default {};
