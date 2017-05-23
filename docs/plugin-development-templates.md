## Template Files

Because of the different needs of frameworks, We recommend seeing how [packages/bm-plugin-forms-angularjs](AngularJS) and [packages/bm-plugin-forms-json](JSON) are implemented to get some ideas of what template files you may need for your particular framework.

As every framework is different, there is no "one size fits all" solution. Some frameworks might not need templates (for example, the [packages/bm-plugin-forms-json](JSON) plug-in simply writes JSON to files), others might need a handful of templates, others might need a mix of Javascript and HTML, JSX or even CSS.

The template files that the plug-in provides are what will be turned into the source of the forms components. As each framework defines its components in a different way, template files will be different for every framework, perhaps even for every framework version.

The template files from a plug-in are copied out of the plug-in folder and into the templates folder specified during the Forms CLI project initialization. This is so that the developers can modify the templates (for example, if every form element needs a certain CSS class, or some custom code needs to be put into every javascript controller) on a per project basis, and use their version control system to version the templates with the project.

To make working with templates easier, we have made a [template helper module](packages/forms-template-helper), with common functions for reading, writing, and storing templates for use during the transformation.

We use the [mustache](https://github.com/janl/mustache.js) template library, with the delimiters set to `<% %>` rather than `{{ }}` so that we don't interfere with libraries like AngularJS, whose built in system also uses `{{ }}`


### Sample AngularJS template

```
<ng-form name="<%interaction%>" class="bm-form" <%#showWhen%>ng-show="<%moduleName%>.<%showWhen%>()"<%/showWhen%>
                  <%#hideWhen%>ng-hide="<%moduleName%>.<%hideWhen%>()"<%/hideWhen%>>
  <%&header%>
  <%&elements%>
  <%&footer%>

  <ng-transclude ng-transclude-slot="pagination"></ng-transclude>
  <button ng-click="<%moduleName%>.onSaveClick(<%moduleName%>.model)" ng-show="!<%moduleName%>.isSubForm">Submit</button>
</ng-form>
```

as per [mustache](https://github.com/janl/mustache.js#templates) docs, we have a very simple AngularJS `ng-form` element which uses the properties of the passed in element to create a HTML string representation of a form.

It is important to note that whilst we have a data normalization step, the data that is passed to `processForm` can be freely modified by you to match your mustache templates.

## Template priming

If you use the [template helper module](packages/forms-template-helper) we take advantage of the mustache [Mustache.parse](https://github.com/janl/mustache.js#pre-parsing-and-caching-templates) function to "prime" a Mustache renderer with the template string. When using the template helper module, `service.getByType('my-type')` returns an object with the template file name as the key (minus the .mustache part), and the value is a "Mustache renderer" - a function that takes an object and returns the compiled template string. See the [template helper docs](packages/forms-template-helper) for a list of functions and how to use them

## What about other template systems?

Whilst the template helper service uses [mustache](https://github.com/janl/mustache.js), you are not forced to use the template helper. This means that you are free to use whatever template system you wish in your plug-in.
