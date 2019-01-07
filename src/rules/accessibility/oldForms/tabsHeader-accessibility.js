HTMLHint.addRule({
    id: 'tabsHeader-accessibility',
    description: 'verify that tabsHeader file is accessibility',
    init: function(parser, reporter) {
        var self = this;

        var isElementInTabNavigation = false;

        var isTabsNavigation = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, 'tabs-navigation');            
        };

        var isElementWithHorizontalAria = function(event) {
            var ariaAttr = HTMLHint.utils.getAttributeValue(event.attrs, 'aria-orientation');            
            return ariaAttr === 'horizontal';            
        };

        var isElementWithTablistRole = function(event) {
            var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, 'role');            
            return roleAttr === 'tablist';            
        };

        var isItemClass = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, 'item');            
        };  

        var isDataBindAttr = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, 'data-bind');                    
        };  
        
        var isElementWithTabRole = function(event) {
            var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, 'role');            
            return roleAttr === 'tab';            
        };

        var isHrefAttr = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, 'href');                    
        }; 

        var isActivateTabBind = function(event) {
            var bindAttrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttrValue.includes('activateTab');                  
        }; 

        var isAriaSelectedBind = function(event) {
            var bindAttrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttrValue.includes('aria-selected');                  
        }; 

        var isAriaControlsBind = function(event) {
            var bindAttrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttrValue.includes('aria-controls');                  
        }; 

        parser.addListener('tagstart', function(event) {
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'ul' && isTabsNavigation(event)) { 
                isElementInTabNavigation = true;                   
                if (!isElementWithHorizontalAria(event)) {
                    reporter.error('tabs-navigation element should contain "aria-orientation" attribute with "horizontal" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                
                }
                if (!isElementWithTablistRole(event)) {
                    reporter.error('tabs-navigation element should contain "role" attribute with "tablist" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }                     
            }  
            if(isElementInTabNavigation === true && tagName === 'li' && isItemClass(event) && isDataBindAttr(event)){
                reporter.error('attribute "data-bind" in li element at "tabsHeader" file should move to A element under li element. Error on line ' + event.line, event.line, event.col, self, event.raw);                                    
            }
            if(isElementInTabNavigation === true && tagName === 'a'){                
                if(!isElementWithTabRole(event)){
                    reporter.error('A element at "tabsHeader" file should contain "role" attribute with "tab" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(!isHrefAttr(event)){
                    reporter.error('A element at "tabsHeader" file should contain "href" attribute with "#" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(isDataBindAttr(event) && !isActivateTabBind(event)){
                    reporter.error('data-bind attribute in A element at "tabsHeader" file should contain "activateTab" bind like this: "activateTab:$parent.isCurrentContainer(name)". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(isDataBindAttr(event) && !isAriaSelectedBind(event)){
                    reporter.error('data-bind attribute in A element at "tabsHeader" file should contain "aria-selected" bind like this: "attr:{"aria-selected":$parent.isCurrentContainer(name)}". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(isDataBindAttr(event) && !isAriaControlsBind(event)){
                    reporter.error('data-bind attribute in A element at "tabsHeader" file should contain "aria-controls" bind like this: "attr:{"aria-controls":("tabpanel_" + name())}". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
            }
        });
        parser.addListener('tagend', function(event) {
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'ul'){
                isElementInTabNavigation = false;     
            }
        });
    }
});
