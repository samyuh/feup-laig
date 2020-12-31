class MyGameMenu {
    constructor(scene, displacement, gameOrchestrator, spriteSheet) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;
        this.rotation = displacement[0];
        this.displacement = displacement[1];

        this.menuButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.changeMenu, null, "Menu", spriteSheet);
        this.resetButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.reset, null, "Restart", spriteSheet);
        this.movieButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.movie,null, "Movie", spriteSheet);
        this.undoButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.undo, null, "Undo", spriteSheet);

        this.buttonTexture = new CGFtexture(scene, "scenes/images/white.jpg");
        this.material2 = new CGFappearance(scene);
        this.material2.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material2.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.material2.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material2.setShininess(5.0);
        this.material2.setTextureWrap('REPEAT', 'REPEAT');
        this.material2.setTexture(this.buttonTexture);
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
        this.material2.apply();
        this.scene.registerForPick(2001, this.menuButton);
        this.menuButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //
        
        //-- Reset -- //
        this.scene.pushMatrix();
        this.scene.translate(-4, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(2002, this.resetButton);
        this.resetButton.display();
        this.scene.popMatrix();
        // -- //

        //-- Undo -- //
        this.scene.pushMatrix();
        this.scene.translate(4, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(2003, this.undoButton);
        this.undoButton.display();
        this.scene.popMatrix();
        // -- //

        // -- Movie -- //
        this.scene.pushMatrix();
        this.scene.translate(10, -2, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(2004, this.movieButton);
        this.movieButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
        // -- //
        
        

        this.scene.popMatrix();
    }

}