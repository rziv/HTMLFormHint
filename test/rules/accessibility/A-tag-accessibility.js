var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'A-tag-accessibility',
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

    it('A tag without "addDescription" binding should result in an error', function(){
        var code = `<body>
                        <span id="accessibilityNewWindowAlert" class="hide">קישור זה ייפתח בחלון חדש</span>
                        <p>
                        <a target="_blank" href="http://www.btl.gov.il/About/contact_us/Pages/default.aspx" 
                        aria-label="פנו אלינו, לחץ למעבר לאתר המוסד לביטוח לאומי לאזור פנו אלינו"></a>
                        </p>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });
   
    it('A tag with "addDescription" binding should not result in an error', function(){
        var code = `<body>
                        <span id="accessibilityNewWindowAlert" class="hide">קישור זה ייפתח בחלון חדש</span>
                        <p>
                        <a target="_blank" href="http://www.btl.gov.il/About/contact_us/Pages/default.aspx" data-bind="addDescription:'accessibilityNewWindowAlert'" 
                        aria-label="פנו אלינו, לחץ למעבר לאתר המוסד לביטוח לאומי לאזור פנו אלינו"></a>
                        </p>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('A tag without "aria-label" attribute should result in an error', function(){
        var code = `<body>
                        <span id="accessibilityNewWindowAlert" class="hide">קישור זה ייפתח בחלון חדש</span>
                        <p>
                        <a target="_blank" href="http://www.btl.gov.il/About/contact_us/Pages/default.aspx" data-bind="addDescription:'accessibilityNewWindowAlert'"></a>
                        </p>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('A tag with "aria-label" attribute should not result in an error', function(){
        var code = `<body>
                        <span id="accessibilityNewWindowAlert" class="hide">קישור זה ייפתח בחלון חדש</span>
                        <p>
                        <a target="_blank" href="http://www.btl.gov.il/About/contact_us/Pages/default.aspx" data-bind="addDescription:'accessibilityNewWindowAlert'" 
                        aria-label="פנו אלינו, לחץ למעבר לאתר המוסד לביטוח לאומי לאזור פנו אלינו"></a>
                        </p>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
});

