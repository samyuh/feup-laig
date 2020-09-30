class MyLeaf {
	constructor(sceneGraph, descendants) {
        this.sceneGraph = sceneGraph;
        
        this.type = this.sceneGraph.reader.getItem(descendants, 'type', ['rectangle', 'cylinder', 'sphere', 'torus']);

        this.primitive = null;

        this.initPrimitive();
    }
    initPrimitive() {
        if (this.type == "cylinder")
            this.primitive = null;
        if (this.type == "sphere")
            this.primitive = null;
        if (this.type == "torus")
            this.primitive = null;
        if (this.type == "rectangle")
            this.primitive = new MyRectangle(this.sceneGraph.scene, -1, -.1, 1, .1);
    }
}