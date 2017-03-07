HTMLHint.addRule({
    id: 'tooltip-accessibility',
    description: 'element with binding "addTooltip" should have binding "addDescription"',
    init: function (parser, reporter) {
        var self = this;
        var isTooltipNotBound = true, isDivWithTooltip = false,tooltipId;
        var isTooltipSpan = function (event) {
            var tagName = event.tagName;
            var tooltipClass = HTMLHint.utils.isClassExsits(event.attrs, 'tooltip-help');
            return tagName === 'span' && tooltipClass;
        };
        var isDescriptionPointsToTooltip = function (bindings, tooltipId) {
            var startOfDescription = bindings.indexOf('addDescription');
            if (startOfDescription === -1) {
                return false;
            }
            var endOfDescription = bindings.indexOf(',', startOfDescription) > -1 ? bindings.indexOf(',', startOfDescription) : bindings.length;
            var descriptionBinding = bindings.substring(startOfDescription, endOfDescription);
            return descriptionBinding.includes(tooltipId);
        };

        parser.addListener('tagstart', function (event) {
            var dataBindings = HTMLHint.utils.getAttributeValue(event.attrs, "data-bind");
            if (isTooltipSpan(event)) {
                tooltipId = HTMLHint.utils.getAttributeValue(event.attrs, "id");
                if (!tooltipId) {
                    reporter.error('span with class tooltip-help must have an id', event.line, event.col, self, event.raw);
                }
                isTooltipNotBound = true;
                isDivWithTooltip = true;
            }
            if (isDivWithTooltip) {
                if (isDescriptionPointsToTooltip(dataBindings, tooltipId)) {
                    isTooltipNotBound = false;
                }
            }
        });
        parser.addListener('tagend', function (event) {
            var tagName = event.tagName.toLowerCase();
            if (tagName === "div") {
                if (isDivWithTooltip && isTooltipNotBound) {
                    reporter.error('span with class tooltip-help expects element with description in same div', event.line, event.col, self, event.raw);
                }
                isDivWithTooltip = false;
            }
        });

    }
});
