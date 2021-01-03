/**
 * MyGameMove
 * @constructor
 * @param {Board Object} prevBoard - board before moving the piece "piece"
 * @param {Piece Object} piece - the piece placed during this game move
 * @param {String} color - the color of the player of the turn that this game move was made
 * @param {Array} startPosition - the initial position of the piece, in the format [x, y, z]
 * @param {Array} finalPosition - the final position of the piece, in the format [x, y, z]
 * @param {Array} coordinates - coordinates on the board of piece
 */
class MyGameMove {
	constructor(prevBoard, piece, color, startPosition, finalPosition, coordinates) {
        this.prevBoard = prevBoard;
        this.piece = piece;
        this.color = color;
        this.startPosition = startPosition;
        this.finalPosition = finalPosition;
        this.coordinates = coordinates;
    }
}