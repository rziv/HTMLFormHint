HTMLHint.addRule({
    id: 'oldRadioGroup-accessibility',
    description: 'old group of radio buttons should have aria-labelledby attribute',
    init: function(parser, reporter){  
        var self = this;   
        
        var isRadiogroupContainer = function(event) { 
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className ==="radio");
        };                           

        var isRadioContainerWithoutAriaAttribute = function(event){
            var ariaLabelAttribute = HTMLHint.utils.getAttributeValue(event.attrs,'aria-labelledby');
            return isRadiogroupContainer(event) && ariaLabelAttribute === '';
        };

        parser.addListener('tagstart', function(event){           
            if (isRadioContainerWithoutAriaAttribute(event))
            {
               reporter.error('radio group should have "aria-labelledby" attribute with value of radioGroup\'s label id. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }             
        });         
    }
});
