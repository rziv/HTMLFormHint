HTMLHint.addRule({
    id: 'checkbox-acceessibility',
    description: 'verify checkbox group container has aria-labelledby attributes, and checkbox input has accessibility bindings.',
    init: function(parser, reporter){
        var unclosedDivsCounter = 0;
        var inCheckboxGroup = false;       
        var self = this;   
              
        var isCheckboxContainerWithoutAriaLabelledAttribute = function(event){
            var ariaLabelledbyAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"aria-labelledby");        
            return isCheckboxGroupContainer(event) && ariaLabelledbyAttribute === '';
        };

        var isCheckboxGroupContainer = function(event){
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className.toLowerCase() ==="checkbox-group-container");
        };

        var isCheckboxElement = function(event){
            var typeAttrValue = HTMLHint.utils.getAttributeValue(event.attrs,"type");
            return typeAttrValue.toLowerCase() === 'checkbox';          
        };
        
        var singleCheckboxWithoutAccessibility = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return isCheckboxElement(event) && !inCheckboxGroup && !bindAttributeValue.includes('aria-checked');
        };

        var checkboxInGroupWithoutAccessibility = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return isCheckboxElement(event) && inCheckboxGroup &&(!bindAttributeValue.includes('checkboxAccessibility'));
        };

        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'div' && inCheckboxGroup){
                unclosedDivsCounter++;
            }
            if(isCheckboxGroupContainer(event)){
            inCheckboxGroup = true;
            unclosedDivsCounter++;
            }          
            if (isCheckboxContainerWithoutAriaLabelledAttribute(event))
            {
            reporter.error('checkbox container should have aria-labelledby attribute with value' + event.line , event.line, event.col, self, event.raw);
            } 
            if(singleCheckboxWithoutAccessibility(event)){
                reporter.error('single checkbox input should have aria-checked binding' + event.line , event.line, event.col, self, event.raw);                    
            }
            if(checkboxInGroupWithoutAccessibility(event)){
                reporter.error('checkbox input in group should have checkboxAccessibility binding' + event.line , event.line, event.col, self, event.raw);                    
            }            
        });         
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();          
            if (tagName === "div" && unclosedDivsCounter > 0) {
                unclosedDivsCounter--;
            }
            if (unclosedDivsCounter === 0)  {
                inCheckboxGroup = false;
            }        
        });       
    }
});
