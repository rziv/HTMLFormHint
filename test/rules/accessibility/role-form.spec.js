var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'role-form',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('body tag without "role" attribute should result in an error', function () {
        var code = '<body id="body"></body>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal('body tag should have role "form"');
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

    it('body tag without "role=form" attribute should result in an error', function () {
        var code = '<body id="body" role="noForm"></body>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal('body tag should have role "form"');
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });


    it('body tag with "role=form" attribute should not result in an error', function () {
        var code = '<body id="body" role="form"></body>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('tag other than body with "role="form"" attribute should result in an error', function () {
        var code = '<div id="myDiv" role="form"><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal('role "form" cannot be set on tag other than body');
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

});