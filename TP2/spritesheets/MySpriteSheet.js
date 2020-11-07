class MySpriteSheet {
    constructor(scene) {
        this.scene = scene;
        /*
        this.texture = texture;
        */

        // -- Passed as parameters -- //
        this.sizeM = 10;
        this.sizeN = 10;

        this.texture = new CGFtexture(this.scene, './scenes/images/demoTexture.png');

        this.shader = new CGFshader(this.scene.gl, "./shaders/spriteShader.vert", "./shaders/spriteShader.frag");

        this.shader.setUniformsValues({texture: 0});
        this.shader.setUniformsValues({sizeM: this.sizeM, sizeN: this.sizeN});
    }

    activateCellMN(m, n) {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
        
    }

    activateCellP(p) {
        // Definir os parâmetros da célula a desenhar e mandar para o shader com setUniformValues()
        //this.scene.setActiveShader(this.shader);

        //this.scene.setActiveShader(this.scene.defaultShader);
    }
}