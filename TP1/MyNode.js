class MyNode {
	constructor(graph, root) {
        this.graph = graph;

        // Origin Node
        this.rootID = root;

        // All descendants nodes and leaves
        this.descendants = [];
        this.leaves = [];
    }
    addNode(node) {
        this.descendants.push(node);
    }
    addLeaf(leaf) {
        this.leaves.push(leaf);
    }
    display() {
        for(var i = 0; i < this.descendants.length; i++) {
            this.graph.scene.pushMatrix();
            this.graph.nodes[this.descendants[i]].display();
            this.graph.scene.popMatrix();
        }
        
        for(var i = 0; i < this.leaves.length; i++) {
            this.graph.scene.pushMatrix();
            this.leaves[i].display();
            this.graph.scene.popMatrix();
        }
    } 
}