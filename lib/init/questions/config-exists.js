'use strict'

const prompt = require('../../prompt-config.js')

function configExists () {
  const question = {
    properties: {
      overwrite: {
        description: 'Configuration already present in config file. Are you sure you want to overwrite it (y/N)',
        default: 'n',
        type: 'string',
        pattern: /^[y|n]$/i,
        required: true
      }
    }
  }

  prompt.start()

  return new Promise((resolve, reject) => {
    prompt.get(question, (err, result) => {
      if (err) {
        return reject(err)
      }

      if (result.overwrite.toLowerCase() === 'n') {
        /* eslint-disable no-process-exit */
        // the user accidently typed `init` and doesnt want to overwrite
        process.exit(0)
        /* eslint-enable no-process-exit */
      }

      // user wants to overwrite, return empty cfg
      return resolve({})
    })
  })
}

module.exports = configExists
