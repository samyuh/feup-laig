class MyAuxBoard {
	constructor(scene) {
        this.scene = scene;

        this.tileMaterial = new CGFappearance(scene);
        this.tilesTexture = new CGFtexture(scene, "scenes/images/decoration/flag.png");
        this.tileMaterial.setTexture(this.tilesTexture);

        this.auxBoard = new MyCube(this.scene);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(3, 1, 14);
        this.tileMaterial.apply();
        this.auxBoard.display();
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}