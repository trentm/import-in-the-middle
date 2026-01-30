// These export identifiers require support for string-named exports.
exports['one.two'] = () => console.log('b')

// See: https://github.com/nodejs/import-in-the-middle/issues/94
exports['unsigned short'] = 'something'

exports._ = 'foo'
exports.$ = 'bar'
