'use strict'

const readConfig = require('../config/read-config.js')
const writeTemplates = require('../init/write-templates.js')
const debugLogger = require('../logger/loggers.js').debugLogger

function extractTemplates () {
  return readConfig().then((cfg) => {
    if (!cfg || !cfg.templatePath) {
      debugLogger.error('.blinkmrc.json does not contain a templatePath field')
      return Promise.reject(new Error('Template Path not found in .blinkmrc.json. Please run `bm forms init`'))
    }

    return writeTemplates(cfg)
  })
}

module.exports = extractTemplates
