class MyAuxBoard {
	constructor(scene, auxBoardTexture) {
        this.scene = scene;

        this.tileMaterial = new CGFappearance(scene);
        this.tileMaterial.setTexture(auxBoardTexture);

        this.auxBoardFront = new MyCube(this.scene);
        this.auxBoardLeft = new MyCube(this.scene);
        this.auxBoardRight = new MyCube(this.scene);
        this.auxBoardBot = new MyCube(this.scene);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -3);
        this.scene.scale(1, 1, 5);
        this.tileMaterial.apply();
        this.auxBoardFront.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 4);
        this.scene.scale(1, 1, 5);
        this.tileMaterial.apply();
        this.auxBoardBot.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0.5);
        this.scene.scale(1, 1, 12);
        this.tileMaterial.apply();
        this.auxBoardRight.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, 0, 0.5);
        this.scene.scale(1, 1, 12);
        
        this.tileMaterial.apply();
        this.auxBoardLeft.display();
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}