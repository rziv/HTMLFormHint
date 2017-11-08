var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'role-main',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('div with id "mainDiv" without "role" attribute should result in an error', function () {
        var code = '<div id="mainDiv"><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

    it('div with id "mainDiv" without "role="main"" attribute should result in an error', function () {
        var code = '<div id="mainDiv" role="vain"><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });


    it('div with id "mainDiv" with "role="main"" attribute should not result in an error', function () {
        var code = '<div id="mainDiv" role="main"><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('div without id "mainDiv" with "role="main"" attribute should result in an error', function () {
        var code = '<div id="myDiv" role="main"><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });

});