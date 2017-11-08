HTMLHint.addRule({
    id: 'lang-he',
    description: 'body tag should have lang "he" ',
    init: function (parser, reporter) {
        var isBody = function (event) {
            var tagName = event.tagName;
            return tagName === 'body';
        };

        var self = this;
        var isLangHe = function (event) {
            var langAttr = HTMLHint.utils.getAttributeValue(event.attrs, "lang");
            return langAttr === 'he';
        };
        var bodyWithoutLangHe = function (event) {
            return isBody(event) && !isLangHe(event);
        };

        parser.addListener('tagstart', function (event) {
            if (bodyWithoutLangHe(event)) {
                reporter.error('body tag should have lang "he"', event.line, event.col, self, event.raw);
            }
        });
    }
});
