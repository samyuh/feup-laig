class GameStateEnd extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    update(time, elapsedTime) {
        this.gameOrchestrator.lavaAnim.update(time);
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //

        // -- Lava -- //
        this.gameOrchestrator.lavaAnim.apply();
        // -- Lava -- //
        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}