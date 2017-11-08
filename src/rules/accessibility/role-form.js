HTMLHint.addRule({
    id: 'role-form',
    description: 'body tag should have role "form" ',
    init: function (parser, reporter) {
        var isBody = function (event) {
            var tagName = event.tagName;
            return tagName === 'body';
        };

        var self = this;
        var isRoleForm = function (event) {
            var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, "role");
            return roleAttr === 'form';
        };
        var bodyWithoutRoleForm = function (event) {
            return isBody(event) && !isRoleForm(event);
        };

        var otherTagWithRoleForm = function (event) {
            return !isBody(event) && isRoleForm(event);
        };

        parser.addListener('tagstart', function (event) {
            if (bodyWithoutRoleForm(event)) {
                reporter.error('body tag should have role "form"', event.line, event.col, self, event.raw);
            }
            if (otherTagWithRoleForm(event)) {
                reporter.error('role "form" cannot be set on tag other than body', event.line, event.col, self, event.raw);
            }
        });
    }
});
