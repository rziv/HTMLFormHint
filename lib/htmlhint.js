/* jshint -W079 */
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
var HTMLHint = (function (undefined) {

    var HTMLHint = {};

    HTMLHint.version = '@VERSION';
    HTMLHint.release = '@RELEASE';

    HTMLHint.rules = {};

    //默认配置
    HTMLHint.defaultRuleset = {
        'tagname-lowercase': true,
        'attr-lowercase': true,
        'attr-value-double-quotes': true,
        'doctype-first': true,
        'tag-pair': true,
        'spec-char-escape': true,
        'id-unique': true,
        'src-not-empty': true,
        'attr-no-duplication': true,
        'title-require': true
    };

    HTMLHint.addRule = function(rule){
        HTMLHint.rules[rule.id] = rule;
    };

    HTMLHint.verify = function(html, ruleset){

        if(ruleset === undefined || Object.keys(ruleset).length ===0){
            ruleset = HTMLHint.defaultRuleset;
        }

        // parse inline ruleset
        html = html.replace(/^\s*<!--\s*htmlhint\s+([^\r\n]+?)\s*-->/i, function(all, strRuleset){
            if(ruleset === undefined){
                ruleset = {};
            }
            strRuleset.replace(/(?:^|,)\s*([^:,]+)\s*(?:\:\s*([^,\s]+))?/g, function(all, key, value){
                if(value === 'false'){
                    value = false;
                }
                else if(value === 'true'){
                    value = true;
                }
                ruleset[key] = value === undefined ? true : value;
            });
            return '';
        });

        var parser = new HTMLParser();
        var reporter = new HTMLHint.Reporter(html, ruleset);

        var rules = HTMLHint.rules,
            rule;
        for (var id in ruleset){
            rule = rules[id];
            if (rule !== undefined && ruleset[id] !== false){
              rule.init(parser, reporter, ruleset[id]);
            }
        }

        parser.parse(html);

        return reporter.messages;
    };

    // format messages
    HTMLHint.format = function(arrMessages, options){
        options = options || {};
        var arrLogs = [];
        var colors = {
            white: '',
            grey: '',
            red: '',
            reset: ''
        };
        if(options.colors){
            colors.white = '\033[37m';
            colors.grey = '\033[90m';
            colors.red = '\033[31m';
            colors.reset = '\033[39m';
        }
        var indent = options.indent || 0;
        arrMessages.forEach(function(hint){
            var leftWindow = 40;
            var rightWindow = leftWindow + 20;
            var evidence = hint.evidence;
            var line = hint.line;
            var col = hint.col;
            var evidenceCount = evidence.length;
            var leftCol = col > leftWindow + 1 ? col - leftWindow : 1;
            var rightCol = evidence.length > col + rightWindow ? col + rightWindow : evidenceCount;
            if(col < leftWindow + 1){
                rightCol += leftWindow - col + 1;
            }
            evidence = evidence.replace(/\t/g, ' ').substring(leftCol - 1, rightCol);
            // add ...
            if(leftCol > 1){
                evidence = '...' + evidence;
                leftCol -= 3;
            }
            if(rightCol < evidenceCount){
                evidence += '...';
            }
            // show evidence
            arrLogs.push(colors.white+repeatStr(indent)+'L'+line+' |' + colors.grey + evidence + colors.reset);
            // show pointer & message
            var pointCol = col - leftCol;
            // add double byte character
            var match = evidence.substring(0, pointCol).match(/[^\u0000-\u00ff]/g);
            if(match !== null){
                pointCol += match.length;
            }
            arrLogs.push(colors.white+repeatStr(indent)+repeatStr(String(line).length + 3 + pointCol)+'^ ' + colors.red + hint.message + ' (' + hint.rule.id+')' + colors.reset);
        });
        return arrLogs;
    };

    // repeat string
    function repeatStr(n, str){
        return new Array(n + 1).join(str || ' ');
    }

    return HTMLHint;

})();

if (typeof exports === 'object' && exports){
    exports.HTMLHint = HTMLHint;
}

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
(function(HTMLHint, undefined){

    var Reporter = function(){
        var self = this;
        self._init.apply(self,arguments);
    };

    Reporter.prototype = {
        _init: function(html, ruleset){
            var self = this;
            self.html = html;
            self.lines = html.split(/\r?\n/);
            var match = html.match(/\r?\n/);
            self.brLen = match !== null ? match[0].length : 0;
            self.ruleset = ruleset;
            self.messages = [];
        },
        // error message
        error: function(message, line, col, rule, raw){
            this.report('error', message, line, col, rule, raw);
        },
        // warning message
        warn: function(message, line, col, rule, raw){
            this.report('warning', message, line, col, rule, raw);
        },
        // info message
        info: function(message, line, col, rule, raw){
            this.report('info', message, line, col, rule, raw);
        },
        // save report
        report: function(type, message, line, col, rule, raw){
            var self = this;
            var lines = self.lines;
            var brLen = self.brLen;
            var evidence, evidenceLen;
            for(var i=line-1, lineCount=lines.length;i<lineCount;i++){
                evidence = lines[i];
                evidenceLen = evidence.length;
                if(col > evidenceLen && line < lineCount){
                    line ++;
                    col -= evidenceLen;
                    if(col !== 1){
                        col -= brLen;
                    }
                }
                else{
                    break;
                }
            }
            self.messages.push({
                type: type,
                message: message,
                raw: raw,
                evidence: evidence,
                line: line,
                col: col,
                rule: {
                    id: rule.id,
                    description: rule.description,
                    link: 'https://github.com/yaniswang/HTMLHint/wiki/' + rule.id
                }
            });
        }
    };

    HTMLHint.Reporter = Reporter;

})(HTMLHint);

