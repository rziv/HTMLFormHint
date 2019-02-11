HTMLHint.addRule({
    id: 'vertical-containers-acceessibility',
    description: 'div with id "user" should have "setRoleTablist" binding',
    init: function (parser, reporter) {
        var isDivUser = function (event) {
            var id = HTMLHint.utils.getAttributeValue(event.attrs, "id");
            var tagName = event.tagName;
            return tagName === 'div' && id === 'user';
        };

        var self = this;

        var divUserWithoutSetRoleBinding = function (event) {
            var dataBindings = HTMLHint.utils.getAttributeValue(event.attrs, "data-bind");
            return isDivUser(event) && !dataBindings.includes('setRoleTablist');
        };

        parser.addListener('tagstart', function (event) {
            if (divUserWithoutSetRoleBinding(event)) {
                reporter.error('div with id "user" should have "setRoleTablist" binding. Error on line ' , event.line, event.col, self, event.raw);
            }
        });
    }
});
