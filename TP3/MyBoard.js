class MyBoard {
	constructor(scene, rows, columns) {
        this.scene = scene;
        this.tiles = [];
        this.buildInitialBoard(rows, columns);
    }

    buildInitialBoard(rows, columns) {
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= columns; j++) {
                this.tiles.push(new MyTile(this.scene, i, j, this, "empty"));
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