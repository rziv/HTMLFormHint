HTMLHint.addRule({
    id: 'containers-accessibility',
    description: 'div with class container should have role of tabPanel and binding addAccessibilityContainerAttrs with the value of "name"',
    init: function (parser, reporter) {
        var self = this;
        var isContainer = function (element, attributes) {
            return (element === "div" && HTMLHint.utils.isClassExsits(attributes, "container"));
        };

        var isContainerWithoutAccessibilityBinding = function (event) {
            if (HTMLHint.utils.getBindingValue(event, 'addAccessibilityContainerAttrs') !== 'name') {
                return true;
            }
            return false;
        };

        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName.toLowerCase();

            if (isContainer(tagName, event.attrs)) {
                var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, "role");
                if (roleAttr !== 'tabpanel') {
                    reporter.error('div with class container should have role "tabpanel"', event.line, event.col, self, event.raw);
                }

                if (isContainerWithoutAccessibilityBinding(event)) {
                    reporter.error('div with class container should have "addAccessibilityContainerAttrs" binding with the value "name"', event.line, event.col, self, event.raw);
                }

            }
        });

    }
});