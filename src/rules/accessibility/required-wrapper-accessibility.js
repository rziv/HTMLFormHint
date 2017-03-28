HTMLHint.addRule({
    id: 'required-wrapper-accessibility',
    description: 'div with requiredWrapper binding should contain at least one validation message and one element that points to it',
    init: function (parser, reporter) {
        var inRequiredWrapper = false;
        var self = this;
        var unclosedDivsCounter = 0;
        var messagesInRequiredWrapper = [];
        var usedMessagesInRequiredWrapper = [];

        var isDivRequiredWraper = function (event) {
            return HTMLHint.utils.getBindingValue(event, "requiredWrapper");
        };

        var isValidationMessage = function (event) {
            return (event.tagName === "span" && HTMLHint.utils.isClassExsits(event.attrs, "validationMessage"));
        };

        var findValidationMessageInDescription = function (description) {
            var descriptionsIds = HTMLHint.utils.removeBoundaryQuotes(description).split(' ');
            return descriptionsIds.find(function (descriptionId) {
                return descriptionId.startsWith(HTMLHint.resources.validationMessagesAccessibility.messageIdPrefix);
            });
        };

        var atleastOneBoundMessageInRequiredWrapper = function () {
            if (messagesInRequiredWrapper.length === 0 || usedMessagesInRequiredWrapper.length === 0) {
                return false;
            }
            return usedMessagesInRequiredWrapper.find(item => messagesInRequiredWrapper.indexOf(item) !== -1);
        };

        var endOfRequiredWrapper = function () {
            return unclosedDivsCounter === 0 && inRequiredWrapper === true;
        };


        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName;

            if (isDivRequiredWraper(event)) {
                inRequiredWrapper = true;
            }
            if (inRequiredWrapper) {
                if (tagName === 'div') {
                    unclosedDivsCounter++;
                }
                if (isValidationMessage(event)) {
                    var id = HTMLHint.utils.getAttributeValue(event.attrs, "id");
                    messagesInRequiredWrapper.push(id);
                }
                if (HTMLHint.utils.isFocusableElement(event)) {
                    var descriptionBinding = HTMLHint.utils.getBindingValue(event, 'addDescription');
                    if (descriptionBinding) {
                        var boundMessage = findValidationMessageInDescription(descriptionBinding);
                        if (boundMessage) {
                            usedMessagesInRequiredWrapper.push(boundMessage);
                        }
                    }
                }
            }
        });

        parser.addListener('tagend', function (event) {
            var tagName = event.tagName.toLowerCase();
            if (tagName === "div" && unclosedDivsCounter > 0) {
                unclosedDivsCounter--;
            }
            if (endOfRequiredWrapper()) {
                inRequiredWrapper = false;
                if (!atleastOneBoundMessageInRequiredWrapper()) {
                    reporter.error('div with requiredWrapper binding should contain at least one validation message and one element that points to it' + event.line, event.line, event.col, self, event.raw);
                }
                messagesInRequiredWrapper = [];
                usedMessagesInRequiredWrapper = [];
            }

        });
    }
});
