// @flow
'use strict'

/*::
export type FormDef = {
  uniqueNameId: string,
  name: string,
  formDescription:  string,
  defaultCategory:  string,
  maxStep: number,
  labelPlacement:  string,
  header:  string,
  footer: string,
  _elements: Array<Object>,
  _checks: Array<any>,
  _actions: Array<any>,
  _behaviours: Array<any>,
  answerspaceName: string,
  platformURL: string,
  answerspaceId: string
}

export type FormWriter = (string) => Promise<void>

export type FormWriters = Array<FormWriter>

export type FormWriterWrapper = () => Promise<FormWriters>

export type FromWriterWrappers = {
  [formName: string]: FormWriterWrapper
}
*/

const debugLogger = require('../logger/loggers.js').debugLogger

function formsTransducer (
  processForm /* : (FormDef) => Promise<Array<(string, string) => Promise<void>>> */
) /* (Array<FormDef>) => FromWriterWrappers */ {
  return (definition /* : Array<FormDef> */) => {
    return definition.reduce((memo, form) => {
      memo[form.name] = () => {
        debugLogger.debug('start framework processing of form definition')
        debugLogger.debug('input')
        debugLogger.debug(JSON.stringify(form))

        // Starting with Promise.resolve() for backward compatibility.
        // The `processForm()` function previously expected a synchronous function
        return Promise.resolve()
          .then(() => processForm(form))
          .then((writers) => {
            if (!Array.isArray(writers)) {
              writers = [writers]
            }
            return writers
          })
      }
      return memo
    }, {})
  }
}

module.exports = formsTransducer
