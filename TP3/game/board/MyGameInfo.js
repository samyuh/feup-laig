class MyGameInfo {
    constructor(scene, turn) {
        this.scene = scene;
        this.turn = turn;

        // -- Player Turn -- //
        this.whiteTurn = new MySpriteText(this.scene, "Turn: white");
        this.blackTurn = new MySpriteText(this.scene, "Turn: black");

        this.whiteGroup = new MySpriteText(this.scene, "Biggest White Group: 0");
        this.blackGroup = new MySpriteText(this.scene, "Biggest Black Group: 0");

        this.whiteValue = 0;
        this.blackValue = 0;
    }

    updateGroups(whiteValue, blackValue) {
        this.whiteValue = whiteValue;
        this.blackValue = blackValue;
        this.whiteGroup.text = "Biggest White Group: " + this.whiteValue;
        this.blackGroup.text = "Biggest Black Group: " + this.blackValue;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(1, 6, 0);
        if (this.turn == "white")
            this.whiteTurn.display();
        else if (this.turn == "black")
            this.blackTurn.display();

        this.scene.translate(0, 2, 0);
        this.blackGroup.display();

        this.scene.translate(0, 2, 0);
        this.whiteGroup.display();

        this.scene.popMatrix();
    }
}