/**
 * MyGameMove
 * @constructor
 * @param {MyPiece} piece - Reference to MyPiece object
 * * @param {String} color - Color of the player that made the move
 * * @param {MyTile} tile1 - Reference to MyTile object, where the part of the piece with color Color will be placed
 * * @param {MyTile} tile2 - Reference to MyTile object, where the part of the piece with the opposite color will be placed
 * * @param {MyBoard} board - Gameboard state before the move
 */
class MyGameMove {
	constructor(list, piece, boardTile) {
        let position = this.putPiece(boardTile[0], boardTile[1]);
                                
        piece.updatePosition(position[0], position[1], position[2], position[3]);

        list.push(piece);
    }

    putPiece(prev, actual) {
        let rowP = ((prev - 1) % 7) + 1;
        let columnP = Math.floor((prev - 1) / 7) + 1;

        let rowA = ((actual - 1) % 7) + 1;
        let columnA = Math.floor((actual - 1) / 7) + 1;

        return [rowP, columnP, rowA, columnA];
    }

    animate() {
        
    }
}