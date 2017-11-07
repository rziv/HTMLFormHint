var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'no-tooltip-in-radio',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: ' + ruldId, function () {

    it('tooltip inside div with class "radio" should result in an error', function () {
        var code = `<div class="radio">
                        <input type="radio" />
                        <label></label>
                        <span class="tooltip-help"></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(4);
        expect(messages[0].col).to.be(25);
    });

    it('div with class "radio" with no tooltip in it should not result in an error', function () {
        var code = `<div class="radio">
                        <input type="radio" />
                        <label></label>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

        it('tooltip inside div without class "radio" should not result in an error', function () {
        var code = `<div class="no-Radio">
                        <label></label>
                        <span class="tooltip-help"></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('tooltip inside chained div with class "radio" should result in an error', function () {
        var code = `<div class="radio">
                        <input type="radio" />
                        <div>
                        <label></label>
                        <span class="tooltip-help"></span>
                        </div>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].line).to.be(5);
        expect(messages[0].col).to.be(25);
    });

});
