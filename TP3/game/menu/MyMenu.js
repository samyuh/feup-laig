/**
 * MyMenu
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MySpritesheet} spriteSheet - the spritesheet to use in the Spritetext objects
 * @param {Array} boardDisplacement - the displacement of the menu in the scene, in the format [x, y, z]
 * @param {Array of CGFTextures} textures - the textures of the buttons composing the menu
 */
class MyMenu {
    constructor(gameOrchestrator, scene, spriteSheet, boardDisplacement, textures) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;
        
        // -- Buttons -- //
        this.boardSizeButtonSmall = new MyButton(gameOrchestrator, scene, textures[3], MyGameOrchestrator.prototype.changeBoardSize, true, "size",  '7');
        this.boardSizeButtonMedium = new MyButton(gameOrchestrator, scene, textures[4], MyGameOrchestrator.prototype.changeBoardSize, false, "size", '9');
        this.boardSizeButtonBig = new MyButton(gameOrchestrator, scene, textures[5], MyGameOrchestrator.prototype.changeBoardSize, false, "size",  '11');

        this.playerOnePlayerButton = new MyButton(gameOrchestrator, scene, textures[0], MyGameOrchestrator.prototype.changePlayer, true, "playerOne", "one", 1);
        this.playerOneRandomButton = new MyButton(gameOrchestrator, scene,  textures[1], MyGameOrchestrator.prototype.changePlayer, false, "playerOne", "one", 2);
        this.playerOneSmartButton = new MyButton(gameOrchestrator, scene, textures[2], MyGameOrchestrator.prototype.changePlayer, false, "playerOne", "one", 3);

        this.playerTwoPlayerButton = new MyButton(gameOrchestrator, scene, textures[0], MyGameOrchestrator.prototype.changePlayer, true, "playerTwo", "two", 1);
        this.playerTwoRandomButton = new MyButton(gameOrchestrator, scene, textures[1], MyGameOrchestrator.prototype.changePlayer, false, "playerTwo", "two", 2);
        this.playerTwoSmartButton = new MyButton(gameOrchestrator, scene, textures[2], MyGameOrchestrator.prototype.changePlayer, false, "playerTwo", "two", 3);

        this.resetButton = new MyButton(gameOrchestrator, scene, textures[6], MyGameOrchestrator.prototype.reset, false, null);

        // -- Board -- //
        
        this.boardRotate = boardDisplacement[0];
        this.boardTranslate = boardDisplacement[1];

        this.board = new MyCube(scene);
        this.material = new CGFappearance(scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.material.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material.setShininess(5.0);
        this.material.setTextureWrap('REPEAT', 'REPEAT');
        this.material.setTexture(textures[7]);

        // -- Button -- //
        this.material2 = new CGFappearance(scene);
        this.material2.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material2.setDiffuse(0.6, 0.6, 0.6, 1.0);
        this.material2.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material2.setShininess(5.0);
        this.material2.setTextureWrap('REPEAT', 'REPEAT');
        this.material2.setTexture(textures[8]);

        // -- Text -- //
        this.settingsText = new MySpriteText(this.scene, "Settings", spriteSheet);
        this.playerOneText = new MySpriteText(this.scene, "Player One", spriteSheet);
        this.playerTwoText = new MySpriteText(this.scene, "Player Two", spriteSheet);
        this.sizeText = new MySpriteText(this.scene, "Board Size", spriteSheet);
        this.startText = new MySpriteText(this.scene, "Start Game", spriteSheet);
    }

    /**
     * Unselects the menu buttons, according to the corresponding radio type
     * @param {String} radioType - the radio type of the buttons to unselect
     */
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
        } else if (radioType == null) {
            this.resetButton.unselect();
        }
    }

    /**
     * Display function, called periodically, which displays the menu and the corresponding buttons to the scene
     */
    display() {
        this.scene.pushMatrix();
        this.material.apply();

        this.scene.rotate(this.boardRotate[2], 0, 0, 1);
        this.scene.rotate(this.boardRotate[1], 0, 1, 0);
        this.scene.rotate(this.boardRotate[0], 1, 0, 0);
        this.scene.translate(this.boardTranslate[0], this.boardTranslate[1], this.boardTranslate[2]);
        this.scene.pushMatrix();
        this.scene.scale(24, 24, 3);
        this.board.display();
        this.scene.popMatrix();

        // -- Text -- //
        this.scene.pushMatrix();
        this.scene.translate(0, 10, 2);
        this.settingsText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-5.5, 8, 2);
        this.playerOneText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(5.5, 8, 2);
        this.playerTwoText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 2);
        this.sizeText.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -6, 2);
        this.startText.display();
        this.scene.popMatrix();
 
        // -- Player -- //
        this.scene.pushMatrix();
        this.scene.translate(-6, 6, 2);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1001, this.playerOnePlayerButton);
        this.playerOnePlayerButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-8, 3, 2);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1002, this.playerOneRandomButton);
        this.playerOneRandomButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-4, 3, 2);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1003, this.playerOneSmartButton);
        this.playerOneSmartButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(6, 6, 2);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1004, this.playerTwoPlayerButton);
        this.playerTwoPlayerButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(4, 3, 2);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1005, this.playerTwoRandomButton);
        this.playerTwoRandomButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(8, 3, 2);
        this.scene.scale(2, 2, 1);
        this.material2.apply();
        this.scene.registerForPick(1006, this.playerTwoSmartButton);
        this.playerTwoSmartButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //

        //-- Board Size
        this.scene.pushMatrix();
        this.scene.translate(-8, -3, 2);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1007, this.boardSizeButtonSmall);
        this.boardSizeButtonSmall.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, -3, 2);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1008, this.boardSizeButtonMedium);
        this.boardSizeButtonMedium.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(8, -3, 2);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1009, this.boardSizeButtonBig);
        this.boardSizeButtonBig.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //
        
        //-- Reset/New Game
        this.scene.pushMatrix();
        this.scene.translate(0, -9, 2);
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