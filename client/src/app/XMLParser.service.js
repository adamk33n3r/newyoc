"use strict";
var XMLParser = (function () {
    function XMLParser(xml) {
        this.xml = xml;
        this.nsResolver = document.createNSResolver(xml);
    }
    XMLParser.prototype.getNode = function (xPath, base) {
        var result = this.evaluate(xPath, base, XPathResult.FIRST_ORDERED_NODE_TYPE);
        if (!result) {
            throw new Error("No node " + xPath + " found.");
        }
        return result.singleNodeValue;
    };
    XMLParser.prototype.getNodes = function (xPath, base) {
        var result = this.evaluate(xPath, base, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        if (result.snapshotLength === 0) {
            throw new Error("No nodes " + xPath + " found.");
        }
        var nodes = [];
        for (var i = 0; i < result.snapshotLength; i++) {
            nodes.push(result.snapshotItem(i));
        }
        return nodes;
    };
    XMLParser.prototype.getText = function (xPath, base) {
        return this.evaluate(xPath, base, XPathResult.STRING_TYPE).stringValue;
    };
    XMLParser.prototype.getAttribute = function (attribute, node) {
        return node.attributes.getNamedItem(attribute).value;
    };
    XMLParser.prototype.evaluate = function (xPath, base, resultType) {
        if (base === void 0) { base = this.xml; }
        if (resultType === void 0) { resultType = XPathResult.ANY_TYPE; }
        console.log("Evaluating: '" + xPath + "'", base);
        return this.xml.evaluate(xPath, base, this.nsResolver, resultType, null);
    };
    return XMLParser;
}());
exports.XMLParser = XMLParser;
