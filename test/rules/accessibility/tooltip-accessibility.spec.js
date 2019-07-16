var expect = require("expect.js");

var HTMLHint = require("../../../index").HTMLHint;

var ruldId = 'tooltip-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;
var noDescribedElementError = 'tooltip {0} expects element to describe';
var tooltip = `<span id="description" class='tooltip-help'></span>`;

var formattedMessage = function (param) {
    return noDescribedElementError.replace('{0}', param);
};

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

    it('tooltip with no described element should result in an error', function () {
        var code = `<div>
                   ${tooltip}
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal(formattedMessage(tooltip));
        expect(messages[0].line).to.be(2);
        expect(messages[0].col).to.be(20);
    });

    it('tooltip with no described focusabale element should result in an error', function () {
        var code = `<div>
                    ${tooltip}
                    <span data-bind='addDescription:"description",lock:true' ></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal(formattedMessage(tooltip));
        expect(messages[0].line).to.be(2);
        expect(messages[0].col).to.be(21);
    });

    it('tooltip with described element in same div should not result in an error', function () {
        var code = `<div>
                     ${tooltip}
                    <input data-bind="addDescription:'input description',lock:true" />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('tooltip with described element in different div should not result in an error', function () {
        var code = `<div>
                    ${tooltip}                   
                    </div>
                    <div>
                    <input data-bind='addDescription:"description"' />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('two tooltip that one has described element should result in an error', function () {
        var code = `<div>
                    <span id="description" class='tooltip-help'></span>
                    <span id="description2" class='tooltip-help'></span>
                     </div>
                     <div>
                    <input data-bind='addDescription:"description"' />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal(formattedMessage(`<span id="description2" class='tooltip-help'></span>`));
        expect(messages[0].line).to.be(3);
        expect(messages[0].col).to.be(21);
    });
    it('two tooltips that none have described element should result in an error', function () {
        var code = `<div>
                    <span id="description" class='tooltip-help'></span>
                    <span id="description2" class='tooltip-help'></span>
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(2);
        expect(messages[0].rule.id).to.be(ruldId);
        expect(messages[0].message).to.equal(formattedMessage(`<span id="description" class='tooltip-help'></span>`));
        expect(messages[1].rule.id).to.be(ruldId);
        expect(messages[1].message).to.equal(formattedMessage(`<span id="description2" class='tooltip-help'></span>`));
        expect(messages[0].line).to.be(2);
        expect(messages[0].col).to.be(21);
        expect(messages[1].line).to.be(3);
        expect(messages[1].col).to.be(21);
    });
    it('two tooltips that both have described element should not result in an error', function () {
        var code = `<div>
                    <span id="description" class='tooltip-help'></span>
                    <input data-bind='addDescription:"description"' />
                    </div>
                    <div>
                    <span id="description2" class='tooltip-help'></span>
                    <input data-bind='addDescription:"description2"' />
                    </div>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

});