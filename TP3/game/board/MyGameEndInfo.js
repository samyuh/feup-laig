/**
 * MyGameEndInfo
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} state - cause of the end of the game (Board full or Timeout)
 * @param {Array} info - game info, with the winner and its score
 * @param {MySpritesheet Object} spriteSheet - spritesheet to be used in the SpriteTexts
 */
class MyGameEndInfo {
    constructor(scene, state, info, infoDisplacement, spriteSheet) {
        this.scene = scene;
        this.infoDisplacement = infoDisplacement;
        
        this.rotation = displacement[0];
        this.displacement = displacement[1];

        // -- Player Turn -- //
        if(state == "end") {
            this.firstText = new MySpriteText(this.scene, "Winner: " +  info[0], spriteSheet);
            this.secondText = new MySpriteText(this.scene, "Score: " +  info[1], spriteSheet);
        }
        else {
            this.firstText = new MySpriteText(this.scene, "Winner by Timeout", spriteSheet);
            this.secondText = new MySpriteText(this.scene, info[0], spriteSheet);
        }
        
    }

    /**
     * Display function, called periodically, which calls the display function of the SpriteTexts composing the game end info
     */
    display() {
        this.scene.pushMatrix();
        this.scene.rotate(this.rotation[1], 0, 1, 0);
        this.scene.rotate(this.rotation[0], 1, 0, 0);
        
        this.scene.translate(this.displacement[0], this.displacement[1], this.displacement[2]);
        
        this.scene.translate(0, 2, 0);
        this.firstText.display();
        this.scene.translate(0, 2, 0);
        this.secondText.display();

        this.scene.popMatrix();
    }
}