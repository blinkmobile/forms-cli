# Saving Drafts

The Angular plugin for Blink Forms CLI automatically sets up forms to save/retrieve data to/from the devices local storage. It relies on the [AngularJS Draft Queue](https://github.com/blinkmobile/angularjs-draft-queue) module for the functionality.

# Setup

You will need to include the AngularJS Draft Queue in your projects build step or in your html and then configure the service.

```html
<html>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
    <script src="/node_modules/@blinkmobile/angularjs-draft-queue/dist/bm-angularjs-draft-queue.js"></script>
    <script src="/dist/blink-forms-bundle.js"></script>
  </head>
  <body>
    <script>
    angular.module('forms', ['simpleForm', 'bmDraftQueue'])
           .config(['bmDraftQueueServiceProvider', function (draftQueueProvider) {
              draftQueueProvider.config({appName: 'demoApp'})
           }])
    angular.bootstrap(document, ['forms'])
    </script>
  </body>
</html>
```


A complete example can be found in `dist/index.html` once you have built your forms.

See the [AngularJS Draft Queue](https://github.com/blinkmobile/angularjs-draft-queue) repo for more details on how to use the draft queue in your app.
