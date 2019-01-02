HTMLHint.addRule({
    id: 'date-accessibility',
    description: 'date element should contain addDescription binding',
    init: function(parser, reporter){  
        var self = this;   
        var isExistSpanAccessibility = false;

        var isDateElement = function(event) { 
            var tfsdatatypeAttr = HTMLHint.utils.getAttributeValue(event.attrs,'tfsdatatype');
            return tfsdatatypeAttr === 'date';           
        };    
        
        var isAddDescriptionBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttributeValue.includes('addDescription');
        };
        
        var setSpanAccessibilityVariable  = function(event) { 
            var idAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'id');            
            if(idAttributeValue === 'accessibilityFormatDate'){
                isExistSpanAccessibility = true;
            }                                                                    
        }; 
        
        var reportOfAccessibilityFormatDateSpan = function(event) {  
            if (isExistSpanAccessibility === false) {                            
                reporter.error('The form should contain accessibility span like this "<span id="accessibilityFormatDate" class="hide">עליך להזין תאריך בפורמט DD/MM/YYYY</span>" ' + event.line, event.line, event.col, self, event.raw);                               
            }                                                        
        };

        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'input'){    
                if (isDateElement(event) && !isAddDescriptionBind(event)) {
                reporter.error('Date element should contain "addDescription" binding that bind to "accessibilityFormatDate" span. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }  
            }   

            if(tagName === 'span') {
                setSpanAccessibilityVariable(event);  
            }         
        });       
        
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'body'){   
                reportOfAccessibilityFormatDateSpan(event);
            }                                  
        }); 
    }
});