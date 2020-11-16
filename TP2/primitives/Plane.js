class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes Cylinder's buffers
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
     /**
     * Updates the list of texture coordinates
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {

	}
}