class MyBoard {
	constructor(scene, boardList) {
        this.scene = scene;
        this.tiles = boardList;
    }

    display() {
        console.log('NO BOARD');
        console.log(this.tiles);

        this.scene.pushMatrix();
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