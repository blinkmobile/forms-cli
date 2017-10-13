// @flow
'use strict'

/*::
import type {
  FormDef,
  FromWriterWrappers
} from './transducers/framework.js'
*/

const path = require('path')

const debugLogger = require('./logger/loggers.js').debugLogger

function writeSite (
  basePath /* : string */,
  fromWriterWrappers /* : FromWriterWrappers */
) /* : Promise<any> */ {
  const formNames = Object.keys(fromWriterWrappers)

  return Promise.all(formNames.map((formName) => {
    let fromWriterWrapper = fromWriterWrappers[formName]
    if (!fromWriterWrapper) {
      return Promise.resolve()
    }

    if (typeof fromWriterWrapper !== 'function') {
      debugLogger.debug('FromWriterWrapper is not a function')
      return Promise.reject(new Error('FromWriterWrapper must be a single function'))
    }

    const formPath = path.join(basePath, formName)
    debugLogger.debug(`Writing form to ${formPath}`)
    return fromWriterWrapper()
      .then((formWriters) => {
        if (!Array.isArray(formWriters)) {
          formWriters = [formWriters]
        }
        return Promise.all(formWriters.map((formWriter) => {
          return formWriter(formPath)
        }))
      })
  }))
}

module.exports = {writeSite}
