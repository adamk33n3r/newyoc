export class XMLParser {
    private nsResolver: XPathNSResolver;
    constructor(private xml: Document) {
        this.nsResolver = document.createNSResolver(xml);
    }

    public getNode(xPath: string, base?: Node): Node {
        return this.evaluate(xPath, base, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
    }

    public getNodes(xPath: string, base?: Node): Node[] {
        const result = this.evaluate(xPath, base, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        const nodes: Node[] = [];
        for (let i = 0; i < result.snapshotLength; i++) {
            nodes.push(result.snapshotItem(i));
        }
        return nodes;
    }

    public getText(xPath: string, base?: Node): string {
        return this.evaluate(xPath, base, XPathResult.STRING_TYPE).stringValue;
    }

    public getNumber(xPath: string, base?: Node): number {
        return this.evaluate(xPath, base, XPathResult.NUMBER_TYPE).numberValue;
    }

    public getBoolean(xPath: string, base?: Node): boolean {
        xPath += '[text() = "true"]';
        return this.evaluate(xPath, base, XPathResult.BOOLEAN_TYPE).booleanValue;
    }

    public getAttribute(attribute: string, node: Node) {
        return node.attributes.getNamedItem(attribute).value;
    }

    protected evaluate(xPath: string, base: Node = this.xml, resultType = XPathResult.ANY_TYPE): XPathResult {
        // console.log(`Evaluating: '${xPath}'`, base);
        return this.xml.evaluate(xPath, base, this.nsResolver, resultType, null);
    }
}
