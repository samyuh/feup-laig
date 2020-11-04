class MySpriteText {
    constructor(scene, text) {
        super(scene);
        
        this.scene = scene;
        this.text = text;
        this.background = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.spriteSheet = new MySpriteSheet(scene, "spridesheet.png", 16, 16);
    }

    getCharacterPosition(character) {
        let charCode = character.charCodeAt();
        let M, N;
        if ((charCode >= 65) && (charCode <= 90)) {   // Normal Alphabet (without special ponctuation) in Uppercase
            M = (charCode <= 79) ? 4 : 5;
            N = (1 + charCode - 65) % 16;
        }

        return [M, N];
    }

    display() {
        for (let i = 0; i < this.text.length; i++) {
            let MN = getCharacterPosition(this.text[i]);
            this.spriteSheet.activateCellMN(MN[0], MN[1]);
            let matrix = mat4.create();
            mat4.translate(matrix, matrix, [i, 0, 0]);
            this.scene.pushMatrix();
            this.scene.multMatrix(matrix);
            this.background.display();
            this.scene.popMatrix();
        }
    }
}