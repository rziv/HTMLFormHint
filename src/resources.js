(function (HTMLHint, undefined) {

    const validationMessagesAccessibility = {
        messageIdPrefix: 'vmsg_',
        ariaLive: 'assertive'
    };


    var containersAccessibility = {
        idBinding: `'id':'tabpanel_+'name()`,
        ariaLabelBinding: `'aria-labeledby':'tab_'+name()`,
        role: 'tabpanel'
    };

    HTMLHint.resources = {
        validationMessagesAccessibility,
        containersAccessibility
    };

})(HTMLHint);
