/**
 * GameStateEnd
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Board Object} board - current board of the game
 */
class GameStateEnd extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    /**
     * Update function, called periodically
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {

    }

    /**
     * Display function, called periodically, which calls the display function of the board set and the game info, and the processNode from orchestrator, to build the scene
     */
    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
    }
}