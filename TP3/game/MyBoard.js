class MyBoard {
	constructor(scene, boardList) {
        this.scene = scene;
        
        this.boardList = boardList;
        this.boardLength = boardList.length;
        this.tiles = [];

        this.tileMaterial = new CGFappearance(scene);
        this.tilesTexture = new CGFtexture(scene, "scenes/images/wood.jpg");
        this.tileMaterial.setTexture(this.tilesTexture);

        this.diff = new CGFappearance(scene);
        this.diffT = new CGFtexture(scene, "scenes/images/daenerys/cloth.jpg");
        this.diff.setTexture(this.diffT);
        this.createTiles();
    }

    createTiles() {
        for (let i = 1; i <= this.boardLength; i++) {
            for (let j = 1; j <= this.boardLength; j++) {
                this.tiles.push(new MyTile(this.scene, j, i, this, this.boardList[i], this.tileMaterial, this.diff));
            }
        }
    }

    getTile(row, column) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].row == row && this.tiles[i].column == column)
                return this.tiles[i];
        }
        return null;
    }


    display() {
        this.scene.pushMatrix();
        this.scene.translate(-3, 0, 0);
        for (let i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].display();
        }
        this.scene.clearPickRegistration();
        this.scene.popMatrix(); 
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}