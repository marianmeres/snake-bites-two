import { strict as assert } from 'assert';
import * as path from 'path';
import { TestRunner } from 'test-runner';
import { fileURLToPath } from 'url';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

suite.test('test runner works', () => assert(1 === 1));

//
export default suite;
