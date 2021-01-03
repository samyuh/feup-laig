/**
 * MyGameMenu
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Array} displacement - the displacement of the game menu in the scene, in the format [x, y, z]
 * @param {Array of CGFTextures} textures - the textures of the buttons composing the menu
 */
class MyGameMenu {
    constructor(gameOrchestrator, scene, displacement, textures) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;
        this.rotation = displacement[0];
        this.displacement = displacement[1];
        
        this.menuButton = new MyButton(gameOrchestrator, scene, textures[0], MyGameOrchestrator.prototype.changeMenu, false, null);
        this.resetButton = new MyButton(gameOrchestrator, scene, textures[1], MyGameOrchestrator.prototype.reset, false, null);
        this.movieButton = new MyButton(gameOrchestrator, scene, textures[2], MyGameOrchestrator.prototype.movie, false, null);
        this.undoButton = new MyButton(gameOrchestrator, scene, textures[3], MyGameOrchestrator.prototype.undo, false, null);

        this.board = new MyCube(scene);
        this.boardMaterial = new CGFappearance(scene);
        this.boardMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.boardMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.boardMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.boardMaterial.setShininess(5.0);
        this.boardMaterial.setTextureWrap('REPEAT', 'REPEAT');
        this.boardMaterial.setTexture(textures[4]);

        this.material = new CGFappearance(scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1.0);
        this.material.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material.setShininess(5.0);
        this.material.setTexture(textures[5]);
    }

    /**
     * Unselects the game menu buttons, when the radioType is null
     * @param {String} radioType - check if radiotype is null before unselecting the buttons
     */
    unselectButton(radioType) {
        if (radioType == null) {
            this.menuButton.unselect();
            this.resetButton.unselect();
            this.movieButton.unselect();
            this.undoButton.unselect();
        }
    }

    /**
     * Display function, called periodically, which displays the game menu and the corresponding buttons to the scene
     */
    display() {
        this.scene.pushMatrix();

        this.scene.rotate(this.rotation[1], 0, 1, 0);
        this.scene.rotate(this.rotation[0], 1, 0, 0);
        this.scene.translate(this.displacement[0], this.displacement[1], this.displacement[2]);
        this.scene.pushMatrix();
        this.boardMaterial.apply();
        this.scene.translate(0, 3, 0);
        this.scene.scale(20, 17, 1.5);
        this.board.display();
        this.scene.popMatrix();

        //-- Menu -- //
        this.scene.pushMatrix();
        this.scene.translate(-7.5, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material.apply();
        this.scene.registerForPick(2001, this.menuButton);
        this.menuButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //
        
        //-- Reset -- //
        this.scene.pushMatrix();
        this.scene.translate(-2.5, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material.apply();
        this.scene.registerForPick(2002, this.resetButton);
        this.resetButton.display();
        this.scene.popMatrix();
        // -- //

        //-- Undo -- //
        this.scene.pushMatrix();
        this.scene.translate(2.5, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material.apply();
        this.scene.registerForPick(2003, this.undoButton);
        this.undoButton.display();
        this.scene.popMatrix();
        // -- //

        // -- Movie -- //
        this.scene.pushMatrix();
        this.scene.translate(7.5, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material.apply();
        this.scene.registerForPick(2004, this.movieButton);
        this.movieButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //
        
        this.scene.popMatrix();
    }

}