/* jshint -W079 */
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
var HTMLParser = (function(undefined){

    var HTMLParser = function(){
        var self = this;
        self._init.apply(self,arguments);
    };

    HTMLParser.prototype = {
        _init: function(){
            var self = this;
            self._listeners = {};
            self._mapCdataTags = self.makeMap("script,style");
            self._arrBlocks = [];
            self.lastEvent = null;
        },

        makeMap: function(str){
            var obj = {}, items = str.split(",");
            for ( var i = 0; i < items.length; i++ ){
                obj[ items[i] ] = true;
            }
            return obj;
        },

        // parse html code
        parse: function(html){

            var self = this,
                mapCdataTags = self._mapCdataTags;

            var regTag=/<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g,
                regAttr = /\s*([^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g,
                regLine = /\r?\n/g;

            var match, matchIndex, lastIndex = 0, tagName, arrAttrs, tagCDATA, attrsCDATA, arrCDATA, lastCDATAIndex = 0, text;
            var lastLineIndex = 0, line = 1;
            var arrBlocks = self._arrBlocks;

            self.fire('start', {
                pos: 0,
                line: 1,
                col: 1
            });

            while((match = regTag.exec(html))){
                matchIndex = match.index;
                if(matchIndex > lastIndex){//保存前面的文本或者CDATA
                    text = html.substring(lastIndex, matchIndex);
                    if(tagCDATA){
                        arrCDATA.push(text);
                    }
                    else{//文本
                        saveBlock('text', text, lastIndex);
                    }
                }
                lastIndex = regTag.lastIndex;

                if((tagName = match[1])){
                    if(tagCDATA && tagName === tagCDATA){//结束标签前输出CDATA
                        text = arrCDATA.join('');
                        saveBlock('cdata', text, lastCDATAIndex, {
                            'tagName': tagCDATA,
                            'attrs': attrsCDATA
                        });
                        tagCDATA = null;
                        attrsCDATA = null;
                        arrCDATA = null;
                    }
                    if(!tagCDATA){
                        //标签结束
                        saveBlock('tagend', match[0], matchIndex, {
                            'tagName': tagName
                        });
                        continue;
                    }
                }

                if(tagCDATA){
                    arrCDATA.push(match[0]);
                }
                else{
                    if((tagName = match[4])){//标签开始
                        arrAttrs = [];
                        var attrs = match[5],
                            attrMatch,
                            attrMatchCount = 0;
                        while((attrMatch = regAttr.exec(attrs))){
                            var name = attrMatch[1],
                                quote = attrMatch[2] ? attrMatch[2] :
                                    attrMatch[4] ? attrMatch[4] : '',
                                value = attrMatch[3] ? attrMatch[3] :
                                    attrMatch[5] ? attrMatch[5] :
                                    attrMatch[6] ? attrMatch[6] : '';
                            arrAttrs.push({'name': name, 'value': value, 'quote': quote, 'index': attrMatch.index, 'raw': attrMatch[0]});
                            attrMatchCount += attrMatch[0].length;
                        }
                        if(attrMatchCount === attrs.length){
                            saveBlock('tagstart', match[0], matchIndex, {
                                'tagName': tagName,
                                'attrs': arrAttrs,
                                'close': match[6]
                            });
                            if(mapCdataTags[tagName]){
                                tagCDATA = tagName;
                                attrsCDATA = arrAttrs.concat();
                                arrCDATA = [];
                                lastCDATAIndex = lastIndex;
                            }
                        }
                        else{//如果出现漏匹配，则把当前内容匹配为text
                            saveBlock('text', match[0], matchIndex);
                        }
                    }
                    else if(match[2] || match[3]){//注释标签
                        saveBlock('comment', match[0], matchIndex, {
                            'content': match[2] || match[3],
                            'long': match[2]?true:false
                        });
                    }
                }
            }

            if(html.length > lastIndex){
                //结尾文本
                text = html.substring(lastIndex, html.length);
                saveBlock('text', text, lastIndex);
            }

            self.fire('end', {
                pos: lastIndex,
                line: line,
                col: html.length - lastLineIndex + 1
            });

            //存储区块
            function saveBlock(type, raw, pos, data){
                var col = pos - lastLineIndex + 1;
                if(data === undefined){
                    data = {};
                }
                data.raw = raw;
                data.pos = pos;
                data.line = line;
                data.col = col;
                arrBlocks.push(data);
                self.fire(type, data);
                var lineMatch;
                while((lineMatch = regLine.exec(raw))){
                    line ++;
                    lastLineIndex = pos + regLine.lastIndex;
                }
            }

        },

        // add event
        addListener: function(types, listener){
            var _listeners = this._listeners;
            var arrTypes = types.split(/[,\s]/), type;
            for(var i=0, l = arrTypes.length;i<l;i++){
                type = arrTypes[i];
                if (_listeners[type] === undefined){
                    _listeners[type] = [];
                }
                _listeners[type].push(listener);
            }
        },

        // fire event
        fire: function(type, data){
            if (data === undefined){
                data = {};
            }
            data.type = type;
            var self = this,
                listeners = [],
                listenersType = self._listeners[type],
                listenersAll = self._listeners['all'];
            if (listenersType !== undefined){
                listeners = listeners.concat(listenersType);
            }
            if (listenersAll !== undefined){
                listeners = listeners.concat(listenersAll);
            }
            var lastEvent = self.lastEvent;
            if(lastEvent !== null){
                delete lastEvent['lastEvent'];
                data.lastEvent = lastEvent;
            }
            self.lastEvent = data;
            for (var i = 0, l = listeners.length; i < l; i++){
                listeners[i].call(self, data);
            }
        },

        // remove event
        removeListener: function(type, listener){
            var listenersType = this._listeners[type];
            if(listenersType !== undefined){
                for (var i = 0, l = listenersType.length; i < l; i++){
                    if (listenersType[i] === listener){
                        listenersType.splice(i, 1);
                        break;
                    }
                }
            }
        },

        //fix pos if event.raw have \n
        fixPos: function(event, index){
            var text = event.raw.substr(0, index);
            var arrLines = text.split(/\r?\n/),
                lineCount = arrLines.length - 1,
                line = event.line, col;
            if(lineCount > 0){
                line += lineCount;
                col = arrLines[lineCount].length + 1;
            }
            else{
                col = event.col + index;
            }
            return {
                line: line,
                col: col
            };
        },

        // covert array type of attrs to map
        getMapAttrs: function(arrAttrs){
            var mapAttrs = {},
                attr;
            for(var i=0,l=arrAttrs.length;i<l;i++){
                attr = arrAttrs[i];
                mapAttrs[attr.name] = attr.value;
            }
            return mapAttrs;
        }
    };

    return HTMLParser;

})();

if (typeof exports === 'object' && exports){
    exports.HTMLParser = HTMLParser;
}

(function (HTMLHint, undefined) {
    "use strict";

    const isAttributeExists = function (attributes, attributeName) {
        if (!Array.isArray(attributes) || typeof attributeName !== "string") {
            return undefined;
        }

        return attributes.some(
            (attr) => attr.name.toLowerCase() === attributeName.toLowerCase()
        );
    };

    const trimAll = function (val) {
        if (typeof val !== 'string') {
            return;
        }
        return val.replace(/ /g, '');
    };

    const getAttribute = function (attributes, attributeName) {
        if (!Array.isArray(attributes) || typeof attributeName !== "string") {
            return undefined;
        }

        if (isAttributeExists(attributes, attributeName)) {
            return attributes.find(
                (attr) => attr.name.toLowerCase() === attributeName.toLowerCase()
            );
        }

        return undefined;
    };

    const removeBoundaryQuotes = function (str) {
        return str.replace(/(^")|("$)|(^')|('$)/g, '');
    };

    const getAttributeValue = function (attributes, attributeName) {
        let attributeObject = getAttribute(attributes, attributeName);
        return attributeObject ? attributeObject.value : '';
    };

    const getBindingValue = function (event, bindingName) {
        var bindings = getAttributeValue(event.attrs, "data-bind");
        var startOfBinding = bindings.indexOf(bindingName);
        if (startOfBinding === -1) {
            return;
        }
        var endOfBinding = bindings.indexOf(',', startOfBinding) > -1 ? bindings.indexOf(',', startOfBinding) : bindings.length;
        return bindings.substring(startOfBinding + bindingName.length + 1, endOfBinding).trim();//trim to avoid whiteSpaced, add 1 to take ":" in account
    };

    const isClassExsits = function (attributes, className) {
        let classNames = getAttributeValue(attributes, "class");
        let classesArray = classNames.split(/\s+/g);
        return classesArray.some(c => c === className);
    };

    const isDynamicTable = function (tagName, attributes) {
        return (tagName.toLowerCase() === "table") &&
            (HTMLHint.utils.isAttributeExists(attributes, "tfsdata") ||
                HTMLHint.utils.isAttributeExists(attributes, "tfsnestedtable"));
    };

    const isFocusableElement = function (event) {
        var focusabaleTagNames = ['input', 'textare', 'select', 'a', 'button'];
        return focusabaleTagNames.includes(event.tagName);
    };

    HTMLHint.utils = {
        trimAll,
        isAttributeExists,
        getAttribute,
        removeBoundaryQuotes,
        isClassExsits,
        getAttributeValue,
        isDynamicTable,
        getBindingValue,
        isFocusableElement
    };

})(HTMLHint);
(function (HTMLHint, undefined) {
    "use strict";
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

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2014, Takeshi Kurosawa <taken.spc@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'alt-require',
    description: 'The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase(),
                mapAttrs = parser.getMapAttrs(event.attrs),
                col = event.col + tagName.length + 1,
                selector;
            if(tagName === 'img' && !('alt' in mapAttrs)){
                reporter.warn('An alt attribute must be present on <img> elements.', event.line, col, self, event.raw);
            }
            else if((tagName === 'area' && 'href' in mapAttrs) ||
                (tagName === 'input' && mapAttrs['type'] === 'image')){
                if(!('alt' in mapAttrs) || mapAttrs['alt'] === ''){
                    selector = tagName === 'area' ? 'area[href]' : 'input[type=image]';
                    reporter.warn('The alt attribute of ' + selector + ' must have a value.', event.line, col, self, event.raw);
                }
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'attr-lowercase',
    description: 'All attribute names must be in lowercase.',
    init: function(parser, reporter, options){
        var self = this;
        var exceptions = Array.isArray(options) ? options : [];
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs,
                attr,
                col = event.col + event.tagName.length + 1;
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                var attrName = attr.name;
                if (exceptions.indexOf(attrName) === -1 && attrName !== attrName.toLowerCase()){
                    reporter.error('The attribute name of [ '+attrName+' ] must be in lowercase.', event.line, col + attr.index, self, attr.raw);
                }
            }
        });
    }
});

