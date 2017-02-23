HTMLHint.addRule({
    id: 'radio-group-acceessibility',
    description: 'group of radio buttons should have role of radiogroup. every radio button should have radio role',
    init: function(parser, reporter){
        var isRadiogroupContainer = function(event) { 
            var isRadioClassExist = false;
            var classNames = HTMLHint.utils.getAttribute(event.attrs,"class");
            if(!classNames){
                return false;
            }
            var classesArray = classNames.value.split(/\s+/g);
            // No need in to always iterate the whole array , use some() instaed of forEach
            classesArray.forEach(function(className){
                if(className.toLowerCase() ==="radio" ){
                    isRadioClassExist = true;
                }
            });
            return isRadioClassExist;
        };
        var isRadioInput = function(event){
            return HTMLHint.utils.getAttribute(event.attrs,"type")  === 'radio';          
        };

        var prevEvent;
        var self = this;   

        var isRadioContainerWithoutAriaAttribute = function(event){
            var ariaLabelAttribute = HTMLHint.utils.getAttribute(event.attrs,"aria-labelledby");
            return isRadiogroupContainer(event) && (!ariaLabelAttribute || ariaLabelAttribute.value === '');
        };
        var isRadioContainerWithoutRoleAttribute = function(event){
            var roleAttribute = HTMLHint.utils.getAttribute(event.attrs,"role");
            return isRadiogroupContainer(event) && (!roleAttribute || roleAttribute.value !== 'radiogroup');
        };
        var isRadioNotWrappedWithDiv = function(event, prevEvent){
            return isRadioInput(event) && prevEvent.tagName.toLowerCase() !== 'div';
        };

        var isRadioWithoutRadioRole = function(event){
            var roleAttribute = HTMLHint.utils.getAttribute(event.attrs,"role");
            return isRadioInput(event) && (!roleAttribute || roleAttribute.value !== 'radio');
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
            if(isRadioWithoutRadioRole(event)){
                reporter.error('radio input should have role attribute with radio value' + event.line , event.line, event.col, self, event.raw);    
            }
            prevEvent = event;
        });         
    }
});
