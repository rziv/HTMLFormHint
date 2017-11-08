var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'lang-he',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('body tag without "lang" attribute should result in an error', function () {
        var code = '<body id="body"></body>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

    it('body tag without "lang=he" attribute should result in an error', function () {
        var code = '<body id="body" lang="af"></body>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });


    it('body tag with "role=form" attribute should not result in an error', function () {
        var code = '<body id="body" lang="he"></body>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

});