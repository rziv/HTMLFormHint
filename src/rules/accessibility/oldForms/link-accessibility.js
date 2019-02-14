HTMLHint.addRule({
    id: 'link-accessibility',
    description: 'the form should contain accessibility span of links with id "accessibilityNewWindowAlert"',
    init: function(parser, reporter) {
        var self = this;
            
        var isExistSpanAccessibility = false;            
        
        var setSpanAccessibilityVariable  = function(event) { 
            var idAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'id');            
            if(idAttributeValue === 'accessibilityNewWindowAlert'){
                isExistSpanAccessibility = true;
            }                                                                    
        };           

        var reportOfAccessibilityNewWindowAlertSpan = function(event) {  
            if (isExistSpanAccessibility === false) {                            
                reporter.error('The form should contain accessibility span with id "accessibilityNewWindowAlert" and value "This link open in new window..." ' + event.line, event.line, event.col, self, event.raw);                               
            }                                                        
        };      
       
        parser.addListener('tagstart', function(event) {          
            var tagName = event.tagName.toLowerCase();            
            if(tagName === 'span') {
                setSpanAccessibilityVariable(event);  
            }
        });
     
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'body'){   
                reportOfAccessibilityNewWindowAlertSpan(event);
            }                                  
        }); 
    }
});
