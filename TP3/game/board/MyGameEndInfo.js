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
            this.stringTimeout = new MySpriteText(this.scene, "Winner by Timeout", spriteSheet);
            this.gameWinner = new MySpriteText(this.scene, info[0], spriteSheet);
            //this.gameScore = new MySpriteText(this.scene, "Score not taken in account" +  info[1], spriteSheet);
        }
        
    }

    display() {
        this.scene.pushMatrix();
        //this.scene.translate(1 + this.displacement[0], 6 + this.displacement[1], this.displacement[2]);
        
        this.scene.translate(0, -3, -5);
        this.stringTimeout.display();

        this.scene.translate(0, -4, 0);
        this.gameWinner.display();

        this.scene.popMatrix();
    }
}