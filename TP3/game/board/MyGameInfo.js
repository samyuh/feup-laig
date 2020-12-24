class MyGameInfo {
    constructor(scene, turn) {
        this.scene = scene;
        this.turn = turn;

         // -- Player Turn -- //
         this.whiteTurn = new MySpriteText(this.scene, "Turn: white");
         this.blackTurn = new MySpriteText(this.scene, "Turn: black");
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(1, 6, 0);
        if (this.turn == "white")
            this.whiteTurn.display();
        else if (this.turn == "black")
            this.blackTurn.display();
        this.scene.popMatrix();
    }
}