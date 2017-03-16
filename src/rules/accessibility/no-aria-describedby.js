HTMLHint.addRule({
    id: 'no-aria-describedby',
    description: '"aria-describedby" should never be used as inline attribute but via bindingHandler only',
    init: function (parser, reporter) {
        var self = this;

        var hasAriaDescribedbyAttr = function (event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, "aria-describedby");
        };

        parser.addListener('tagstart', function (event) {
            if (hasAriaDescribedbyAttr(event)) {
                reporter.error('"aria-describedby" should not be used as inline attribute', event.line, event.col, self, event.raw);
            }
        });
    }
});
