var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'tooltip-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;
var noDescribedElementError = 'span with class tooltip-help expects element with description in same div';

describe('Rules: ' + ruldId, function () {

    it('span with class "tooltip-help" without id should result in an error', function () {
        var code = `<div>
                    <span class='tooltip-help'></span>
                     <input data-bind='addDescription:"input description",lock:true' />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal('span with class tooltip-help must have an id');
        expect(messages[0].line).to.be(2);
        expect(messages[0].col).to.be(21);
    });

    it('div with tooltip and no element that points to it should result in an error', function () {
        var code = `<div>
                    <span id="tooltip" class='tooltip-help'></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal(noDescribedElementError);
        expect(messages[0].line).to.be(3);
        expect(messages[0].col).to.be(21);
    });
    it('div with tooltip and element that points to it should not result in an error', function () {
        var code = `<div>
                    <span id="description" class='tooltip-help'></span>
                    <input data-bind='addDescription:"input description",lock:true' />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    it('div with tooltip and element that points to it should not result in an error', function () {
        var code = `<div>
                    <span id="description" class='tooltip-help'></span>
                    <input data-bind='addDescription:"description"' />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
});