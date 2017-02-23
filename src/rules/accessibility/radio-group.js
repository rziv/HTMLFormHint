HTMLHint.addRule({
    id: 'radio-group',
    description: 'group of radio buttons should have role of radiogroup. every radio button should have radio role',
    init: function(parser, reporter){
        var isRadiogroupContainer = function(event) { 
            var isRadioClassExist = false;
            var classNames = HTMLHint.utils.getAttribute(event.attrs,"class");
            if(!classNames){
                return false;
            }
            var classesArray = classNames.value.split(/\s+/g);
            classesArray.forEach(function(className){
                if(className.toLowerCase() ==="radio" ){
                    isRadioClassExist = true;
                }
            });
            return isRadioClassExist;
        };
        var isRadioInput = function(event){
            var typeValue = HTMLHint.utils.getAttribute(event.attrs,"type");
            return typeValue && typeValue.value === 'radio';
        };

        var prevEvent;
        var self = this;   

        var radioContainerNotHaveAriaLabelledbyAttr = function(event){
            var ariaLabelAttribute = HTMLHint.utils.getAttribute(event.attrs,"aria-labelledby");
            return isRadiogroupContainer(event) && (!ariaLabelAttribute || ariaLabelAttribute.value === '');
        };
        var radioContainerNotHaveRoleAttr = function(event){
            var roleAttribute = HTMLHint.utils.getAttribute(event.attrs,"role");
            return isRadiogroupContainer(event) && (!roleAttribute || roleAttribute.value !== 'radiogroup');
        };
        var radioNotWrpaWithDiv = function(event, prevEvent){
            return isRadioInput(event) && prevEvent.tagName.toLowerCase() !== 'div';
        };

        var radioNotHaveRadioRole = function(event){
            var roleAttribute = HTMLHint.utils.getAttribute(event.attrs,"role");
            return isRadioInput(event) && (!roleAttribute || roleAttribute.value !== 'radio');
        };
        
        parser.addListener('tagstart', function(event){
            if (radioContainerNotHaveRoleAttr(event))
            {
               reporter.error('radiogroup container should have role attr with radiogroup value' + event.line , event.line, event.col, self, event.raw);
            }  
            if (radioContainerNotHaveAriaLabelledbyAttr(event))
            {
               reporter.error('radiogroup container should have aria-labelledby attribute with value' + event.line , event.line, event.col, self, event.raw);
            }   
            if(radioNotWrpaWithDiv(event, prevEvent)){
               reporter.error('radio input shold be wrap with div element' + event.line , event.line, event.col, self, event.raw);
            }
            if(radioNotHaveRadioRole(event)){
                reporter.error('radio input shold have  role attribute with radio value' + event.line , event.line, event.col, self, event.raw);    
            }
            prevEvent = event;
        });
        //parser.addListener('tagend', function(event){
        //    var tagName = event.tagName.toLowerCase();          
          //  if (tagName === "table" && unclosedTablesCounter>0) {
            //    unclosedTablesCounter--;
           // }
           // if (unclosedTablesCounter === 0)  {
             //   inTable = false;
           // }        
        //});       
    }
});
