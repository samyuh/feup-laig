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

        this.material = new CGFappearance(scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1.0);
        this.material.setSpecular(0.4, 0.4, 0.4, 1.0);
        this.material.setShininess(5.0);
        this.buttonTexture = new CGFtexture(scene, "scenes/images/white.jpg");
        this.material.setTexture(this.buttonTexture);
    }

    unselectButton(radioType) {

    }

    display() {
        this.scene.pushMatrix();

        this.scene.rotate(this.rotation[1], 0, 1, 0);
        this.scene.rotate(this.rotation[0], 1, 0, 0);

        this.scene.translate(this.displacement[0], this.displacement[1], this.displacement[2]);

        //-- Menu -- //
        this.scene.pushMatrix();
        this.scene.translate(-10, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material.apply();
        this.scene.registerForPick(2001, this.menuButton);
        this.menuButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //
        
        //-- Reset -- //
        this.scene.pushMatrix();
        this.scene.translate(-4, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material.apply();
        this.scene.registerForPick(2002, this.resetButton);
        this.resetButton.display();
        this.scene.popMatrix();
        // -- //

        //-- Undo -- //
        this.scene.pushMatrix();
        this.scene.translate(4, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material.apply();
        this.scene.registerForPick(2003, this.undoButton);
        this.undoButton.display();
        this.scene.popMatrix();
        // -- //

        // -- Movie -- //
        this.scene.pushMatrix();
        this.scene.translate(10, -2, 1);
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