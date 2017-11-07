HTMLHint.addRule({
    id: 'no-tooltip-in-radio',
    description: 'tooltip is not legal inside radio group',
    init: function (parser, reporter) {
        var self = this;
        var insideRadio = false;
        var unclosedDivsCounter = 0;

        var isRadio = function (event) {
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs, "class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some(className => className === "radio");
        };
        var isTooltip = function (event) {
            var tagName = event.tagName;
            var hasTooltipClass = HTMLHint.utils.isClassExsits(event.attrs, 'tooltip-help');
            return tagName === 'span' && hasTooltipClass;
        };

        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName;
            if (isRadio(event)) {
                insideRadio = true;
            }
            if (insideRadio) {
                if (tagName === 'div') {
                    unclosedDivsCounter++;
                }
                if (isTooltip(event)) {
                    reporter.error('tooltip is not allowed inside radio', event.line, event.col, self, event.raw);
                }
            }

        });
        parser.addListener('tagend', function (event) {
            var tagName = event.tagName.toLowerCase();
            if (tagName === "div" && unclosedDivsCounter > 0) {
                unclosedDivsCounter--;
            }
        });
    }
});
