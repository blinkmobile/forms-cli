'use strict'

const path = require('path')

const log = require('./logger.js').logger

function writeSite (basePath, formData) {
  const formNames = Object.keys(formData)

  return Promise.all(formNames.map((formName) => {
    const form = formData[formName]
    if (!form) {
      return Promise.resolve()
    }

    const formPath = path.join(basePath, formName)

    return Promise.all(form.map((writer) => writer(formPath)))
  })).catch((err) => log.error(err))
}

module.exports = {writeSite}
