var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'required-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('input with "tfsrequired" attribute should result in an error', function(){
        var code = `<input id="Fname" tfsRequired maxlength="25" data-bind="value: Fname">`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('input with "tfsrequired" binding should result in an error', function(){
        var code = `<input id="Fname" maxlength="25" data-bind="value: Fname,attr:{'tfsrequired':isCustody}">`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('input without "tfsrequired" attribute should not result in an error', function(){
        var code = `<input id="Fname" maxlength="25" data-bind="value: Fname">`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });    
});

