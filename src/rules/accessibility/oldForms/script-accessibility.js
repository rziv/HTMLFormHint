HTMLHint.addRule({
    id: 'script-accessibility',
    description: 'the form should contain an accessibility scripts',
    init: function(parser, reporter){  
        var self = this;   

        var srcScripts = [];

        var addSrcAttributeToArray = function(event) {            
            var srcAttribute = HTMLHint.utils.getAttributeValue(event.attrs,'src');
            return srcScripts.push(srcAttribute);                              
        }; 
    
        var isAccessibilityScript = function(event) {
            var accessibilityScript = srcScripts.includes('CDN/Common/JS/accessibility.js');   
            var accessibilityMethodsScript = srcScripts.includes('CDN/Common/JS/accessibilityMethods.js');   
            if(accessibilityScript === false || accessibilityMethodsScript === false) {
                reporter.error('the form should contain "accessibility.js" and "accessibilityMethods.js" scripts ' + event.line , event.line, event.col, self, event.raw);
            }
        }; 
         
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'script'){
                addSrcAttributeToArray(event); 
            }                                                                               
        }); 

        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'head'){    
                isAccessibilityScript(event);
            }                                  
        });        
    }
});
