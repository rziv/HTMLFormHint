var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'attr-jQueryUIVersion',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('"generalAttributes" element without "tfsJQueryUIVersion" attribute should result in an error', function(){
        var code = `<span id="GeneralAttributes" tfspluginversion="5.3.2.0"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('"generalAttributes" element with "tfsJQueryUIVersion" attribute that is not update should result in an error', function(){
        var code = `<span id="GeneralAttributes" tfspluginversion="5.3.2.0" tfsJQueryUIVersion="1_12_0"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });  
     
    it('"generalAttributes" element with "tfsJQueryUIVersion" attribute should not result in an error', function(){
        var code = `<span id="GeneralAttributes" tfspluginversion="5.3.2.0" tfsJQueryUIVersion="1_12_1"></span>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });    
});

