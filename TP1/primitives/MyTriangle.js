/**
 * MyTriangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);

		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3; 
		
		this.initBuffers();
	}

	/**
     * Init triangle buffers
     */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	
			this.x2, this.y2, 0,	
			this.x3, this.y3, 0,
		];

		// Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		this.normals = [];
		
		// Defining the normals:
		for (let j = 0 ; j < 3 ; j++) {
			this.normals.push(0, 0, 1);
		}

		this.a = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2));
		this.b = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2));
		this.c = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2));

		this.cosA = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2*this.a*this.c);
		this.sinA = Math.sqrt(1 - Math.pow(this.cosA, 2));

		this.texCoords = [
			0, 0,
			this.a, 0,
			this.c * this.cosA, this.c * this.sinA
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
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
			0, 						1,
			this.a / afs, 		  	1,
			this.c*this.cosA / afs, 1 - this.c*this.sinA / aft,
		];

		this.updateTexCoordsGLBuffers();
	}
}