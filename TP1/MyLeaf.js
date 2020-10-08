class MyLeaf {
	constructor(sceneGraph, descendants) {
        this.sceneGraph = sceneGraph;
        this.descendants = descendants;

        this.type = this.sceneGraph.reader.getItem(this.descendants, 'type', ['rectangle', 'cylinder', 'triangle', 'sphere', 'torus']);

        this.primitive = null;

        this.initPrimitive();
    }
    initPrimitive() {
        if (this.type == "torus") {
            this.primitive = new MyTorus(this.sceneGraph.scene, 1, 1, 8, 8);
        }
        if (this.type == "cylinder") {
            // -- height="10.0" topRadius="1.0" bottomRadius="1.0" stacks="8" slices="8"
            let height = this.sceneGraph.reader.getFloat(this.descendants, 'height');
            let topRadius = this.sceneGraph.reader.getFloat(this.descendants, 'topRadius');
            let bottomRadius = this.sceneGraph.reader.getFloat(this.descendants, 'bottomRadius');
            let stacks = this.sceneGraph.reader.getFloat(this.descendants, 'stacks');
            let slices = this.sceneGraph.reader.getFloat(this.descendants, 'slices');

            this.primitive = new MyCylinder(this.sceneGraph.scene, height, topRadius, bottomRadius, stacks, slices);
        }
        if (this.type == "sphere")
            this.primitive = new MySphere(this.sceneGraph.scene, 8, 8);
        if (this.type == "rectangle") {
            let x1 = this.sceneGraph.reader.getFloat(this.descendants, 'x1');
            let y1 = this.sceneGraph.reader.getFloat(this.descendants, 'y1');
            let x2 = this.sceneGraph.reader.getFloat(this.descendants, 'x2');
            let y2 = this.sceneGraph.reader.getFloat(this.descendants, 'y2');

            this.primitive = new MyRectangle(this.sceneGraph.scene, x1, y1, x2, y2);
        }
        if (this.type == "triangle") {
            let x1 = this.sceneGraph.reader.getFloat(this.descendants, 'x1');
            let y1 = this.sceneGraph.reader.getFloat(this.descendants, 'y1');
            let x2 = this.sceneGraph.reader.getFloat(this.descendants, 'x2');
            let y2 = this.sceneGraph.reader.getFloat(this.descendants, 'y2');
            let x3 = this.sceneGraph.reader.getFloat(this.descendants, 'x3');
            let y3 = this.sceneGraph.reader.getFloat(this.descendants, 'y3');

            this.primitive = new MyTriangle(this.sceneGraph.scene, x1, y1, x2, y2, x3, y3);
        }
    }
    display() {
        this.primitive.display();
    }
}