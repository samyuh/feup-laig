class MySpriteText {
    constructor(scene, text) { 
        this.scene = scene; 

        this.text = text;
        this.background = new MyRectangle(scene, 0, 0, 1, 1);
        this.spriteSheet = new MySpriteSheet(scene, "./scenes/images/spritesheet-alphabet.jpg", 8, 6);
    }

    getPosition(character) {
        if (character == " ") return [3, 4];

        let charCode = character.charCodeAt();
        charCode -= (65 + 32);

        let M = charCode % this.spriteSheet.sizeM;
        let N = Math.floor(charCode / this.spriteSheet.sizeM);
        
        return [M, N];
    }

    display() {
        for (let i = 0; i < this.text.length; i++) {
            // -- Relative position -- //
            let matrix = mat4.create();
            mat4.translate(matrix, matrix, [i, 0, 0]);

            // -- Get Char Position and update sprite sheet coordinate -- //
            let MN = this.getPosition(this.text[i]);
            this.spriteSheet.activateCellMN(MN[0], MN[1]);
            
            // -- Apply Matrix and background -- //
            this.scene.pushMatrix();
            this.scene.multMatrix(matrix);
            this.background.display();
            this.scene.popMatrix();
        }
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    updateTexCoords(afs, aft) {
        // Do nothing
    }
}