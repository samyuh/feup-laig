class GameStateAnime extends GameState {
    constructor(gameOrchestrator, piece, boardSet, finalPosition) {
        super(gameOrchestrator, boardSet.board);
        this.piece = piece;
        this.boardSet = boardSet;
        this.position = this.getCoordinates(finalPosition[0], finalPosition[1]);

        this.animation = new MyPieceAnimation(this.gameOrchestrator.scene, boardSet.pieceToPlay, 0, finalPosition);
    }

    getCoordinates(prev, actual) {
        let rowP = ((prev - 1) % 7) + 1;
        let columnP = Math.floor((prev - 1) / 7) + 1;

        let rowA = ((actual - 1) % 7) + 1;
        let columnA = Math.floor((actual - 1) / 7) + 1;

        return [rowP, columnP, rowA, columnA];
    }

    putPiece() {
        this.piece.updatePosition(this.position[0], this.position[1], this.position[2], this.position[3]);
        this.board.addPiece(this.piece);

        this.boardSet.resetPiece();
    }

    checkEndGame() {
        let stringNewBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");
        let gameOverString = 'game_over(' + stringNewBoard + ')';
        this.gameOrchestrator.server.makePrologRequest(gameOverString, null, null, false);
        let gameOverData = this.gameOrchestrator.server.getResult();
        if (gameOverData.length != 0) {
            this.gameOrchestrator.changeState(new GameStateEnd(this.gameOrchestrator, this.board));
            this.gameOrchestrator.createGameStats(gameOverData);
        }
        else {
            this.gameOrchestrator.changeState(new GameStateGame(this.gameOrchestrator, this.board));
            this.gameOrchestrator.changeTurn();
        }
    }

    update(time) {
        this.animation.update(time);
        
        this.gameOrchestrator.lavaAnim.update(time);
    }

    display() {
        if(this.animation.active) {
            this.animation.apply();
        } else {
            this.putPiece();
            this.checkEndGame();
        }

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