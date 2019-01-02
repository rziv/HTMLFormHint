var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'dynamic-table-acceessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('dynamic table without accessibilityTable binding should not result in an error', function(){
         var code = `<table tfsdata>
                       <thead></thead>
                       <tbody>
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                            </div>
                       </tr>
                        <tr>
                            <td>
                                <label data-for="firstName">First Name</label>
                                <input id="firstName"/>
                            <td>
                        </tr>
                       </tbody>
                    </table>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1); 
    });

    it('dynamic table with perefect structure should not result in an error', function(){
         var code = `<table tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                            </div>
                       </tr>
                        <tr>
                            <td>
                                <label data-for="firstName">First Name</label>
                                <input id="firstName"/>
                            <td>
                        </tr>
                       </tbody>
                    </table>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0); 
    });

    it('dynamic table without div with accessibility-table-title class should result in an error', function(){
         var code = `<table tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                            </div>
                       </tr>
                        <tr>
                            <td>
                                <label data-for="firstName">First Name</label>
                                <input id="firstName"/>
                            <td>
                        </tr>
                       </tbody>
                    </table>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1); 
    });

    it('accessibility-table-title element without aria-level attribute should result in an error', function(){
         var code = `<table tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" role="heading"></div>
                            </div>
                       </tr>
                        <tr>
                            <td>
                                <label data-for="firstName">First Name</label>
                                <input id="firstName"/>
                            <td>
                        </tr>
                       </tbody>
                    </table>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1); 
    });

    it('accessibility-table-title element without role attribute with heading value should result in an error', function(){
         var code = `<table tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4"></div>
                            </div>
                       </tr>
                        <tr>
                            <td>
                                <label data-for="firstName">First Name</label>
                                <input id="firstName"/>
                            <td>
                        </tr>
                       </tbody>
                    </table>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1); 
    });

    it('accessibility-table-title element without accessibilityRowTitle binding should result in an error', function(){
         var code = `<table tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" aria-level="4" role="heading"></div>
                            </div>
                       </tr>
                        <tr>
                            <td>
                                <label data-for="firstName">First Name</label>
                                <input id="firstName"/>
                            <td>
                        </tr>
                       </tbody>
                    </table>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1); 
    });

    it('add row button element without aria-Label attribute should result in an error', function(){
        var code = `<table tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                        </div>
                      </tr>
                       <tr>
                           <td>
                               <label data-for="firstName">First Name</label>
                               <input id="firstName"/>
                           <td>
                       </tr>
                      </tbody>
                   </table>
                   <input type="button" title="הוסף שורה" value="+ הוסף שורה"
                   id="Button1" role="button"
                   data-bind="addRow: dynamicChildren, tableModel: 'Children', maxRows: 3, args: { tableId: 'ChildrenTable'}" />`;
       var messages = HTMLHint.verify(code, ruleOptions);
       expect(messages.length).to.be(1); 
    });
    
    it('add row button element with aria-Label attribute should not result in an error', function(){
        var code = `<table tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                        </div>
                      </tr>
                       <tr>
                           <td>
                               <label data-for="firstName">First Name</label>
                               <input id="firstName"/>
                           <td>
                       </tr>
                      </tbody>
                   </table>
                   <input type="button" title="הוסף שורה" value="+ הוסף שורה"
                   id="Button1" role="button" aria-label="הוסף שורה לטבלת פרטי הילדים"
                   data-bind="addRow: dynamicChildren, tableModel: 'Children', maxRows: 3, args: { tableId: 'ChildrenTable'}" />`;
       var messages = HTMLHint.verify(code, ruleOptions);
       expect(messages.length).to.be(0); 
    });

    describe('Dynamic table with inner table: ', function(){
        it('inner dynamic table without accessibilityTable binding should result in an error', function(){
            var code = `<table tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                <div class="table-title-operation">
                                    <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table tfsnestedtable>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                        </div>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label data-for="firstName">First Name</label>
                                            <input id="firstName"/>
                                        <td>
                                    </tr>
                                </tbody>
                            </table>
                        </tbody>
                        </table>`;
            var messages = HTMLHint.verify(code, ruleOptions);
            expect(messages.length).to.be(1); 
        });

        it('inner dynamic table with perefect structure should not result in an error', function(){
            var code = `<table tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table tfsnestedtable>
                                <thead></thead>
                                <tbody data-bind="accessibilityTable: contacts">
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                        </div>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label data-for="firstName">First Name</label>
                                            <input id="firstName"/>
                                        <td>
                                    </tr>
                                </tbody>
                            </table>
                        </tbody>
                        </table>`;
            var messages = HTMLHint.verify(code, ruleOptions);
            expect(messages.length).to.be(0); 
        });

        it('inner dynamic table without div with accessibility-table-title class should result in an error', function(){
            var code = `<table tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table tfsnestedtable>
                                <thead></thead>
                                <tbody data-bind="accessibilityTable: contacts">
                                    <tr>
                                        
                                    </tr>
                                    <tr>
                                        <td>
                                            <label data-for="firstName">First Name</label>
                                            <input id="firstName"/>
                                        <td>
                                    </tr>
                                </tbody>
                            </table>
                        </tbody>
                        </table>`;
            var messages = HTMLHint.verify(code, ruleOptions);
            expect(messages.length).to.be(1); 
        });

        it('inner accessibility-table-title element without aria-level attribute should result in an error', function(){
            var code = `<table tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table tfsnestedtable>
                                <thead></thead>
                                <tbody data-bind="accessibilityTable: contacts">
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" role="heading"></div>
                                        </div>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label data-for="firstName">First Name</label>
                                            <input id="firstName"/>
                                        <td>
                                    </tr>
                                </tbody>
                            </table>
                        </tbody>
                        </table>`;
            var messages = HTMLHint.verify(code, ruleOptions);
            expect(messages.length).to.be(1); 
        });

        it('inner accessibility-table-title element without role attribute with heading value should result in an error', function(){
            var code =`<table tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table tfsnestedtable>
                                <thead></thead>
                                <tbody data-bind="accessibilityTable: contacts">
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4"></div>
                                        </div>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label data-for="firstName">First Name</label>
                                            <input id="firstName"/>
                                        <td>
                                    </tr>
                                </tbody>
                            </table>
                        </tbody>
                        </table>`;
            var messages = HTMLHint.verify(code, ruleOptions);
            expect(messages.length).to.be(1); 
        });

        it('inner accessibility-table-title element without accessibilityRowTitle binding should result in an error', function(){
            var code = `<table tfsdata>
                            <thead></thead>
                            <tbody data-bind="accessibilityTable: contacts">
                                <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                                        </div>
                                </tr>
                                <tr>
                                    <td>
                                        <label data-for="firstName">First Name</label>
                                        <input id="firstName"/>
                                    <td>
                                </tr>
                                <table tfsnestedtable>
                                    <thead></thead>
                                    <tbody data-bind="accessibilityTable: contacts">
                                        <tr>
                                            <div class="table-title-operation">
                                                <div class="accessibility-table-title" aria-level="4" role="heading"></div>
                                            </div>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label data-for="firstName">First Name</label>
                                                <input id="firstName"/>
                                            <td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tbody>
                        </table>`;
            var messages = HTMLHint.verify(code, ruleOptions);
            expect(messages.length).to.be(1); 
        });

        it('inner add row button element without aria-Label attribute should result in an error', function(){
            var code = `<table tfsdata>
                          <thead></thead>
                          <tbody data-bind="accessibilityTable: contacts">
                          <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                            </div>
                          </tr>
                           <tr>
                               <td>
                                   <label data-for="firstName">First Name</label>
                                   <input id="firstName"/>
                               <td>
                           </tr>
                          </tbody>
                       </table>
                       <input type="button" title="הוסף שורה" value="+ הוסף שורה"
                       id="Button1" role="button"
                       data-bind="addRow: dynamicChildren, tableModel: 'Children', maxRows: 3, args: { tableId: 'ChildrenTable'}" />`;
           var messages = HTMLHint.verify(code, ruleOptions);
           expect(messages.length).to.be(1); 
        });
        
        it('inner add row button element with aria-Label attribute should not result in an error', function(){
            var code = `<table tfsdata>
                          <thead></thead>
                          <tbody data-bind="accessibilityTable: contacts">
                          <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true" aria-level="4" role="heading"></div>
                            </div>
                          </tr>
                           <tr>
                               <td>
                                   <label data-for="firstName">First Name</label>
                                   <input id="firstName"/>
                               <td>
                           </tr>
                          </tbody>
                       </table>
                       <input type="button" title="הוסף שורה" value="+ הוסף שורה"
                       id="Button1" role="button" aria-label="הוסף שורה לטבלת פרטי הילדים"
                       data-bind="addRow: dynamicChildren, tableModel: 'Children', maxRows: 3, args: { tableId: 'ChildrenTable'}" />`;
           var messages = HTMLHint.verify(code, ruleOptions);
           expect(messages.length).to.be(0); 
        });    
    });
});