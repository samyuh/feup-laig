/**
 * GameStateLoading
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Board Object} board - current board of the game
 */
class GameStateLoading extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);

        this.gameOrchestrator = gameOrchestrator;
        this.board = board;
    }

    /**
     * Update function, called periodically
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        // Override
    }

    /**
     * Display function, called periodically, which shows a message to the console telling that the scene is loading
     */
    display() {
        if(this.gameOrchestrator.gameOrchestratorLoaded) {
            this.gameOrchestrator.boardSet.display();
            this.gameOrchestrator.gameInfo.display();
        }
    }
}