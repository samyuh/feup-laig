class MyAuxBoard {
	constructor(scene, rows, columns) {
        this.scene = scene;
        this.tiles = [];

        this.tileMaterial = new CGFappearance(scene);
        this.tilesTexture = new CGFtexture(scene, "scenes/images/decoration/flag.png");
        this.tileMaterial.setTexture(this.tilesTexture);

        this.buildInitialBoard(rows, columns);
        
    }

    buildInitialBoard(rows, columns) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                this.tiles.push(new MyTile(this.scene, j-10, i, this, "empty", this.tileMaterial));
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        for (let i = 0; i < this.tiles.length; i++) {

            this.tiles[i].display();
        }
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}