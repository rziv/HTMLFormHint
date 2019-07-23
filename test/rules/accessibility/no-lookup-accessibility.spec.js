var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'no-lookup-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('select with tfsdatatype="LookUpWindow" should replace to Autocomplete', function(){
        var code = `<select class="tfsInputCombo"
        tfsdatatype="LookUpWindow" id="status" tfsdata=""
        data-bind="tlpLookUp:{ value: status.entity,bindOnSelect:{lookupOptions:statusList,optionsText:status.currentDataText,optionsValue:'dataCode'}},forceValueFromOptions: true"></select>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('select with tfsdatatype="LookUpWindow" should replace to Autocomplete', function(){
        var code = `<select class="autocomplete-field" data-bind="value: status.dataText, autocompleteBindList: status" data-schema-type="autocomplete" id="status"></select>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });    
});