class MyGameEndInfo {
    constructor(scene, info, displacement) {
        this.scene = scene;

        this.displacement = displacement;
        // -- Player Turn -- //
        this.gameWinner = new MySpriteText(this.scene, "Winner: " +  info[0]);
        this.gameScore = new MySpriteText(this.scene, "Score: " +  info[1]);
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