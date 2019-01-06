var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'date-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('form without "accessibilityFormatDate" span should result in an error', function(){
        var code = `<body>
                        <div class="tfsMainDiv" id="mainDiv">        
                        <span id="hello" class="hide">שלום</span>
                        </div>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('form with "accessibilityFormatDate" span should not result in an error', function(){
        var code = `<body>
                        <div class="tfsMainDiv" id="mainDiv">
                        <span id="hello" class="hide">שלום</span>        
                        <span id="accessibilityFormatDate" class="hide">עליך להזין תאריך בפורמט DD/MM/YYYY</span>
                        </div>
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('date element without "addDescription" binding should result in an error', function(){
        var code = `<body>
                        <span id="accessibilityFormatDate" class="hide">עליך להזין תאריך בפורמט DD/MM/YYYY</span>
                        <input id="birthday" tfsdatatype="date" placeholder="DD/MM/YEAR" data-bind="value:birthday" />
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });
   
    it('date element with "addDescription" binding should not result in an error', function(){
        var code = `<body>
                        <span id="accessibilityFormatDate" class="hide">עליך להזין תאריך בפורמט DD/MM/YYYY</span>
                        <input id="birthday" tfsdatatype="date" placeholder="DD/MM/YEAR" data-bind="value:birthday, addDescription:'accessibilityFormatDate'" />
                    </body>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });  
});

