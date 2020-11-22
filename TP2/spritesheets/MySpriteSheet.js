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
        this.scene.setActiveShaderSimple(this.shader);
        
        this.shader.setUniformsValues({actualM: m, actualN: n});
        this.texture.bind(0); 
    }

    activateCellP(p) {
        let M = p % this.sizeM;
        let N = Math.floor(p / this.sizeM);

        this.activateCellMN(M, N);
    }
}