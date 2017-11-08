HTMLHint.addRule({
    id: 'role-main',
    description: 'div with id "mainDiv" should have role "main" ',
    init: function (parser, reporter) {
        var isMainDiv = function (event) {
            var id = HTMLHint.utils.getAttributeValue(event.attrs, "id");
            var tagName = event.tagName;
            return tagName === 'div' && id === 'mainDiv';
        };

        var self = this;
        var isRoleMain = function (event) {
            var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, "role");
            return roleAttr === 'main';
        };
        var mainDivWithoutRoleMain = function (event) {
            return isMainDiv(event) && !isRoleMain(event);
        };

        var plainDivWithRoleMain = function (event) {
            return !isMainDiv(event) && isRoleMain(event);
        };

        parser.addListener('tagstart', function (event) {
            if (mainDivWithoutRoleMain(event)) {
                reporter.error('div with id "mainDiv" should have role "main"', event.line, event.col, self, event.raw);
            }
            if (plainDivWithRoleMain(event)) {
                reporter.error('role "main" cannot be set on div without id "mainDiv"', event.line, event.col, self, event.raw);
            }
        });
    }
});
