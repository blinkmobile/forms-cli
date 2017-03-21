'use strict'

const resolvePluginName = require('../plugin-system/resolve-plugin-name.js')
const loadPlugin = require('../plugin-system/load-plugin.js')

const templateService = require('../utils/template-service.js')
const lazyWriter = require('../utils/write-file-contents.js').lazyWriter

function processDefinition (framework) {
  const pluginName = resolvePluginName(framework)
  const plugin = loadPlugin(`@blinkmobile/${pluginName}`)
console.log('plugin = ', JSON.stringify(plugin), pluginName)
  const processForm = plugin.processForm({templateService, lazyWriter})

  return (definition) => {
    return definition.reduce((memo, form) => {
      const writers = processForm(form)

      return [...memo, ...writers]
    }, [])
  }
}

module.exports = processDefinition
