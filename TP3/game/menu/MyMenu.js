class MyMenu {
    constructor(scene, gameOrchestrator, spriteSheet) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;

        this.resetButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.reset, "Reset", spriteSheet);
        this.movieButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.movie, "Movie", spriteSheet);
        this.initButton = new MyButton(scene, gameOrchestrator, MyGameOrchestrator.prototype.initBoard, "Init", spriteSheet);
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
        this.scene.translate(0, 0, 20);
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

        //-- Movie
        this.scene.pushMatrix();
        this.scene.translate(-4, -8, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1001, this.movieButton);
        this.movieButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();

        //-- Init
        this.scene.pushMatrix();
        this.scene.translate(0, -8, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1002, this.initButton);
        this.initButton.display();
        this.scene.popMatrix();

        //-- Undo
        this.scene.pushMatrix();
        this.scene.translate(4, -8, 1);
        this.scene.scale(3, 3, 1);
        this.material2.apply();
        this.scene.registerForPick(1003, this.undoButton);
        this.undoButton.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
        this.scene.clearPickRegistration();
    }

}