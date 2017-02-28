'use strict'

const path = require('path')

const footer = `(c) ${(new Date()).getUTCFullYear()} Blink Mobile Technologies`

function finishMessage (command, flags) {
  const showSrcLocation = command === 'create'
  const showBuildLocation = flags.build === true || command === 'build'

  /* Tagged template literal */
  return function msg (strings, ...values) {
    let [framework, srcLocation, libLocation] = values

    libLocation = path.join(...[...libLocation.split('/'), 'bm-forms.js'])

    const whatWasMade = `Forms Library ${showBuildLocation ? 'Component' : 'Source'}`
    const srcMsg = showSrcLocation ? `Source Location: ${path.resolve(srcLocation)}` : ''
    const libMsg = showBuildLocation ? `Compiled Component Location: ${path.resolve(libLocation)}` : ''
    const locations = srcMsg && libMsg ? `${srcMsg}

${libMsg}` : `${srcMsg || libMsg}`

    return `
===============================================================================
Finished creating the ${whatWasMade} for ${framework}

${locations}
` + strings.join(' ') + `
${footer}
===============================================================================`
  }
}

module.exports = finishMessage
