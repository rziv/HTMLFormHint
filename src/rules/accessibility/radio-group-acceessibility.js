HTMLHint.addRule({
    id: 'radio-group-acceessibility',
    description: 'group of radio buttons should have aria-labelledby attribute and radioGroupAccessibility binding',
    init: function(parser, reporter){
        var isRadiogroupContainer = function(event) { 
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className ==="radiogroupContainer");
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
   
        var isRadioNotWrappedWithDiv = function(event, prevEvent){
            return isRadioInput(event) && prevEvent.tagName.toLowerCase() !== 'div';
        };
        
        parser.addListener('tagstart', function(event){    
            if (isRadioContainerWithoutAriaAttribute(event))
            {
               reporter.error('radiogroup container should have aria-labelledby attribute with value. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }   
            if(isRadioNotWrappedWithDiv(event, prevEvent)){
               reporter.error('radio input should be wrap with div element. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }
            if(isRadioBindWithoutRaiogroupAccessibility(event)){
                reporter.error('radio input should have radioGroupAccessibility binding. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
            }
            prevEvent = event;
        });         
    }
});
