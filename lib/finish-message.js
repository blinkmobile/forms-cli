'use strict'

const path = require('path')

const footer = `(c) ${(new Date()).getUTCFullYear()} Blink Mobile Technologies`

function finishMessage (command, flags) {
  const showSrcLocation = command === 'create'
  const showBuildLocation = (command === 'create' && flags.build === true) || command === 'build'

  /* Tagged template literal */
  return function msg (strings, ...values) {
    let [framework, srcLocation, libLocation, templatePath, scope] = values

    const whatWasMade = `Forms Library ${showBuildLocation ? 'Component' : 'Source'}`
    const srcMsg = showSrcLocation ? `Source Location: ${path.resolve(srcLocation)}` : ''
    const libMsg = showBuildLocation ? `Compiled Component Location: ${path.resolve(path.join(...[...libLocation.split('/'), 'bm-forms.js']))}` : ''
    let locations = srcMsg && libMsg ? `${srcMsg}

${libMsg}` : `${srcMsg || libMsg}`
    let whatWasDone
    switch (command) {
      case 'init':
        whatWasDone = `Finished initalising and creating the ${framework} templates`
        locations = `Form field template path: ${path.resolve(templatePath)}`
        break
      case 'scope':
        whatWasDone = scope ? `Your EPS scope is set to ${scope}` : `You have not set an EPS scope yet.

Please use the command \`bm forms scope <eps url>\` to set one`
        break
      default:
        whatWasDone = `Finished creating the ${whatWasMade} files`
    }

    return `
===============================================================================
${whatWasDone}

${locations}
` + strings.join(' ') + `
${footer}
===============================================================================`
  }
}

module.exports = finishMessage
