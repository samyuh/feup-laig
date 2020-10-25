/**
 * MyRectangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} x1 - x coordinate corner 1
 * @param {integer} y1 - y coordinate corner 1
 * @param {integer} x2 - x coordinate corner 2
 * @param {integer} y2 - y coordinate corner 2
 */
class MyRectangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}
	
	/**
     * Init Rectangle buffers
     */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		// Texture Coordinates
		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	 /**
     * Updates the list of texture coordinates
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
	updateTexCoords(afs, aft) {
		this.texCoords = [
            0,         (this.y2 - this.y1)/aft,
            (this.x2 - this.x1) /afs,     (this.y2 - this.y1)/aft,
            0,             0,
            (this.x2 - this.x1) /afs,         0,
        ];

		this.updateTexCoordsGLBuffers();
	}
}

