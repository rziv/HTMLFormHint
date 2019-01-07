var expect  = require("expect.js");

var HTMLHint  = require("../../../../index").HTMLHint;

var ruldId = 'tabsHeader-accessibility',
    ruleOptions = {};

ruleOptions[ruldId] = true;

describe('Rules: '+ruldId, function(){

    it('tabsHeader element without "aria-orientation" attribute with "horizontal" value should result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('tabsHeader element with "aria-orientation" attribute with "horizontal" value should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('tabsHeader element without "role" attribute with "tablist" value should result in an error', function(){
        var code = `<ul class="tabs-navigation" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('tabsHeader element with "role" attribute with "tablist" value should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('in tabsHeader li element with "data-bind" attribute should result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item" data-bind="moveToContainer: $data ,css:{'active-tab': $parent.isCurrentContainer(name)}">                            
                            <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>                           
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('in tabsHeader li element without "data-bind" attribute should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('in tabsHeader A element without "role" attribute with "tab" value should result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('in tabsHeader A element with "role" attribute with "tab" value should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('in tabsHeader A element without "href" attribute with "#" value should result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('in tabsHeader A element with "href" attribute with "#" value should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    
    it('in tabsHeader A element without "activateTab" value in data-bind attribute should result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data, css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('in tabsHeader A element with "activateTab" value in data-bind attribute should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });

    it('in tabsHeader A element without "aria-selected" value in data-bind attribute should result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('in tabsHeader A element with "aria-selected" value in data-bind attribute should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
    
    it('in tabsHeader A element with "aria-controls" value in data-bind attribute should result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name)}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(1);
    });

    it('in tabsHeader A element with "aria-controls" value in data-bind attribute should not result in an error', function(){
        var code = `<ul class="tabs-navigation" role="tablist" aria-orientation="horizontal" data-bind="foreach: containersList">
                        <li class="item">
                            <a href="#" role="tab" data-bind="moveToContainer: $data ,activateTab:$parent.isCurrentContainer(name), css:{'active-tab': $parent.isCurrentContainer(name),'disable': !checkEnabled()}, attr: { 'disabled': !checkEnabled(),'aria-selected':$parent.isCurrentContainer(name),'aria-controls':('tabpanel_' + name())}">                
                                <span class="num" data-bind="text: $index()+1"></span><span class="title" data-bind="text: text "></span>
                            </a>
                        </li>
                    </ul>`;
        var messages = HTMLHint.verify(code, ruleOptions);
        expect(messages.length).to.be(0);
    });
});

