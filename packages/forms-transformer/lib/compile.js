'use strict'

const loadPlugin = require('../lib/plugin-system/load-plugin.js')
const formsTransducer = require('../lib/transducers/framework.js')

function compile (options, normaliser) {
  const plugin = loadPlugin(options.framework)
  const transformer = formsTransducer(plugin.processForm)

  return plugin.init(options)
    .then(() => normaliser(options))
    .then((normalisedForms) => transformer(normalisedForms))
}

module.exports = compile
