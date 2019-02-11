HTMLHint.addRule({
    id: 'role-footer',
    description: 'div with class "footer" should have role "contentinfo"',
    init: function (parser, reporter) {
        var isFooterDiv = function (event) {
            var tagName = event.tagName;
            return tagName === 'div' && HTMLHint.utils.isClassExsits(event.attrs, 'footer');            
        };

        var self = this;
        
        var isRoleFooter = function (event) {
            var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, "role");
            return roleAttr === 'contentinfo';
        };
        var footerDivWithoutRole = function (event) {
            return isFooterDiv(event) && !isRoleFooter(event);
        };
       
        var plainDivWithRoleContentinfo = function (event) {
            return !isFooterDiv(event) && isRoleFooter(event);
        };

        parser.addListener('tagstart', function (event) {
            if (footerDivWithoutRole(event)) {
                reporter.error('div with class "footer" should have role "contentinfo". Error on line ', event.line, event.col, self, event.raw);//
            }   
            if (plainDivWithRoleContentinfo(event)) {
                reporter.error('role "contentinfo" cannot be set on div without class "footer". Error on line ', event.line, event.col, self, event.raw);
            }        
        });
    }
});
