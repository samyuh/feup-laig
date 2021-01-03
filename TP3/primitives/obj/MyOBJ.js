class MyOBJ extends CGFobject {
    constructor(scene, path) {
        super(scene);
        
        this.obj = new CGFOBJModel(scene, path);
    }

    display() {
        this.obj.display();
    }

    /**
     * Updates the list of texture coordinates - Not user in MyHalfTorus
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
	}
}