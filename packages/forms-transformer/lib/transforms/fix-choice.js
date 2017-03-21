'use strict'

const choiceMatrix = [
  ['multi', 'expanded', 'checkboxes'],
  ['select', 'expanded', 'radio'],
  ['multi', 'collapsed', 'select'],
  ['select', 'collapsed', 'select']
]

module.exports = function (el) {
  if (el.type === 'boolean') {
    return el
  }
  if (el.options && el.type !== 'checkbox') {
    el.options = Object.keys(el.options)

    let row = 0
    while (row < choiceMatrix.length) {
      const values = choiceMatrix[row]
      if (el.type === values[0] && el.mode === values[1]) {
        el.type = values[2]
        el.multi = values[0] === 'multi'
        break
      }

      row++
    }
  }
  return el
}
