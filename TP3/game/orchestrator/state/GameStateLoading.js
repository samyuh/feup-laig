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

        this.elapsedTime = 0;
        this.movedCamera = false;
        this.menuCamera = null;
    }

    reset() {
        this.movedCamera = false;
        this.elapsedTime = 0;
    }

    setMenuCamera(camera) {
        this.menuCamera = camera;
    }

    /**
     * Update function, called periodically
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.elapsedTime += elapsedTime;

        if((this.elapsedTime >= 8) && !this.movedCamera && (this.menuCamera != null)) {
            this.movedCamera = true;
            this.gameOrchestrator.scene.updateCamera(this.menuCamera);
        }
    }

    /**
     * Display function, called periodically, which shows a message to the console telling that the scene is loading
     */
    display() {
        if(this.gameOrchestrator.allLoaded) {
            this.gameOrchestrator.boardSet.display();
            this.gameOrchestrator.gameInfo.display();
        }
    }
}