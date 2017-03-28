'use strict'

/*
  stub for the error logger
  use:
```
const pq = require('proxyquire')
const logger = require('test/fixtures/logger.js')
const stub = pq('path/to/logger', logger)
```
*/

const fn = () => true

module.exports = {
  logger: {
    error: fn,
    log: fn,
    trace: fn,
    debug: fn,
    info: fn,
    warn: fn,
    fatal: fn
  }
}
