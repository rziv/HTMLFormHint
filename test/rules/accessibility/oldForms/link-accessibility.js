var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'link-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('form without "accessibilityNewWindowAlert" span should result in an error', function(){
        var code = `<body>
                        <div class="tfsMainDiv" id="mainDiv">        
                        <span id="hello" class="hide">שלום</span>
                        </div>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('form with "accessibilityNewWindowAlert" span should not result in an error', function(){
        var code = `<body>
                        <div class="tfsMainDiv" id="mainDiv">
                        <span id="hello" class="hide">שלום</span>        
                        <span id="accessibilityNewWindowAlert" class="hide">קישור זה ייפתח בחלון חדש</span>
                        </div>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
});

