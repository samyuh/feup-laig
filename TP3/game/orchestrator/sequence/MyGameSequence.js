/**
 * MyGameSequence
 * @constructor
 * @param {MyPiece} piece - Reference to MyPiece object
 * 
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
}