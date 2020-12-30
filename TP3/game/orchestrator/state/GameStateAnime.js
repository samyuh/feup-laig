class GameStateAnime extends GameState {
    constructor(gameOrchestrator, piece, boardSet, finalPosition) {
        super(gameOrchestrator, boardSet.board);
        this.piece = piece;
        this.boardSet = boardSet;
        this.board = boardSet.board;
        this.position = this.board.getCoordinates(finalPosition[0], finalPosition[1]);
        
        this.pieceToPlayPosition = boardSet.auxBoardDisplacement;
        this.animation = new MyPieceAnimation(this.gameOrchestrator.scene, boardSet, boardSet.pieceToPlay, boardSet.pieceStack, this.pieceToPlayPosition, this.board.getPieceFinalPosition(finalPosition[0], finalPosition[1]));
    
        this.waitingResponse = false;
    }

    putPiece() {
        this.piece.updatePosition(this.position[0], this.position[1], this.position[2], this.position[3]);
        this.board.addPiece(this.piece);     
    }

    update(elapsedTime) {
        this.animation.update(elapsedTime);
    }

    display() {
        if(this.animation.active) {
            this.animation.apply();
            
        } else if (!this.waitingResponse) {
            this.putPiece();
            this.waitingResponse = true;
            this.gameOrchestrator.server.checkEndGame(this.gameOrchestrator, this.boardSet, this.board);
        }

        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //
    }
}