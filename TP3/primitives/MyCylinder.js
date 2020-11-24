/**
 * MyCylinder
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {integer} height - Cylinder height
 * @param {integer} topRadius - Cylinder top radius
 * @param {integer} bottomRadius - Cylinder base radius
 * @param {integer} stacks - Reference to number of stacks of cylinder
 * @param {integer} slices - Reference to number of slices of cylinder
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
        
        /* [n] represents the n number
        *  
        * To create base is necessary [slices] plus [1] (base center) vertices.
        * 
        *   
        * Every stack has [slices + 1] vertices.
        * So for the n-th stack, we need to start at [n*stack + n]
        * 
        * In order to create the rectangles we need to take the following into consideration
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

        // --- Bottom Vertices --- //
        this.createBases(amplitude_increment, this.bottomRadius, 0, -1);
        
        // ---  Side Vertices  --- //
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
                let a = Math.cos(angle);
                let b = Math.sin(angle);
                let c = -Math.atan((this.topRadius - this.bottomRadius) / this.height);

                let length = Math.sqrt(a*a + b*b + c*c);
                let nx = a / length;
                let ny = b / length;
                let nz = c / length;

                this.normals.push(nx, ny, nz);

                // -- Texture Coordinates -- //
                this.texCoords.push(i / this.slices, 1 - h / this.stacks);
                
                angle += amplitude_increment;
            }
        }

        // --- Top Vertices --- //
        this.createBases(amplitude_increment, this.topRadius, this.height, 1);

        // -- Indices Push
        this.createIndices();
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Creates Cylinder's bot and top base
     * @param {integer} amplitude_increment - Amplitude increment between each slice
     * @param {integer} height - Z Position
     * @param {integer} zNormalDirection - 1 if positive, -1 if negative
     */
    createBases(amplitude_increment, radius, height, zNormalDirection) {
        let angle = 0;
        this.vertices.push(0, 0, height);
        this.normals.push(0, 0, zNormalDirection);

        this.texCoords.push(0.5, 0.5);

        for (var i = 0; i < this.slices; i++) {
            let x = Math.cos(angle);
            var y = Math.sin(angle);

            this.vertices.push(x * radius, y * radius, height);

            this.normals.push(0, 0, zNormalDirection);

            this.texCoords.push(0.5 * Math.cos(angle) + 0.5, 0.5 * Math.sin(angle) + 0.5);   

            angle += amplitude_increment;      
        }
    }

    /**
     * Join cylinder vertices counterclockwise
     */
    createIndices() {
        // -- Bottom -- //
        for (let j = 0; j < this.slices; j++) {
            if(j == this.slices - 1) this.indices.push(1);
            else this.indices.push(j + 2);
            this.indices.push(j + 1);
            this.indices.push(0);
        }

        // -- Side -- //
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

        // -- Top -- //
        for (let j = 0; j < this.slices - 2; j++) {
            let val = this.vertices.length/3 - this.slices;

            this.indices.push(val + j + 2);
            this.indices.push(val);
            this.indices.push(val + j + 1);
        }  
    }

     /**
     * Updates the list of texture coordinates - Not used on MyCylinder
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
	}
}