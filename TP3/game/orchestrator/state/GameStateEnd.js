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


        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}