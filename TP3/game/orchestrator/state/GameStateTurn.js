/**
 * GameStateGame
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Board Object} board - current board of the game
 */
class GameStateTurn extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
        this.board = board;
        this.selectedTiles = null;
        this.previousTileId = null;
        this.turnTimer = 0;

        this.piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
    }

     /**
     * Update the prolog board
     * @param {Array} lastMove - lastMove
     */
    updateBoardProlog(lastMove) {
        let move = this.board.convertProlog(lastMove[0]);
        let orientation = this.board.getOrientation(lastMove[0], lastMove[1]);

        let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

        let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + this.gameOrchestrator.turn + ')';
        let p = this.gameOrchestrator.server.promiseRequest(moveString, null, null);

        p.then((request) => {
            this.board.boardList = request;
        });
    }

    /**
     * Removes the highlighted playable cells
     */
    cleanPicked() {
        if(this.selectedTiles != null) {
            for (var i = 0; i < this.selectedTiles.length; i++) {
                if(this.selectedTiles[i] != null) {
                    this.selectedTiles[i].validMove(false);
                }
            }
        }
    }

    /**
     * Processes the picking of the user, moving a piece if the cells chosen were valid
     * @param {Tile Object} tile - the tile picked by the user
     * @param {Integer} currentTileId - the id of the tile picked by the user
     */
    handlePicking(tile, currentTileId) {
        if (tile.isDiff) {
            let move = this.board.convertProlog(this.previousTileId);  // [Row, Column]
            let orientation = this.board.getOrientation(this.previousTileId, currentTileId);
            let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

            let validString = 'valid_move(' + move[0] + '-' + move[1] + '-' + orientation + ',' + stringBoard + ')';
            let p = this.gameOrchestrator.server.promiseRequest(validString, null, null, false);

            p.then((request) => {
                if (request == "valid") {
                    // --- Game move --- //
                    this.lastMove = [this.previousTileId, currentTileId];
                    
                    // push move to animator    
                    this.gameOrchestrator.gameMode 
                    this.gameOrchestrator.gameSequence.addMove(
                        new MyGameMove(
                            this.gameOrchestrator.piecesList, 
                            this.piece,
                            this.gameOrchestrator.turn, 
                            this.gameOrchestrator.boardSet.auxBoardDisplacement, 
                            this.board.getPieceFinalPosition(this.lastMove[0], this.lastMove[1]),
                            [this.lastMove[0], this.lastMove[1]])
                        );

                    // --- Game move --- //
                    this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, this.piece, this.gameOrchestrator.boardSet, this.lastMove));
                    this.updateBoardProlog(this.lastMove);
                }
            });
            
            this.cleanPicked();
        }
        else {
            this.cleanPicked();

            this.selectedTiles = this.board.getAdjacentTiles(currentTileId);
            this.previousTileId = currentTileId;
        }
    }

    /**
     * Update function, called periodically, which calls the update function of the game info, and checks if the time reached the timeout of the turn
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */    
    update(elapsedTime) {
        this.turnTimer += elapsedTime;

        this.gameOrchestrator.gameInfo.timeout = Math.floor(this.gameOrchestrator.timeout); // Because of interface changes;
        this.gameOrchestrator.gameInfo.update(this.turnTimer);
        
        if(this.turnTimer >= this.gameOrchestrator.timeout) {
            this.gameOrchestrator.changeState(new GameStateEnd(this.gameOrchestrator, this.board));
            if(this.gameOrchestrator.turn == "white") {
                this.gameOrchestrator.createGameStats("timeout", "Black");
            }
            else {
                this.gameOrchestrator.createGameStats("timeout", "White");
            }
        }
    }

    /**
     * Display function, called periodically, which calls the display function of the current state
     */
    display() {       
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
    }
}