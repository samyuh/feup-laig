/**
 * MyGameSequence
 * @constructor
 */
class MyGameSequence {
	constructor() {
        this.moves = [];
    }

    /**
     * Adds a game move to the game sequence
     * @param {GameMove Object} move - the game move to be added
     */
    addMove(move) {
        this.moves.push(move);
    }

    /**
     * Undoes the last game move
     */
    undo() {
        this.moves.pop(); // Futuramente adicionar o penultimo move em vez de dar pop maybe
    }
}