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
            if (looseTooltips.length > 0 && HTMLHint.utils.isFocusableElement(event)) {
                var descriptionBinding = HTMLHint.utils.getBindingValue(event,'addDescription');
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
