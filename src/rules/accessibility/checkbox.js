HTMLHint.addRule({
    id: 'checkbox-acceessibility',
    description: '',
    init: function(parser, reporter){
      
        var prevEvent;
        var self = this;   
        
        var isRadioContainerWithoutRoleAttribute = function(event){
            var roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"role");
            return isRadiogroupContainer(event) && roleAttribute !== 'radiogroup';
         };

        var isCheckboxGroupContainer = function(){
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className.toLowerCase() ==="checkbox-group-container");
        };

        var isCheckboxElement = function(event){
            return HTMLHint.utils.getAttributeValue(event.attrs,"type")  === 'checkbox';          
        };

        parser.addListener('tagstart', function(event){

             if (isCheckboxContainerWithoutRoleAttribute(event))
             {
                reporter.error('checkbox container should have role attribute with group value' + event.line , event.line, event.col, self, event.raw);
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
             if(isRadioBindWithoutRaiogroupAccessibility(event)){
                 reporter.error('radio input should have radioGroupAccessibility binding' + event.line , event.line, event.col, self, event.raw);                    
             }
             prevEvent = event;
        });         
    }
});
