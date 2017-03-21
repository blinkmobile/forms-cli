'use strict'

function paginate (strings, html, page) {
  return `<div class='bm-forms__pagination' ng-show='$ctrl.page === ${page}'>
  ${html}
</div>`
}

module.exports = paginate
