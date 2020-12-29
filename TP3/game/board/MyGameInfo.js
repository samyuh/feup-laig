class MyGameInfo {
    constructor(scene, turn, displacement, timeout, spriteSheet) {
        this.scene = scene;
        this.turn = turn;
        this.turnTime = 0;
        this.timeout = timeout;

        this.displacement = displacement;
        this.spriteSheet = spriteSheet;
         // -- Player Turn -- //
         
        this.whiteTurn = new MySpriteText(this.scene, "Turn: white", this.spriteSheet);
        this.blackTurn = new MySpriteText(this.scene, "Turn: black", this.spriteSheet);
        this.timer = new MySpriteText(this.scene, "Turn Time: " + this.timeout, this.spriteSheet);

        this.whiteGroup = new MySpriteText(this.scene, "Biggest White Group: 0", this.spriteSheet);
        this.blackGroup = new MySpriteText(this.scene, "Biggest Black Group: 0", this.spriteSheet);

        this.whiteValue = 0;
        this.blackValue = 0;
    }

    update(time) {
        if(Math.abs(time - this.turnTime) >= 1) {
            this.turnTime = this.timeout - Math.floor(time);
            this.timer = new MySpriteText(this.scene, "Turn Time: " + this.turnTime, this.spriteSheet);
        }
    }

    updateGroups(whiteValue, blackValue) {
        this.whiteValue = whiteValue;
        this.blackValue = blackValue;
        this.whiteGroup.text = "Biggest White Group: " + this.whiteValue;
        this.blackGroup.text = "Biggest Black Group: " + this.blackValue;
    }

    display() {
        this.scene.pushMatrix();
        //this.scene.translate(this.displacement[0] + 3, 6 + this.displacement[1], this.displacement[2]);

        this.scene.translate(0, -10, -5);

        this.scene.translate(0, 2, 0);
        this.blackGroup.display();

        this.scene.translate(0, 2, 0);
        this.whiteGroup.display();

        this.scene.translate(0, 2, 0);
        this.timer.display();

        this.scene.translate(0, 2, 0);
        if (this.turn == "white")
            this.whiteTurn.display();
        else if (this.turn == "black")
            this.blackTurn.display();

        this.scene.popMatrix();
    }
}