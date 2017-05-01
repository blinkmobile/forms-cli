# Submitting data to the Blink Mobility Platform

By default, the submit functionality in a form component will defer submission to `<moduleName>SubmitToBMPService`. The Blink Mobility Platform takes data in `application/x-www-form-urlencoded` format and this service will handle all the needed conversions.

## Customising form submission

If you wish to submit form data elsewhere, or in a different encoding, it is recommened that you modify the form controller templates (usualy these are written to the `<your-project>/templates/js` folder) to include your own submission service, and call that service in `$ctrl.onSaveClick()`

## How it works

`<moduleName>SubmitToBMPService` is a thin wrapper around AngularJS's `$http` service. This means that you are able to use your applications `.config` method to modify default values as mentioned in the [$httpProvider](https://docs.angularjs.org/api/ng/provider/$httpProvider) documentation.

## BMP Data restrictions

TBD.
