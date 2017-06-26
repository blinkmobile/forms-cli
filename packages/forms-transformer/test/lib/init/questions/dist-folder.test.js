'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../../lib/init/questions/dist-folder.js'

test('default should return the dirname + `dist`', (t) => {
  const question = require(TEST_SUBJECT)
  const expected = 'folder/dist'
  const input = {sourcePath: 'folder/source'}

  t.is(question.default(input), expected)
})

test('should return a folder relative to the current folder', (t) => {
  const question = require(TEST_SUBJECT)
  const expected = 'folder/dist'
  const input = './folder/dist'

  t.is(question.filter(input), expected)
})
