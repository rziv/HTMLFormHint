HTMLHint.addRule({
    id: 'no-lookup-accessibility',
    description: 'select with tfsdatatype="LookUpWindow" should replace to Autocomplete',
    init: function(parser, reporter) {
        var self = this;
                    
        var isLookUpWindow  = function(event) {
            var tfsdatatypeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'tfsdatatype');
            tfsdatatypeValue = tfsdatatypeValue.toLowerCase();              
           return tfsdatatypeValue === 'lookupwindow';  
        };                

        parser.addListener('tagstart', function(event) {          
            var tagName = event.tagName.toLowerCase();            
            if(tagName === 'select') {
               if(isLookUpWindow(event)){
                reporter.error('select with tfsdatatype="LookUpWindow" should replace to Autocomplete" ', event.line, event.col, self, event.raw);  
               }  
            }
        });   
    }
});
