# Using the finished product in a project

This plugin creates AngularJS components from a Blink Forms definition. They are designed to be a component included in your front end project, as such they wont create a complete web app.

You should be familiar with the AngularJS [component architechture](https://docs.angularjs.org/guide/component)

## Including the code

When the forms transformer is used, this plugin will create two files in the specified `dist/` folder.

- `bm-forms.js` - The concatenated forms component code, including the input html
- `index.html` - An example on how to include it in a simple web app.

## Angular Modules and components

You should be familiar with [AngularJS modules](https://docs.angularjs.org/guide/module#recommended-setup) conventions.

Each form component is inside its own module. The AngularJS module and component name are the same, and will conform to AngularJS naming conventions.

If your form name is `Report_Form`, then in your application you will need to include `reportForm` as a dependency:

```javascript
angular.module('myApp', ['reportForm', 'other3rdPartyModule'])
```

To use the forms, in your template html, use the custom element syntax:

```html
<div class="form-container">
  <report-form model="$ctrl.myFormModel"></report-form>

  <input type="submit" ng-click="$ctrl.submit($ctrl.myFormModel)">
</div>
```
