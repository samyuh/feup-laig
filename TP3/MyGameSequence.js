/**
 * MyGameSequence
 * @constructor
 * @param {MyPiece} piece - Reference to MyPiece object
 * * @param {String} color - Color of the player that made the move
 * * @param {MyTile} tile1 - Reference to MyTile object, where the part of the piece with color Color will be placed
 * * @param {MyTile} tile2 - Reference to MyTile object, where the part of the piece with the opposite color will be placed
 * * @param {MyBoard} board - Gameboard state before the move
 */
class MyGameSequence {
	constructor() {
        this.moves = [];
    }

    addMove(move) {
        this.moves.push(move);
    }

    undo() {
        this.moves.pop(); // Futuramente adicionar o penultimo move em vez de dar pop maybe
    }

    replay() {
        // Show replay of the game
    }
}