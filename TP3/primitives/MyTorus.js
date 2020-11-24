/**
 * MyTorus
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} inner - Reference to MyScene object
 * @param {integer} outer - Reference to MyScene object
 * @param {integer} slices - Reference to MyScene object
 * @param {integer} loops - Reference to MyScene object
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

		this.initBuffers();
    }
    
    /**
     * Init torus buffers
     */
	initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        // BODY
        var angle = 0;
        var amplitude_increment = (2 * Math.PI) / this.slices;

		let theta = 0;
        var theta_increment = (2 * Math.PI) / this.loops;
        
        for (var loop = 0; loop <= this.loops; loop++) {

            theta += theta_increment;
            angle = 0;
            for (var slice = 0; slice <= this.slices; slice++) {
                // Parametric equations of Torus
                let x = Math.cos(theta) * (this.outer + Math.cos(angle) * this.inner);
                let y = Math.sin(theta) * (this.outer + Math.cos(angle) * this.inner)
                let z = Math.sin(angle) * this.inner;

                // -- Base of Cylinder -- //
                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                // -- Normals -- //

                // Font: https://web.cs.ucdavis.edu/~amenta/s12/findnorm.pdf
                let tx = -Math.sin(theta);
                let ty = Math.cos(theta);
                let tz = 0;

                // Tangent vector with respect to little circle //
                let sx = Math.cos(theta)*(-Math.sin(angle));
                let sy = Math.sin(theta)*(-Math.sin(angle));
                let sz = Math.cos(angle);
                
                // Normal is cross-product of tangents //
                let nx = ty*sz - tz*sy;
                let ny = tz*sx - tx*sz;
                let nz = tx*sy - ty*sx;

                // Normalize normal //
                let length = Math.sqrt(nx*nx + ny*ny + nz*nz);
                nx /= length;
                ny /= length;
                nz /= length;

                this.normals.push(nx, ny, nz);

                // -- Texture Coordinates -- //
                this.texCoords.push(slice / this.slices, loop / this.loops);
                
                angle += amplitude_increment;
            }
        }

        // -- Join vertices by slices, and then by loops. Same logic as cylinder
		for (let loop = 0; loop < this.loops; loop++) {
			for (let slice = 0; slice < this.slices; slice++) {
				var startVertice = this.slices * loop + loop;

                this.indices.push(startVertice + slice);
                this.indices.push(startVertice + slice + this.slices + 1);
                this.indices.push(startVertice + slice + 1);
               
                this.indices.push(startVertice + slice + 1);
                this.indices.push(startVertice + slice + this.slices + 1); 
                this.indices.push(startVertice + slice + this.slices + 2);
			}
		}
		
		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
    }
    
     /**
     * Updates the list of texture coordinates - Not used on MyTorus
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
       // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
	}
}