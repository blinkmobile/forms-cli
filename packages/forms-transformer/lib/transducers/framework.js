'use strict'

const templateService = require('@blinkmobile/forms-template-helper').service
const lazyWriter = require('@blinkmobile/forms-template-helper').lazyWriteFile

function processDefinition (pluginName) {
  const plugin = require(pluginName)
  const processForm = plugin.processForm({templateService, lazyWriter})

  return (definition) => {
    return definition.reduce((memo, form) => {
      const writers = processForm(form)

      return [...memo, ...writers]
    }, [])
  }
}

module.exports = processDefinition
