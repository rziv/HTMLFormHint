HTMLHint.addRule({
    id: 'required-accessibility',
    description: 'input with attribute tfsrequired should replace it to tlpRequired binding',
    init: function(parser, reporter) {
        var self = this;

        var isTfsrequiredAttr = function(event) {
            return HTMLHint.utils.isAttributeExists( event.attrs, 'tfsrequired');            
        };

        var isTfsrequiredBind = function(event) {
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttributeValue.includes('tfsrequired');                         
        };

        parser.addListener('tagstart', function(event) {
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'input'){    
                if (isTfsrequiredAttr(event) || isTfsrequiredBind(event)) {
                    reporter.error('input with attribute or binding "tfsrequired" should replace to "tlpRequired" binding. Error on line ' + event.line, event.line, event.col, self, event.raw);
                }
            }
        });
    }
});