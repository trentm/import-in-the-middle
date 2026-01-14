import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)

const hookPath = new URL('../../hook.mjs', import.meta.url)
const hookSpecifier = hookPath.href

// Prefer the actual ts-node CLI entrypoint instead of `npx` to keep the test
// hermetic and avoid any PATH/npx behavior.
const tsNodeBin =
  require.resolve('ts-node/dist/bin.js', { paths: [process.cwd()] })

const result = spawnSync(process.execPath, [tsNodeBin, '-v'], {
  env: {
    ...process.env,
    NODE_OPTIONS: `--loader=${hookSpecifier}`
  },
  encoding: 'utf8'
})

assert.equal(result.status, 0, `expected exit code 0, got ${result.status}\n${result.stderr}`)
assert.match(result.stdout, /\d+\.\d+\.\d+/, `expected version in stdout, got:\n${result.stdout}\n${result.stderr}`)