/**
 * Copyright (c) 2014, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'attr-no-duplication',
    description: 'Elements cannot have duplicate attributes.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs;
            var attr;
            var attrName;
            var col = event.col + event.tagName.length + 1;

            var mapAttrName = {};
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                attrName = attr.name;
                if(mapAttrName[attrName] === true){
                    reporter.error('Duplicate of attribute name [ '+attr.name+' ] was found.', event.line, col + attr.index, self, attr.raw);
                }
                mapAttrName[attrName] = true;
            }
        });
    }
});
/**
 * Copyright (c) 2014, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'attr-unsafe-chars',
    description: 'Attribute values cannot contain unsafe chars.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs,
                attr,
                col = event.col + event.tagName.length + 1;
            // exclude \x09(\t), \x0a(\r), \x0d(\n)
            var regUnsafe = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
            var match;
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                match = attr.value.match(regUnsafe);
                if(match !== null){
                    var unsafeCode = escape(match[0]).replace(/%u/, '\\u').replace(/%/, '\\x');
                    reporter.warn('The value of attribute [ '+attr.name+' ] cannot contain an unsafe char [ ' + unsafeCode + ' ].', event.line, col + attr.index, self, attr.raw);
                }
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'attr-value-double-quotes',
    description: 'Attribute values must be in double quotes.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs,
                attr,
                col = event.col + event.tagName.length + 1;
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                if((attr.value !== '' && attr.quote !== '"') ||
                    (attr.value === '' && attr.quote === "'")){
                    reporter.error('The value of attribute [ '+attr.name+' ] must be in double quotes.', event.line, col + attr.index, self, attr.raw);
                }
            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'attr-value-not-empty',
    description: 'All attributes must have values.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs,
                attr,
                col = event.col + event.tagName.length + 1;
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                if(attr.quote === '' && attr.value === ''){
                    reporter.warn('The attribute [ '+attr.name+' ] must have a value.', event.line, col + attr.index, self, attr.raw);
                }
            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'csslint',
    description: 'Scan css with csslint.',
    init: function(parser, reporter, options){
        var self = this;
        parser.addListener('cdata', function(event){
            if(event.tagName.toLowerCase() === 'style'){

                var cssVerify;

                if(typeof exports === 'object' && require){
                    cssVerify = require("csslint").CSSLint.verify;
                }
                else{
                    cssVerify = CSSLint.verify;
                }

                if(options !== undefined){
                    var styleLine = event.line - 1,
                        styleCol = event.col - 1;
                    try{
                        var messages = cssVerify(event.raw, options).messages;
                        messages.forEach(function(error){
                            var line = error.line;
                            reporter[error.type==='warning'?'warn':'error']('['+error.rule.id+'] '+error.message, styleLine + line, (line === 1 ? styleCol : 0) + error.col, self, error.evidence);
                        });
                    }
                    catch(e){}
                }

            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'doctype-first',
    description: 'Doctype must be declared first.',
    init: function(parser, reporter){
        var self = this;
        var allEvent = function(event){
            if(event.type === 'start' || (event.type === 'text' && /^\s*$/.test(event.raw))){
                return;
            }
            if((event.type !== 'comment' && event.long === false) || /^DOCTYPE\s+/i.test(event.content) === false){
                reporter.error('Doctype must be declared first.', event.line, event.col, self, event.raw);
            }
            parser.removeListener('all', allEvent);
        };
        parser.addListener('all', allEvent);
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'doctype-html5',
    description: 'Invalid doctype. Use: "<!DOCTYPE html>"',
    init: function(parser, reporter){
        var self = this;
        function onComment(event){
            if(event.long === false && event.content.toLowerCase() !== 'doctype html'){
                reporter.warn('Invalid doctype. Use: "<!DOCTYPE html>"', event.line, event.col, self, event.raw);
            }
        }
        function onTagStart(){
            parser.removeListener('comment', onComment);
            parser.removeListener('tagstart', onTagStart);
        }
        parser.addListener('all', onComment);
        parser.addListener('tagstart', onTagStart);
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'head-script-disabled',
    description: 'The <script> tag cannot be used in a <head> tag.',
    init: function(parser, reporter){
        var self = this;
        var reScript = /^(text\/javascript|application\/javascript)$/i;
        var isInHead = false;
        function onTagStart(event){
            var mapAttrs = parser.getMapAttrs(event.attrs);
            var type = mapAttrs.type;
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'head'){
                isInHead = true;
            }
            if(isInHead === true &&
                tagName === 'script' &&
                (!type || reScript.test(type) === true)){
                reporter.warn('The <script> tag cannot be used in a <head> tag.', event.line, event.col, self, event.raw);
            }
        }
        function onTagEnd(event){
            if(event.tagName.toLowerCase() === 'head'){
                parser.removeListener('tagstart', onTagStart);
                parser.removeListener('tagend', onTagEnd);
            }
        }
        parser.addListener('tagstart', onTagStart);
        parser.addListener('tagend', onTagEnd);
    }
});

/**
 * Copyright (c) 2014, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'href-abs-or-rel',
    description: 'An href attribute must be either absolute or relative.',
    init: function(parser, reporter, options){
        var self = this;

        var hrefMode = options === 'abs' ? 'absolute' : 'relative';

        parser.addListener('tagstart', function(event){
            var attrs = event.attrs;
            var attr;
            var col = event.col + event.tagName.length + 1;

            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                if(attr.name === 'href'){
                    if((hrefMode === 'absolute' && /^\w+?:/.test(attr.value) === false) ||
                        (hrefMode === 'relative' && /^https?:\/\//.test(attr.value) === true)){
                        reporter.warn('The value of the href attribute [ '+attr.value+' ] must be '+hrefMode+'.', event.line, col + attr.index, self, attr.raw);
                    }
                    break;
                }
            }
        });
    }
});
/**
 * Copyright (c) 2014, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'id-class-ad-disabled',
    description: 'The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs;
            var attr;
            var attrName;
            var col = event.col + event.tagName.length + 1;

            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                attrName = attr.name;
                if(/^(id|class)$/i.test(attrName)){
                    if(/(^|[-\_])ad([-\_]|$)/i.test(attr.value)){
                        reporter.warn('The value of attribute '+attrName+' cannot use the ad keyword.', event.line, col + attr.index, self, attr.raw);
                    }
                }
            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'id-class-value',
    description: 'The id and class attribute values must meet the specified rules.',
    init: function(parser, reporter, options){
        var self = this;
        var arrRules = {
            'underline': {
                'regId': /^[a-z\d]+(_[a-z\d]+)*$/,
                'message': 'The id and class attribute values must be in lowercase and split by an underscore.'
            },
            'dash': {
                'regId': /^[a-z\d]+(-[a-z\d]+)*$/,
                'message': 'The id and class attribute values must be in lowercase and split by a dash.'
            },
            'hump': {
                'regId': /^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/,
                'message': 'The id and class attribute values must meet the camelCase style.'
            }
        }, rule;
        if(typeof options === 'string'){
            rule = arrRules[options];
        }
        else{
            rule = options;
        }
        if(rule && rule.regId){
            var regId = rule.regId,
                message = rule.message;
            parser.addListener('tagstart', function(event){
                var attrs = event.attrs,
                    attr,
                    col = event.col + event.tagName.length + 1;
                for(var i=0, l1=attrs.length;i<l1;i++){
                    attr = attrs[i];
                    if(attr.name.toLowerCase() === 'id'){
                        if(regId.test(attr.value) === false){
                            reporter.warn(message, event.line, col + attr.index, self, attr.raw);
                        }
                    }
                    if(attr.name.toLowerCase() === 'class'){
                        var arrClass = attr.value.split(/\s+/g), classValue;
                        for(var j=0, l2=arrClass.length;j<l2;j++){
                            classValue = arrClass[j];
                            if(classValue && regId.test(classValue) === false){
                                reporter.warn(message, event.line, col + attr.index, self, classValue);
                            }
                        }
                    }
                }
            });
        }
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'id-unique',
    description: 'The value of id attributes must be unique.',
    init: function(parser, reporter){
        var self = this;
        var mapIdCount = {};
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs,
                attr,
                id,
                col = event.col + event.tagName.length + 1;
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                if(attr.name.toLowerCase() === 'id'){
                    id = attr.value;
                    if(id){
                        if(mapIdCount[id] === undefined){
                            mapIdCount[id] = 1;
                        }
                        else{
                            mapIdCount[id] ++;
                        }
                        if(mapIdCount[id] > 1){
                            reporter.error('The id value [ '+id+' ] must be unique.', event.line, col + attr.index, self, attr.raw);
                        }
                    }
                    break;
                }
            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'inline-script-disabled',
    description: 'Inline script cannot be used.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs;
            var attr;
            var col = event.col + event.tagName.length + 1;
            var attrName;
            var reEvent = /^on(unload|message|submit|select|scroll|resize|mouseover|mouseout|mousemove|mouseleave|mouseenter|mousedown|load|keyup|keypress|keydown|focus|dblclick|click|change|blur|error)$/i;

            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                attrName = attr.name.toLowerCase();
                if(reEvent.test(attrName) === true){
                    reporter.warn('Inline script [ '+attr.raw+' ] cannot be used.', event.line, col + attr.index, self, attr.raw);
                }
                else if(attrName === 'src' || attrName === 'href'){
                    if(/^\s*javascript:/i.test(attr.value)){
                        reporter.warn('Inline script [ '+attr.raw+' ] cannot be used.', event.line, col + attr.index, self, attr.raw);
                    }
                }
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'inline-style-disabled',
    description: 'Inline style cannot be used.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var attrs = event.attrs;
            var attr;
            var col = event.col + event.tagName.length + 1;
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                if(attr.name.toLowerCase() === 'style'){
                    reporter.warn('Inline style [ '+attr.raw+' ] cannot be used.', event.line, col + attr.index, self, attr.raw);
                }
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'jshint',
    description: 'Scan script with jshint.',
    init: function(parser, reporter, options){
        var self = this;
        parser.addListener('cdata', function(event){
            if(event.tagName.toLowerCase() === 'script'){

                var mapAttrs = parser.getMapAttrs(event.attrs),
                    type = mapAttrs.type;

                // Only scan internal javascript
                if(mapAttrs.src !== undefined || (type && /^(text\/javascript)$/i.test(type) === false)){
                    return;
                }

                var jsVerify;

                if(typeof exports === 'object' && require){
                    jsVerify = require('jshint').JSHINT;
                }
                else{
                    jsVerify = JSHINT;
                }

                if(options !== undefined){
                    var styleLine = event.line - 1,
                        styleCol = event.col - 1;
                    var code = event.raw.replace(/\t/g,' ');
                    try{
                        var status = jsVerify(code, options);
                        if(status === false){
                            jsVerify.errors.forEach(function(error){
                                var line = error.line;
                                reporter.warn(error.reason, styleLine + line, (line === 1 ? styleCol : 0) + error.character, self, error.evidence);
                            });
                        }
                    }
                    catch(e){}
                }

            }
        });
    }
});
/**
 * Copyright (c) 2014, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'space-tab-mixed-disabled',
    description: 'Do not mix tabs and spaces for indentation.',
    init: function(parser, reporter, options){
        var self = this;
        var indentMode = 'nomix';
        var spaceLengthRequire = null;
        if(typeof options === 'string'){
            var match = options.match(/^([a-z]+)(\d+)?/);
            indentMode = match[1];
            spaceLengthRequire = match[2] && parseInt(match[2], 10);
        }
        parser.addListener('text', function(event){
            var raw = event.raw;
            var reMixed = /(^|\r?\n)([ \t]+)/g;
            var match;
            while((match = reMixed.exec(raw))){
                var fixedPos = parser.fixPos(event, match.index + match[1].length);
                if(fixedPos.col !== 1){
                    continue;
                }
                var whiteSpace  = match[2];
                if(indentMode === 'space'){
                    if(spaceLengthRequire){
                        if(/^ +$/.test(whiteSpace) === false || whiteSpace.length % spaceLengthRequire !== 0){
                            reporter.warn('Please use space for indentation and keep '+spaceLengthRequire+' length.', fixedPos.line, 1, self, event.raw);
                        }
                    }
                    else{
                        if(/^ +$/.test(whiteSpace) === false){
                            reporter.warn('Please use space for indentation.', fixedPos.line, 1, self, event.raw);
                        }
                    }
                }
                else if(indentMode === 'tab' && /^\t+$/.test(whiteSpace) === false){
                    reporter.warn('Please use tab for indentation.', fixedPos.line, 1, self, event.raw);
                }
                else if(/ +\t|\t+ /.test(whiteSpace) === true){
                    reporter.warn('Do not mix tabs and spaces for indentation.', fixedPos.line, 1, self, event.raw);
                }
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'spec-char-escape',
    description: 'Special characters must be escaped.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('text', function(event){
            var raw = event.raw,
                reSpecChar = /[<>]/g,
                match;
            while((match = reSpecChar.exec(raw))){
                var fixedPos = parser.fixPos(event, match.index);
                reporter.error('Special characters must be escaped : [ '+match[0]+' ].', fixedPos.line, fixedPos.col, self, event.raw);
            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'src-not-empty',
    description: 'The src attribute of an img(script,link) must have a value.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName,
                attrs = event.attrs,
                attr,
                col = event.col + tagName.length + 1;
            for(var i=0, l=attrs.length;i<l;i++){
                attr = attrs[i];
                if(((/^(img|script|embed|bgsound|iframe)$/.test(tagName) === true && attr.name === 'src') ||
                    (tagName === 'link' && attr.name === 'href') ||
                    (tagName === 'object' && attr.name === 'data')) &&
                    attr.value === ''){
                    reporter.error('The attribute [ '+attr.name + ' ] of the tag [ '+tagName+' ] must have a value.', event.line, col + attr.index, self, attr.raw);
                }
            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'style-disabled',
    description: '<style> tags cannot be used.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart', function(event){
            if(event.tagName.toLowerCase() === 'style'){
                reporter.warn('The <style> tag cannot be used.', event.line, event.col, self, event.raw);
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'tag-pair',
    description: 'Tag must be paired.',
    init: function(parser, reporter){
        var self = this;
        var stack=[],
            mapEmptyTags = parser.makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr");//HTML 4.01 + HTML 5
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if (mapEmptyTags[tagName] === undefined && !event.close){
                stack.push({
                    tagName: tagName,
                    line: event.line,
                    raw: event.raw
                });
            }
        });
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            //向上寻找匹配的开始标签
            for(var pos = stack.length-1;pos >= 0; pos--){
                if(stack[pos].tagName === tagName){
                    break;
                }
            }
            if(pos >= 0){
                var arrTags = [];
                for(var i=stack.length-1;i>pos;i--){
                    arrTags.push('</'+stack[i].tagName+'>');
                }
                if(arrTags.length > 0){
                    var lastEvent = stack[stack.length-1];
                    reporter.error('Tag must be paired, missing: [ '+ arrTags.join('') + ' ], start tag match failed [ ' + lastEvent.raw + ' ] on line ' + lastEvent.line + '.', event.line, event.col, self, event.raw);
                }
                stack.length=pos;
            }
            else{
                reporter.error('Tag must be paired, no start tag: [ ' + event.raw + ' ]', event.line, event.col, self, event.raw);
            }
        });
        parser.addListener('end', function(event){
            var arrTags = [];
            for(var i=stack.length-1;i>=0;i--){
                arrTags.push('</'+stack[i].tagName+'>');
            }
            if(arrTags.length > 0){
                var lastEvent = stack[stack.length-1];
                reporter.error('Tag must be paired, missing: [ '+ arrTags.join('') + ' ], open tag match failed [ ' + lastEvent.raw + ' ] on line ' + lastEvent.line + '.', event.line, event.col, self, '');
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'tag-self-close',
    description: 'Empty tags must be self closed.',
    init: function(parser, reporter){
        var self = this;
        var mapEmptyTags = parser.makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr");//HTML 4.01 + HTML 5
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(mapEmptyTags[tagName] !== undefined){
                if(!event.close){
                    reporter.warn('The empty tag : [ '+tagName+' ] must be self closed.', event.line, event.col, self, event.raw);
                }
            }
        });
    }
});

/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'tagname-lowercase',
    description: 'All html element names must be in lowercase.',
    init: function(parser, reporter){
        var self = this;
        parser.addListener('tagstart,tagend', function(event){
            var tagName = event.tagName;
            if(tagName !== tagName.toLowerCase()){
                reporter.error('The html element name of [ '+tagName+' ] must be in lowercase.', event.line, event.col, self, event.raw);
            }
        });
    }
});
/**
 * Copyright (c) 2015, Yanis Wang <yanis.wang@gmail.com>
 * MIT Licensed
 */
