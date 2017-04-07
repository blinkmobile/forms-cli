'use strict'

const readConfig = require('../config/read-config.js')
const writeTemplates = require('../init/write-templates.js')

function extractTemplates () {
  return readConfig().then((cfg) => {
    if (!cfg || !cfg.templatePath) {
      return Promise.reject(new Error('Template Path not found in .blinkmrc.json. Please run `bm forms init`'))
    }

    return writeTemplates(cfg)
  })
}

module.exports = extractTemplates
