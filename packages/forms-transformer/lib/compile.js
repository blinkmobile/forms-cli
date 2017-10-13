// @flow
'use strict'

/*::
import type {
  FormDef,
  FromWriterWrappers
} from '../lib/transducers/framework.js'

import type {
  FormsCfg
} from '../lib/config/read-config.js'
*/

const loadPlugin = require('../lib/plugin-system/load-plugin.js')
const formsTransducer = require('../lib/transducers/framework.js')

function compile (
  options /* : FormsCfg */,
  normaliser /* : (FormsCfg) => Promise<FormDef[]> */
) /* : Promise<FromWriterWrappers> */ {
  const plugin = loadPlugin(options.framework)
  const transformer = formsTransducer(plugin.processForm)

  return plugin.init(options)
    .then(() => normaliser(options))
    .then((normalisedForms) => transformer(normalisedForms))
}

module.exports = compile
