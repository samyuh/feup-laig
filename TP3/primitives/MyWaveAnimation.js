/**
 * MyWaveAnimation
 */
class MyWaveAnimation {
    constructor(scene, x, y, z) {
        this.scene = scene;   

        this.x = x;
        this.y= y;
        this.z = z;
        this.waterPlane = new MyPlane(this.scene, 50, 50);

        this.appearance = new CGFappearance(this.scene);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);


		this.waterTex = new CGFtexture(this.scene, "scenes/images/shaders/water.jpg");
		this.waterMap = new CGFtexture(this.scene, "scenes/images/shaders/waterMap.jpg");

        this.appearance.setTexture(this.waterTex);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        this.waterShader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");

        this.waterShader.setUniformsValues({ timeFactor : 0 });
		this.waterShader.setUniformsValues({ waterTex: 2 });
        this.waterShader.setUniformsValues({ waterMap: 3 });
    }


    /** 
    * Update animation matrix
    * @param {integer} elapsedTime - elapsed time since last call
    */
    update(elapsedTime) {
        this.waterShader.setUniformsValues({ timeFactor: elapsedTime / 100 % 1000 });
    }

    /** 
    * Apply the animation matrix to the scene
    */
    display() {
        this.scene.pushMatrix();
        this.appearance.apply();

        this.waterTex.bind(2);
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_S, this.scene.gl.MIRRORED_REPEAT);
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_T, this.scene.gl.MIRRORED_REPEAT);
		this.waterMap.bind(3);
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_S, this.scene.gl.MIRRORED_REPEAT);
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_T, this.scene.gl.MIRRORED_REPEAT);
        
        this.scene.translate(this.x, this.y, this.z);
        
        this.scene.setActiveShader(this.waterShader);
        this.waterPlane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }

     /**
   * Updates the list of texture coordinates - Not used on MyCube
   * @param {integer} afs - dx/afs
   * @param {integer} aft - dy/aft
   */
  updateTexCoords(afs, aft) {
    // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
  }
}