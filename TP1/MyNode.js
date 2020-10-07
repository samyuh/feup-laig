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
}