/**
 * MyGameInfo
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} turn - color of the player to play in the current turn (black/white)
 * @param {String} whitePlayer - whitePlayer type
 * @param {String} blackPlayer - blackPlayer type
 * @param {Array} infoDisplacement - displacement of the info board
 * @param {Integer} timeout - time left for the player to play in the current turn
 * @param {MySpritesheet Object} spriteSheet - spritesheet to be used in the SpriteTexts
 * @param {Texture} backgroundTexture - backgroundTexture initialized on game orchestrator
 */
class MyGameInfo {
    constructor(scene, turn, whitePlayer, blackPlayer, infoDisplacement, timeout, spriteSheet, backgroundTexture) {
        this.scene = scene;
        this.turn = turn;
        this.turnTime = 0;
        this.timeout = timeout;

        this.rotation = infoDisplacement[0];
        this.displacement = infoDisplacement[1];
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.spriteSheet = spriteSheet;

        // -- Player Turn -- //
        this.background = new MyRectangle(this.scene, -9, 0, 9, 10);
        this.backgroundTexture = new CGFappearance(scene);
        this.backgroundTexture.setTexture(backgroundTexture);

        this.whiteTurn = new MySpriteText(this.scene, "Turn: white", this.spriteSheet);
        this.blackTurn = new MySpriteText(this.scene, "Turn: black", this.spriteSheet);
        this.timer = new MySpriteText(this.scene, "Turn Time: " + this.timeout, this.spriteSheet);

        this.randomBot = new MySpriteText(this.scene, "Random Bot", this.spriteSheet);
        this.intelligentBot = new MySpriteText(this.scene, "Intelligent Bot", this.spriteSheet);

        this.whiteGroup = new MySpriteText(this.scene, "White Score: 0", this.spriteSheet);
        this.blackGroup = new MySpriteText(this.scene, "Black Score: 0", this.spriteSheet);

        this.whiteValue = 0;
        this.blackValue = 0;
    }

    /**
     * Update the displacement of boards
     * @param {Array} displacement - displacement of the info board
     */
    updatePosition(displacement) {
        this.rotation = displacement[0];
        this.displacement = displacement[1];
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
        this.whiteGroup.text = "White Score: " + this.whiteValue;
        this.blackGroup.text = "Black Score: " + this.blackValue;
    }

    /**
     * Get bot type
     */
    getBotType() {
        if (this.turn == "white") {
            if (this.whitePlayer == 2) {
                return this.randomBot;
            } else {
                return this.intelligentBot;
            }
        }
        else {
            if (this.blackPlayer == 2) {
                return this.randomBot;
            } else {
                return this.intelligentBot;
            }
        }
    }

    /**
     * Display function, called periodically, which calls the display function of all the SpriteTexts composing the game info
     */
    display() {
        this.scene.pushMatrix();
        this.scene.rotate(this.rotation[2], 0, 0, 1);
        this.scene.rotate(this.rotation[1], 0, 1, 0);
        this.scene.rotate(this.rotation[0], 1, 0, 0);

        this.scene.translate(this.displacement[0], this.displacement[1], this.displacement[2]);

        
        this.scene.translate(0, 0, 1);
        this.backgroundTexture.apply();
        this.background.display();
        this.scene.translate(0, 0, 0.2);
        this.scene.translate(0, 2, 0);
        this.blackGroup.display();

        this.scene.translate(0, 2, 0);
        this.whiteGroup.display();

        this.scene.translate(0, 2, 0);
        if ((this.turn == "white" && this.whitePlayer == '1') || (this.turn == "black" && this.blackPlayer == '1')) {
            this.timer.display();
        }
        else {
            let botType = this.getBotType();
            botType.display();
        }

        this.scene.translate(0, 2, 0);
        if (this.turn == "white") {
            this.whiteTurn.display();
        } else if (this.turn == "black") {
            this.blackTurn.display();
        }

        this.scene.popMatrix();
    }
}