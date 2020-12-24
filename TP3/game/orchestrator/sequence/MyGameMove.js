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
	constructor(prevBoard, piece, color) {
        this.prevBoard = prevBoard;
        this.piece = piece;
        this.color = color;
    }

    animate() {
        
    }
}