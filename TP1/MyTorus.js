/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
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
	initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

		var angle = 0;
		var amplitude_increment = (2 * Math.PI) / this.slices;

		let theta = 0;
		var theta_increment = (2 * Math.PI) / this.loops;
        for(var h = 0; h <= this.loops; h++) {
			theta += theta_increment;
            for (var i = 0; i < this.slices; i++) {
	
                let x = Math.cos(theta) * (this.outer + Math.cos(angle) * this.inner);
                let y = Math.sin(theta) * (this.outer + Math.cos(angle) * this.inner)
                let z = Math.sin(angle) * this.inner;

                // -- Base of Cylinder -- //
                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                // -- Normals -- //
                this.normals.push(x, y, z);

                /*
                // -- Texture Coordinates -- //
                /*  0 ----------- 1
                *  |
                *  |
                *  |
                *  |
                *  1
                *  To map a texture, each side will have 1/this.slices
                * */
               /*
                this.texCoords.push(1 - i / this.slices, 1);
                this.texCoords.push(1 - i / this.slices, 0);

                */

				angle += amplitude_increment;
            }
        }

		// BODY
		for (let i = 0; i < this.loops; i++) {
			for (let j = 0; j < this.slices - 1; j++) {
				var val = (this.slices) * (i);

				this.indices.push(val + j);
				this.indices.push(val + j + this.slices);
				this.indices.push((val + j + 1));
				

				this.indices.push((val + j + 1));
				this.indices.push((val + j + this.slices));
				this.indices.push((val + j + this.slices + 1));	
			}
		}
		
		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}