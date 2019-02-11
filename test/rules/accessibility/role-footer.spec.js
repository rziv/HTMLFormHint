var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'role-footer',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('div with class "footer" without "role" attribute should result in an error', function () {
        var code = '<div class="footer"></div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('div with class "footer" without "role="contentinfo"" attribute should result in an error', function () {
        var code = '<div class="footer" role="contentfooter"></div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });


    it('div with class "footer" with "role="contentinfo"" attribute should not result in an error', function () {
        var code = '<div class="footer" role="contentinfo"></div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div without class "footer" with "role="contentinfo"" attribute should result in an error', function () {
        var code = '<div class="header" role="contentinfo"></div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });
});