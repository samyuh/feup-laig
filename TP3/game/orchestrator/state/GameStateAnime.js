class GameStateAnime extends GameState {
    constructor(gameOrchestrator, piece, boardSet, finalPosition) {
        super(gameOrchestrator, boardSet.board);
        this.piece = piece;
        this.boardSet = boardSet;
        this.board = boardSet.board;
        this.position = this.board.getCoordinates(finalPosition[0], finalPosition[1]);

        this.boardSet.pieceAnimated = true;
        this.pieceToPlayPosition = boardSet.auxBoardDisplacement;
        this.animation = new MyPieceAnimation(this.gameOrchestrator.scene, boardSet.pieceToPlay, this.pieceToPlayPosition, this.board.getPieceFinalPosition(finalPosition[0], finalPosition[1]));
    }

    putPiece() {
        this.piece.updatePosition(this.position[0], this.position[1], this.position[2], this.position[3]);
        this.board.addPiece(this.piece);     
    }

    checkEndGame() {
        let stringNewBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");
        let gameOverString = 'game_over(' + stringNewBoard + ')';
        this.gameOrchestrator.server.makePrologRequest(gameOverString, null, null, false);
        let gameOverData = this.gameOrchestrator.server.getResult();
        if (gameOverData.length != 0) {
            this.gameOrchestrator.changeState(new GameStateEnd(this.gameOrchestrator, this.board));
            this.gameOrchestrator.createGameStats("end", gameOverData);
        }
        else {
            this.gameOrchestrator.changeTurn();
            this.boardSet.resetPiece(this.gameOrchestrator.turn);
        }
    }

    update(elapsedTime) {
        this.animation.update(elapsedTime);
    }

    display() {
        if(this.animation.active) {
            this.animation.apply();
        } else {
            this.putPiece();
            this.boardSet.pieceAnimated = false;
            this.checkEndGame();
        }

        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //
        
        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}