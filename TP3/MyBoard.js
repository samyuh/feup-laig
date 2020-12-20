class MyBoard {
	constructor(scene, boardList) {
        this.scene = scene;
        
        this.boardList = boardList;
        console.log('BBB ANTES', this.boardList)
        this.boardLength = boardList.length;
        this.tiles = [];
        this.createTiles();
    }

    createTiles() {
        for (let i = 1; i <= this.boardLength; i++) {
            for (let j = 1; j <= this.boardLength; j++) {
                this.tiles.push(new MyTile(this.scene, i, j, this, this.boardList[i]));
            }
        }
    }

    display() {
        console.log('NO BOARD');
        console.log(this.tiles);
        console.log(this.boardList)

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