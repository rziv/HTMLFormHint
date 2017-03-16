var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'no-aria-describedby',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('input with aria-describedby attribute should reslt in an error', function(){
        var code = '<input  type="text" aria-describedby="desc"/>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(1);
        expect(messages[0].col).to.be(1);   
    });

    it('input without aria-describedby attribute should not reslt in an error', function(){
       var code = '<input type="text"/>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

     it('input with aria-describedby via binding handler should not reslt in an error', function(){
       var code = '<input type="text" data-bind="addDescription"/>';
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

});