class MyMenu {
    constructor(scene, gameOrchestrator, spriteSheet) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;

        this.boardSizeButtonSmall = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changeBoardSize, "Small", spriteSheet, '7');
        this.boardSizeButtonMedium = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changeBoardSize, "Medium", spriteSheet, '9');
        this.boardSizeButtonBig = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changeBoardSize, "Big", spriteSheet, '11');

        this.playerOnePlayerButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "PlayerOne - Player", spriteSheet, "one", 1);
        this.playerOneRandomButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "PlayerOne - Random", spriteSheet, "one", 2);
        this.playerOneSmartButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "PlayerOne - Smart", spriteSheet, "one", 3);

        this.playerTwoPlayerButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "PlayerTwo - Player", spriteSheet, "two", 1);
        this.playerTwoRandomButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "PlayerTwo - Random", spriteSheet, "two", 2);
        this.playerTwoSmartButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "PlayerTwo - Smart", spriteSheet, "tw0", 3);

        this.resetButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.reset, "New Game", spriteSheet);
        this.movieButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.movie, "Movie", spriteSheet);
        this.undoButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.undo, "Undo", spriteSheet);

        this.board = new MyCube(scene);
        this.boardTexture = new CGFtexture(scene, "scenes/images/info-background.jpg");
        this.material = new CGFappearance(scene);
        this.material.setTexture(this.boardTexture);

        this.buttonTexture = new CGFtexture(scene, "scenes/images/white.jpg");
        this.material2 = new CGFappearance(scene);
        this.material2.setTexture(this.buttonTexture);

        //console.log(gameOrchestrator.prototype.display);
    }

    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.rotate(-Math.PI/4, 1, 0, 0);
        this.scene.translate(0, -30, 40);
        this.scene.pushMatrix();
        this.scene.scale(20, 20, 1);
        this.board.display();
        this.scene.popMatrix();

        //-- Reset
        this.scene.pushMatrix();
        this.scene.translate(-8, -8, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1000, this.resetButton);
        this.resetButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //

        //-- Movie
        this.scene.pushMatrix();
        this.scene.translate(0, -8, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1001, this.movieButton);
        this.movieButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //

        //-- Undo
        this.scene.pushMatrix();
        this.scene.translate(8, -8, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1002, this.undoButton);
        this.undoButton.display();
        this.scene.popMatrix();
        // -- //

        //-- Board Size
        this.scene.pushMatrix();
        this.scene.translate(-8, -4, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1003, this.boardSizeButtonSmall);
        this.boardSizeButtonSmall.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -4, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1004, this.boardSizeButtonMedium);
        this.boardSizeButtonMedium.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(8, -4, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1005, this.boardSizeButtonBig);
        this.boardSizeButtonBig.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //

        // -- Player -- //
        this.scene.pushMatrix();
        this.scene.translate(-8, 3, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1006, this.playerOnePlayerButton);
        this.playerOnePlayerButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-6, 0, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1007, this.playerOneRandomButton);
        this.playerOneRandomButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-4, 3, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1008, this.playerOneSmartButton);
        this.playerOneSmartButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(8, 3, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1009, this.playerTwoPlayerButton);
        this.playerTwoPlayerButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(6, 0, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1010, this.playerTwoRandomButton);
        this.playerTwoRandomButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(4, 3, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1011, this.playerTwoSmartButton);
        this.playerTwoSmartButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

}