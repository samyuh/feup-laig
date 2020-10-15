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

        // Amplification
        this.afs = 1.0;
        this.aft = 1.0;

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
}