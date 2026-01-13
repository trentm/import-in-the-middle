import { Hook } from '../../index.js'
import { strictEqual } from 'assert'

// If a module does not export `default`, returning a "new default" from the hook
// should not crash (see issue #188).
Hook((exports, name) => {
  if (name.match(/foo\.mjs/)) {
    return function newDefault () {
      return 'should-not-be-applied'
    }
  }
})

import * as ns from '../fixtures/foo.mjs'

strictEqual('default' in ns, false)
strictEqual(ns.foo(), 'foo')
