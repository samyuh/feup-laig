class GameStateGame extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
        this.board = board;
        this.selectedTiles = null;
        this.previousTileId = null;
        this.turnTimer = 0;
    }

    cleanPicked() {
        if(this.selectedTiles != null) {
            for (var i = 0; i < this.selectedTiles.length; i++) {
                if(this.selectedTiles[i] != null) {
                    this.selectedTiles[i].validMove(false);
                }
            }
        }
    }

    handlePicking(tile, currentTileId) {
        if (tile.isDiff) {
            // --- Prolog -- //
            let move = this.board.convertId(this.previousTileId);  // [Row, Column]
            let orientation = this.board.getOrientation(this.previousTileId, currentTileId);
            let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

            let validString = 'valid_move(' + move[0] + '-' + move[1] + '-' + orientation + ',' + stringBoard + ')';
            this.gameOrchestrator.server.makePrologRequest(validString, null, null, false);
            let result = this.gameOrchestrator.server.getResult();
            // --- Prolog -- //
            if (result == "valid") {
                // --- Game move --- //
                let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
                this.lastMove = [this.previousTileId, currentTileId];
                
                // push move to animator    
                this.gameOrchestrator.gameMode 
                this.gameOrchestrator.gameSequence.addMove(
                    new MyGameMove(
                        this.gameOrchestrator.piecesList, 
                        piece,
                        this.gameOrchestrator.turn, 
                        this.gameOrchestrator.boardSet.auxBoardDisplacement, 
                        this.board.getPieceFinalPosition(this.lastMove[0], this.lastMove[1]))
                    );

                // --- Game move --- //
                this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, this.lastMove));
                this.gameOrchestrator.server.updateBoardProlog(this.gameOrchestrator, this.board,this.lastMove);
            }

            this.cleanPicked();
        }
        else {
            this.cleanPicked();

            this.selectedTiles = this.board.getAdjacentTiles(currentTileId);
            this.previousTileId = currentTileId;
        }
    }

    pickBoardTile() {
		if (this.gameOrchestrator.scene.pickMode == false) {
			if (this.gameOrchestrator.scene.pickResults != null && this.gameOrchestrator.scene.pickResults.length > 0) {
				for (let i = 0; i < this.gameOrchestrator.scene.pickResults.length; i++) {
					let tile = this.gameOrchestrator.scene.pickResults[i][0];
					if (tile) {
                        let currentTileId = this.gameOrchestrator.scene.pickResults[i][1];
                        this.handlePicking(tile, currentTileId);
                    }
                    else {
                        this.cleanPicked();
                    }
                }
                
                this.gameOrchestrator.scene.pickResults.splice(0, this.gameOrchestrator.scene.pickResults.length);
            }
		}
    }

    update(elapsedTime) {
        this.turnTimer += elapsedTime;

        this.gameOrchestrator.gameInfo.update(this.turnTimer);
        
        if(this.turnTimer >= this.gameOrchestrator.timeout) {
            this.gameOrchestrator.changeState(new GameStateEnd(this.gameOrchestrator, this.board));
            if(this.gameOrchestrator.turn == "white") {
                this.gameOrchestrator.createGameStats("timeout", ["Black",""]);
            }
            else {
                this.gameOrchestrator.createGameStats("timeout", ["White",""]);
            }
        }
    }

    display() {
        this.pickBoardTile();
        
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //

        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}