class MyBoard {
	constructor(scene, rows, columns) {
        this.scene = scene;
        this.tiles = [];

        this.tileMaterial = new CGFappearance(scene);
        this.tilesTexture = new CGFtexture(scene, "scenes/images/wood.jpg");
        this.tileMaterial.setTexture(this.tilesTexture);

        this.buildInitialBoard(rows, columns);
        
    }

    buildInitialBoard(rows, columns) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                this.tiles.push(new MyTile(this.scene, j, i, this, "empty", this.tileMaterial));
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-3, 0, 0);
        for (let i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);

            this.tiles[i].display();
        }
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}