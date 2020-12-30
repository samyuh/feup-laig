/**
 * GameStateAnime
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Piece Object} piece - piece whose animation will be displayed
 * @param {BoardSet Object} boardSet - board set during the piece animation
 * @param {Array} finalPosition - the final position of the piece, in the format [x, y, z]
 */
class GameStateAnime extends GameState {
    constructor(gameOrchestrator, piece, boardSet, finalPosition) {
        super(gameOrchestrator, boardSet.board);
        this.piece = piece;
        this.boardSet = boardSet;
        this.board = boardSet.board;
        this.position = this.board.getCoordinates(finalPosition[0], finalPosition[1]);
        
        this.pieceToPlayPosition = boardSet.auxBoardDisplacement;
        this.animation = new MyPieceAnimation(this.gameOrchestrator.scene, boardSet.pieceToPlay, boardSet.pieceStack, this.pieceToPlayPosition, this.board.getPieceFinalPosition(finalPosition[0], finalPosition[1]));
    }

    /**
     * Sets the final position of the piece, and adds the piece to the board
     */
    putPiece() {
        this.piece.updatePosition(this.position[0], this.position[1], this.position[2], this.position[3]);
        this.board.addPiece(this.piece);     
    }

    /**
     * Update function, called periodically, which calls the update function of the piece animation
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.animation.update(elapsedTime);
    }

    /**
     * Display function, called periodically, which calls the display function of the board set and the game info, and the apply function of the piece animation
     */
    display() {
        if(this.animation.active) {
            this.boardSet.pieceAnimated = true;
            this.animation.apply();
        } else {
            this.putPiece();
            this.boardSet.pieceAnimated = false;
            let a = this.gameOrchestrator.server.checkEndGame(this.gameOrchestrator, this.boardSet, this.board);
            console.log(a);
        }

        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //
        
        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}