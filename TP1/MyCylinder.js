/**
 * MyCylinder
 * @method constructor
 * @param scene - Reference to MyScene object
 * @param slices - Reference to number of sides of Cylinder
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

        var amplitude_increment = (2 * Math.PI) / this.slices;
        var height_increment = this.height / this.stacks;
        var radius_increment = (this.bottomRadius - this.topRadius) / this.stacks;
        
        
        // BASE
        var angle = 0;

        this.vertices.push(0);
        this.vertices.push(0);
        this.vertices.push(0);
        this.normals.push(0, 0, -1);

        for (var i = 0; i < this.slices; i++) {
            var x = Math.cos(angle);
            var y = Math.sin(angle);

            this.vertices.push(x * this.bottomRadius);
            this.vertices.push(y * this.bottomRadius);
            this.vertices.push(0);

            this.normals.push(0, 0, -1);

            angle += amplitude_increment;
        }

        
        // BODY
        var angle = 0;
        for(var h = 0; h <= this.stacks; h++) {
            for (var i = 0; i < this.slices; i++) {
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
               /*
                this.texCoords.push(1 - i / this.slices, 1);
                this.texCoords.push(1 - i / this.slices, 0);

                */

                angle += amplitude_increment;
            }
        }

        // TOP
        var angle = 0;

        this.vertices.push(0);
        this.vertices.push(0);
        this.vertices.push(this.height);
        this.normals.push(0, 0, 1);

        for (var i = 0; i < this.slices; i++) {
            var x = Math.cos(angle);
            var y = Math.sin(angle);

            this.vertices.push(x * this.topRadius);
            this.vertices.push(y * this.topRadius);
            this.vertices.push(this.height);

            this.normals.push(0, 0, 1);

            angle += amplitude_increment;
        }

        console.log(this.topRadius);

        // BASE
        for (let j = 0; j < this.slices; j++) {
            if(j == this.slices - 1) this.indices.push(1);
            else this.indices.push(j + 2);
            this.indices.push(j + 1);
            this.indices.push(0);
        }

        // BODY
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                var val = (this.slices) * (i + 1) + 1;

                this.indices.push(val + j);
                if (j == this.slices - 1) this.indices.push(val);
                else this.indices.push((val + j + 1));
                this.indices.push(val + j + this.slices);


                if (j == this.slices - 1) this.indices.push(val);
                else this.indices.push((val + j + 1));
                if (j == this.slices - 1) this.indices.push(val + this.slices);
                else this.indices.push((val + j + this.slices + 1));
  
                this.indices.push((val + j + this.slices));
            }
        }

        // TOP
        for (let j = 0; j < this.slices - 2; j++) {
            let val = this.vertices.length/3 - this.slices;

            this.indices.push(val + j + 2);
            this.indices.push(val);
            this.indices.push(val + j + 1);
           
        }  

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}