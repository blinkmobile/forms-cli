'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../../lib/transform/pagination-wrapper-template.js'

test('should insert the html inside the wrapper', (t) => {
  const expected = `<div class='bm-forms__pagination' ng-show='myCtrl.page === 0'>
  hello, world
</div>`

  const m = require(TEST_SUBJECT)
  const result = m`${'hello, world'}${0}${'myCtrl'}`

  t.is(result, expected)
})
