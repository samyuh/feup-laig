class GameStateAnime extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
    }

    display() {
        this.gameOrchestrator.animation.display();

        // -- Board -- //
        this.gameOrchestrator.boardSet.display();

        this.gameOrchestrator.displayTurn();

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

        this.gameOrchestrator.changeState(new GameStateGame(this.gameOrchestrator, this.board));
    }
}