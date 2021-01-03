/**
 * MyBoard
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Array} boardList - the list representation of the board, received from the Prolog server
 * @param {Array} boardDisplacement - the displacement of the board in the scene, in the format [dx, dy, dz]
 * @param {CGFtexture} boardTexture - the texture of the game board
 */
class MyBoard {
	constructor(scene, boardList, boardDisplacement, boardTexture) {
        this.scene = scene;
        
        this.boardList = boardList;
        this.boardLength = boardList.length;
        this.boardDisplacement = boardDisplacement;
        this.tiles = [];
        this.pieceList = [];
        
        // --- Textures and Materials --- //
        this.tileMaterial = new CGFappearance(scene);
        this.tileMaterial.setTexture(boardTexture);

        this.selectedTexture = new CGFappearance(scene);
        this.selectedTexture.setAmbient(0.1, 0.5, 0.1, 1.0);
        this.selectedTexture.setDiffuse(0.1, 0.5, 0.1, 1.0);
        this.selectedTexture.setSpecular(0.1, 0.5, 0.1, 1.0);
        this.selectedTexture.setTexture(boardTexture);
        
        this.createTiles();
    }

     /**
     * Update the texture of board when changing themes
     * @param {Texture} boardTexture - board texture
     */
    updateTexture(boardTexture, whiteTexture, blackTexture) {
        this.tileMaterial.setTexture(boardTexture);
        this.selectedTexture.setTexture(boardTexture);

        for(let i = 0; i < this.pieceList.length; i++) {
            this.pieceList[i].whiteTexture = whiteTexture;
            this.pieceList[i].blackTexture = blackTexture;
        }
    }

    /**
     * Creates the MyTile objects that compose the board, each one corresponding to a given cell of the board
     */
    createTiles() {
        this.tiles = [];
        for (let i = 0; i < this.boardLength; i++) {
            for (let j = 0; j < this.boardLength; j++) {
                this.tiles.push(new MyTile(this.scene, j, i, this.tileMaterial, this.selectedTexture));
            }
        }
    }

    /**
     * Adds a piece to the board, after it was played
     * @param {MyPiece Object} piece - the piece to be added to the board
     */
    addPiece(piece) {
        this.pieceList.push(piece);
    }

    /**
     * Converts the id of a given cell of the board in its row and column. Returns in the format [Row, Column]
     * @param {Integer} id - the id of the cell to be converted
     */
    convertProlog(id) {
        let row = Math.floor(id / this.boardLength) + (((id % this.boardLength) == 0) ? 0 : 1);
        let column = (((id % this.boardLength) == 0) ? this.boardLength : id % this.boardLength)

        return [row, column];
    }

    /**
     * Returns the orientation of a given piece, with the main part on the cell with id "idA" and secondary part on the cell with the id "idB"
     * @param {Integer} idA - the id of the main part of the piece
     * @param {Integer} idB - the id of the secondary part of the piece
     */
    getOrientation(idA, idB) {
        let init = this.convertProlog(idA);
        let end = this.convertProlog(idB);

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

    /**
     * Returns the coordinates of the cell of the cell with id in the format [row, column]
     * Used to simplify calculations
     * @param {Integer} id - the id of the cell
     */
    getCoordinate(id) {
        let rowP = ((id - 1) % this.boardLength);
        let columnP = Math.floor((id - 1) / this.boardLength);

        return [rowP, columnP];
    }
    
    /**
     * Returns the coordinates of the previous cell of the cell with id "prev", in the format [row, column]
     * @param {Integer} prev - the id of the cell, whose coordinates of the previous cell will be returned
     * @param {Integer} actual - the id of the cell, whose coordinates of the previous cell will be returned
     */
    // --------------------------------------------
    getCoordinates(prev, actual) {
        let previousCoordinate = this.getCoordinate(prev);
        let actualCoordinate = this.getCoordinate(actual);

        return [previousCoordinate[0], previousCoordinate[1], actualCoordinate[0], actualCoordinate[1]];
    }

    /**
     * Returns the coordinates of both parts of a given cell, in the format [MainPartRow, MainPartColumn, SecondaryPartRow, SecondaryPartColumn] (MainPart can be white/black, depending on the current turn)
     * @param {Integer} row - the row of the cell, whose coordinates of both parts will be returned
     * @param {Integer} column - the column of the cell, whose coordinates of both parts will be returned
     * @param {String} orientation - the orientation of the cell (up, down, left, right), which will be used to deduce the coordinates of both parts of the cell
     */
    getCoordinatesFromProlog(row, column, orientation) {
        let row2 = row, column2 = column;

        switch(orientation) {
            case "up":
                row2 = row - 1;
                break;
            case "down":
                row2 = row + 1;
                break;
            case "left":
                column2 = column - 1;
                break;
            case "right":
                column2 = column + 1;
                break;
        }

        return [column-1, row-1, column2-1, row2-1];
    }

    /**
     * Returns the info needed to the animation of the piece, in the format [x, y, z, angle]
     * @param {Integer} idCenter - the id of the main part of the piece
     * @param {Integer} idExtreme - the id of the secondary part of the piece
     */
    getPieceFinalPosition(idCenter, idExtreme) {
        let c = this.getCoordinate(idCenter); 
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

        return [this.boardDisplacement[0] + row, this.boardDisplacement[1], this.boardDisplacement[2] + column, rotate];
    }

    /**
     * Returns the adjacent cells of the cell with id "id", in a list
     * @param {Integer} id - the id of the cell whose adjacent cells will be returned
     */
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

    /**
     * Returns the MyTile object corresponding to the cell with row "row" and column "column"
     * @param {Integer} row - the row of the cell whose corresponding tile will be returned
     * @param {Integer} column - the column of the cell whose corresponding tile will be returned
     */
    getTile(row, column) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].row == row && this.tiles[i].column == column)
                return this.tiles[i];
        }
        return null;
    }

    /**
     * Display function, called periodically, which calls the display function of all the tiles and pieces composing the board
     */
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

    /**
     * Updates the list of texture coordinates - Not used on MyBoard
     * @param {Integer} afs - dx/afs
     * @param {Integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}