var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'script-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('form without "accessibility.js" script should result in an error', function(){
        var code = `<head>
                        <script src="CDN/Common/JS/aaa.js"></script>
                        <script src="CDN\Common\JS\bbb.js"></script>
                    </head>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
    });

    it('form with "accessibility.js" script should not result in an error', function(){
        var code = `<head>
                        <script src="CDN/Common/JS/accessibility.js"></script>
                        <script src="CDN/Common/JS/accessibilityMethods.js"></script>
                    </head>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    
    it('form without "accessibilityMethods.js" script should result in an error', function(){
        var code = `<head>
                        <script src="CDN/Common/JS/aaa.js"></script>
                        <script src="CDN\Common\JS\bbb.js"></script>
                    </head>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
    });

    it('form with "accessibilityMethods.js" script should not result in an error', function(){
        var code = `<head>
                        <script src="CDN/Common/JS/accessibility.js"></script>
                        <script src="CDN/Common/JS/accessibilityMethods.js"></script>
                    </head>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('form with "accessibility.js" script (whit backslesh) should not result in an error', function(){
        var code = `<head>
                        <script src="CDN\Common\JS\accessibility.js"></script>
                        <script src="CDN\Common\JS\accessibilityMethods.js"></script>
                    </head>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('form with "accessibilityMethods.js" script (whit backslesh) should not result in an error', function(){
        var code = `<head>
                        <script src="CDN\Common\JS\accessibility.js"></script>
                        <script src="CDN\Common\JS\accessibilityMethods.js"></script>
                    </head>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
});

