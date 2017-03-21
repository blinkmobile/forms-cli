'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()

const TEST_SUBJECT = '../../../lib/plugin-system/load-plugin.js'

test('it should throw because no framework is specified', (t) => {
  const loadPlugin = pq(TEST_SUBJECT, {
    './resolve-plugin-name.js': () => t.fail()
  })

  t.throws(() => loadPlugin(), 'No Front end framework specified')
})

test('it should load the plugin', (t) => {
  const loadPlugin = pq(TEST_SUBJECT, {
    './resolve-plugin-name.js': (f) => f,
    'plugin': () => Promise.resolve(() => t.pass())
  })

  const plugin = loadPlugin('plugin')

  return plugin()
})

test('plugin doesnt exist should return null', (t) => {
  const loadPlugin = pq(TEST_SUBJECT, {
    './resolve-plugin-name.js': (f) => f
  })

  const plugin = loadPlugin('doesnt-exist')

  t.is(plugin, null)
})
