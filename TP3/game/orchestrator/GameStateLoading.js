class GameStateLoading extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    display() {
        console.log("Waiting Loading");
    }
}