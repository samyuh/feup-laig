class MyLeaf {
	constructor(sceneGraph, primitive) {
        this.sceneGraph = sceneGraph;

        this.primitive = primitive;

        this.afs = 1.0;
        this.aft = 1.0;
    }
    display() {
        this.primitive.display();
    }
    
    updateTexCoords(afs, aft) {
        this.primitive.updateTexCoords(afs, aft) ;
    }
}