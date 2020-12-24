class MyBoard {
	constructor(scene, boardList) {
        this.scene = scene;
        
        this.boardList = boardList;
        this.boardLength = boardList.length;
        this.tiles = [];
        this.pieceList = [];

        this.tileMaterial = new CGFappearance(scene);
        this.tilesTexture = new CGFtexture(scene, "scenes/images/wood.jpg");
        this.tileMaterial.setTexture(this.tilesTexture);

        this.diff = new CGFappearance(scene);
        this.diffT = new CGFtexture(scene, "scenes/images/daenerys/cloth.jpg");
        this.diff.setTexture(this.diffT);

        this.createTiles();
    }

    addPiece(piece) {
        this.pieceList.push(piece);
    }

    convertId(id) {
        let row = Math.floor(id / this.boardLength) + (((id % this.boardLength) == 0) ? 0 : 1);
        let column = (((id % this.boardLength) == 0) ? 7 : id % this.boardLength)

        return [row, column];
    }

    getOrientation(idA, idB) {
        let init = this.convertId(idA);
        let end = this.convertId(idB);

        if(init[0] == end[0]) {
            if(init[1] < end[1]) {
                return "right";
            }
            else return "left";
        }
        else {
            if(init[0] > end[0]) {
                return "up";
            }
            else return "down";
        }
    }

    createTiles() {
        this.tiles = [];
        for (let i = 1; i <= this.boardLength; i++) {
            for (let j = 1; j <= this.boardLength; j++) {
                this.tiles.push(new MyTile(this.scene, j, i, this.tileMaterial, this.diff));
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
        for (let i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].display();
        }
        this.scene.clearPickRegistration();
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}