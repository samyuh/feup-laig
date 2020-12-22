class MyAuxBoard {
	constructor(scene, direction) {
        this.scene = scene;

        this.direction = direction;

        this.tileMaterial = new CGFappearance(scene);
        this.tilesTexture = new CGFtexture(scene, "scenes/images/decoration/flag.png");
        this.tileMaterial.setTexture(this.tilesTexture);

        this.aux = new MyCube(this.scene);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(10 * this.direction, 0, 3);
        this.scene.scale(3, 1, 7);
        this.aux.display();
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}