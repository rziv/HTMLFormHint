var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'title-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('title element without heading role attribute should result in an error', function(){
        var code = `<div class="section-title" aria-level="4">פרטי חשבון הבנק של התובע</div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('title element with heading role attribute should not result in an error', function(){
        var code = `<div class="section-title" aria-level="4" role="heading">פרטי חשבון הבנק של התובע</div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });       
   
    it('title element without aria-level attribute should result in an error', function(){
        var code = `<div class="section-title" role="heading">פרטי חשבון הבנק של התובע</div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('title element with aria-level attribute should not result in an error', function(){
        var code = `<div class="section-title" aria-level="4" role="heading">פרטי חשבון הבנק של התובע</div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
});