'use strict'

const mustache = require('mustache')

module.exports = (template) => {
  mustache.parse(template, [ '<%', '%>' ])
  return (el, log) =>{
    log && console.log(el)
    return mustache.render(template, el)
  }
}
