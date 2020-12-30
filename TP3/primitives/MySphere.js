/**
 * MySphere
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
class MySphere extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Y axis
     * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
     */
    constructor(scene, radius, slices, stacks) {
      super(scene);
      this.radius = radius;
      this.latDivs = stacks * 2;
      this.longDivs = slices;
  
      this.initBuffers();
    }
  
    /**
     * Initializes the sphere buffers
     */
    initBuffers() {
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords = [];
  
      var phi = 0;
      var theta = 0;
      var phiInc = Math.PI / this.latDivs;
      var thetaInc = (2 * Math.PI) / this.longDivs;
      var latVertices = this.longDivs + 1;
  
      var longD = 1 / this.longDivs;
      var latD = 1 / this.latDivs;
  
      // -- build an all-around stack at a time, starting on "north pole" and proceeding "south" -- //
      for (let latitude = 0; latitude <= this.latDivs; latitude++) {
        var sinPhi = this.radius * Math.sin(phi);
        var cosPhi = this.radius * Math.cos(phi);
  
        // -- in each stack, build all the slices around, starting on longitude 0 -- //
        theta = 0;
        for (let longitude = 0; longitude <= this.longDivs; longitude++) {
          // -- Vertices coordinates  -- //
          var x = Math.sin(-theta) * sinPhi; // Eixo nos x: var x = Math.cos(theta) * sinPhi;
          var y = Math.cos(theta) * sinPhi;  // Eixo nos x: var y = cosPhi;
          var z = cosPhi;                    // Eixo nos x: var z = Math.sin(-theta) * sinPhi;
          this.vertices.push(x, y, z);
  
          // -- Indices -- //
          if (latitude < this.latDivs && longitude < this.longDivs) {
            var current = latitude * latVertices + longitude;
            var next = current + latVertices;
            // pushing two triangles using indices from this round (current, current+1)
            // and the ones directly south (next, next+1) 
            // (i.e. one full round of slices ahead) 
  
            this.indices.push(current + 1, current, next);
            this.indices.push(current + 1, next, next + 1);
          }
  
          //--- Normals
          // at each vertex, the direction of the normal is equal to 
          // the vector from the center of the sphere to the vertex. 
          // in a sphere of radius equal to one, the vector length is one. 
          // therefore, the value of the normal is equal to the position vectro 

          let length = Math.sqrt(x*x + y*y + z*z);
          let nx = x / length;
          let ny = y / length;
          let nz = z / length;

          this.normals.push(nx, ny, nz);
          theta += thetaInc;
  
          // -- Texture Coordinates -- //
          var tu = 0.25 + longD * longitude;
          var tv = latD * latitude;
          this.texCoords.push(tu, tv);
  
        }
        phi += phiInc;
      }
  
      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
    }

     /**
     * Updates the list of texture coordinates - Not used on MySphere
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
      // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
  }