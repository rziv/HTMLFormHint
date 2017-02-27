var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'containers-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('div with class "container" with no role should result in an error', function () {
        var code = `<div class="container"  data-bind="attr:{'id':'tabpanel_+'name(),'aria-labeledby':'tab_'+name()}"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have role "tabpanel"');
        expect(messages[0].rule.id).to.be(ruldId);
    });
    it('div with class "container" with role not "tabpanel" should result in an error', function () {
        var code = `<div class="container" role="tab"  data-bind="attr:{'id':'tabpanel_+'name(),'aria-labeledby':'tab_'+name()}"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have role "tabpanel"');
        expect(messages[0].rule.id).to.be(ruldId);
    });
    it('div with class "container" with role "tabpanel" should not result in an error', function () {
        var code = `<div class="container" role="tabpanel"  data-bind="attr:{'id':'tabpanel_+'name(),'aria-labeledby':'tab_'+name()}"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div with class "container" with no data-bind attribute should result in an error', function () {
        var code = `<div class="container" role="tabpanel" ></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
        expect(messages[0].message).to.equal('div with class container should have attr binding of id that starts with "tabpanel_"');
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[1].message).to.equal('div with class container should have attr binding of aria-labeledby to an id that starts with "tab_"');
        expect(messages[1].rule.id).to.be(ruldId);
    });

    it('div with class "container" with no attr bind of "id" should result in an error', function () {
        var code = `<div class="container" role="tabpanel" data-bind="attr:{'aria-labeledby':'tab_'+name()}"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have attr binding of id that starts with "tabpanel_"');
        expect(messages[0].rule.id).to.be(ruldId);
    });

    it('div with class "container" with attr bind of "id" that does not start with "tabpanel_"should result in an error', function () {
        var code = `<div class="container" role="tabpanel" data-bind="attr:{'id':name(),aria-labeledby':'tab_'+name()}"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have attr binding of id that starts with "tabpanel_"');
        expect(messages[0].rule.id).to.be(ruldId);
    });

    it('div with class "container" with no attr bind of "aria-labeledby" should result in an error', function () {
        var code = `<div class="container" role="tabpanel" data-bind="attr:{'id':'tabpanel_+'name()}"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have attr binding of aria-labeledby to an id that starts with "tab_"');
        expect(messages[0].rule.id).to.be(ruldId);
    });

    it('div with class "container" with attr bind of "aria-labeledby" that does not start with "tab_"should result in an error', function () {
        var code = `<div class="container" role="tabpanel" data-bind="attr:{'id':'tabpanel_+'name(),aria-labeledby':name()}"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].message).to.equal('div with class container should have attr binding of aria-labeledby to an id that starts with "tab_"');
        expect(messages[0].rule.id).to.be(ruldId);
    });

});