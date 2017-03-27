'use strict'

const fs = require('fs')

const inquirer = require('inquirer')
const maybeRun = require('@blinkmobile/maybe-run')

const loadPlugin = require('../plugin-system/load-plugin.js')

function checkTemplatePath (templatePath) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(resolve) // its not an error if the path doesn't exist!

    fs.access(templatePath, (err) => {
      if (notError(err)) {
        inquirer.prompt({
          name: 'continue',
          type: 'confirm',
          message: 'The template path already exists. Are you sure you want to overwrite the templates?',
          default: false
        }).then((answer) => answer.continue ? resolve() : reject(new Error('cancelled')))
          .catch(() => reject(new Error('cancelled')))
      }
    })
  })
}

function writeTemplates (cfg) {
  const templatePath = cfg.templatePath
  const plugin = loadPlugin(cfg.framework)

  return checkTemplatePath(templatePath).then(() => plugin.writeTemplates(templatePath))
}

module.exports = writeTemplates
