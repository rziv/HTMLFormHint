HTMLHint.addRule({
    id: 'oldRadioGroup-inTabel',
    description: 'group of radio buttons in dynamic tabel should replce to new structure',
    init: function(parser, reporter){  
        var self = this;   
        
        var isOldRadiogroup = function(event) { 
            var tfsincludeAttribute = HTMLHint.utils.getAttributeValue(event.attrs,'tfsinclude');
            return tfsincludeAttribute.includes('RadioGroup.html');           
        };    
        
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'div'){    
                if (isOldRadiogroup(event)) {
                reporter.error('group of radio buttons in dynamic tabel should replce to new structure (use "tlpRadio" binding in HTML and replace radio object in JS, parameters from js move to html). Error on line ' + event.line , event.line, event.col, self, event.raw);
                }  
            }            
        });         
    }
});
