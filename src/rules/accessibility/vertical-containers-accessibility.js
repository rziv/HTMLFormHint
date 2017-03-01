HTMLHint.addRule({
    id: 'vertical-containers-acceessibility',
    description: 'div wih id "user" should have "setRoleTabList" binding',
    init: function (parser, reporter) {
        var isDivUser = function (event) {
            var id = HTMLHint.utils.getAttributeValue(event.attrs, "id");
            var tagName = event.tagName;
            return tagName === 'div' && id === 'user';
        };

        var self = this;

        var divUserWithoutSetRoleBinding = function (event) {
            var dataBindings = HTMLHint.utils.getAttributeValue(event.attrs, "data-bind");
            return isDivUser(event) && !dataBindings.includes('setRoleTabList');
        };

        parser.addListener('tagstart', function (event) {
            if (divUserWithoutSetRoleBinding(event)) {
                reporter.error('radiogroup container should have role attribute with radiogroup value' , event.line, event.col, self, event.raw);
            }
        });
    }
});
