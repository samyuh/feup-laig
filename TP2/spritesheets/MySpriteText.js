class MySpriteText {
    constructor(scene, text) {
        super(scene);
        
        this.text = text;
        this.background = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.spriteSheet = new MySpriteSheet(scene, "spridesheet.png", 16, 16);
    }

    getCharacterPosition(character) {

    }

    display() {
        
    }
}