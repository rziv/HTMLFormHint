var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'oldRadioGroup-inTabel',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('radio buttons in dynamic tabel that use "radioGroup" componnent should result in an error', function(){
        var code = ` <table id="Children18to24Table" class="table" tfsdata tfsstaticrows="true">
        <tbody data-bind='foreach: getdynamicChildren18to24()'>
            <tr>
                <td>                       
                    <div class="row">                        
                        <label for="TypeChild"><span class="ui-asteria">*</span>הילד הוא:</label>
                        <div tfsinclude="CDN/Common/Components/RadioGroup/RadioGroup.html" data-bind="with: typeChild"></div>                                                                     
                    </div>
                </td>
            </tr>
        </tbody>
    </table>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });    
});

