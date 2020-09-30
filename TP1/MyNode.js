class MyNode {
	constructor(graph, root) {
        this.graph = graph;
    
        this.rootID = root;
        this.nodes = [];
    }
    addNode(node) {
        this.nodes.push(node);
    }
}