var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'containers-accessibility',
    ruleOptions = {};

var noAccessibilityBindingError = 'div with class container should have "addContainersAccessibilityAttrs" binding with the value "name"';

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('div with class "container" with no role should result in an error', function () {
        var code = `<div class="container"  data-bind="addContainersAccessibilityAttrs:name"></div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have role "tabpanel"');
        expect(messages[0].rule.id).to.be(ruldId);
    });
    it('div with class "container" with role not "tabpanel" should result in an error', function () {
        var code = `<div class="container" role="tab"  data-bind="addContainersAccessibilityAttrs:name"></div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have role "tabpanel"');
        expect(messages[0].rule.id).to.be(ruldId);
    });
    it('div with class "container" with role "tabpanel" should not result in an error', function () {
        var code = `<div class="container" role="tabpanel" data-bind="addContainersAccessibilityAttrs:name"></div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div with class "container" with no data-bind attribute should result in an error', function () {
        var code = `<div class="container" role="tabpanel" ></div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal(noAccessibilityBindingError);
        expect(messages[0].rule.id).to.be(ruldId);
    });

    it('div with class "container" with no addContainersAccessibilityAttrs binding should result in an error', function () {
        var code = `<div class="container" role="tabpanel" data-bind="lock:true"></div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal(noAccessibilityBindingError);
        expect(messages[0].rule.id).to.be(ruldId);
    });

    it('div with class "container" with addContainersAccessibilityAttrs bining with valueAccessor other than "name" should result in an error"', function () {
        var code = `<div class="container" role="tabpanel" data-bind="addContainersAccessibilityAttrs:container"></div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal(noAccessibilityBindingError);
        expect(messages[0].rule.id).to.be(ruldId);
    });

    it('div with class "container" with addContainersAccessibilityAttrs bining with valueAccessor "name" should not result in an error"', function () {
        var code = `<div class="container" role="tabpanel" data-bind="addContainersAccessibilityAttrs:name"></div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

});