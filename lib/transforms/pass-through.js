'use strict'

module.exports = (fn) => {
  return function (/*.. val*/) {
    const args = Array.prototype.slice.call(arguments)
    fn.apply && fn.apply(fn, args)

    return args
  }
}
