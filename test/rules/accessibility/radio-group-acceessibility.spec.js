var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'radio-group-acceessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){
  
    it('radiogroup container without aria-labelledby attribute should result in an error', function(){
        var code = `<div class="radiogroupContainer">
                        <div><input tfsdata id="private" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>
                        <div><input tfsdata id="pulic" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
    });

     it('radio group container with aria-labelledby attribute should not result in an error', function(){
         var code = `<div class="radiogroupContainer" aria-labelledby="radioLabel">
                        <div><input id="private" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>
                        <div><input id="pulic" name="type" type="radio" data-bind="radioGroupAccessibility: true"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('radio input with wrapper div should not result in an error', function(){
        var code = `<div class="radiogroupContainer" aria-labelledby="radioLabel">
                        <div><input tfsdata  data-bind="radioGroupAccessibility: true" id="private" name="type" type="radio"/></div>
                        <div><input tfsdata  data-bind="radioGroupAccessibility: true"  id="pulic" name="type" type="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

     it('radio input without wrapper div should result in an error', function(){
         var code = `<div class="radiogroupContainer" aria-labelledby="radioLabel">
                        <sapn><input id="private" name="type" data-bind="radioGroupAccessibility: true"  type="radio"/></span>
                        <sapn><input id="pulic" name="type" data-bind="radioGroupAccessibility: true"  type="radio"/></span>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
    });

    it('radio input with radioGroupAccessibility binding should not result in an error', function(){
        var code = `<div class="radiogroupContainer" aria-labelledby="radioLabel">
                        <div><input tfsdata data-bind="radioGroupAccessibility: true" id="private" name="type" type="radio"/></div>
                        <div><input tfsdata data-bind="radioGroupAccessibility: true" id="pulic" name="type" type="radio"/></div>                        
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('radio input without radioGroupAccessibility binding should result in an error', function(){
    var code = `<div class="radiogroupContainer" aria-labelledby="radioLabel">
                    <div><input tfsdata id="private" name="type" type="radio"/></div>
                    <div><input tfsdata id="pulic" name="type" type="radio"/></div>                        
                </div>`;
    var messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(2);
    });   
});