HTMLHint.addRule({
    id: 'title-require',
    description: '<title> must be present in <head> tag.',
    init: function(parser, reporter){
        var self = this;
        var headBegin = false;
        var hasTitle = false;
        function onTagStart(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'head'){
                headBegin = true;
            }
            else if(tagName === 'title' && headBegin){
                hasTitle = true;
            }
        }
        function onTagEnd(event){
            var tagName = event.tagName.toLowerCase();
            if(hasTitle && tagName === 'title'){
                var lastEvent = event.lastEvent;
                if(lastEvent.type !== 'text' || (lastEvent.type === 'text' && /^\s*$/.test(lastEvent.raw) === true)){
                    reporter.error('<title></title> must not be empty.', event.line, event.col, self, event.raw);
                }
            }
            else if(tagName === 'head'){
                if(hasTitle === false){
                    reporter.error('<title> must be present in <head> tag.', event.line, event.col, self, event.raw);
                }
                parser.removeListener('tagstart', onTagStart);
                parser.removeListener('tagend', onTagEnd);
            }
        }
        parser.addListener('tagstart', onTagStart);
        parser.addListener('tagend', onTagEnd);
    }
});

HTMLHint.addRule({
    id: 'A-tag-accessibility',
    description: 'add aria-label and aria-description to A tag',
    init: function(parser, reporter) {
        var self = this;
      
        var tagAWithoutAriaLabelAttr = [];
        var tagAWithoutaddDescriptionBind = [];

        var isAriaLabelAttribute = function(event){
            var ariaLabelAttribute = HTMLHint.utils.isAttributeExists(event.attrs, 'aria-label');
            return ariaLabelAttribute === true;   
        };

        var isAriaLabelBinding = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            var ariaLabelBind = bindAttributeValue.includes('aria-label');
            return ariaLabelBind === true;
        };

        var addElementWithoutAriaLabelAttrToArray = function(event) {  
            if(!isAriaLabelAttribute(event) && !isAriaLabelBinding(event)){
                tagAWithoutAriaLabelAttr.push(event);
            }                                               
        };

        var addElementWithoutAddDesriptionBindToArray = function(event) {            
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            var addDescriptionBind = bindAttributeValue.includes('addDescription');  
            if(addDescriptionBind === false){
                tagAWithoutaddDescriptionBind.push(event);
            }                                               
        };           

        var isLinkOpenInNewWindow = function(event) {            
            var attrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'target');
            return attrValue === '_blank';            
        };

        var reportOfTagAWithoutAriaLabelAttr = function() {            
            if (tagAWithoutAriaLabelAttr.length > 0) {
                for(var item of tagAWithoutAriaLabelAttr) {              
                    reporter.warn('If the link does not express its clear purpose, should be add "aria-label" attribute or bind. Warn On line: ' + item.line, item.line, item.col, self, item.raw);                                   
                }
            }                                              
        };               
       
        var reportOfTagAWithoutAddDescriptionBind = function() {  
            if (tagAWithoutaddDescriptionBind.length > 0) {
                for(var item of tagAWithoutaddDescriptionBind) {              
                    reporter.error('A tag should contain "addDescription" binding that bind to "accessibilityNewWindowAlert" span. Error on line ' + item.line, item.line, item.col, self, item.raw);                
                }
            }                                                        
        }; 
       
        parser.addListener('tagstart', function(event) {          
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'a') {
                addElementWithoutAriaLabelAttrToArray(event);                
                if(isLinkOpenInNewWindow(event)) {
                    addElementWithoutAddDesriptionBindToArray(event);                   
                } 
            }           
        });
     
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'body'){   
                reportOfTagAWithoutAriaLabelAttr(); 
                reportOfTagAWithoutAddDescriptionBind();
            }                                  
        }); 
    }
});

