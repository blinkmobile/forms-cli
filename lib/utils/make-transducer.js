'use strict'

const t = require('transducers-js')

class TransducerFactory {
  constructor () {
    this.t = t
    this.pipeline = []
    this.accum = (memo, val) => {
      memo.push(val)
      return memo
    }
  }

  set add (fn) {
    this.pipeline.push(fn)
  }

  set map (fn) {
    this.add(t.map(fn))
  }

  set filter (fn) {
    this.add(t.filter(fn))
  }

  set accumulator (fn) {
    this.accum = fn
  }

  go (input, empty) {
    if (!input) {
      throw new Error('Cannot transform nothing!')
    }
    empty = empty || []
    const xf = this.pipeline.length === 1 ? this.pipeline[0] : t.comp.apply(t, this.pipeline)

    t.transduce(xf, this.accum, empty, input)
  }
}

module.exports = () => new TransducerFactory()
