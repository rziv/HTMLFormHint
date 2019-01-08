var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'checkbox-acceessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){   
  
     it('checkboxes group container without aria-labelledby should result in an error', function(){
         var code = `<div class="checkbox-group-container">
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
        var code = `<div class="checkbox-group-container" aria-labelledby="radioLabel">
                        <input type="checkbox" data-bind="checkboxAccessibility: true" />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    it('checkbox input in group without checkboxAccessibility binding should result in an error', function(){
        var code = `<div class="checkbox-group-container" aria-labelledby="radioLabel">
                        <input type="checkbox"/>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });
    it('both checkbox group and single checkbox in one container', function(){
        var code = `<div>
                        <div class="checkbox-group-container" aria-labelledby="radioLabel">
                            <input type="checkBox" data-bind="checkboxAccessibility: true" />
                        </div>
                        <div class="checkbox">
                            <input type="checkBox" data-bind="attr:{'aria-checked': true}" />
                        </div>

                    </div>
                    `;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
});

