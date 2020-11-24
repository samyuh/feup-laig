/**
 * MyPatch
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} nPointsU - the number of points on U
 * @param {integer} nPointsV - the number of points on V
 * @param {integer} nPartsU - the number of divisions in the U direction
 * @param {integer} nPartsV - the number of divisions in the V direction
 * @param {Array} controlPoints - Control Vertexes that form the Patch surface
 */
class MyPatch extends CGFobject {
	constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
		super(scene);

        let nurbsSurface = new CGFnurbsSurface(nPointsU - 1, nPointsV - 1, controlPoints);
        
		this.primitive = new CGFnurbsObject(this.scene, nPartsU, nPartsV, nurbsSurface);
    }
	
	/**
     * Display the nurbs object created which makes the Patch
     */
	display() {
		this.primitive.display();
	}

	 /**
     * Updates the list of texture coordinates - Not used on MyPatch
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
	updateTexCoords(afs, aft) {
		// Do nothing
	}
}