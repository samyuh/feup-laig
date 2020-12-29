class MyGameInfo {
    constructor(scene, turn, displacement, spriteSheet) {
        this.scene = scene;
        this.turn = turn;
        this.turnTime = 0;

        this.displacement = displacement;
        this.spriteSheet = spriteSheet;
         // -- Player Turn -- //
         
         this.whiteTurn = new MySpriteText(this.scene, "Turn: white", this.spriteSheet);
         this.blackTurn = new MySpriteText(this.scene, "Turn: black", this.spriteSheet);
         this.timer = new MySpriteText(this.scene, "Turn Time: 0", this.spriteSheet);

         this.whiteGroup = new MySpriteText(this.scene, "Biggest White Group: 0", this.spriteSheet);
        this.blackGroup = new MySpriteText(this.scene, "Biggest Black Group: 0", this.spriteSheet);

        this.whiteValue = 0;
        this.blackValue = 0;

         // TO DO
         this.whiteScore = new MySpriteText(this.scene, "White Score: ", this.spriteSheet);
         this.blackScore = new MySpriteText(this.scene, "Black Score: ", this.spriteSheet);
    }

    update(time) {
        if(Math.abs(time - this.turnTime) >= 1) {
            this.turnTime = Math.floor(time);
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
        this.scene.translate(this.displacement[0] + 3, 6 + this.displacement[1], this.displacement[2]);
        if (this.turn == "white")
            this.whiteTurn.display();
        else if (this.turn == "black")
            this.blackTurn.display();

        this.scene.translate(0, 2, 0);
        this.blackGroup.display();

        this.scene.translate(0, 2, 0);
        this.whiteGroup.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.displacement[0] + 3, 7 + this.displacement[1], this.displacement[2]);
        this.timer.display()
        this.scene.popMatrix();
    }
}