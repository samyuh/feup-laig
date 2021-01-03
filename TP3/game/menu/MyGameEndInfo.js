/**
 * MyGameEndInfo
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} state - cause of the end of the game (Board full or Timeout)
 * @param {Array} info - game info, with the winner and its score
 * @param {Array} infoDisplacement - displacement of the info board
 * @param {MySpritesheet Object} spriteSheet - spritesheet to be used in the SpriteTexts
 * @param {Texture} backgroundTexture - backgroundTexture initialized on game orchestrator
 */
class MyGameEndInfo {
    constructor(scene, state, info, infoDisplacement, spriteSheet, backgroundTexture) {
        this.scene = scene;
        
        this.rotation = infoDisplacement[0];
        this.displacement = infoDisplacement[1];

        this.background = new MyRectangle(this.scene, -9, 0, 9, 10);
        this.backgroundTexture = new CGFappearance(scene);
        this.backgroundTexture.setTexture(backgroundTexture);


        // -- Type of endGame -- //
        if (state == "end") {
            this.firstText = new MySpriteText(this.scene, "Winner: " +  info[0], spriteSheet);
            this.secondText = new MySpriteText(this.scene, "Score: " +  info[1], spriteSheet);
        }
        else {
            this.firstText = new MySpriteText(this.scene, "Timeout", spriteSheet);
            this.secondText = new MySpriteText(this.scene, "Winner " + info, spriteSheet);
        }
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
     * Update function, called periodically
     * @param {Integer} time - the time elapsed since the last call
     */
    update(time) {
        
    }

    /**
     * Display function, called periodically, which calls the display function of the SpriteTexts composing the game end info
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
        this.scene.translate(0, 4, 0);
        this.secondText.display();
        this.scene.translate(0, 2, 0);
        this.firstText.display();

        this.scene.popMatrix();
    }
}