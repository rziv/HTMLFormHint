(function (HTMLHint, undefined) {
    var containersAccessibility = {
        idBinding: `'id':'tabpanel_+'name()`,
        ariaLabelBinding: `'aria-labeledby':'tab_'+name()`,
        role: 'tabpanel'
    };

    HTMLHint.resources = {
       containersAccessibility
    };

})(HTMLHint);
