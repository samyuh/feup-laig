class MyBoard {
	constructor(scene, boardList, boardDisplacement, boardTexture) {
        this.scene = scene;
        
        this.boardList = boardList;
        this.boardLength = boardList.length;
        this.boardDisplacement = boardDisplacement;
        this.tiles = [];
        this.pieceList = [];
        
        // --- Textures --- //
        this.tileMaterial = new CGFappearance(scene);
        this.tileMaterial.setTexture(boardTexture);

        this.selectedTexture = new CGFappearance(scene);
        this.selectedTexture.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.selectedTexture.setDiffuse(0.8, 0.4, 0.1, 1.0);
        this.selectedTexture.setSpecular(0.8, 0.0, 0.0, 1.0);
        this.selectedTexture.setShininess(5.0);
        
        this.createTiles();
    }

    createTiles() {
        this.tiles = [];
        for (let i = 0; i < this.boardLength; i++) {
            for (let j = 0; j < this.boardLength; j++) {
                this.tiles.push(new MyTile(this.scene, j, i, this.tileMaterial, this.selectedTexture));
            }
        }
    }

    addPiece(piece) {
        this.pieceList.push(piece);
    }

    // --- Refactor this functions idk what it does -- //
    convertId(id) {
        let row = Math.floor(id / this.boardLength) + (((id % this.boardLength) == 0) ? 0 : 1);
        let column = (((id % this.boardLength) == 0) ? 7 : id % this.boardLength)

        return [row, column];
    }
    // --- Refactor this functions idk what it does -- //

    getCoord(prev) {
        let rowP = ((prev - 1) % 7);
        let columnP = Math.floor((prev - 1) / 7);

        return [rowP, columnP];
    }

    getCoordinates(prev, actual) {
        let rowP = ((prev - 1) % 7);
        let columnP = Math.floor((prev - 1) / 7);

        let rowA = ((actual - 1) % 7);
        let columnA = Math.floor((actual - 1) / 7);

        return [rowP, columnP, rowA, columnA];
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

    getPieceFinalPosition(idCenter, idExtreme) {
        let c = this.getCoord(idCenter);
        let row = c[0];
        let column = c[1];

        let orientation = this.getOrientation(idCenter, idExtreme);
        let rotate = 0;
        if(orientation == "up") {
            rotate = 180;
        } else if(orientation == "right") {
            rotate = 90;
        } else if(orientation == "left") {
            rotate = -90;
        }

        console.log(orientation);

        return [this.boardDisplacement[0] + row, this.boardDisplacement[1], this.boardDisplacement[2] + column, rotate]
    }

    getAdjacentTiles(id) {
        let row = ((id - 1) % this.boardLength);
        let column = Math.floor((id - 1) / this.boardLength);
        
        let prev_row = row - 1;
        let prev_column = column - 1;
        let next_row = row + 1;
        let next_column = column + 1;

        let adjacent = [
            this.getTile(row, prev_column), 
            this.getTile(row, next_column), 
            this.getTile(prev_row, column), 
            this.getTile(next_row, column)
        ];

        for (var i = 0; i < adjacent.length; i++) {
            if(adjacent[i] != null) {
                adjacent[i].validMove(true);
            }
        }

        return adjacent;
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

        for(var i = 0; i < this.pieceList.length; i++) {
            this.pieceList[i].display();
        }
    }

    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}