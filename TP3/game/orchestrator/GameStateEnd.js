class GameStateEnd extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    displayGameStats() {
        this.gameOrchestrator.scene.pushMatrix();
        this.gameOrchestrator.scene.translate(1, 6, 0);
        this.gameOrchestrator.gameWinner.display();
        this.gameOrchestrator.scene.popMatrix();

        this.gameOrchestrator.scene.pushMatrix();
        this.gameOrchestrator.scene.translate(1, 5, 0);
        this.gameOrchestrator.gameScore.display();
        this.gameOrchestrator.scene.popMatrix();
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();

        this.displayGameStats();
    
        // -- Board -- //

        // -- Piece Display -- //
        for(var i = 0; i < this.gameOrchestrator.piecesList.length; i++) {
            this.gameOrchestrator.piecesList[i].display();
        }
        // -- Piece Display -- //
        // -- Lava -- //
        this.gameOrchestrator.lavaAnim.apply();
        // -- Lava -- //
        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}