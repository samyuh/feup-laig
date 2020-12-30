class GameStateEnd extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    update(elapsedTime) {
        
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //
    }
}