class GameStateLoading extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    update(elapsedTime) {
        
    }

    display() {
        console.log("Waiting Loading");
    }
}