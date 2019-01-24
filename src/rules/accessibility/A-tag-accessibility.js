HTMLHint.addRule({
    id: 'A-tag-accessibility',
    description: 'add aria-label and aria-description to A tag',
    init: function(parser, reporter) {
        var self = this;
      
        var tagAWithoutAriaLabelAttr = [];
        var tagAWithoutaddDescriptionBind = [];
        var isExistSpanAccessibility = false;

        var isAriaLabelAttribute = function(event){
            var ariaLabelAttribute = HTMLHint.utils.isAttributeExists(event.attrs, 'aria-label');
            return ariaLabelAttribute === true;   
        };

        var isAriaLabelBinding = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            var ariaLabelBind = bindAttributeValue.includes('aria-label');
            return ariaLabelBind === true;
        };

        var addElementWithoutAriaLabelAttrToArray = function(event) {  
            if(!isAriaLabelAttribute(event) && !isAriaLabelBinding(event)){
                tagAWithoutAriaLabelAttr.push(event);
            }                                               
        };

        var addElementWithoutAddDesriptionBindToArray = function(event) {            
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            var addDescriptionBind = bindAttributeValue.includes('addDescription');  
            if(addDescriptionBind === false){
                tagAWithoutaddDescriptionBind.push(event);
            }                                               
        };
        
        var setSpanAccessibilityVariable  = function(event) { 
            var idAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'id');            
            if(idAttributeValue === 'accessibilityNewWindowAlert'){
                isExistSpanAccessibility = true;
            }                                                                    
        };  

        var isLinkOpenInNewWindow = function(event) {            
            var attrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'target');
            return attrValue === '_blank';            
        };

        var reportOfTagAWithoutAriaLabelAttr = function() {            
            if (tagAWithoutAriaLabelAttr.length > 0) {
                for(var item of tagAWithoutAriaLabelAttr) {              
                    reporter.warn('If the link does not express its clear purpose, should be add "aria-label" attribute or bind. Warn On line: ' + item.line, item.line, item.col, self, item.raw);                                   
                }
            }                                              
        };               
       
        var reportOfTagAWithoutAddDescriptionBind = function() {  
            if (tagAWithoutaddDescriptionBind.length > 0) {
                for(var item of tagAWithoutaddDescriptionBind) {              
                    reporter.error('A tag should contain "addDescription" binding that bind to "accessibilityNewWindowAlert" span. Error on line ' + item.line, item.line, item.col, self, item.raw);                
                }
            }                                                        
        }; 

        var reportOfAccessibilityNewWindowAlertSpan = function(event) {  
            if (isExistSpanAccessibility === false) {                            
                reporter.error('The form should contain accessibility span with id "accessibilityNewWindowAlert" and value "This link open in new window..." ' + event.line, event.line, event.col, self, event.raw);                               
            }                                                        
        };      
       
        parser.addListener('tagstart', function(event) {          
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'a') {
                addElementWithoutAriaLabelAttrToArray(event);                
                if(isLinkOpenInNewWindow(event)) {
                    addElementWithoutAddDesriptionBindToArray(event);                   
                } 
            }
            if(tagName === 'span') {
                setSpanAccessibilityVariable(event);  
            }
        });
     
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'body'){   
                reportOfTagAWithoutAriaLabelAttr(); 
                reportOfTagAWithoutAddDescriptionBind();
                reportOfAccessibilityNewWindowAlertSpan(event);
            }                                  
        }); 
    }
});
