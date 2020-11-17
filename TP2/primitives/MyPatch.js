class MyPatch extends CGFobject {
	constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
		super(scene);

        let nurbsSurface = new CGFnurbsSurface(nPointsU - 1, nPointsV - 1, controlPoints);
        
		this.primitive = new CGFnurbsObject(this.scene, nPartsU, nPartsV, nurbsSurface);
    }
	
	display() {
		this.primitive.display();
	}

	 /**
     * Updates the list of texture coordinates
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
	updateTexCoords(afs, aft) {
		// Do nothing
	}
}
