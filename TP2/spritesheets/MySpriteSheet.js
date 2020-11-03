class MySpriteSheet extends CGFobject {
    constructor(scene, texture, sizeM, sizeN) {
        super(scene);    

        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(this.gl, "shaders/spriteShader.vert", "shaders/spriteShader.frag");
        this.shader.setUniformValues({sizeM: this.sizeM, sizeN: this.sizeN});
    }

    activateCellMN(m, n) {
        // Definir os parâmetros da célula a desenhar e mandar para o shader com setUniformValues()
        this.scene.setActiveShader(this.shader);

        this.scene.setActiveShader(this.scene.defaultShader);
    }

    activateCellP(p) {
        // Definir os parâmetros da célula a desenhar e mandar para o shader com setUniformValues()
        this.scene.setActiveShader(this.shader);

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}