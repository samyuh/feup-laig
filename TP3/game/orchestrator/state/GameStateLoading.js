class GameStateLoading extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    update(time, elapsedTime) {
        
    }

    display() {
        console.log("Waiting Loading");
    }
}