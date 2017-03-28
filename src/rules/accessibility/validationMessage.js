HTMLHint.addRule({
    id: 'validation-message-accessibility',
    description: 'verify that all span of validation message have ID and attribute "aria-live"',
    init: function (parser, reporter) {
        var self = this;

        var messagePrefix = HTMLHint.resources.validationMessagesAccessibility.messageIdPrefix;

        var isValidationMessage = function (element, attributes) {
            return (element === "span" && HTMLHint.utils.isClassExsits(attributes, "validationMessage"));
        };

        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName.toLowerCase();

            if (isValidationMessage(tagName, event.attrs)) {
                var id = HTMLHint.utils.getAttributeValue(event.attrs, "id");
                var ariaLiveAttr = HTMLHint.utils.getAttributeValue(event.attrs, "aria-live");

                if (!id || !id.startsWith(messagePrefix)) {
                    reporter.error(`span with class validationMessage must have ID that starts with "${messagePrefix}" ` + event.line, event.line, event.col, self, event.raw);
                }
                if (ariaLiveAttr !== HTMLHint.resources.validationMessagesAccessibility.ariaLive) {
                    reporter.error('span with class validationMessage must have attribute aria-live="assertive" ' + event.line, event.line, event.col, self, event.raw);
                }
            }
        });

    }
});
