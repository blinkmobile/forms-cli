'use strict'

function paginate (_, html, page, moduleName) {
  return `<div class='bm-forms__pagination' ng-show='${moduleName}.page === ${page}'>
  ${html}
</div>`
}

module.exports = paginate
