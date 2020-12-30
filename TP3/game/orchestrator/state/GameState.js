/**
 * GameState
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Board Object} board - current board of the game
 */
class GameState {
    constructor(gameOrchestrator, board) {
        this.gameOrchestrator = gameOrchestrator;
        this.board = board;
    }
}