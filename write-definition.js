'use strict'

const fs = require('fs')
const path = require('path')

const input = ["{\"default\":{\"uniqueNameId\":\"2huuim\",\"name\":\"simple_form\",\"formDescription\":\"\",\"defaultCategory\":\"\",\"maxStep\":6,\"labelPlacement\":\"auto\",\"header\":\"\",\"footer\":\"\",\"_elements\":[{\"default\":{\"name\":\"id\",\"type\":\"text\",\"page\":0}},{\"default\":{\"name\":\"_heading_1\",\"type\":\"heading\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"text\":\"I am a heading\",\"headingSmallText\":\"heading, bitches!\",\"position\":\"left\",\"fontFace\":\"arial\",\"page\":0}},{\"default\":{\"name\":\"textbox\",\"type\":\"text\",\"label\":\"Textbox\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"defaultValue\":\"blarg\",\"tooltip\":\"default tool tip\",\"hint\":\"default hint text\",\"rowClass\":\"default-row-class\",\"rowStyle\":\"default-row-style\",\"maxWidth\":\"10\",\"maxWidthPrefix\":\"characters\",\"prefix\":\"default-prefix\",\"suffix\":\"default-suffix\",\"characterLimit\":\"20\",\"placeholderText\":\"default-placeholder\",\"page\":0},\"add\":{\"customise\":\"1\",\"label\":\"Add Textbox\",\"tooltip\":\"add tool tip\",\"rowClass\":\"row-class\",\"placeholderText\":\"add placeholder\"},\"edit\":{\"customise\":\"1\",\"label\":\"edit textbox\",\"labelPlacement\":\"left\",\"tooltip\":\"edit textbox tooltip\",\"placeholderText\":\"edit placeholder\"}},{\"default\":{\"name\":\"textarea\",\"type\":\"textarea\",\"label\":\"Textarea\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"required\":\"1\",\"wrap\":\"hard\",\"page\":0},\"add\":{\"customise\":\"1\",\"label\":\"add textarea label\",\"tooltip\":\"add textarea tooltip\"}},{\"default\":{\"name\":\"date\",\"type\":\"date\",\"label\":\"Date\",\"page\":0}},{\"default\":{\"name\":\"selectbox\",\"type\":\"select\",\"label\":\"Selectbox\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"options\":{\"select 1\":\"select 1\",\"select 2\":\"select 2\",\"select 3\":\"select 3\"},\"dataSource\":\"static\",\"mode\":\"collapsed\",\"page\":0}},{\"default\":{\"name\":\"choice\",\"type\":\"select\",\"label\":\"Choice\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"options\":{\"choice 1\":\"choice 1\",\"choice 2\":\"choice 2\",\"choice 3\":\"choice 3\"},\"mode\":\"expanded\",\"page\":0}},{\"default\":{\"name\":\"password\",\"type\":\"password\",\"label\":\"Password\",\"page\":0}},{\"default\":{\"name\":\"email\",\"type\":\"email\",\"label\":\"Email\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"page\":0}},{\"default\":{\"name\":\"url\",\"type\":\"url\",\"label\":\"Url\",\"page\":0}},{\"default\":{\"name\":\"phoneNumber\",\"type\":\"telephone\",\"label\":\"Phone Number\",\"page\":0}},{\"default\":{\"name\":\"number\",\"type\":\"number\",\"label\":\"Number\",\"page\":0}},{\"default\":{\"name\":\"currency\",\"type\":\"number\",\"label\":\"Currency\",\"page\":0}},{\"default\":{\"name\":\"multiSelect\",\"type\":\"multi\",\"label\":\"Multi Select\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"options\":{\"multi 1\":\"multi 1\",\"multi 2\":\"multi 2\",\"multi 3\":\"multi 3\"},\"other\":\"1\",\"mode\":\"collapsed\",\"page\":0}},{\"default\":{\"name\":\"checkBoxes\",\"type\":\"multi\",\"label\":\"Check Boxes\",\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"options\":{\"check boxes 1\":\"check boxes 1\",\"check boxes 2\":\"check boxes 2\",\"check boxes 3\":\"check boxes 3\"},\"mode\":\"expanded\",\"page\":0}},{\"default\":{\"name\":\"checkbox\",\"type\":\"boolean\",\"label\":\"Checkbox\",\"options\":[\"n\",\"y\"],\"defaultValue\":0,\"page\":0}},{\"default\":{\"name\":\"time\",\"type\":\"time\",\"label\":\"Time\",\"page\":0}},{\"default\":{\"name\":\"dateTime\",\"type\":\"datetime\",\"label\":\"Date Time\",\"page\":0}},{\"default\":{\"name\":\"fileUpload\",\"type\":\"file\",\"label\":\"File Upload\",\"page\":0}}],\"_checks\":[{\"default\":{\"name\":\"textboxIsHello\",\"exp\":{\"operator\":\"==\",\"operands\":[{\"operator\":\"formElement.value\",\"operands\":[\"textbox\"]},\"hello\"]}}}],\"_actions\":[{\"default\":{\"name\":\"showEmail\",\"manipulations\":[{\"target\":\"email\",\"properties\":{\"hidden\":false,\"persist\":true}}]}}],\"_behaviours\":[{\"default\":{\"name\":\"showEmail_textboxIsHello\",\"trigger\":{\"formElements\":[\"textbox\"],\"formEvents\":[\"load\"]},\"check\":\"textboxIsHello\",\"actions\":[{\"action\":\"showEmail\",\"autoReverse\":true}]}}]},\"list\":{\"interaction\":\"SIMPLE_FORM_LIST\",\"displayName\":\"SIMPLE_FORM LIST\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":null,\"action\":\"list\",\"orderBy\":null,\"showLink\":{\"edit\":\"1\",\"view\":\"1\",\"delete\":\"1\"},\"dataStorageList\":\"temporary\",\"downloadModeList\":\"partial\",\"recordsToDisplay\":\"\",\"_elements\":[\"textbox\",\"textarea\",\"date\"]},\"search\":{\"interaction\":\"\",\"displayName\":null,\"defaultCategory\":null,\"header\":null,\"footer\":null,\"hidden\":null,\"action\":\"search\"},\"add\":{\"interaction\":\"SIMPLE_FORM_ADD\",\"displayName\":\"SIMPLE_FORM ADD\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":null,\"action\":\"add\",\"_elements\":[\"_heading_1\",\"textbox\",\"textarea\",\"date\",\"selectbox\",\"choice\",\"password\",\"email\",\"url\",\"phoneNumber\",\"number\",\"currency\",\"multiSelect\",\"checkBoxes\",\"checkbox\",\"time\",\"dateTime\",\"fileUpload\"]},\"edit\":{\"interaction\":\"SIMPLE_FORM_EDIT\",\"displayName\":\"SIMPLE_FORM EDIT\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"edit\",\"_elements\":[\"_heading_1\",\"textbox\",\"textarea\",\"selectbox\",\"choice\",\"password\",\"email\",\"url\",\"phoneNumber\",\"number\",\"currency\",\"multiSelect\",\"checkBoxes\",\"checkbox\",\"time\",\"dateTime\",\"fileUpload\"]},\"view\":{\"interaction\":\"SIMPLE_FORM_VIEW\",\"displayName\":\"SIMPLE_FORM VIEW\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"view\",\"_elements\":[\"_heading_1\",\"textbox\",\"textarea\",\"date\",\"selectbox\",\"choice\",\"password\",\"email\",\"url\",\"phoneNumber\",\"number\",\"currency\",\"multiSelect\",\"checkBoxes\",\"checkbox\",\"time\",\"dateTime\",\"fileUpload\"]},\"delete\":{\"interaction\":\"SIMPLE_FORM_DELETE\",\"displayName\":\"SIMPLE_FORM DELETE\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"delete\",\"_elements\":[\"_heading_1\",\"textbox\",\"textarea\",\"date\",\"selectbox\",\"choice\",\"password\",\"email\",\"url\",\"phoneNumber\",\"number\",\"currency\",\"multiSelect\",\"checkBoxes\",\"checkbox\",\"time\",\"dateTime\",\"fileUpload\"]}}","{\"default\":{\"uniqueNameId\":\"qmh1agfs\",\"name\":\"simple_w_existing\",\"formDescription\":\"\",\"defaultCategory\":\"\",\"maxStep\":6,\"labelPlacement\":\"auto\",\"header\":\"\",\"footer\":\"\",\"_elements\":[{\"default\":{\"name\":\"id\",\"type\":\"text\",\"page\":0}},{\"default\":{\"name\":\"field_one\",\"type\":\"text\",\"label\":\"Field One\",\"page\":0}},{\"default\":{\"name\":\"field_two\",\"type\":\"text\",\"label\":\"Field Two\",\"page\":0}},{\"default\":{\"name\":\"big_form\",\"type\":\"subForm\",\"subForm\":\"simple_form\",\"_elements\":{\"|heading|1\":{\"hide\":\"\",\"override\":\"\",\"type\":\"heading\",\"id\":\"_heading_1\"},\"textbox\":{\"hide\":\"\",\"override\":\"\",\"type\":\"textbox\",\"id\":\"textbox\"},\"textarea\":{\"hide\":\"\",\"override\":\"\",\"type\":\"text_area\",\"id\":\"textarea\"},\"date\":{\"hide\":\"\",\"override\":\"\",\"type\":\"date\",\"id\":\"date\"},\"selectbox\":{\"hide\":\"\",\"override\":\"\",\"type\":\"select\",\"id\":\"selectbox\"},\"choice\":{\"hide\":\"\",\"override\":\"\",\"type\":\"radio\",\"id\":\"choice\"},\"password\":{\"override\":\"\",\"type\":\"password\",\"id\":\"password\",\"hide\":\"1\"},\"email\":{\"override\":\"\",\"type\":\"email\",\"id\":\"email\",\"hide\":\"1\"},\"url\":{\"override\":\"\",\"type\":\"url\",\"id\":\"url\",\"hide\":\"1\"},\"phoneNumber\":{\"override\":\"\",\"type\":\"phone_number\",\"id\":\"phoneNumber\",\"hide\":\"1\"},\"number\":{\"override\":\"\",\"type\":\"number\",\"id\":\"number\",\"hide\":\"1\"},\"currency\":{\"override\":\"\",\"type\":\"currency\",\"id\":\"currency\",\"hide\":\"1\"},\"multiSelect\":{\"hide\":\"\",\"override\":\"\",\"type\":\"multi\",\"id\":\"multiSelect\"},\"checkBoxes\":{\"hide\":\"\",\"override\":\"\",\"type\":\"checkboxes\",\"id\":\"checkBoxes\"},\"checkbox\":{\"hide\":\"\",\"override\":\"\",\"type\":\"checkbox\",\"id\":\"checkbox\"},\"time\":{\"hide\":\"\",\"override\":\"\",\"type\":\"time\",\"id\":\"time\"},\"dateTime\":{\"hide\":\"\",\"override\":\"\",\"type\":\"timestamp\",\"id\":\"dateTime\"},\"fileUpload\":{\"hide\":\"\",\"override\":\"\",\"type\":\"file_upload\",\"id\":\"fileUpload\"}},\"labelPlacement\":\"default\",\"labelStyle\":\"Plain\",\"subformControlPos\":\"below\",\"subformPerms\":\"allow_add\",\"preload\":\"no\",\"page\":0}}],\"_checks\":[],\"_actions\":[],\"_behaviours\":[]},\"list\":{\"interaction\":\"SIMPLE_W_EXISTING_LIST\",\"displayName\":\"SIMPLE_W_EXISTING LIST\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":null,\"action\":\"list\",\"orderBy\":null,\"showLink\":{\"edit\":\"1\",\"view\":\"1\",\"delete\":\"1\"},\"dataStorageList\":\"temporary\",\"downloadModeList\":\"partial\",\"recordsToDisplay\":\"\",\"_elements\":[\"field_one\",\"field_two\",\"big_form\"]},\"search\":{\"interaction\":\"\",\"displayName\":null,\"defaultCategory\":null,\"header\":null,\"footer\":null,\"hidden\":null,\"action\":\"search\"},\"add\":{\"interaction\":\"SIMPLE_W_EXISTING_ADD\",\"displayName\":\"SIMPLE_W_EXISTING ADD\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":null,\"action\":\"add\",\"_elements\":[\"field_one\",\"field_two\",\"big_form\"]},\"edit\":{\"interaction\":\"SIMPLE_W_EXISTING_EDIT\",\"displayName\":\"SIMPLE_W_EXISTING EDIT\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"edit\",\"_elements\":[\"field_one\",\"field_two\",\"big_form\"]},\"view\":{\"interaction\":\"SIMPLE_W_EXISTING_VIEW\",\"displayName\":\"SIMPLE_W_EXISTING VIEW\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"view\",\"_elements\":[\"field_one\",\"field_two\",\"big_form\"]},\"delete\":{\"interaction\":\"SIMPLE_W_EXISTING_DELETE\",\"displayName\":\"SIMPLE_W_EXISTING DELETE\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"delete\",\"_elements\":[\"field_one\",\"field_two\",\"big_form\"]}}","{\"default\":{\"uniqueNameId\":\"vjhj96im\",\"name\":\"small_with_subform\",\"formDescription\":\"\",\"defaultCategory\":\"\",\"maxStep\":6,\"labelPlacement\":\"auto\",\"header\":\"\",\"footer\":\"\",\"_elements\":[{\"default\":{\"name\":\"id\",\"type\":\"text\",\"page\":0}},{\"default\":{\"name\":\"first\",\"type\":\"text\",\"label\":\"First\",\"page\":0}},{\"default\":{\"name\":\"second\",\"type\":\"text\",\"label\":\"Second\",\"page\":0}},{\"default\":{\"name\":\"subform_1\",\"type\":\"subForm\",\"subForm\":\"subform_1\",\"page\":0}}],\"_checks\":[],\"_actions\":[],\"_behaviours\":[]},\"list\":{\"interaction\":\"SMALL_WITH_SUBFORM_LIST\",\"displayName\":\"SMALL_WITH_SUBFORM LIST\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":null,\"action\":\"list\",\"orderBy\":null,\"showLink\":{\"edit\":\"1\",\"view\":\"1\",\"delete\":\"1\"},\"dataStorageList\":\"temporary\",\"downloadModeList\":\"partial\",\"recordsToDisplay\":\"\",\"_elements\":[\"first\",\"second\",\"subform_1\"]},\"search\":{\"interaction\":null,\"displayName\":null,\"defaultCategory\":null,\"header\":null,\"footer\":null,\"hidden\":null,\"action\":\"search\"},\"add\":{\"interaction\":\"SMALL_WITH_SUBFORM_ADD\",\"displayName\":\"SMALL_WITH_SUBFORM ADD\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":null,\"action\":\"add\",\"_elements\":[\"first\",\"second\",\"subform_1\"]},\"edit\":{\"interaction\":\"SMALL_WITH_SUBFORM_EDIT\",\"displayName\":\"SMALL_WITH_SUBFORM EDIT\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"edit\",\"_elements\":[\"first\",\"second\",\"subform_1\"]},\"view\":{\"interaction\":\"SMALL_WITH_SUBFORM_VIEW\",\"displayName\":\"SMALL_WITH_SUBFORM VIEW\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"view\",\"_elements\":[\"first\",\"second\",\"subform_1\"]},\"delete\":{\"interaction\":\"SMALL_WITH_SUBFORM_DELETE\",\"displayName\":\"SMALL_WITH_SUBFORM DELETE\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"delete\",\"_elements\":[\"first\",\"second\",\"subform_1\"]}}","{\"default\":{\"uniqueNameId\":\"3gep\",\"name\":\"subform_1\",\"formDescription\":\"\",\"defaultCategory\":\"\",\"maxStep\":6,\"labelPlacement\":\"auto\",\"header\":\"\",\"footer\":\"\",\"_elements\":[{\"default\":{\"name\":\"id\",\"type\":\"text\",\"page\":0}},{\"default\":{\"name\":\"sub_first\",\"type\":\"text\",\"label\":\"Sub First\",\"page\":0}},{\"default\":{\"name\":\"sub_second\",\"type\":\"text\",\"label\":\"Sub Second\",\"page\":0}}],\"_checks\":[],\"_actions\":[],\"_behaviours\":[]},\"list\":{\"interaction\":\"\",\"displayName\":\"\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":null,\"action\":\"list\",\"orderBy\":null,\"showLink\":{\"edit\":\"1\",\"view\":\"1\",\"delete\":\"1\"},\"dataStorageList\":\"temporary\",\"downloadModeList\":\"partial\",\"recordsToDisplay\":\"\",\"_elements\":[\"sub_first\",\"sub_second\"]},\"search\":{\"interaction\":null,\"displayName\":null,\"defaultCategory\":null,\"header\":null,\"footer\":null,\"hidden\":null,\"action\":\"search\"},\"add\":{\"interaction\":\"\",\"displayName\":\"\",\"defaultCategory\":\"\",\"header\":\"<h1>let see what happens when i add a header<\\\/h1>\",\"footer\":\"<footer>let see what happens when i add a footer<\\\/footer>\",\"hidden\":null,\"action\":\"add\",\"_elements\":[\"sub_first\",\"sub_second\"]},\"edit\":{\"interaction\":\"\",\"displayName\":\"\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"edit\",\"_elements\":[\"sub_first\",\"sub_second\"]},\"view\":{\"interaction\":\"\",\"displayName\":\"\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"view\",\"_elements\":[\"sub_first\",\"sub_second\"]},\"delete\":{\"interaction\":\"\",\"displayName\":\"\",\"defaultCategory\":\"\",\"header\":\"\",\"footer\":\"\",\"hidden\":\"1\",\"action\":\"delete\",\"_elements\":[\"sub_first\",\"sub_second\"]}}"]
const answerspaceName = 'simon'

const json = input.map((str) => JSON.parse(str))

const str = '[' + json.reduce((memo, form) => {
  memo.push(JSON.stringify(form))
  return memo
}, []).join(',') + ']'

const p = path.join(process.cwd(), answerspaceName)

try {
  fs.accessSync(p)
} catch (e) {
  fs.mkdirSync(p)
}
const filename = path.join(p, 'definition.json')
fs.writeFile(filename, str, 'utf8', (err) => {
  if (err) {
    console.log(`Error writing to ${filename}`)
    return console.log(err)
  }

  console.log(`successfully wrote to ${filename}`)
})
