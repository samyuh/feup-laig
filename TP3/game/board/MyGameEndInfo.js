/**
 * MyGameEndInfo
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} state - cause of the end of the game (Board full or Timeout)
 * @param {Array} info - game info, with the winner and its score
 * @param {MySpritesheet Object} spriteSheet - spritesheet to be used in the SpriteTexts
 */
class MyGameEndInfo {
    constructor(scene, state, info, spriteSheet) {
        this.scene = scene;
        
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
        
        this.scene.translate(0, -3, -5);
        this.firstText.display();

        this.scene.translate(0, -4, 0);
        this.secondText.display();

        this.scene.popMatrix();
    }
}