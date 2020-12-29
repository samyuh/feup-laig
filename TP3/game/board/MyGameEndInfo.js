class MyGameEndInfo {
    constructor(scene, state, info, displacement, spriteSheet) {
        this.scene = scene;
        this.displacement = displacement;
        
        // -- Player Turn -- //
        if(state == "end") {
            this.gameWinner = new MySpriteText(this.scene, "Winner: " +  info[0], spriteSheet);
            this.gameScore = new MySpriteText(this.scene, "Score: " +  info[1], spriteSheet);
        }
        else {
            this.gameWinner = new MySpriteText(this.scene, "Winner by Timeout: " +  info[0], spriteSheet);
            this.gameScore = new MySpriteText(this.scene, "Score not taken in account" +  info[1], spriteSheet);
        }
        
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(1 + this.displacement[0], 6 + this.displacement[1], this.displacement[2]);
        this.gameWinner.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1 + this.displacement[0], 5 + this.displacement[1], this.displacement[2]);
        this.gameScore.display();
        this.scene.popMatrix();
    }
}