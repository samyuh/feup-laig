/**
 * MySpriteSheet
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} texture - Texture to be applied in the sprite sheet
 * @param {integer} sizeM - Number of Columns of the sprite sheet
 * @param {integer} sizeN - Number of Lines of the sprite sheet
 */
class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;

        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.texture = new CGFtexture(this.scene, texture);

        this.shader = new CGFshader(this.scene.gl, "./shaders/spriteShader.vert", "./shaders/spriteShader.frag");

        this.shader.setUniformsValues({texture: 0});
        this.shader.setUniformsValues({sizeM: this.sizeM, sizeN: this.sizeN});
    }

    /**
     * Activates the current cell to be presented, based on the values of the column and row passed by parameters
     * @param {integer} m - Column of the cell to be presented
     * @param {integer} n - Line of the cell to be presented
     */
    activateCellMN(m, n) {
        // Activate the shader of the sprite sheet
        this.scene.setActiveShaderSimple(this.shader);
        
        // Pass the values of the line and column of the cell to be presented to the frag and vert files
        this.shader.setUniformsValues({actualM: m, actualN: n});

        // Bind the texture of the spritesheet
        this.texture.bind(0); 
    }

    /**
     * Activates the current cell to be presented, based on the value corresponding to the number of the cell position passed by parameter
     * @param {integer} p - Number of the cell position to be presented
     */
    activateCellP(p) {
        // Calculate Column and Line of the cell to be presented, based on the number of its position
        let M = p % this.sizeM;
        let N = Math.floor(p / this.sizeM);

        // Use method activateCellMN to activate the cell, based on the values calculated before
        this.activateCellMN(M, N);
    }
}