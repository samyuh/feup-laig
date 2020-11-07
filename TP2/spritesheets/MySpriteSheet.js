class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;

        // -- Passed as parameters -- //
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        // -- Texture -- // 
        this.texture = new CGFtexture(this.scene, texture);

        this.shader = new CGFshader(this.scene.gl, "./shaders/spriteShader.vert", "./shaders/spriteShader.frag");

        this.shader.setUniformsValues({texture: 0});
        this.shader.setUniformsValues({sizeM: this.sizeM, sizeN: this.sizeN});
    }

    activateCellMN(m, n) {
        this.scene.setActiveShader(this.shader);
        
        this.shader.setUniformsValues({actualM: m, actualN: n});
        this.texture.bind(0); 
    }

    activateCellP(p) {
        // Definir os parâmetros da célula a desenhar e mandar para o shader com setUniformValues()
        //this.scene.setActiveShader(this.shader);

        //this.scene.setActiveShader(this.scene.defaultShader);
    }
}