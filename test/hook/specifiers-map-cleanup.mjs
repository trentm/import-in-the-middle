import { spawnSync } from 'child_process'
import { strictEqual } from 'assert'

const [NODE_MAJOR, NODE_MINOR] = process.versions.node.split('.').map(Number)
if (NODE_MAJOR === 18 && NODE_MINOR < 19) {
  console.log(`Skipping ${process.env.IITM_TEST_FILE || import.meta.url} as this is Node.js v${NODE_MAJOR}.${NODE_MINOR} and test wants >=v18.19`)
  process.exit(0)
}

const result = spawnSync(process.execPath, [
  '--no-warnings',
  '--loader',
  './test/loaders/specifiers-map-cleanup-loader.mjs',
  './test/fixtures/specifiers-map-cleanup-entry.mjs'
], {
  encoding: 'utf8',
  // The test runner sets NODE_OPTIONS to install its own loader; we want this
  // child process to run with only the loader we're explicitly specifying.
  env: { ...process.env, NODE_OPTIONS: '' }
})

strictEqual(result.signal, null)
strictEqual(result.status, 0, result.stderr || result.stdout)
