var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'radio-group-acceessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('radio group container without role of radiogroup should result in an error', function(){
        var code = `<div class="radio" aria-labelledby="radioLabel">
                        <div><input id="private" name="type" data-bind="radioGroupAccessibility: true"  type="radio" role="radio"/></div>
                        <div><input id="pulic" name="type" data-bind="radioGroupAccessibility: true" type="radio" role="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
    });

     it('radio group container with role of radiogroup should not result in an error', function(){
         var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <div><input tfsdata id="private" name="type" type="radio" data-bind="radioGroupAccessibility: true"  role="radio"/></div>
                        <div><input tfsdata id="pulic" name="type" type="radio" data-bind="radioGroupAccessibility: true"  role="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    it('radiogroup container without aria-labelledby attribute should result in an error', function(){
        var code = `<div class="radio" role="radiogroup">
                        <div><input tfsdata id="private" name="type" type="radio" data-bind="radioGroupAccessibility: true"  role="radio"/></div>
                        <div><input tfsdata id="pulic" name="type" type="radio" data-bind="radioGroupAccessibility: true"  role="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
    });

     it('radio group container without role of radiogroup should not result in an error', function(){
         var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <div><input id="private" name="type" type="radio" data-bind="radioGroupAccessibility: true" role="radio"/></div>
                        <div><input id="pulic" name="type" type="radio" data-bind="radioGroupAccessibility: true" role="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('radio input with role of radio should not result in an error', function(){
        var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <div><input tfsdata role="radio" data-bind="radioGroupAccessibility: true" id="private" name="type" type="radio"/></div>
                        <div><input tfsdata role="radio" data-bind="radioGroupAccessibility: true"  id="pulic" name="type" type="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

     it('radio input without role of radio should result in an error', function(){
         var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <div><input id="private" name="type" data-bind="radioGroupAccessibility: true"  type="radio"/></div>
                        <div><input id="pulic" name="type" data-bind="radioGroupAccessibility: true"  type="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
    });

    it('radio input with wrapper div should not result in an error', function(){
        var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <div><input tfsdata role="radio" data-bind="radioGroupAccessibility: true" id="private" name="type" type="radio"/></div>
                        <div><input tfsdata role="radio" data-bind="radioGroupAccessibility: true"  id="pulic" name="type" type="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

     it('radio input without wrapper div should result in an error', function(){
         var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <sapn><input id="private" name="type" data-bind="radioGroupAccessibility: true" role="radio" type="radio"/></span>
                        <sapn><input id="pulic" name="type" data-bind="radioGroupAccessibility: true"  role="radio" type="radio"/></span>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
    });

    it('radio input with radioGroupAccessibility binding should not result in an error', function(){
        var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <div><input tfsdata role="radio" data-bind="radioGroupAccessibility: true" id="private" name="type" type="radio"/></div>
                        <div><input tfsdata role="radio" data-bind="radioGroupAccessibility: true" id="pulic" name="type" type="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
        it('radio input without radioGroupAccessibility binding should result in an error', function(){
        var code = `<div class="radio" role="radiogroup" aria-labelledby="radioLabel">
                        <div><input tfsdata role="radio" id="private" name="type" type="radio"/></div>
                        <div><input tfsdata role="radio" id="pulic" name="type" type="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
    });
    
});

