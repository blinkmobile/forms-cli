# Normalised JSON Definition

## Purpose

Blink Forms 2 used server rendered HTML modified by XSLT
Blink Forms 3 used a JSON format and was rendered on the client by jQuery Mobile

Both of these format come from the Blink Forms builder. They also included many nuances specific to FORMS2 and FORMS3.

The normalised format gets rid of many of the nuances and makes the format friendlier, however some legacy properties exist in the definition. They can be safely ignored, and exist for convience.

# _elements

The elements property is an array of objects representing the elements of the form. Whilst we have kept properties like `labelPlacement` and `labelStyle`, we prefer to use the new plugin templates to specify layout. If you are making your own plug-in we strongly recommend using the templating feature and ignoring any layout properties here

# _checks, _actions, _behaviors

These fields are filled out by the old Blink Forms Builder, and are for very basic functions like hiding fields based on values in other fields. The [AngularJS](../packages/bm-plugin-forms-angularjs) package contains AST based transforms for making simple functions in the form controller from the values in these fields, however if you are not using the BMP based Forms builder it is recommended that you build any logic into your custom plug-in templates.

For more involved form behavior, the source of the form component can be edited before being built.

## Structure
```json
[{
  "uniqueNameId": "mzqo6md",
  "name": "FormName",
  "formDescription": "",
  "defaultCategory": "",
  "maxStep": 6,
  "labelPlacement": "auto",
  "header": "the form header",
  "footer": "the form footer",
  "_elements": [
    {
      "name": "id",
      "type": "hidden",
      "page": 0
    },
    {
      "name": "subformtest",
      "type": "subForm",
      "subForm": "subformtest",
      "page": 0
    },
    {
      "name": "text",
      "type": "text",
      "label": "Text",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "defaultValue": "text value",
      "maxWidthPrefix": "characters",
      "page": 0,
      "value": "\"text value\""
    },
    {
      "name": "textarea",
      "type": "text",
      "label": "Textarea",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "defaultValue": "text area",
      "maxWidthPrefix": "characters",
      "page": 0,
      "value": "\"text area\""
    },
    {
      "name": "password",
      "type": "password",
      "label": "Password",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "maxWidthPrefix": "characters",
      "page": 0
    },
    {
      "name": "email",
      "type": "email",
      "label": "Email",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "page": 0
    },
    {
      "name": "url",
      "type": "url",
      "label": "Url",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "page": 0
    },
    {
      "name": "phone",
      "type": "text",
      "label": "Phone",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "maxWidthPrefix": "characters",
      "page": 0
    },
    {
      "name": "number",
      "type": "number",
      "label": "Number",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "page": 0
    },
    {
      "name": "currency",
      "type": "number",
      "label": "Currency",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "defaultValue": "1.99",
      "page": 0,
      "value": "1.99"
    },
    {
      "name": "radio",
      "type": "radio",
      "label": "Radio",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "options": [
        "yes",
        "no",
        "maybe"
      ],
      "mode": "expanded",
      "page": 0,
      "multi": false
    },
    {
      "name": "select",
      "type": "select",
      "label": "Select",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "options": [
        "yes",
        "no",
        "maybe"
      ],
      "dataSource": "static",
      "mode": "collapsed",
      "page": 0,
      "multi": false
    },
    {
      "name": "star",
      "type": "number",
      "label": "Star",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "defaultValue": "5",
      "mode": "graphical",
      "graphic": {
        "active": {
          "ascii": "*"
        },
        "inactive": {
          "ascii": "*"
        }
      },
      "min": "0",
      "max": "5",
      "page": 0,
      "value": "5"
    },
    {
      "name": "multiselect",
      "type": "select",
      "label": "Multiselect",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "options": [
        "yes",
        "no",
        "maybe"
      ],
      "mode": "collapsed",
      "page": 0,
      "multi": true,
      "value": "[undefined]"
    },
    {
      "name": "checkboxes",
      "type": "checkboxes",
      "label": "Checkboxes",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "options": [
        "yes",
        "no",
        "maybe",
        "sometimes"
      ],
      "mode": "expanded",
      "page": 0,
      "multi": true,
      "value": "[undefined]"
    },
    {
      "name": "checkbox",
      "type": "boolean",
      "label": "Checkbox",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "defaultValue": 0,
      "options": [
        "n",
        "y"
      ],
      "page": 0,
      "value": 0
    },
    {
      "name": "_heading_1",
      "type": "heading",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "text": "I am a new page",
      "headingPageBreak": "1",
      "position": "left",
      "fontFace": "arial",
      "page": 1,
      "headingType": 1
    },
    {
      "name": "date",
      "type": "date",
      "label": "Date",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "dateFormat": "dd_mm_yyyy",
      "defaultDate": "now",
      "defaultValue": "now",
      "page": 1,
      "value": "now"
    },
    {
      "name": "time",
      "type": "time",
      "label": "Time",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "timeFormat": "hh_mm",
      "defaultTime": "now",
      "minuteStep": "1",
      "defaultValue": "now",
      "page": 1,
      "value": "now"
    },
    {
      "name": "datetime",
      "type": "datetime",
      "label": "Datetime",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "dateFormat": "dd_mm_yyyy",
      "timeFormat": "hh_mm",
      "defaultTimestamp": "now",
      "minuteStep": "1",
      "defaultValue": "now",
      "page": 1,
      "value": "now"
    },
    {
      "name": "camera",
      "type": "camera",
      "label": "Camera",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "capture": true,
      "accept": "image/*",
      "page": 1
    },
    {
      "name": "image",
      "type": "file",
      "label": "Image",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "accept": "image/*",
      "page": 1
    },
    {
      "name": "file",
      "type": "file",
      "label": "File",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "page": 1
    },
    {
      "name": "location",
      "type": "location",
      "label": "Location",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "page": 1
    },
    {
      "name": "sketch",
      "type": "draw",
      "label": "Sketch",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "size": "signature",
      "page": 1
    },
    {
      "name": "value",
      "type": "text",
      "label": "Value",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "page": 1
    }
  ],
  "_checks": [],
  "_actions": [],
  "_behaviours": [],
  "answerspaceName": "https://blinkm.co/yourAnswerspace",
  "platformURL": "https://blinkm.co",
  "answerspaceId": "12345"
},
{
  "uniqueNameId": "3gf2",
  "name": "subformtest",
  "formDescription": "",
  "defaultCategory": "",
  "maxStep": 6,
  "labelPlacement": "auto",
  "header": "",
  "footer": "",
  "_elements": [
    {
      "name": "id",
      "type": "hidden",
      "page": 0
    },
    {
      "name": "input",
      "type": "text",
      "label": "Input",
      "page": 0
    },
    {
      "name": "radio",
      "type": "radio",
      "label": "Radio",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "options": [
        "yes",
        "no",
        "maybe"
      ],
      "mode": "expanded",
      "page": 0,
      "multi": false
    },
    {
      "name": "select",
      "type": "select",
      "label": "Select",
      "labelPlacement": "default",
      "labelStyle": "Plain",
      "options": [
        "yes",
        "no",
        "maybe"
      ],
      "dataSource": "static",
      "mode": "collapsed",
      "page": 0,
      "multi": false
    },
    {
      "name": "location",
      "type": "location",
      "label": "Location",
      "page": 0
    }
  ],
  "_checks": [],
  "_actions": [],
  "_behaviours": [],
  "answerspaceName": "https://blinkm.co/yourAnswerspace",
  "platformURL": "https://blinkm.co",
  "answerspaceId": "12345"
}
]
```
