class MyMenu {
    constructor(scene, gameOrchestrator, spriteSheet) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;

        this.boardSizeButtonSmall = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changeBoardSize, "size", "Small", spriteSheet, '7');
        this.boardSizeButtonMedium = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changeBoardSize, "size", "Medium", spriteSheet, '9');
        this.boardSizeButtonBig = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changeBoardSize, "size", "Big", spriteSheet, '11');

        this.playerOnePlayerButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "playerOne", "PlayerOne - Player", spriteSheet, "one", 1);
        this.playerOneRandomButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "playerOne", "PlayerOne - Random", spriteSheet, "one", 2);
        this.playerOneSmartButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "playerOne", "PlayerOne - Smart", spriteSheet, "one", 3);

        this.playerTwoPlayerButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "playerTwo", "PlayerTwo - Player", spriteSheet, "two", 1);
        this.playerTwoRandomButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "playerTwo", "PlayerTwo - Random", spriteSheet, "two", 2);
        this.playerTwoSmartButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changePlayer, "playerTwo", "PlayerTwo - Smart", spriteSheet, "tw0", 3);

        this.resetButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.reset, null, "New Game", spriteSheet);

        this.board = new MyCube(scene);
        this.boardTexture = new CGFtexture(scene, "scenes/images/volcanic.jpg");
        
        this.material = new CGFappearance(scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.material.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material.setShininess(5.0);
        this.material.setTextureWrap('REPEAT', 'REPEAT');

        this.material.setTexture(this.boardTexture);

        this.buttonTexture = new CGFtexture(scene, "scenes/images/white.jpg");
        this.material2 = new CGFappearance(scene);
        this.material2.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material2.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.material2.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material2.setShininess(5.0);
        this.material2.setTextureWrap('REPEAT', 'REPEAT');
        this.material2.setTexture(this.buttonTexture);

        this.settingsText = new MySpriteText(this.scene, "Settings", spriteSheet);
        this.playerOneText = new MySpriteText(this.scene, "Player One", spriteSheet);
        this.playerTwoText = new MySpriteText(this.scene, "Player Two", spriteSheet);

        this.sizeText = new MySpriteText(this.scene, "Board Size", spriteSheet);
        this.startText = new MySpriteText(this.scene, "Start Game", spriteSheet);
        //console.log(gameOrchestrator.prototype.display);
    }

    unselectButton(radioType) {
        if(radioType == "size") {
            this.boardSizeButtonSmall.unselect();
            this.boardSizeButtonMedium.unselect();
            this.boardSizeButtonBig.unselect();
        } else if(radioType == "playerOne") {
            this.playerOnePlayerButton.unselect();
            this.playerOneRandomButton.unselect();
            this.playerOneSmartButton.unselect();
        } else if(radioType == "playerTwo") {
            this.playerTwoPlayerButton.unselect();
            this.playerTwoRandomButton.unselect();
            this.playerTwoSmartButton.unselect();
        }
    }

    display() {
        this.scene.pushMatrix();
        this.material.apply();

        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(-Math.PI/4, 1, 0, 0);
        this.scene.translate(0, -50, 30);
        this.scene.pushMatrix();
        this.scene.scale(24, 24, 1);
        this.board.display();
        this.scene.popMatrix();

        // -- Text -- //
        this.scene.pushMatrix();
        this.scene.translate(0, 10, 1);
        this.settingsText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-6, 8, 1);
        this.playerOneText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(6, 8, 1);
        this.playerTwoText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.sizeText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -6, 1);
        this.startText.display();
        this.scene.popMatrix();
 
        // -- Player -- //
        this.scene.pushMatrix();
        this.scene.translate(-8, 6, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1006, this.playerOnePlayerButton);
        this.playerOnePlayerButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-6, 3, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1007, this.playerOneRandomButton);
        this.playerOneRandomButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-4, 6, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1008, this.playerOneSmartButton);
        this.playerOneSmartButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(8, 6, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1009, this.playerTwoPlayerButton);
        this.playerTwoPlayerButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(6, 3, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1010, this.playerTwoRandomButton);
        this.playerTwoRandomButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(4, 6, 1);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1011, this.playerTwoSmartButton);
        this.playerTwoSmartButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //

        //-- Board Size
        this.scene.pushMatrix();
        this.scene.translate(-8, -3, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1003, this.boardSizeButtonSmall);
        this.boardSizeButtonSmall.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, -3, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1004, this.boardSizeButtonMedium);
        this.boardSizeButtonMedium.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(8, -3, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1005, this.boardSizeButtonBig);
        this.boardSizeButtonBig.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //
        

        //-- Reset
        this.scene.pushMatrix();
        this.scene.translate(0, -9, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1000, this.resetButton);
        this.resetButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //

        this.scene.popMatrix();
    }

}