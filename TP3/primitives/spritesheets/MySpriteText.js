/**
 * MySpriteText
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} text - Text to be written to the sprite text
 * @param {String} spriteSheet - Spritesheet to be used to display the text
 */
class MySpriteText extends CGFobject{
    constructor(scene, text, spriteSheet) { 
        super(scene);
        this.scene = scene; 

        this.text = text;
        this.background = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.spriteSheet = spriteSheet;
    }

    /**
     * Return the line and column of the cell of the sprite sheet with the character passed by parameter
     * @param {String} character - The character which we want to know its line and column in the sprite sheet
     */
    getPosition(character) {
        if (character == " ") return [0, 0];

        // Get position of the character in the sprite sheet
        let charCode = character.charCodeAt();
        /* Older Spritesheet
        if(charCode >= 97 && charCode <= 122) { // Lowercase
            charCode -= 32; 
        }
        else if (charCode >= 65 && charCode <= 90) { // Upercase
            charCode -= 32;
        }
        else if (charCode >= 48 && charCode <= 57) { // Number
            charCode -= 32;
        }
        else return [2, 16]; // Show character "?" (invalid char)
        */
        if(charCode >= 32 && charCode <= 122) { // Lowercase
            charCode -= 32; 
        }
        else return [0, 0]; // Show character "?" (invalid char)
        // Calculate the line and column of the character to be presented
        let M = charCode % this.spriteSheet.sizeM;
        let N = Math.floor(charCode / this.spriteSheet.sizeM);

        return [M, N];
    }

    /**
     * Displays the sprite text, by displaying its background (MyRectangle) and activating the shader of the sprite text, and then reset shader to the default
     */
    display() {
        for (let i = 0; i < this.text.length; i++) {
            // Relative position
            let matrix = mat4.create();
            mat4.translate(matrix, matrix, [i - this.text.length/2 + 0.5, 0, 0]);

            // Get Char Position and update sprite sheet coordinate
            let MN = this.getPosition(this.text[i]);
            this.spriteSheet.activateCellMN(MN[0], MN[1]);
            
            // Apply Matrix and background
            this.scene.pushMatrix();
            this.scene.multMatrix(matrix);
            this.background.display();
            this.scene.popMatrix();
        }

        this.scene.setActiveShaderSimple(this.scene.defaultShader);
    }

    /**
     * Updates the list of texture coordinates - Not used on MySpriteText
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Do nothing
    }
}