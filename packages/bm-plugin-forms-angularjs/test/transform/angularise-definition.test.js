'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../../lib/transform/angularise-definition.js'

test('should replace underscores in subform name with dashes', (t) => {
  const m = require(TEST_SUBJECT)

  const result = m({
    name: 'myModule',
    _elements: [{type: 'subform', subForm: 'my_sub_form'}]
  })

  const expected = 'my-sub-form'
  t.is(result._elements[0].subFormElement, expected)
})
