'use strict'

module.exports = (el) => {
  if (el.type === 'heading') {
    el.headingType = el.headingType ? 1 + Number(el.headingType) : 1
  }

  return el
}
