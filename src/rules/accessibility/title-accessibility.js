HTMLHint.addRule({
    id: "title-accessibility",
    description: "add aria-level and heading role to title element",
    init: function(parser, reporter) {
        var self = this;
        var inTitleElement = false;
        var unclosedTitleCounter = 0;
        var elementsInTitle = [];

        var isElementWithHeadingRole = function(event) {
            var roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"role");
            return roleAttribute === "heading";
        };

        var isElementWithAriaLevel = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, "aria-level");
        };

        var isTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "section-title");
        };

        var isSubTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "section-sub-title");
        };

        var isMainTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "main-title");
        };

        var isSecondaryTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "secondary-title");
        };

        var reportOfTitleElementWithoutAriaLevelAttr = function(event) {
            reporter.error('title element should have "aria-level" attribute. Error on line ' + event.line, event.line, event.col, self, event.raw);
        }; 
        var reportOfTitleElementWithoutHeadingRole = function(event) {
            reporter.error('title element should have "role" attribute with "heading" value. Error on line ' + event.line, event.line, event.col, self, event.raw);
        };        

        parser.addListener("tagstart", function(event) {
            if (inTitleElement) {
                unclosedTitleCounter++;
                elementsInTitle.push(event);
            }
            if (isTitleElement(event) || isSubTitleElement(event) || isMainTitleElement(event) || isSecondaryTitleElement(event)) {
                inTitleElement = true;
                unclosedTitleCounter++;
                elementsInTitle.push(event);
            }           
        });
        
        parser.addListener("tagend", function() {
            if (unclosedTitleCounter > 0) {
                unclosedTitleCounter--;
            }
            if (unclosedTitleCounter === 0) {
                inTitleElement = false;
            }
            if (!inTitleElement && elementsInTitle.length > 0) {
                var elementsWithAriaLevel = elementsInTitle.filter(item => {
                    return isElementWithAriaLevel(item);
                });
                if (elementsWithAriaLevel.length === 0) {
                    reportOfTitleElementWithoutAriaLevelAttr(elementsInTitle[0]);
                }

                var elementsWithHeadingRole = elementsInTitle.filter(item => {
                    return isElementWithHeadingRole(item);
                });
                if (elementsWithHeadingRole.length === 0) {
                    reportOfTitleElementWithoutHeadingRole(elementsInTitle[0]);
                }
                
                elementsInTitle = [];               
            }
        });
    }
});
