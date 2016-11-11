'use script'

module.exports = {
  wordCount: {
    type: 'string',
    compile: (maxLength, parentSchema) => {
      // match any whitespace character that is immediatley followed by a non-whitespace char
      // should handle spaces and linebreaks signalling the start of a new word
      return (str) => str.match(/\s{1}\S/gm).length <= maxLength
    }
  }
}
