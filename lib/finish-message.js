'use strict'

const path = require('path')

const footer = `(c) ${(new Date()).getUTCFullYear()} Blink Mobile Technologies`

function finishMessage (command, flags) {
  const showSrcLocation = command === 'create'
  const showBuildLocation = (command === 'create' && flags.build === true) || command === 'build'

  /* Tagged template literal */
  return function msg (strings, ...values) {
    let [framework, srcLocation, libLocation, templatePath] = values

    libLocation = path.join(...[...libLocation.split('/'), 'bm-forms.js'])

    const whatWasMade = `Forms Library ${showBuildLocation ? 'Component' : 'Source'}`
    const srcMsg = showSrcLocation ? `Source Location: ${path.resolve(srcLocation)}` : ''
    const libMsg = showBuildLocation ? `Compiled Component Location: ${path.resolve(libLocation)}` : ''
    let locations = srcMsg && libMsg ? `${srcMsg}

${libMsg}` : `${srcMsg || libMsg}`
    let whatWasDone
    switch (command) {
      case 'init':
        whatWasDone = `initalising and creating the ${framework} templates`
        locations = `Form field template path: ${path.resolve(templatePath)}`
        break
      case 'scope':
        whatWasDone = 'setting your EPS scope'
        break
      default:
        whatWasDone = `creating the ${whatWasMade} files`
    }

    return `
===============================================================================
Finished ${whatWasDone}

${locations}
` + strings.join(' ') + `
${footer}
===============================================================================`
  }
}

module.exports = finishMessage
