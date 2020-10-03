class MyNode {
	constructor(graph, root) {
        this.graph = graph;

        // Origin Node
        this.rootID = root;

        // Transformation
        this.transformation = mat4.create();
        mat4.identity(this.transformation);

        // Texture
        this.texture = null;

        // Material
        this.material = null;

        // All descendants nodes and leaves
        this.descendants = [];
        this.leaves = [];
    }
    addDescendants(node) {
        this.descendants.push(node);
    }
    addLeaf(leaf) {
        this.leaves.push(leaf);
    }
    display() {
        this.graph.scene.pushMatrix();
        this.graph.scene.multMatrix(this.transformation);

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
        this.graph.scene.popMatrix();
    } 
}