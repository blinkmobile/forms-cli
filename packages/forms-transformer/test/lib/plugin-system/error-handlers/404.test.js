'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */
const TEST_SUBJECT = '../../../../lib/plugin-system/error-handlers/404.js'

test('it should return a generic message if name cant be extracted', (t) => {
  const handler = require(TEST_SUBJECT)
  const expected = `
plugin could not be found by npm.
Please check the address is valid and try again.
`
  const result = handler('blah')

  t.is(result, expected)
})

test('it should return extract the name', (t) => {
  const handler = require(TEST_SUBJECT)
  const expected = `
blahaersdg could not be found by npm.
Please check the address is valid and try again.
`
  const result = handler(`npm ERR! Windows_NT 10.0.14393\nnpm ERR! argv \"C:\\\\Program Files (x86)\\\\nodejs\\\\node.exe\" \"C:\\\\Program Files (x86)\\\\nodejs\\\\node_modules\\\\npm\\\\bin\\\\npm-cli.js\" \"install\" \"blahaersdg\"\nnpm ERR! node v7.7.4\nnpm ERR! npm  v4.1.2\nnpm ERR! code E404\n\nnpm ERR! 404 Registry returned 404 for GET on https://registry.npmjs.org/blahaersdg\nnpm ERR! 404 \nnpm ERR! 404  'blahaersdg' is not in the npm registry.\nnpm ERR! 404 You should bug the author to publish it (or use the name yourself!)\nnpm ERR! 404 \nnpm ERR! 404 Note that you can also install from a\nnpm ERR! 404 tarball, folder, http url, or git url.\n\nnpm ERR! Please include the following file with any support request:\nnpm ERR!     C:\\src\\forms-test\\npm-debug.log\n`) // eslint-disable-line no-useless-escape, quotes

  t.is(result, expected)
})
