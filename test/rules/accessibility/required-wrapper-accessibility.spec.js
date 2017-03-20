var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'required-wrapper-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

var messagePrefix = HTMLHint.resources.validationMessagesAccessibility.messageIdPrefix;

describe('Rules: ' + ruldId, function () {

    it('div with "requiredWrapper" binding and no validationMessage inside should result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                    <input id='firstName'/>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(3);
        expect(messages[0].col).to.be(21);
    });

    it('div with "requiredWrapper" binding with validationMessage and no element that points to it should result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                  <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(3);
        expect(messages[0].col).to.be(21);
    });

    it('div with "requiredWrapper" binding with validationMessage and element that points to it should not result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                       <input id='firstName' data-bind='addDescription:"${messagePrefix}input1"'/>
                       <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div with "requiredWrapper" binding with multiple validationMessages and element that points to one of them should not result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                       <input id='firstName' data-bind='addDescription:"${messagePrefix}input1"'/>
                       <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                       <span class="validationMessage" id="${messagePrefix}input2" aria-live="assertive"></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div with "requiredWrapper" binding with validationMessage inside an inner div and element that points to it should not result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                       <input id='firstName' data-bind='addDescription:"${messagePrefix}input1"'/>
                       <div>
                        <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                       </div>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div with "requiredWrapper" binding with validationMessage and element that points to it inside an inner div should not result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                       <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                       <div>
                       <input id='firstName' data-bind='addDescription:"${messagePrefix}input1"'/>
                       </div>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div with "requiredWrapper" binding with validationMessage and element with multiple description should not result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                       <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                       <input id='firstName' data-bind='addDescription:"${messagePrefix}input1  desc"'/>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div with "requiredWrapper" binding with validationMessage and element that points to it in other div should result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                       <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                    </div>
                    <div data-bind="requiredWrapper:firstName">
                       <input id='firstName' data-bind='addDescription:"${messagePrefix}input1"'/>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(3);
        expect(messages[0].col).to.be(21);
    });
    it('div with "requiredWrapper" binding with validationMessage and element that points to it in nested "requiredWrapper" div should result in an error', function () {
        var code = `<div data-bind="requiredWrapper:firstName">
                       <span class="validationMessage" id="${messagePrefix}input1" aria-live="assertive"></span>
                       <div data-bind="requiredWrapper:firstName">
                       <input id='firstName' data-bind='addDescription:"${messagePrefix}input1"'/>
                    </div>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

});