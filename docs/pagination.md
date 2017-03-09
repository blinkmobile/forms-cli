# Pagination

The Blink Forms Builder has the ability to specify "pages" with a form. This functionality has been carried over to the Forms Library Builder.

The Front end framework used determines how pagination is handled. For now we only support AngularJS 1.5+, therefore all information in this file applies to it.

## Implementation

Each form component communicates via one way bindings as per the AngularJS Component [spec](https://docs.angularjs.org/guide/component#component-based-application-architecture)


```html
<my-custom-form page="$myController.currentPage"
                on-page-change="$myController.onPageChange(page)">
</my-custom-form>
```

## Inputs

### page

type: Number

Pages start at index 0.

You can control which page the form shows by binding `page` to a value on your controller.

## Outputs

### on-page-change

Type: Expression

Parameters: page

If you are binding to a function, the parameter must be called `page`, otherwise nothing will be passed in. This function will be called whenever the component changes the page, eg. when the inbuilt `Previous` and `Next` buttons are clicked

## Customisation

By default the `<lib-folder>/templates/html/pagination.mustache` template file will define the look of your pagination buttons. These controls will appear inside the Form HTML. You can customise the mustache template before running `bm forms create` to change the look and feel of the customisation.

If you wish to use a pagination directive/component, you bind the directive/component to update the same variable specified in the `page` input attribute on the custom form element.

If you do use your own directives or HTML you can either delete `<lib-folder>/templates/html/pagination.mustache` or make its contents empty, and no pagination HTML will be included in the form library you build.

The form component also supports transclusion to include the custom HTML inside the form layout.

### Transclusion

Transclusion is achieved via optional transclusion [slots](https://docs.angularjs.org/api/ng/directive/ngTransclude#multi-slot-transclusion). You must wrap your directives/html in a custom element called `pagination`

```html
<my-custom-form page="$myController.currentPage"
                on-page-change="$myController.onPageChange(page)">
  <pagination>
    <!-- insert custom pagination layout here -->
  </pagination>
</my-custom-form>

```
