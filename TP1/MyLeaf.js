class MyLeaf {
	constructor(sceneGraph, descendants) {
        this.sceneGraph = sceneGraph;
        this.descendants = descendants;

        this.type = this.sceneGraph.reader.getItem(this.descendants, 'type', ['rectangle', 'cylinder', 'triangle', 'sphere', 'torus']);

        this.primitive = null;

        this.initPrimitive();
    }
    initPrimitive() {
        if (this.type == "cylinder")
            this.primitive = new MyCylinder(this.sceneGraph.scene, 1, 8);
        if (this.type == "sphere")
            this.primitive = new MySphere(this.sceneGraph.scene, 8, 8);
        if (this.type == "torus")
            this.primitive = new MyRectangle(this.sceneGraph.scene, 0, 0, 0, 0);
        if (this.type == "rectangle") {
            var x1 = this.sceneGraph.reader.getFloat(this.descendants, 'x1');
            var y1 = this.sceneGraph.reader.getFloat(this.descendants, 'y1');
            var x2 = this.sceneGraph.reader.getFloat(this.descendants, 'x2');
            var y2 = this.sceneGraph.reader.getFloat(this.descendants, 'y2');

            this.primitive = new MyRectangle(this.sceneGraph.scene, x1, y1, x2, y2);
        }
        if (this.type == "triangle") {
            var x1 = this.sceneGraph.reader.getFloat(this.descendants, 'x1');
            var y1 = this.sceneGraph.reader.getFloat(this.descendants, 'y1');
            var x2 = this.sceneGraph.reader.getFloat(this.descendants, 'x2');
            var y2 = this.sceneGraph.reader.getFloat(this.descendants, 'y2');
            var x3 = this.sceneGraph.reader.getFloat(this.descendants, 'x3');
            var y3 = this.sceneGraph.reader.getFloat(this.descendants, 'y3');

            this.primitive = new MyTriangle(this.sceneGraph.scene, x1, y1, x2, y2, x3, y3);
        }
    }
    display() {
        this.primitive.display();
    }
}