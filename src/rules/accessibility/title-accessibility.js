HTMLHint.addRule({
    id: 'title-accessibility',
    description: 'add aria-level and heading role to title element',
    init: function(parser, reporter) {
        var self = this;
      
        var elementWithHeadingRole = function(event){
            var roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,'role');
            return roleAttribute === 'heading';
         };

        var elementWithAriaLevel = function(event){
            return HTMLHint.utils.isAttributeExists(event.attrs,'aria-level');                    
        };

        var isTitleElement = function(event){
            return HTMLHint.utils.isClassExsits(event.attrs, 'section-title');
        };    
      
        var isSubTitleElement = function(event){
            return HTMLHint.utils.isClassExsits(event.attrs, 'section-sub-title');
        }; 

        parser.addListener('tagstart', function(event) {                                   
            if(isTitleElement(event) || isSubTitleElement(event)) {
                if(!elementWithHeadingRole(event)){
                    reporter.error('title element should have "role" attribute with "heading" value. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
                }  
                if(!elementWithAriaLevel(event)){
                    reporter.error('title element should have "aria-level" attribute. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
                }                   
            }                       
        });     
    }
});
