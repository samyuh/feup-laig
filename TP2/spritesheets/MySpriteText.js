class MySpriteText {
    constructor(scene, text) { 
        this.scene = scene; 

        this.text = text;
        this.background = new MyRectangle(scene, 0, 0, 1, 1);
        this.spriteSheet = new MySpriteSheet(scene, "./scenes/images/spritesheet-alphabet.jpg", 8, 6);
    }

    getPosition(character) {
        if (character == " ") return [3, 5];

        let charCode = character.charCodeAt();
        if(charCode >= 97 && charCode <= 122) { // Lowercase
            charCode -= 97; 
        }
        else if (charCode >= 65 && charCode <= 90) { // Upercase
            charCode -= 65;
        }
        else if (charCode >= 48 && charCode <= 57) { // Number
            charCode -= 22;
        }
        else return [6, 4]; // Show ? (invalid char)

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
        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }

    updateTexCoords(afs, aft) {
        // Do nothing
    }
}