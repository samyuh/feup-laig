/**
 * MyCylinder
 * @method constructor
 * @param scene - Reference to MyScene object
 * @param height - Cylinder height
 * @param topRadius - Cylinder top radius
 * @param bottomRadius - Cylinder base radius
 * @param stacks - Reference to number of stacks of cylinder
 * @param slices - Reference to number of slices of cylinder
 */
class MyCylinder extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.stacks = stacks;
        this.slices = slices;
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

        let amplitude_increment = (2 * Math.PI) / this.slices;
        let height_increment = this.height / this.stacks;
        let radius_increment = (this.bottomRadius - this.topRadius) / this.stacks;
        

        // Bottom side vertices
        var angle = 0;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);

        this.texCoords.push(0.5, 0.5);

        for (var i = 0; i < this.slices; i++) {
            let x = Math.cos(angle);
            var y = Math.sin(angle);

            this.vertices.push(x * this.bottomRadius, y * this.bottomRadius, 0);

            this.normals.push(0, 0, -1);

            this.texCoords.push(0.5 * Math.cos(angle) + 0.5, 0.5 * Math.sin(angle) + 0.5);   

            angle += amplitude_increment;      
        }
        
        // Cylinder side vertices
        
        for(var h = 0; h <= this.stacks; h++) {
            let angle = 0;
            for (var i = 0; i <= this.slices; i++) {
                let x = Math.cos(angle) * (this.bottomRadius - radius_increment * h);
                let y = Math.sin(angle) * (this.bottomRadius - radius_increment * h);
                let z = h * height_increment;

                // -- Base of Cylinder -- //
                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                // -- Normals -- //
                this.normals.push(Math.cos(angle), Math.sin(angle), 0);

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
               
                this.texCoords.push(1 - i / this.slices, h / this.stacks);
                

                angle += amplitude_increment;
            }
        }

        // Top side vertices
        var angle = 0;
        this.vertices.push(0);
        this.vertices.push(0);
        this.vertices.push(this.height);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        for (var i = 0; i < this.slices; i++) {
            var x = Math.cos(angle);
            var y = Math.sin(angle);

            this.vertices.push(x * this.topRadius);
            this.vertices.push(y * this.topRadius);
            this.vertices.push(this.height);

            this.normals.push(0, 0, 1);

            this.texCoords.push(0.5 * Math.cos(angle) + 0.5, 0.5 * Math.sin(angle) + 0.5);   

            angle += amplitude_increment;
        }

        /* [n] represents the n number
        *  
        * To create base is necessary [slices] plus [1] (base center) vertices.
        * 
        *   
        * Every stack has [slices + 1] vertices. So for first stack, 
        * we should start at vertice [slices + 1].
        * For second stack, we should start at [2*slices + 2] and go on
        * For the n-th stack, we need to start at [n*stack + n]
        * 
        * 
        * Now that we know how Vertices are aggregated, let's create our rectangles
        * 
        * |------------|
        * |            |
        * |            |
        * |            |
        * |            |
        * |------------|
        * 
        * If bottom-left corner was the start vertice, then would be [startVertice + slice], 
        * where slice indicates the current position on the stack 
        * bottom-left corner can be obtained by adding 1 to bottom-right corner
        * 
        * The same thing can be applied to top-right and top-left corner
        * top-right corner will be plus [slices + 1] than the bottom right vertice, 
        * since it is above in other stack
        * and top-left corner can be obtained by adding 1 to top-right corner
        *
        * After this, just join vertices counterclockwise
        */

        // -- Indices Push
        // Bottom side of Cylinder
        for (let j = 0; j < this.slices; j++) {
            if(j == this.slices - 1) this.indices.push(1);
            else this.indices.push(j + 2);
            this.indices.push(j + 1);
            this.indices.push(0);
        }

        // Cylinder Side
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                let startVertice = this.slices * (stack + 1) + (stack + 1);

                this.indices.push(startVertice + slice);
                this.indices.push(startVertice + slice + 1);
                this.indices.push(startVertice + slice + this.slices + 1);
                
                this.indices.push(startVertice + slice + 1);
                this.indices.push(startVertice + slice + this.slices + 2);
                this.indices.push(startVertice + slice + this.slices + 1); 
            }
        }

        // Top side of Cylinder
        for (let j = 0; j < this.slices - 2; j++) {
            let val = this.vertices.length/3 - this.slices;

            this.indices.push(val + j + 2);
            this.indices.push(val);
            this.indices.push(val + j + 1);
        }  

        
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(afs, aft) {
		// To Do

		this.updateTexCoordsGLBuffers();
	}
}