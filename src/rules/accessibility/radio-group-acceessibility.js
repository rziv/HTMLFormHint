HTMLHint.addRule({
    id: 'radio-group-acceessibility',
    description: 'group of radio buttons should have role of radiogroup and aria-labelledby attribute. every radio button should have radio role',
    init: function(parser, reporter){
        var isRadiogroupContainer = function(event) { 
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className.toLowerCase() ==="radio");
        };

        var isRadioInput = function(event){
            return HTMLHint.utils.getAttributeValue(event.attrs,"type")  === 'radio';          
        };

        var isRadioBindWithoutRaiogroupAccessibility = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return isRadioInput(event) && (!bindAttributeValue.includes('radioGroupAccessibility'));
        };

        var prevEvent;
        var self = this;   

        var isRadioContainerWithoutAriaAttribute = function(event){
            var ariaLabelAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"aria-labelledby");
            return isRadiogroupContainer(event) && ariaLabelAttribute === '';
        };
        var isRadioContainerWithoutRoleAttribute = function(event){
            var roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"role");
            return isRadiogroupContainer(event) && roleAttribute !== 'radiogroup';
        };
        var isRadioNotWrappedWithDiv = function(event, prevEvent){
            return isRadioInput(event) && prevEvent.tagName.toLowerCase() !== 'div';
        };
        
        parser.addListener('tagstart', function(event){
            if (isRadioContainerWithoutRoleAttribute(event))
            {
               reporter.error('radiogroup container should have role attribute with radiogroup value' + event.line , event.line, event.col, self, event.raw);
            }  
            if (isRadioContainerWithoutAriaAttribute(event))
            {
               reporter.error('radiogroup container should have aria-labelledby attribute with value' + event.line , event.line, event.col, self, event.raw);
            }   
            if(isRadioNotWrappedWithDiv(event, prevEvent)){
               reporter.error('radio input should be wrap with div element' + event.line , event.line, event.col, self, event.raw);
            }
            if(isRadioBindWithoutRaiogroupAccessibility(event)){
                reporter.error('radio input should have radioGroupAccessibility binding' + event.line , event.line, event.col, self, event.raw);                    
            }
            prevEvent = event;
        });         
    }
});
