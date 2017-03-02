var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'vertical-containers-acceessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('div with id "user" without "setRoleTabList" binding should result in an error', function () {
        var code = '<div id="user"><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);
    });



    it('div with id "user" without "setRoleTabList" binding should not result in an error', function () {
        var code = '<div id="user" data-bind="setRoleTabList:containersViewModel.isDrawsMoe"><div>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

});