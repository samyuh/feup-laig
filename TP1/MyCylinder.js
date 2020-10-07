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
        var radius_increment = (this.topRadius - this.bottomRadius) / this.stacks;
        var angle = 0;

        console.log(this.bottomRadius);
        console.log(this.topRadius);

        for(var h = 0; h < this.stacks; h++) {
            for (var i = 0; i <= this.slices; i++) {
                var x = Math.cos(angle);
                var z = Math.sin(angle);

                // -- Vertices of Cylinder -- //
                // -- Base of Cylinder -- //
                this.vertices.push(x * (this.bottomRadius - radius_increment * (h + 1)));
                this.vertices.push(z * (this.bottomRadius - radius_increment * (h + 1)));
                this.vertices.push(height_increment + h * height_increment);

                // -- Top of Cylinder -- //
                this.vertices.push(x * (this.bottomRadius - radius_increment * h));
                this.vertices.push(z * (this.bottomRadius - radius_increment * h));
                this.vertices.push(0 + h * height_increment);

                // -- Normals -- //
                // cos^2 (x) + sin^2 (x) = 1, so normal is unitary
                this.normals.push(Math.cos(angle), 0, Math.sin(angle));
                this.normals.push(Math.cos(angle), 0, Math.sin(angle));

                // -- Texture Coordinates -- //
                /*  0 ----------- 1
                *  |
                *  |
                *  |
                *  |
                *  1
                *  To map a texture, each side will have 1/this.slices
                * */
                this.texCoords.push(1 - i / this.slices, 1);
                this.texCoords.push(1 - i / this.slices, 0);

                angle += amplitude_increment;
            }
        }
        
        // -- Draw Sides -- //
        for (var i = 0; i <= (this.slices * 2) * this.stacks + 20; i = i + 2) {
            this.indices.push(i);
            this.indices.push((i + 1));
            this.indices.push((i + 2));

            this.indices.push((i + 3));
            this.indices.push((i + 2));
            this.indices.push((i + 1));
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}