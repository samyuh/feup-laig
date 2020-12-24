class GameStateGame extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);

        this.adjacent = null;
        this.previousTileId = null;

        this.whiteTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/black.jpg");
    }

    // --- Prolog -- //
    updateBoardProlog() {
        let move = this.board.convertId(this.lastMove[0]);  // [Row, Column]
        let orientation = this.board.getOrientation(this.lastMove[0], this.lastMove[1]);
        let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

        let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + this.gameOrchestrator.turn + ')';
        this.gameOrchestrator.server.makePrologRequest(moveString, null, null, false);

        let new_board = this.gameOrchestrator.server.getResult();

        this.board.boardList = new_board;
    }
    // --- Prolog -- //

    getAdjacentTiles(id) {
        let row = ((id - 1) % this.board.boardLength) + 1;
        let column = Math.floor((id - 1) / this.board.boardLength) + 1;
        
        let prev_row = row - 1;
        let prev_column = column - 1;
        let next_row = row + 1;
        let next_column = column + 1;

        this.adjacent = [
            this.board.getTile(row, prev_column), 
            this.board.getTile(row, next_column), 
            this.board.getTile(prev_row, column), 
            this.board.getTile(next_row, column)
        ];

        for (var i = 0; i < this.adjacent.length; i++) {
            if(this.adjacent[i] != null) {
                this.adjacent[i].validMove(true);
                console.log(this.adjacent[i]);
            }
        }

    }

    cleanPicked() {
        if(this.adjacent != null) {
            for (var i = 0; i < this.adjacent.length; i++) {
                if(this.adjacent[i] != null) {
                    this.adjacent[i].validMove(false);
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
                let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.whiteTexture, this.blackTexture); 

                // push move to animator    
                this.gameOrchestrator.gameSequence.addMove(new MyGameMove(this.gameOrchestrator.piecesList, piece, this.gameOrchestrator.turn));

                this.lastMove = [this.previousTileId, currentTileId];
                // --- Game move --- //
                this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, this.lastMove));
                this.updateBoardProlog();
            }

            this.cleanPicked();
        }
        else {
            this.cleanPicked();
            this.getAdjacentTiles(currentTileId);
            
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

    update(time) {
        this.gameOrchestrator.lavaAnim.update(time);
    }

    display() {
        this.pickBoardTile();
        
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