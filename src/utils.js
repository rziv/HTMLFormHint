(function (HTMLHint, undefined) {


    const trimAll = function (val) {
        if (typeof val !== 'string') {
            return;
        }
        return val.replace(/ /g, '');
    };

    const isAttributeExists = function (attributes, attributeName) {
        if (!Array.isArray(attributes) || typeof attributeName !== "string") {
            return undefined;
        }

        return attributes.some(
            (attr) => attr.name.toLowerCase() === attributeName.toLowerCase()
        );
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

    const getAttributeValue = function (attributes, attributeName) {
        var attributeObject = getAttribute(attributes, attributeName);
        return attributeObject ? attributeObject.value : '';
    };

    const getBindingValue = function (event, bindingName) {
        var bindings = getAttributeValue(event.attrs, "data-bind");
        var startOfBinding = bindings.indexOf(bindingName);
        if (startOfBinding === -1) {
            return;
        }
        var endOfBinding = bindings.indexOf(',', startOfBinding) > -1 ? bindings.indexOf(',', startOfBinding) : bindings.length;
        return trimAll(bindings.substring(startOfBinding + bindingName.length + 1, endOfBinding));//trim to avoid whiteSpaced, add 1 to take ":" in account
    };

    const isClassExsits = function (attributes, className) {
        let classNames = getAttributeValue(attributes, "class");
        let classesArray = classNames.split(/\s+/g);
        return classesArray.some(c => c === className);
    };

    HTMLHint.utils = {
        trimAll,
        isAttributeExists,
        getAttribute,
        getAttributeValue,
        getBindingValue,
        isClassExsits
    };

})(HTMLHint);
