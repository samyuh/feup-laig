class MyGameEndInfo {
    constructor(scene, info) {
        this.scene = scene;

        // -- Player Turn -- //
        this.gameWinner = new MySpriteText(this.scene, "Winner: " +  info[0]);
        this.gameScore = new MySpriteText(this.scene, "Score: " +  info[1]);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(1, 6, 0);
        this.gameWinner.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 5, 0);
        this.gameScore.display();
        this.scene.popMatrix();
    }
}