'use strict'

module.exports = function (templates) {
  return (el) => {
    let fn = (def) => def
    const transform = el.type.toLowerCase()

    fn = templates[transform] || fn
    return fn(el)
  }
}
