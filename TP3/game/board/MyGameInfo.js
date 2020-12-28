class MyGameInfo {
    constructor(scene, turn, displacement) {
        this.scene = scene;
        this.turn = turn;

        this.displacement = displacement;
         // -- Player Turn -- //
         this.whiteTurn = new MySpriteText(this.scene, "Turn: white");
         this.blackTurn = new MySpriteText(this.scene, "Turn: black");
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.displacement[0] + 3, 6 + this.displacement[1], this.displacement[2]);
        if (this.turn == "white")
            this.whiteTurn.display();
        else if (this.turn == "black")
            this.blackTurn.display();
        this.scene.popMatrix();
    }
}