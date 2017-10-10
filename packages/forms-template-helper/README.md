# Forms CLI Template Helper

A collection of functions to help making a Framework plugin for the Blink Mobile Technologies Forms CLI easier.

See The [AngularJS](../bm-plugin-forms-angularjs) package for a detailed implementation.

## Installation

Install this module as part of your plugin code:

```
npm i --save @blinkmobile/forms-template-helper
```

Then require the module where needed and use the exposed API functions

## API

The template helper exposes the following functions via an object. The majority of function are wrapped by the functions provided by "service", but are exposed for convenience

### makeTemplateStore <a id="maketemplatestore"></a>

makeTemplateStore(templatePath: string) => Promise<TemplateStore>

Reads the folder/file structure from `templatePath` and creates the Templates. Templates in the root `templatePath` are the default templates. Folders represent forms, with the templates contained in the folders overriding the default templates of the same name.

### service <a id="service"></a>
Deprecated. Will be removed before next release
Object containing two functions that wrap most the below functions.

- load (templatePath) => Promise(&lt;Array&lt;MustacheRenderers>)
    - Loads all templates in a given path. Sub folders are treated as 'types', eg a folder structure of
```
|-templates
| |-html
| | |-text.mustache
| |-js
| | |-controller.js.mustache
```

results in two types of templates, "html" and "js"

- getByType (type) => Array&lt;object>
    - returns an object where the key is the name of the file (minus the .mustache part) and the value is a Mustache Renderer, "primed" with the template

### fileListHelper <a id="fileListHelper"></a>

Object containing helper functions for getting lists of files.

- getFileList(path &lt;string>) => Promise(Array&lt;string>)
    - Gets a list of files from the specified path
- getFolderList(path &lt;string>) => Promise(Array&lt;string>)
    - Gets a list of folders from the specified path

### readFileContents <a id="readFileContents"></a>

readFileContents(path-to-file &lt;string>) => Promise(contents &lt;string>)

Asynchronously reads the contents of a file and resolves with the contents of the file.

### mustacheRenderer <a id="mustacheRenderer"></a>

Object containing helper functions to prime a mustache template with the contents of a mustache file

- renderer (template&lt;string>) => (data&lt;object>) => &lt;string>
    - Returns a function that accepts an object of data, lazily runs mustache on the initial template with the data
- createRenderer (filePath&lt;string>) => (data&lt;object>) => &lt;string>
    - Takes a path to a mustache file and reads the file, passing the template to the above `renderer` function, returning the result



### writeFile <a id="writeFile"></a>

writeFile(filePath&lt;string>, contents&lt;string>) => Promise(filePath&lt;string>)

Writes `contents` to `path`. Will recursively create the path if it doesn't exist

### lazyWriteFile <a id="lazyWriteFile"></a>

lazyWriteFile (filePath&lt;string>, contents&lt;string>) => (basePath = '') => writeFile

Same as writeFile but returns a function that will write the file to `basePath` when run

### writeTemplates <a id="writeTemplates"></a>

writeTemplates (srcFolder&lt;string>, destFolder&lt;string>)

Used by the forms transformer during initialisation to copy the templates into the forms project folder.
`srcFolder` is where in your plugin project the template files are, `destFolder` is where they will be copied to. Note that all contents of `destFolder` are removed.

See the [docs/](docs/) folder for specific implementation details
