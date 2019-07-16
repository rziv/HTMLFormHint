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
            var accessibilitySrc = srcScripts.includes('CDN/Common/JS/accessibility.js');   
            var accessibilityMethodsSrc = srcScripts.includes('CDN/Common/JS/accessibilityMethods.js');   
            var accessibilitySrcWithBackSlesh = srcScripts.includes('CDN\Common\JS\accessibility.js');   
            var accessibilityMethodsSrctWithBackSlesh = srcScripts.includes('CDN\Common\JS\accessibilityMethods.js'); 
            
            var accessibilityScriptExist = function(){
                return accessibilitySrc === true || accessibilitySrcWithBackSlesh === true;
            };
            var accessibilityMethodScriptExist = function(){
                return accessibilityMethodsSrc === true || accessibilityMethodsSrctWithBackSlesh === true;
            };
            if(!accessibilityScriptExist()) {
                reporter.error('the form should contain "accessibility.js" script. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }
            if(!accessibilityMethodScriptExist()) {
                reporter.error('the form should contain "accessibilityMethods.js" script. Error on line ' + event.line , event.line, event.col, self, event.raw);
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
