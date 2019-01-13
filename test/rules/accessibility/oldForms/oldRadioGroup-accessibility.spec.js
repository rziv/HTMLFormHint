var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'oldRadioGroup-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){
  
    it('oldRadiogroup without aria-labelledby attribute should result in an error', function(){
        var code = `<div class="radio required-wrapper">
                        <div><input tfsdata id="private" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>
                        <div><input tfsdata id="pulic" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
    });

     it('oldRadiogroup with aria-labelledby attribute should not result in an error', function(){
         var code = `<div class="radio required-wrapper" aria-labelledby="radioLabel">
                        <div><input id="private" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>
                        <div><input id="pulic" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });     
});