HTMLHint.addRule({
    id: 'checkbox-acceessibility',
    description: 'verify checkbox group container has aria-labelledby attributes, and checkbox input has accessibility bindings.',
    init: function(parser, reporter){
        var unclosedDivsCounter = 0;
        var inCheckboxGroup = false;       
        var self = this;   
              
        var isCheckboxContainerWithoutAriaLabelledAttribute = function(event){
            var ariaLabelledbyAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"aria-labelledby");        
            return isCheckboxGroupContainer(event) && ariaLabelledbyAttribute === '';
        };

        var isCheckboxGroupContainer = function(event){
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className.toLowerCase() ==="checkbox-group-container");
        };

        var isCheckboxElement = function(event){
            var typeAttrValue = HTMLHint.utils.getAttributeValue(event.attrs,"type");
            return typeAttrValue.toLowerCase() === 'checkbox';          
        };
        
        var singleCheckboxWithoutAccessibility = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return isCheckboxElement(event) && !inCheckboxGroup && !bindAttributeValue.includes('aria-checked');
        };

        var checkboxInGroupWithoutAccessibility = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return isCheckboxElement(event) && inCheckboxGroup &&(!bindAttributeValue.includes('checkboxAccessibility'));
        };

        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'div' && inCheckboxGroup){
                unclosedDivsCounter++;
            }
            if(isCheckboxGroupContainer(event)){
            inCheckboxGroup = true;
            unclosedDivsCounter++;
            }          
            if (isCheckboxContainerWithoutAriaLabelledAttribute(event))
            {
            reporter.error('checkbox container should have aria-labelledby attribute with value. Error on line ' + event.line , event.line, event.col, self, event.raw);
            } 
            if(singleCheckboxWithoutAccessibility(event)){
                reporter.error('single checkbox input should have aria-checked binding. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
            }
            if(checkboxInGroupWithoutAccessibility(event)){
                reporter.error('checkbox input in group should have checkboxAccessibility binding. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
            }            
        });         
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();          
            if (tagName === "div" && unclosedDivsCounter > 0) {
                unclosedDivsCounter--;
            }
            if (unclosedDivsCounter === 0)  {
                inCheckboxGroup = false;
            }        
        });       
    }
});

