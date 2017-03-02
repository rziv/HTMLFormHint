var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'validation-message-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('span with class "validationMessage" with no id should result in an error', function () {
        var code = '<span class="validationMessage"  aria-live="assertive"></span>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

    it('span with class "validationMessage" that its id does not starts with "vmsg_" should result in an error', function () {
        var code = '<span class="validationMessage" id="input1" aria-live="assertive"></span>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

    it('span with class "validationMessage" that its id starts with "vmsg_" should not result in an error', function () {
        var code = '<span class="validationMessage" id="vmsg_input1" aria-live="assertive"></span>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('span with class "validationMessage" with no aria-live attribute should result in an error', function () {
        var code = '<span class="validationMessage" id="vmsg_input1"></span>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

    it('span with class "validationMessage" that its aria-live attribute value is different than "assertive" should result in an error', function () {
        var code = '<span class="validationMessage" id="vmsg_input1" aria-live="off"></span>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

    it('span with class "validationMessage" with attribute aria-live="assertive" should not result in an error', function () {
        var code = '<div><select id="city"  aria-live="assertive"></select><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('span with class "validationMessage" that has no id or no aria-live should result in an error', function () {
        var code = '<span class="validationMessage"></span>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

});