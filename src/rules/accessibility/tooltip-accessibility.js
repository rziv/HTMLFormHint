HTMLHint.addRule({
    id: 'tooltip-accessibility',
    description: 'element with binding "addTooltip" should have binding "addDescription"',
    init: function (parser, reporter) {
        var self = this;
        var looseTooltips = [];
        var isTooltip = function (event) {
            var tagName = event.tagName;
            var hasTooltipClass = HTMLHint.utils.isClassExsits(event.attrs, 'tooltip-help');
            return tagName === 'span' && hasTooltipClass;
        };
        var isFocusableElement = function (event) {
            var focusabaleTagNames = ['input', 'textare', 'select', 'a', 'button'];
            return focusabaleTagNames.includes(event.tagName);
        };
        var getElementDescription = function (event) {
            var bindings = HTMLHint.utils.getAttributeValue(event.attrs, "data-bind");
            var startOfDescription = bindings.indexOf('addDescription');
            if (startOfDescription === -1) {
                return;
            }
            var endOfDescription = bindings.indexOf(',', startOfDescription) > -1 ? bindings.indexOf(',', startOfDescription) : bindings.length;
            return bindings.substring(startOfDescription, endOfDescription);
        };

        var findBoundTooltipInDescription = function (descriptionBinding) {
            return looseTooltips.find(function (tooltip) {
                if (tooltip) {
                    return descriptionBinding.includes(tooltip.id);
                }
            });
        };

        var removeFromLooseTooltips = function (boundTooltip) {
            var boundTooltipIndex = looseTooltips.indexOf(boundTooltip);
            if (boundTooltipIndex > -1) {
                looseTooltips.splice(boundTooltipIndex, 1);
            }
        };

        parser.addListener('tagstart', function (event) {
            if (isTooltip(event)) {
                var tooltipId = HTMLHint.utils.getAttributeValue(event.attrs, "id");
                var fullRaw = event.raw + '</span>';
                if (!tooltipId) {
                    reporter.error('span with class tooltip-help must have an id', event.line, event.col, self, event.raw);
                }
                else {
                    looseTooltips.push({ id: tooltipId, line: event.line, col: event.col, raw: fullRaw });
                }
            }
            if (looseTooltips.length > 0 && isFocusableElement(event)) {
                var descriptionBinding = getElementDescription(event);
                if (descriptionBinding) {
                    var boundTooltip = findBoundTooltipInDescription(descriptionBinding);
                    removeFromLooseTooltips(boundTooltip);
                }
            }
        });
        parser.addListener('end', function () {
            looseTooltips.forEach(function (looseTooltip) {
                reporter.error('tooltip ' + looseTooltip.raw + ' expects element to describe', looseTooltip.line, looseTooltip.col, self);
            }, this);
        });
    }
});
