HTMLHint.addRule({
    id: 'checkbox-acceessibility',
    description: 'verify checkbox has ',
    init: function(parser, reporter){
        var unclosedDivsCounter = 0;
        var inCheckboxGroup = false;
        var prevEvent;
        var self = this;   
        
        var isCheckboxContainerWithoutRoleAttribute = function(event){
            let roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"role");
            return isCheckboxGroupContainer(event) && roleAttribute !== 'group';
         };

        var isCheckboxContainerWithoutAriaLabelledAttribute = function(event){
            let ariaLabelledbyAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"aria-labelledby");        
            return isCheckboxGroupContainer(event) && ariaLabelledbyAttribute === '';
        };

        var isCheckboxGroupContainer = function(event){
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className.toLowerCase() ==="checkbox-group-container");
        };

        var isCheckboxElement = function(event){
            return HTMLHint.utils.getAttributeValue(event.attrs,"type")  === 'checkbox';          
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
             if (isCheckboxContainerWithoutRoleAttribute(event))
             {
                reporter.error('checkbox container should have role attribute with group value' + event.line , event.line, event.col, self, event.raw);
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
             prevEvent = event;
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
