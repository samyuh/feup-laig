class MyLeaf {
	constructor(sceneGraph, descendants) {
        this.sceneGraph = sceneGraph;
        this.descendants = descendants;

        this.type = this.sceneGraph.reader.getItem(this.descendants, 'type', ['rectangle', 'cylinder', 'triangle', 'sphere', 'torus', 'halftorus']);

        this.primitive = null;

        this.initPrimitive();
    }
    initPrimitive() {
        if (this.type == "torus") {
            let inner = this.sceneGraph.reader.getFloat(this.descendants, 'inner');
            let outer = this.sceneGraph.reader.getFloat(this.descendants, 'outer');
            let slices = this.sceneGraph.reader.getFloat(this.descendants, 'slices');
            let loops = this.sceneGraph.reader.getFloat(this.descendants, 'loops');

            this.primitive = new MyTorus(this.sceneGraph.scene, inner, outer, slices, loops);
        }
        else if (this.type == "halftorus") {
            let inner = this.sceneGraph.reader.getFloat(this.descendants, 'inner');
            let outer = this.sceneGraph.reader.getFloat(this.descendants, 'outer');
            let slices = this.sceneGraph.reader.getFloat(this.descendants, 'slices');
            let loops = this.sceneGraph.reader.getFloat(this.descendants, 'loops');

            this.primitive = new MyHalfTorus(this.sceneGraph.scene, inner, outer, slices, loops);
        }
        else if (this.type == "cylinder") {
            let height = this.sceneGraph.reader.getFloat(this.descendants, 'height');
            let topRadius = this.sceneGraph.reader.getFloat(this.descendants, 'topRadius');
            let bottomRadius = this.sceneGraph.reader.getFloat(this.descendants, 'bottomRadius');
            let stacks = this.sceneGraph.reader.getFloat(this.descendants, 'stacks');
            let slices = this.sceneGraph.reader.getFloat(this.descendants, 'slices');

            this.primitive = new MyCylinder(this.sceneGraph.scene, height, topRadius, bottomRadius, stacks, slices);
        }
        else if (this.type == "sphere") {
            let radius = this.sceneGraph.reader.getFloat(this.descendants, 'radius');
            let slices = this.sceneGraph.reader.getFloat(this.descendants, 'slices');
            let stacks = this.sceneGraph.reader.getFloat(this.descendants, 'stacks');

            this.primitive = new MySphere(this.sceneGraph.scene, radius, slices, stacks);
        }
        else if (this.type == "rectangle") {
            let x1 = this.sceneGraph.reader.getFloat(this.descendants, 'x1');
            let y1 = this.sceneGraph.reader.getFloat(this.descendants, 'y1');
            let x2 = this.sceneGraph.reader.getFloat(this.descendants, 'x2');
            let y2 = this.sceneGraph.reader.getFloat(this.descendants, 'y2');

            this.primitive = new MyRectangle(this.sceneGraph.scene, x1, y1, x2, y2);
        }
        else if (this.type == "triangle") {
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
    updateTexCoords(afs, aft) {
        this.primitive.updateTexCoords(afs, aft) ;
    }
}