HTMLHint.addRule({
    id: 'attr-jQueryUIVersion',
    description: 'check tfsJQueryUIVersion attribute in GeneralAttributes sapn is exist and version is update',
    init: function(parser, reporter) {
        var self = this;

        var isGeneralAttributSpan = function(event) {
            var id = HTMLHint.utils.getAttributeValue(event.attrs, 'id');
            return id === 'GeneralAttributes';
        };

        var isJQueryUIAttribute = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, 'tfsJQueryUIVersion');            
        };

        var isJQueryUIAttributeValue = function(event) {
            return HTMLHint.utils.getAttributeValue(event.attrs, 'tfsJQueryUIVersion');                      
        };

        var isjQueryUIAttributMissing = function(event) {            
            return !isJQueryUIAttribute(event);            
        };

        var isJQueryUIVersionNotApdate = function(event) {           
            return isJQueryUIAttributeValue(event) !== '1_12_1';           
        };

        parser.addListener('tagstart', function(event) {
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'span') {    
                if (isGeneralAttributSpan(event)) {
                    if (isjQueryUIAttributMissing(event)) {
                        reporter.error('attribute "tfsJQueryUIVersion" in GeneralAttributes is missing. Error on line ' + event.line, event.line, event.col, self, event.raw);                
                    }
                    else if (isJQueryUIVersionNotApdate(event)) {
                        reporter.error('attribute "tfsJQueryUIVersion" in GeneralAttributes should be equal "1_12_1". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                    }
                }         
            }  
        });
    }
});
