var expect  = require("expect.js");

var HTMLHint  = require("../../../index").HTMLHint;

var ruldId = 'dynamic-table-acceessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('dynamic table without accessibilityTable binding should not result in an error', function(){
         var code = `<table role="presentation" tfsdata>
                       <thead></thead>
                       <tbody>
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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
         var code = `<table role="presentation" tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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

    it('dynamic table without role=presentation should result in an error', function(){
        var code = `<table tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                           <div class="table-title-operation">
                               <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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

    it('dynamic table without div with accessibility-table-title class should result in an error', function(){
         var code = `<table role="presentation" tfsdata>
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
         var code = `<table role="presentation" tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" role="heading"></div>
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
         var code = `<table role="presentation" tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4"></div>
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
         var code = `<table role="presentation" tfsdata>
                       <thead></thead>
                       <tbody data-bind="accessibilityTable: contacts">
                       <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" aria-level="4" role="heading" data-bind="tableName:'בטבלת פרטים'"></div>
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

    it('accessibility-table-title element without tableName binding should result in an error', function(){
        var code = `<table role="presentation" tfsdata>
        <thead></thead>
        <tbody data-bind="accessibilityTable: contacts">
        <tr>
             <div class="table-title-operation">
                 <div class="accessibility-table-title" aria-level="4" role="heading" data-bind="accessibilityRowTitle:true"></div>
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

    it('accessibility-table-title element with tableName binding should not result in an error', function(){
        var code = `<table role="presentation" tfsdata>
        <thead></thead>
        <tbody data-bind="accessibilityTable: contacts">
        <tr>
             <div class="table-title-operation">
                 <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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

    it('add row button element without aria-Label attribute should result in an error', function(){
        var code = `<table role="presentation" tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                        </div>
                        <div class="table-title-on-the-left">
                            <span id="removeRowSpan" class="hide">מחק שורה מטבלת מעסיקים</span>
                            <span class="delete-line-label">
                                <input type="button" class="del-img noPrint" data-bind="removeRow: $parent.dynamicPreviousEmployer"
                                        id="del-PreviousEmployer" aria-labelledby="removeRowSpan" role="button" data-tofocus />
                                <span aria-labelledby="removeRowSpan" data-bind="removeRow: $parent.dynamicPreviousEmployer">מחק שורה</span>
                            </span>
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
        var code = `<table role="presentation" tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                        </div>
                        <div class="table-title-on-the-left">
                            <span id="removeRowSpan" class="hide">מחק שורה מטבלת מעסיקים</span>
                            <span class="delete-line-label">
                                <input type="button" class="del-img noPrint" data-bind="removeRow: $parent.dynamicPreviousEmployer"
                                        id="del-PreviousEmployer" aria-labelledby="removeRowSpan" role="button" data-tofocus />
                                <span aria-labelledby="removeRowSpan" data-bind="removeRow: $parent.dynamicPreviousEmployer">מחק שורה</span>
                            </span>
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

    it('remove row button element without aria-labelledby or aria-label attribute should result in an error', function(){
        var code = `<table role="presentation" tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                        </div>
                        <div class="table-title-on-the-left">                          
                            <span class="delete-line-label">
                                <input type="button" class="del-img noPrint" data-bind="removeRow: $parent.dynamicPreviousEmployer"
                                        id="del-PreviousEmployer" role="button" data-tofocus />
                                <span data-bind="removeRow: $parent.dynamicPreviousEmployer">מחק שורה</span>
                            </span>
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
       expect(messages.length).to.be(2); 
    });
    
    it('remove row button element with aria-labelledby attribute should not result in an error', function(){
        var code = `<table role="presentation" tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                        </div>
                        <div class="table-title-on-the-left">
                            <span id="removeRowSpan" class="hide">מחק שורה מטבלת מעסיקים</span>
                            <span class="delete-line-label">
                                <input type="button" class="del-img noPrint" data-bind="removeRow: $parent.dynamicPreviousEmployer"
                                        id="del-PreviousEmployer" aria-labelledby="removeRowSpan" role="button" data-tofocus />
                                <span aria-labelledby="removeRowSpan" data-bind="removeRow: $parent.dynamicPreviousEmployer">מחק שורה</span>
                            </span>
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

    it('remove row button element with aria-label attribute should not result in an error', function(){
        var code = `<table role="presentation" tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                        </div>
                        <div class="table-title-on-the-left">
                            <span id="removeRowSpan" class="hide">מחק שורה מטבלת מעסיקים</span>
                            <span class="delete-line-label">
                                <input type="button" class="del-img noPrint" data-bind="removeRow: $parent.dynamicPreviousEmployer"
                                        id="del-PreviousEmployer" aria-label="מחק שורה" role="button" data-tofocus />
                                <span aria-label="מחק שורה" data-bind="removeRow: $parent.dynamicPreviousEmployer">מחק שורה</span>
                            </span>
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

    it('remove row button element without data-tofocus attribute should result in an error', function(){
        var code = `<table role="presentation" tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                        </div>
                        <div class="table-title-on-the-left">
                            <span id="removeRowSpan" class="hide">מחק שורה מטבלת מעסיקים</span>
                            <span class="delete-line-label">
                                <input type="button" class="del-img noPrint" data-bind="removeRow: $parent.dynamicPreviousEmployer"
                                        id="del-PreviousEmployer" aria-labelledby="removeRowSpan" role="button" />
                                <span aria-labelledby="removeRowSpan" data-bind="removeRow: $parent.dynamicPreviousEmployer">מחק שורה</span>
                            </span>
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
       expect(messages.length).to.be(1); 
    });
    
    it('remove row button element with data-tofocus attribute should not result in an error', function(){
        var code = `<table role="presentation" tfsdata>
                      <thead></thead>
                      <tbody data-bind="accessibilityTable: contacts">
                      <tr>
                        <div class="table-title-operation">
                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                        </div>
                        <div class="table-title-on-the-left">
                            <span id="removeRowSpan" class="hide">מחק שורה מטבלת מעסיקים</span>
                            <span class="delete-line-label">
                                <input type="button" class="del-img noPrint" data-bind="removeRow: $parent.dynamicPreviousEmployer"
                                        id="del-PreviousEmployer" aria-labelledby="removeRowSpan" role="button" data-tofocus />
                                <span aria-labelledby="removeRowSpan" data-bind="removeRow: $parent.dynamicPreviousEmployer">מחק שורה</span>
                            </span>
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
            var code = `<table role="presentation" tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                <div class="table-title-operation">
                                    <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                                </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table role="presentation" tfsnestedtable>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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
            var code = `<table role="presentation" tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table role="presentation" tfsnestedtable>
                                <thead></thead>
                                <tbody data-bind="accessibilityTable: contacts">
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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
            var code = `<table role="presentation" tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table role="presentation" tfsnestedtable>
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
            var code = `<table role="presentation" tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table role="presentation" tfsnestedtable>
                                <thead></thead>
                                <tbody data-bind="accessibilityTable: contacts">
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" role="heading"></div>
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
            var code =`<table role="presentation" tfsdata>
                        <thead></thead>
                        <tbody data-bind="accessibilityTable: contacts">
                            <tr>
                                    <div class="table-title-operation">
                                        <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                                    </div>
                            </tr>
                            <tr>
                                <td>
                                    <label data-for="firstName">First Name</label>
                                    <input id="firstName"/>
                                <td>
                            </tr>
                            <table role="presentation" tfsnestedtable>
                                <thead></thead>
                                <tbody data-bind="accessibilityTable: contacts">
                                    <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4"></div>
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
            var code = `<table role="presentation" tfsdata>
                            <thead></thead>
                            <tbody data-bind="accessibilityTable: contacts">
                                <tr>
                                        <div class="table-title-operation">
                                            <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
                                        </div>
                                </tr>
                                <tr>
                                    <td>
                                        <label data-for="firstName">First Name</label>
                                        <input id="firstName"/>
                                    <td>
                                </tr>
                                <table role="presentation" tfsnestedtable>
                                    <thead></thead>
                                    <tbody data-bind="accessibilityTable: contacts">
                                        <tr>
                                            <div class="table-title-operation">
                                                <div class="accessibility-table-title" data-bind="tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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
            var code = `<table role="presentation" tfsdata>
                          <thead></thead>
                          <tbody data-bind="accessibilityTable: contacts">
                          <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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
            var code = `<table role="presentation" tfsdata>
                          <thead></thead>
                          <tbody data-bind="accessibilityTable: contacts">
                          <tr>
                            <div class="table-title-operation">
                                <div class="accessibility-table-title" data-bind="accessibilityRowTitle:true, tableName:'בטבלת פרטים'" aria-level="4" role="heading"></div>
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