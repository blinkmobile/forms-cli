'use strict'

module.exports = (el) => {
  if (el.type === 'heading') {
    el.headingType = el.headingType ? el.headingType + 1 : 1
  }

  return el
}