HTMLHint.addRule({
    id: 'containers-accessibility',
    description: 'div with class container should have role of tabPanel and binding addAccessibilityContainerAttrs with the value of "name"',
    init: function (parser, reporter) {
        var self = this;
        var isContainer = function (element, attributes) {
            return (element === "div" && HTMLHint.utils.isClassExsits(attributes, "container"));
        };

        var isContainerWithoutAccessibilityBinding = function (event) {
            if (HTMLHint.utils.getBindingValue(event, 'addAccessibilityContainerAttrs') !== 'name') {
                return true;
            }
            return false;
        };

        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName.toLowerCase();

            if (isContainer(tagName, event.attrs)) {
                var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, "role");
                if (roleAttr !== 'tabpanel') {
                    reporter.error('div with class container should have role "tabpanel"', event.line, event.col, self, event.raw);
                }

                if (isContainerWithoutAccessibilityBinding(event)) {
                    reporter.error('div with class container should have "addAccessibilityContainerAttrs" binding with "name" value', event.line, event.col, self, event.raw);
                }

            }
        });

    }
});
HTMLHint.addRule({
    id: 'dynamic-table-acceessibility',
    description: 'verify dynamic table has accessibilityTable binding and its title has accessibilityRowTitle binding.',
    init: function(parser, reporter){

        var inTable = false;
        var inTableTitle = false;
        var unclosedDivsCounter = 0;
        var unclosedTablesCounter = 0;
        var isExistAccessibilityTitleElement = [];       

        var self = this;   

        var elementWithoutHeadingRole = function(event){
            var roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"role");
            return roleAttribute !== 'heading';
         };

        var elementWithoutAriaLevel = function(event){
            var ariaLevelValue = HTMLHint.utils.getAttributeValue(event.attrs,"aria-level");        
            return ariaLevelValue === '';
        };

        var isTableTitle = function(event){
            return HTMLHint.utils.isClassExsits(event.attrs, "table-title-operation");
        };

        var isAccessibilityTitleElement = function(event){
            return inTable && inTableTitle && HTMLHint.utils.isClassExsits(event.attrs, "accessibility-table-title");
        };        

        var isTbobyWithoutAccessibilityTableBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return !bindAttributeValue.includes('accessibilityTable');
        };

        var elementWithoutAccessibilityRowTitleBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return !bindAttributeValue.includes('accessibilityRowTitle');
        };
               
        var elementWithouttableNameBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return !bindAttributeValue.includes('tableName');
        };

        var isRemoveRowElement = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttributeValue.includes('removeRow');
        };

        var isAddRowButton = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttributeValue.includes('addRow');
        };

        var isRolePresentation = function(event){
            var roleAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'role');
            return roleAttributeValue === 'presentation';
        };

        var isAriaLabelAttr = function(event) {            
            return HTMLHint.utils.isAttributeExists(event.attrs, 'aria-label');                                             
        };    

        var isAriaLabelledbyAttr = function(event) {            
            return HTMLHint.utils.isAttributeExists(event.attrs, 'aria-labelledby');                                             
        }; 

        var isDataToFocusAttr = function(event) {            
            return HTMLHint.utils.isAttributeExists(event.attrs, 'data-tofocus');                                             
        };          

        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if (tagName === 'tbody' && inTable && isTbobyWithoutAccessibilityTableBind(event)){
                reporter.error('dynamic table tbody should have accessibilityTable binding. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }           
            if (isAccessibilityTitleElement(event)){
                isExistAccessibilityTitleElement[unclosedTablesCounter - 1] = true;
                if(elementWithoutHeadingRole(event)){
                    reporter.error('accessibility title element should have role attribute with heading value. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
                }
                if(elementWithoutAriaLevel(event)){
                    reporter.error('accessibility title element should have aria-level attribute. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
                }
                if(elementWithoutAccessibilityRowTitleBind(event)){
                    reporter.error('accessibility title element should have accessibilityRowTitle binding. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
                if(elementWithouttableNameBind(event)){
                    reporter.error('accessibility title element should have "tableName" binding with value of tabel name in hebrew. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
            }
            
           
            if(tagName === 'input' && isAddRowButton(event)){
                if(!isAriaLabelAttr(event)){
                    reporter.error('Add row button should contain "aria-label" attribute that describe which tabel to add row. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
            }                       
            if(isRemoveRowElement(event)){
                if(!isAriaLabelledbyAttr(event) && !isAriaLabelAttr(event)){
                    reporter.error('Remove row element should contain "aria-labelledby" attribute that bind to span that describe delete row. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }                
                if(tagName === 'input' && !isDataToFocusAttr(event)){
                    reporter.error('Remove row element should contain "data-tofocus" attribute. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }
            }             
            if (HTMLHint.utils.isDynamicTable(tagName,event.attrs)  && !event.close){
                if(!isRolePresentation(event)){
                    reporter.error('add role=presentation to table tag. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }  
               unclosedTablesCounter++;
               inTable = true;
            }    
            if (inTable && isTableTitle(event)  && !event.close)  {
                inTableTitle = true;
            } 
            if (inTableTitle) {
                unclosedDivsCounter++;
            }            
        });
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();          
            if (tagName === "table" && unclosedTablesCounter>0) {
                unclosedTablesCounter--;
                if(!isExistAccessibilityTitleElement[unclosedTablesCounter]){
                    reporter.error('dynamic table title should have div with "accessibility-table-title" class (under "table-title-operation" div). Error on line ' + event.line , event.line, event.col, self, event.raw);
                }                            
            }
            if (tagName === "div" && unclosedDivsCounter>0) {
                unclosedDivsCounter--;
            }
            if (unclosedTablesCounter === 0)  {
                inTable = false;
            }
            if(unclosedDivsCounter === 0)    {
                inTableTitle = false;
            }  
        });        
    }
});

HTMLHint.addRule({
    id: 'lang-he',
    description: 'body tag should have lang "he" ',
    init: function (parser, reporter) {
        var isBody = function (event) {
            var tagName = event.tagName;
            return tagName === 'body';
        };

        var self = this;
        var isLangHe = function (event) {
            var langAttr = HTMLHint.utils.getAttributeValue(event.attrs, "lang");
            return langAttr === 'he';
        };
        var bodyWithoutLangHe = function (event) {
            return isBody(event) && !isLangHe(event);
        };

        parser.addListener('tagstart', function (event) {
            if (bodyWithoutLangHe(event)) {
                reporter.error('body tag should have lang "he"', event.line, event.col, self, event.raw);
            }
        });
    }
});

HTMLHint.addRule({
    id: 'no-aria-describedby',
    description: '"aria-describedby" should never be used as inline attribute but via bindingHandler only',
    init: function (parser, reporter) {
        var self = this;

        var hasAriaDescribedbyAttr = function (event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, "aria-describedby");
        };

        parser.addListener('tagstart', function (event) {
            if (hasAriaDescribedbyAttr(event)) {
                reporter.error('"aria-describedby" should not be used as inline attribute', event.line, event.col, self, event.raw);
            }
        });
    }
});

HTMLHint.addRule({
    id: 'no-lookup-accessibility',
    description: 'select with tfsdatatype="LookUpWindow" should replace to Autocomplete',
    init: function(parser, reporter) {
        var self = this;
                    
        var isLookUpWindow  = function(event) {
            var tfsdatatypeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'tfsdatatype');
            tfsdatatypeValue = tfsdatatypeValue.toLowerCase();              
           return tfsdatatypeValue === 'lookupwindow';  
        };                

        parser.addListener('tagstart', function(event) {          
            var tagName = event.tagName.toLowerCase();            
            if(tagName === 'select') {
               if(isLookUpWindow(event)){
                reporter.error('select with tfsdatatype="LookUpWindow" should replace to Autocomplete" ', event.line, event.col, self, event.raw);  
               }  
            }
        });   
    }
});

HTMLHint.addRule({
    id: 'no-tooltip-in-radio',
    description: 'tooltip is not legal inside radio group',
    init: function (parser, reporter) {
        var self = this;
        var insideRadio = false;
        var unclosedDivsCounter = 0;

        var isRadio = function (event) {
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs, "class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some(className => className === "radio");
        };
        var isTooltip = function (event) {
            var tagName = event.tagName;
            var hasTooltipClass = HTMLHint.utils.isClassExsits(event.attrs, 'tooltip-help');
            return tagName === 'span' && hasTooltipClass;
        };

        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName;
            if (isRadio(event)) {
                insideRadio = true;
            }
            if (insideRadio) {
                if (tagName === 'div') {
                    unclosedDivsCounter++;
                }
                if (isTooltip(event)) {
                    reporter.error('tooltip is not allowed inside radio', event.line, event.col, self, event.raw);
                }
            }

        });
        parser.addListener('tagend', function (event) {
            var tagName = event.tagName.toLowerCase();
            if (tagName === "div" && unclosedDivsCounter > 0) {
                unclosedDivsCounter--;
            }
        });
    }
});

HTMLHint.addRule({
    id: 'attr-jQueryUIVersion',
    description: 'check tfsJQueryUIVersion attribute in GeneralAttributes sapn is exist and version is update',
    init: function(parser, reporter) {
        var self = this;

        var isGeneralAttributSpan = function(event) {
            var id = HTMLHint.utils.getAttributeValue(event.attrs, 'id');
            return id === 'GeneralAttributes';
        };

        var isJQueryUIAttribute = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, 'tfsjqueryuiversion');            
        };

        var isJQueryUIAttributeValue = function(event) {
            return HTMLHint.utils.getAttributeValue(event.attrs, 'tfsjqueryuiversion');                      
        };

        var isjQueryUIAttributMissing = function(event) {            
            return !isJQueryUIAttribute(event);            
        };

        var isJQueryUIVersionNotApdate = function(event) {           
            return isJQueryUIAttributeValue(event) !== '1_12_1';           
        };

        parser.addListener('tagstart', function(event) {
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'span') {    
                if (isGeneralAttributSpan(event)) {
                    if (isjQueryUIAttributMissing(event)) {
                        reporter.error('attribute "tfsjqueryuiversion" in GeneralAttributes is missing. Error on line ' + event.line, event.line, event.col, self, event.raw);                
                    }
                    else if (isJQueryUIVersionNotApdate(event)) {
                        reporter.error('attribute "tfsjqueryuiversion" in GeneralAttributes should be equal "1_12_1". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                    }
                }         
            }  
        });
    }
});

HTMLHint.addRule({
    id: 'date-accessibility',
    description: 'date element should contain addDescription binding',
    init: function(parser, reporter){  
        var self = this;   
        var isExistSpanAccessibility = false;

        var isDateElement = function(event) { 
            var tfsdatatypeAttr = HTMLHint.utils.getAttributeValue(event.attrs,'tfsdatatype');
            return tfsdatatypeAttr === 'date';           
        };    
        
        var isAddDescriptionBind = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttributeValue.includes('addDescription');
        };
        
        var setSpanAccessibilityVariable  = function(event) { 
            var idAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'id');            
            if(idAttributeValue === 'accessibilityFormatDate'){
                isExistSpanAccessibility = true;
            }                                                                    
        }; 
        
        var reportOfAccessibilityFormatDateSpan = function(event) {  
            if (isExistSpanAccessibility === false) {                            
                reporter.error('The form should contain accessibility span with id "accessibilityFormatDate" and value "You must enter a date format DD/MM/YYYY..." ' + event.line, event.line, event.col, self, event.raw);                               
            }                                                        
        };

        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'input'){    
                if (isDateElement(event) && !isAddDescriptionBind(event)) {
                reporter.error('Date element should contain "addDescription" binding that bind to "accessibilityFormatDate" span. Error on line ' + event.line , event.line, event.col, self, event.raw);
                }  
            }   

            if(tagName === 'span') {
                setSpanAccessibilityVariable(event);  
            }         
        });       
        
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'body'){   
                reportOfAccessibilityFormatDateSpan(event);
            }                                  
        }); 
    }
});
HTMLHint.addRule({
    id: 'link-accessibility',
    description: 'the form should contain accessibility span of links with id "accessibilityNewWindowAlert"',
    init: function(parser, reporter) {
        var self = this;
            
        var isExistSpanAccessibility = false;            
        
        var setSpanAccessibilityVariable  = function(event) { 
            var idAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs, 'id');            
            if(idAttributeValue === 'accessibilityNewWindowAlert'){
                isExistSpanAccessibility = true;
            }                                                                    
        };           

        var reportOfAccessibilityNewWindowAlertSpan = function(event) {  
            if (isExistSpanAccessibility === false) {                            
                reporter.error('The form should contain accessibility span with id "accessibilityNewWindowAlert" and value "This link open in new window..." ' + event.line, event.line, event.col, self, event.raw);                               
            }                                                        
        };      
       
        parser.addListener('tagstart', function(event) {          
            var tagName = event.tagName.toLowerCase();            
            if(tagName === 'span') {
                setSpanAccessibilityVariable(event);  
            }
        });
     
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'body'){   
                reportOfAccessibilityNewWindowAlertSpan(event);
            }                                  
        }); 
    }
});

