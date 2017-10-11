# Template Store API

A template store is a collection of templates used to render the HTML and javascript code.

Templates can be namespaced as "default" or "form specific", this is done in the file system by placing default templates in the root template folder, and any form specific templates in a subfolder named after the form.

```
+ textbox.mustache
+ FormName
|  + Radio.mustache
|  + FieldName.mustache
+ AnotherForm
|  + textbox.mustache

```

in the above folder structure, `FormName` will have a template for `radio`, `FieldName` and `textbox` fields. `AnotherForm` will only have `textbox` templates from the `AnotherForm` folder

## Creating

```javascript
const makeTemplateStore = require('@blinkmobile/forms-template-helper').makeTemplateStore

makeTemplateStore("path/to/templates")
  .then((templateStore) => {
    /*... do something with the templateStore */
  })
```

## TemplateStore Class

### Properties
#### TemplateStore.DEFAULT_STORE_NAME

Static property for the name of the store that holds the default templates

### Methods
#### add (template: Template, formName: string)

Adds a template to the template store. If `formName` is not specified, `TemplateStore.DEFAULT_STORE_NAME` is used.

#### getTemplates(formName: string)

Gets a set of templates for the given `formName` from the template store. If `formName` is not specified, `TemplateStore.DEFAULT_STORE_NAME` is used.
