# Maybe run

This is not the Maybe Monad, it is a utility to make working with Promises and NodeJS callback errors a little nicer.

## Usage


```javascript
const maybeRun = require('@blinkmobile/maybe-run')

function writeFileContents (p, contents) {
  return new Promise((resolve, reject) => {
    const notError = maybeRun(reject)
    const dirname = path.dirname(p)

    mkdirp(dirname, (err) => {
      if (notError(err)) {
        fs.writeFile(p, contents, (err) => {
          notError(err) && resolve(p)
        })
      }
    })
  })
}
```
