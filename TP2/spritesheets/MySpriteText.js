class MySpriteText {
    constructor(scene, text) { 
        this.scene = scene; 
        this.text = text;
        console.log(text);
        this.background = new MyRectangle(scene, 0, 0, 1, 1);
        this.spriteSheet = new MySpriteSheet(scene, "spridesheet.png", 16, 16);
    }

    getPosition(character) {
        let charCode = character.charCodeAt();
        let M, N;
        if ((charCode >= 65) && (charCode <= 90)) {   // Normal Alphabet (without special ponctuation) in Uppercase
            M = (charCode <= 79) ? 4 : 5;
            N = (1 + charCode - 65) % 16;
        }

        return [0, 0];
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

            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }

    updateTexCoords(afs, aft) {

    }
}