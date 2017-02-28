var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'checkbox-acceessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('checkboxes group container without role of group should result in an error', function(){
        var code = `<div class="checkbox-group-container" aria-labelledby="radioLabel">
                        </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
    });

     it('checkboxes group container with role of group should not result in an error', function(){
         var code = `<div class="checkbox-group-container" role="group" aria-labelledby="radioLabel">
                        </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
     it('checkboxes group container without aria-labelledby should result in an error', function(){
         var code = `<div class="checkbox-group-container" role="group">
                        </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });
    it('single checkboxes without aria-checked should result in an error', function(){
        var code = `<div class="checkbox">
        <input type="checkbox" />
                       </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });
    it('single checkboxes with aria-checked should not result in an error', function(){
        var code = `<div class="checkbox">
        <input type="checkbox" data-bind="attr:{'aria-checked': true}" />
                       </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    it('checkbox input in group with checkboxAccessibility binding should not result in an error', function(){
        var code = `<div class="checkbox-group-container" role="group" aria-labelledby="radioLabel">
                        <input type="checkbox" data-bind="checkboxAccessibility: true" />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    it('checkbox input in group without checkboxAccessibility binding should result in an error', function(){
        var code = `<div class="checkbox-group-container" role="group" aria-labelledby="radioLabel">
                        <input type="checkbox"/>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });
});