HTMLHint.addRule({
    id: 'oldRadioGroup-accessibility',
    description: 'old group of radio buttons should have aria-labelledby attribute',
    init: function(parser, reporter){  
        var self = this;   
        
        var isRadiogroupContainer = function(event) { 
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className ==="radio");
        };                           

        var isRadioContainerWithoutAriaAttribute = function(event){
            var ariaLabelAttribute = HTMLHint.utils.getAttributeValue(event.attrs,'aria-labelledby');
            return isRadiogroupContainer(event) && ariaLabelAttribute === '';
        };

        parser.addListener('tagstart', function(event){           
            if (isRadioContainerWithoutAriaAttribute(event))
            {
               reporter.error('radio group should have "aria-labelledby" attribute with value of radioGroup\'s label id. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }             
        });         
    }
});

HTMLHint.addRule({
    id: 'oldRadioGroup-inTabel',
    description: 'group of radio buttons in dynamic tabel should replce to new structure',
    init: function(parser, reporter){  
        var self = this;   
        
        var isOldRadiogroup = function(event) { 
            var tfsincludeAttribute = HTMLHint.utils.getAttributeValue(event.attrs,'tfsinclude');
            return tfsincludeAttribute.includes('RadioGroup.html');           
        };    
        
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'div'){    
                if (isOldRadiogroup(event)) {
                reporter.error('group of radio buttons in dynamic tabel should replce to new structure (use "tlpRadio" binding in HTML and replace radio object in JS, parameters from js move to html). Error on line ' + event.line , event.line, event.col, self, event.raw);
                }  
            }            
        });         
    }
});

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
HTMLHint.addRule({
    id: 'script-accessibility',
    description: 'the form should contain an accessibility scripts',
    init: function(parser, reporter){  
        var self = this;   

        var srcScripts = [];

        var addSrcAttributeToArray = function(event) {            
            var srcAttribute = HTMLHint.utils.getAttributeValue(event.attrs,'src');
            return srcScripts.push(srcAttribute);                              
        }; 
    
        var isAccessibilityScript = function(event) {
            var accessibilitySrc = srcScripts.includes('CDN/Common/JS/accessibility.js');   
            var accessibilityMethodsSrc = srcScripts.includes('CDN/Common/JS/accessibilityMethods.js');   
            var accessibilitySrcWithBackSlesh = srcScripts.includes('CDN\Common\JS\accessibility.js');   
            var accessibilityMethodsSrctWithBackSlesh = srcScripts.includes('CDN\Common\JS\accessibilityMethods.js'); 
            
            var accessibilityScriptExist = function(){
                return accessibilitySrc === true || accessibilitySrcWithBackSlesh === true;
            };
            var accessibilityMethodScriptExist = function(){
                return accessibilityMethodsSrc === true || accessibilityMethodsSrctWithBackSlesh === true;
            };
            if(!accessibilityScriptExist()) {
                reporter.error('the form should contain "accessibility.js" script. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }
            if(!accessibilityMethodScriptExist()) {
                reporter.error('the form should contain "accessibilityMethods.js" script. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }
        }; 
         
        parser.addListener('tagstart', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'script'){
                addSrcAttributeToArray(event); 
            }                                                                               
        }); 

        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'head'){    
                isAccessibilityScript(event);
            }                                  
        });        
    }
});

