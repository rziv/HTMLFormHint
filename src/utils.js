(function (HTMLHint, undefined) {

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
        let attributeObject = getAttribute(attributes, attributeName);
        return attributeObject ? attributeObject.value : '';
    };

    const isClassExsits = function (attributes, className) {
        let classNames = getAttributeValue(attributes, "class");
        let classesArray = classNames.split(/\s+/g);
        return classesArray.some(c => c === className);
    };

    const isDynamicTable = function(tagName, attributes) { 
        return (tagName.toLowerCase() === "table") &&                       
                (HTMLHint.utils.isAttributeExists(attributes,"tfsdata") ||
                HTMLHint.utils.isAttributeExists(attributes,"tfsnestedtable"));
    };
    HTMLHint.utils = {
        isAttributeExists,
        getAttribute,
        isClassExsits,
        getAttributeValue,
        isDynamicTable: isDynamicTable
    };

})(HTMLHint);
