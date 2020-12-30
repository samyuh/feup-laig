/**
 * MyGameInfo
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} turn - color of the player to play in the current turn (black/white)
 * @param {Integer} timeout - time left for the player to play in the current turn
 * @param {MySpritesheet Object} spriteSheet - spritesheet to be used in the SpriteTexts
 */
class MyGameInfo {
    constructor(scene, turn, timeout, spriteSheet) {
        this.scene = scene;
        this.turn = turn;
        this.turnTime = 0;
        this.timeout = timeout;

        this.spriteSheet = spriteSheet;
         // -- Player Turn -- //
         
        this.whiteTurn = new MySpriteText(this.scene, "Turn: white", this.spriteSheet);
        this.blackTurn = new MySpriteText(this.scene, "Turn: black", this.spriteSheet);
        this.timer = new MySpriteText(this.scene, "Turn Time: " + this.timeout, this.spriteSheet);

        this.whiteGroup = new MySpriteText(this.scene, "Biggest White Group: 0", this.spriteSheet);
        this.blackGroup = new MySpriteText(this.scene, "Biggest Black Group: 0", this.spriteSheet);

        this.whiteValue = 0;
        this.blackValue = 0;
    }

    /**
     * Update function, called periodically, which updates the SpriteText of the time left to play in the current turn
     * @param {Integer} time - the time elapsed since the last call
     */
    update(time) {
        if(Math.abs(time - this.turnTime) >= 1) {
            this.turnTime = this.timeout - Math.floor(time);
            this.timer = new MySpriteText(this.scene, "Turn Time: " + this.turnTime, this.spriteSheet);
        }
    }

    /**
     * Updates the score of each player
     * @param {Integer} whiteValue - the size of the biggest group of the color white
     * @param {Integer} blackValue - the size of the biggest group of the color black
     */
    updateGroups(whiteValue, blackValue) {
        this.whiteValue = whiteValue;
        this.blackValue = blackValue;
        this.whiteGroup.text = "Biggest White Group: " + this.whiteValue;
        this.blackGroup.text = "Biggest Black Group: " + this.blackValue;
    }

    /**
     * Display function, called periodically, which calls the display function of all the SpriteTexts composing the game info
     */
    display() {
        this.scene.pushMatrix();

        this.scene.translate(0, -10, -5);

        this.scene.translate(0, 2, 0);
        this.blackGroup.display();

        this.scene.translate(0, 2, 0);
        this.whiteGroup.display();

        this.scene.translate(0, 2, 0);
        this.timer.display();

        this.scene.translate(0, 2, 0);
        if (this.turn == "white")
            this.whiteTurn.display();
        else if (this.turn == "black")
            this.blackTurn.display();

        this.scene.popMatrix();
    }
}