HTMLHint.addRule({
    id: 'tabsHeader-accessibility',
    description: 'verify that tabsHeader file is accessibility',
    init: function(parser, reporter) {
        var self = this;

        var isElementInTabNavigation = false;

        var isTabsNavigation = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, 'tabs-navigation');            
        };

        var isElementWithHorizontalAria = function(event) {
            var ariaAttr = HTMLHint.utils.getAttributeValue(event.attrs, 'aria-orientation');            
            return ariaAttr === 'horizontal';            
        };

        var isElementWithTablistRole = function(event) {
            var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, 'role');            
            return roleAttr === 'tablist';            
        };

        var isItemClass = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, 'item');            
        };  

        var isDataBindAttr = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, 'data-bind');                    
        };  
        
        var isElementWithTabRole = function(event) {
            var roleAttr = HTMLHint.utils.getAttributeValue(event.attrs, 'role');            
            return roleAttr === 'tab';            
        };

        var isHrefAttr = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, 'href');                    
        }; 

        var isActivateTabBind = function(event) {
            var bindAttrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttrValue.includes('activateTab');                  
        }; 

        var isAriaSelectedBind = function(event) {
            var bindAttrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttrValue.includes('aria-selected');                  
        }; 

        var isAriaControlsBind = function(event) {
            var bindAttrValue = HTMLHint.utils.getAttributeValue(event.attrs, 'data-bind');
            return bindAttrValue.includes('aria-controls');                  
        }; 

        parser.addListener('tagstart', function(event) {
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'ul' && isTabsNavigation(event)) { 
                isElementInTabNavigation = true;                   
                if (!isElementWithHorizontalAria(event)) {
                    reporter.error('tabs-navigation element should contain "aria-orientation" attribute with "horizontal" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                
                }
                if (!isElementWithTablistRole(event)) {
                    reporter.error('tabs-navigation element should contain "role" attribute with "tablist" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }                     
            }  
            if(isElementInTabNavigation === true && tagName === 'li' && isItemClass(event) && isDataBindAttr(event)){
                reporter.error('attribute "data-bind" in li element at "tabsHeader" file should move to A element under li element. Error on line ' + event.line, event.line, event.col, self, event.raw);                                    
            }
            if(isElementInTabNavigation === true && tagName === 'a'){                
                if(!isElementWithTabRole(event)){
                    reporter.error('A element at "tabsHeader" file should contain "role" attribute with "tab" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(!isHrefAttr(event)){
                    reporter.error('A element at "tabsHeader" file should contain "href" attribute with "#" value. Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(isDataBindAttr(event) && !isActivateTabBind(event)){
                    reporter.error('data-bind attribute in A element at "tabsHeader" file should contain "activateTab" bind like this: "activateTab:$parent.isCurrentContainer(name)". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(isDataBindAttr(event) && !isAriaSelectedBind(event)){
                    reporter.error('data-bind attribute in A element at "tabsHeader" file should contain "aria-selected" bind like this: "attr:{"aria-selected":$parent.isCurrentContainer(name)}". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
                if(isDataBindAttr(event) && !isAriaControlsBind(event)){
                    reporter.error('data-bind attribute in A element at "tabsHeader" file should contain "aria-controls" bind like this: "attr:{"aria-controls":("tabpanel_" + name())}". Error on line ' + event.line, event.line, event.col, self, event.raw);                     
                }
            }
        });
        parser.addListener('tagend', function(event) {
            var tagName = event.tagName.toLowerCase();
            if(tagName === 'ul'){
                isElementInTabNavigation = false;     
            }
        });
    }
});

HTMLHint.addRule({
    id: 'radio-group-acceessibility',
    description: 'group of radio buttons should have aria-labelledby attribute and radioGroupAccessibility binding',
    init: function(parser, reporter){
        var isRadiogroupContainer = function(event) { 
            var classNames = HTMLHint.utils.getAttributeValue(event.attrs,"class");
            var classesArray = classNames.split(/\s+/g);
            return classesArray.some( className => className ==="radiogroupContainer" || className ==="radio");
        };

        var isRadioInput = function(event){
            return HTMLHint.utils.getAttributeValue(event.attrs,"type")  === 'radio';          
        };

        var isRadioBindWithoutRaiogroupAccessibility = function(event){
            var bindAttributeValue = HTMLHint.utils.getAttributeValue(event.attrs,"data-bind");
            return isRadioInput(event) && (!bindAttributeValue.includes('radioGroupAccessibility'));
        };

        var prevEvent;
        var self = this;   

        var isRadioContainerWithoutAriaAttribute = function(event){
            var ariaLabelAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"aria-labelledby");
            return isRadiogroupContainer(event) && ariaLabelAttribute === '';
        };
   
        var isRadioNotWrappedWithDiv = function(event, prevEvent){
            return isRadioInput(event) && prevEvent.tagName.toLowerCase() !== 'div';
        };

        var isInlineElemenClas = function(prevEvent) { 
            var classNames = HTMLHint.utils.getAttributeValue(prevEvent.attrs,"class");
            return classNames.includes('inline-element');
        };

        var isRadioNotWrappedWithInlineElementClas = function(event, prevEvent){
            return isRadioInput(event) && !isInlineElemenClas(prevEvent);
        };
        
        parser.addListener('tagstart', function(event){    
            if (isRadioContainerWithoutAriaAttribute(event))
            {
               reporter.error('radiogroup container should have aria-labelledby attribute with value. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }   
            if(isRadioNotWrappedWithDiv(event, prevEvent)){
               reporter.error('radio input should be wrap with div element. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }
            if(isRadioNotWrappedWithInlineElementClas(event, prevEvent)){
                reporter.error('element that wrap radio input should contain "inline-element" class. Error on line ' + event.line , event.line, event.col, self, event.raw);
             }
            if(isRadioBindWithoutRaiogroupAccessibility(event)){
                reporter.error('radio input should have radioGroupAccessibility binding. Error on line ' + event.line , event.line, event.col, self, event.raw);                    
            }
            prevEvent = event;
        });         
    }
});

HTMLHint.addRule({
    id: 'required-wrapper-accessibility',
    description: 'div with requiredWrapper binding should contain at least one validation message and one element that points to it',
    init: function (parser, reporter) {
        var inRequiredWrapper = false;
        var self = this;
        var unclosedDivsCounter = 0;
        var messagesInRequiredWrapper = [];
        var usedMessagesInRequiredWrapper = [];

        var isDivRequiredWraper = function (event) {
            return HTMLHint.utils.getBindingValue(event, "requiredWrapper");
        };

        var isValidationMessage = function (event) {
            return (event.tagName === "span" && HTMLHint.utils.isClassExsits(event.attrs, "validationMessage"));
        };

        var findValidationMessageInDescription = function (description) {
            var descriptionsIds = HTMLHint.utils.removeBoundaryQuotes(description).split(' ');
            return descriptionsIds.find(function (descriptionId) {
                return descriptionId.startsWith(HTMLHint.resources.validationMessagesAccessibility.messageIdPrefix);
            });
        };

        var atleastOneBoundMessageInRequiredWrapper = function () {
            if (messagesInRequiredWrapper.length === 0 || usedMessagesInRequiredWrapper.length === 0) {
                return false;
            }
            return usedMessagesInRequiredWrapper.find(item => messagesInRequiredWrapper.indexOf(item) !== -1);
        };

        var endOfRequiredWrapper = function () {
            return unclosedDivsCounter === 0 && inRequiredWrapper === true;
        };


        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName;

            if (isDivRequiredWraper(event)) {
                inRequiredWrapper = true;
            }
            if (inRequiredWrapper) {
                if (tagName === 'div') {
                    unclosedDivsCounter++;
                }
                if (isValidationMessage(event)) {
                    var id = HTMLHint.utils.getAttributeValue(event.attrs, "id");
                    messagesInRequiredWrapper.push(id);
                }
                if (HTMLHint.utils.isFocusableElement(event)) {
                    var descriptionBinding = HTMLHint.utils.getBindingValue(event, 'addDescription');
                    if (descriptionBinding) {
                        var boundMessage = findValidationMessageInDescription(descriptionBinding);
                        if (boundMessage) {
                            usedMessagesInRequiredWrapper.push(boundMessage);
                        }
                    }
                }
            }
        });

        parser.addListener('tagend', function (event) {
            var tagName = event.tagName.toLowerCase();
            if (tagName === "div" && unclosedDivsCounter > 0) {
                unclosedDivsCounter--;
            }
            if (endOfRequiredWrapper()) {
                inRequiredWrapper = false;
                if (!atleastOneBoundMessageInRequiredWrapper()) {
                    reporter.error('div with requiredWrapper binding should contain at least one validation message and one element that points to it. Error on line ' + event.line, event.line, event.col, self, event.raw);
                }
                messagesInRequiredWrapper = [];
                usedMessagesInRequiredWrapper = [];
            }

        });
    }
});

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

HTMLHint.addRule({
    id: "title-accessibility",
    description: "add aria-level and heading role to title element",
    init: function(parser, reporter) {
        var self = this;
        var inTitleElement = false;
        var unclosedTitleCounter = 0;
        var elementsInTitle = [];

        var isElementWithHeadingRole = function(event) {
            var roleAttribute = HTMLHint.utils.getAttributeValue(event.attrs,"role");
            return roleAttribute === "heading";
        };

        var isElementWithAriaLevel = function(event) {
            return HTMLHint.utils.isAttributeExists(event.attrs, "aria-level");
        };

        var isTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "section-title");
        };

        var isSubTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "section-sub-title");
        };

        var isMainTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "main-title");
        };

        var isSecondaryTitleElement = function(event) {
            return HTMLHint.utils.isClassExsits(event.attrs, "secondary-title");
        };

        var reportOfTitleElementWithoutAriaLevelAttr = function(event) {
            reporter.error('title element should have "aria-level" attribute. Error on line ' + event.line, event.line, event.col, self, event.raw);
        }; 
        var reportOfTitleElementWithoutHeadingRole = function(event) {
            reporter.error('title element should have "role" attribute with "heading" value. Error on line ' + event.line, event.line, event.col, self, event.raw);
        };        

        parser.addListener("tagstart", function(event) {
            if (inTitleElement) {
                unclosedTitleCounter++;
                elementsInTitle.push(event);
            }
            if (isTitleElement(event) || isSubTitleElement(event) || isMainTitleElement(event) || isSecondaryTitleElement(event)) {
                inTitleElement = true;
                unclosedTitleCounter++;
                elementsInTitle.push(event);
            }           
        });
        
        parser.addListener("tagend", function() {
            if (unclosedTitleCounter > 0) {
                unclosedTitleCounter--;
            }
            if (unclosedTitleCounter === 0) {
                inTitleElement = false;
            }
            if (!inTitleElement && elementsInTitle.length > 0) {
                var elementsWithAriaLevel = elementsInTitle.filter(item => {
                    return isElementWithAriaLevel(item);
                });
                if (elementsWithAriaLevel.length === 0) {
                    reportOfTitleElementWithoutAriaLevelAttr(elementsInTitle[0]);
                }

                var elementsWithHeadingRole = elementsInTitle.filter(item => {
                    return isElementWithHeadingRole(item);
                });
                if (elementsWithHeadingRole.length === 0) {
                    reportOfTitleElementWithoutHeadingRole(elementsInTitle[0]);
                }
                
                elementsInTitle = [];               
            }
        });
    }
});

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

        
        var findBoundTooltipInDescription = function (description) {
            var descriptionsIds = HTMLHint.utils.removeBoundaryQuotes(description).split(' ');

            return looseTooltips.find(function (tooltip) {
                if (tooltip) {
                    return descriptionsIds.find(descID => descID === tooltip.id);
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
                var descriptionBinding = HTMLHint.utils.getBindingValue(event, 'addDescription');
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

HTMLHint.addRule({
    id: 'validation-message-accessibility',
    description: 'verify that all span of validation message have ID and attribute "aria-live"',
    init: function (parser, reporter) {
        var self = this;

        var messagePrefix = HTMLHint.resources.validationMessagesAccessibility.messageIdPrefix;

        var isValidationMessage = function (element, attributes) {
            return (element === "span" && HTMLHint.utils.isClassExsits(attributes, "validationMessage"));
        };

        parser.addListener('tagstart', function (event) {
            var tagName = event.tagName.toLowerCase();

            if (isValidationMessage(tagName, event.attrs)) {
                var id = HTMLHint.utils.getAttributeValue(event.attrs, "id");
                var ariaLiveAttr = HTMLHint.utils.getAttributeValue(event.attrs, "aria-live");

                if (!id || !id.startsWith(messagePrefix)) {
                    reporter.error(`span with class validationMessage must have ID that starts with "${messagePrefix}" ` + event.line, event.line, event.col, self, event.raw);
                }
                if (ariaLiveAttr !== HTMLHint.resources.validationMessagesAccessibility.ariaLive) {
                    reporter.error('span with class validationMessage must have attribute aria-live="assertive" ' + event.line, event.line, event.col, self, event.raw);
                }
            }
        });

    }
});

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

HTMLHint.addRule({
    id: 'label-data-for',
    description: 'label within a dynamic table should have a data-for attribute.',
    init: function(parser, reporter){
        var inTable = false;  
        var self = this;
        var unclosedTablesCounter = 0;        
        
        parser.addListener('tagstart', function(event){
          
            var tagName = event.tagName.toLowerCase();           
            if (inTable && tagName==="label" && !HTMLHint.utils.isAttributeExists(event.attrs,"data-for"))
            {
               reporter.error('label within a dynamic table should have a data-for attribute. Error on line ' + event.line , event.line, event.col, self, event.raw);
            }         
            if (HTMLHint.utils.isDynamicTable(tagName,event.attrs)  && !event.close){
               unclosedTablesCounter++;
               inTable = true;
            }            
        });
        parser.addListener('tagend', function(event){
            var tagName = event.tagName.toLowerCase();          
            if (tagName === "table" && unclosedTablesCounter>0) {
                unclosedTablesCounter--;
            }
            if (unclosedTablesCounter === 0)  {
                inTable = false;
            }        
        });       
    }
});

HTMLHint.addRule({
        id: 'select-mandatory-id',
        description: 'select elements have must have an id attribute.',
        init: function (parser, reporter) {
            var self = this;
            parser.addListener('tagstart', function (event) {
                var tagName = event.tagName.toLowerCase();
                if (tagName === 'select') {
                    if (!HTMLHint.utils.isAttributeExists(event.attrs,"id")) {
                        reporter.error('select element must have an id attribute. Error on line ' + event.line, event.line, event.col, self, event.raw);
                    }
                }
            });
        }
});
HTMLHint.addRule({
        id: 'tfsdata-mandatory-id',
        description: 'elements with tfsdata/tfsrowdata must have an id attribute.',
        init: function (parser, reporter) {
            var self = this;
            var isPublicElement = function(attributes) { 
                return HTMLHint.utils.isAttributeExists(attributes,"tfsdata") ||
                       HTMLHint.utils.isAttributeExists(attributes,"tfsrowdata");
            };

            parser.addListener('tagstart', function (event) {
                if (isPublicElement(event.attrs)) {
                    if (!HTMLHint.utils.isAttributeExists(event.attrs,"id")) {
                        reporter.error('elements with tfsdata/tfsrowdata must have an id attribute. Error on line ' + event.line, event.line, event.col, self, event.raw);
                    }
                }
            });
        }
});