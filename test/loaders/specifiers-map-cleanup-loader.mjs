import { readFileSync } from 'fs'
import { Buffer } from 'buffer'

// Loader used ONLY by `test/hook/specifiers-map-cleanup.mjs` (which is skipped on Node 18.0–18.18).
// Keeping this file outside of `test/hook/` avoids having the test runner execute it directly.

const createHookUrl = new URL('../../create-hook.mjs', import.meta.url)
const getExportsUrl = new URL('../../lib/get-exports.mjs', import.meta.url)

let src = readFileSync(createHookUrl, 'utf8')
src = src.replace(
  "from './lib/get-exports.mjs'",
  `from ${JSON.stringify(getExportsUrl.href)}`
)
src += '\nexport { specifiers }\n'

const dataUrl = `data:text/javascript;base64,${Buffer.from(src).toString('base64')}`
const { createHook, specifiers } = await import(dataUrl)

const meta = { url: new URL('../../hook.mjs', import.meta.url).href }
const { initialize, load, resolve } = createHook(meta)

process.on('exit', () => {
  if (specifiers.size !== 0) {
    // eslint-disable-next-line no-console
    console.error(`specifiers map leak detected: size=${specifiers.size}`)
    process.exitCode = 1
  }
})

export { initialize, load, resolve }
