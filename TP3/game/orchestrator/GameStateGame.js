class GameStateGame extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);

        this.adjacent = null;
        this.previousTileId = null;

        this.whiteTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/black.jpg");
    }

    changeTurn() {
        if(this.gameOrchestrator.currentTurnColor == "white") {
            this.gameOrchestrator.currentTurnColor = "black";
        } else {
            this.gameOrchestrator.currentTurnColor = "white";
        }
    }

    updateBoardProlog() {
        let move = this.board.convertId(this.gameOrchestrator.lastMove[0]);  // [Row, Column]
        let orientation = this.board.getOrientation(this.gameOrchestrator.lastMove[0], this.gameOrchestrator.lastMove[1]);
        let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

        let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + this.gameOrchestrator.currentTurnColor + ')';
        this.gameOrchestrator.server.makePrologRequest(moveString, null, null, false);

        let new_board = this.gameOrchestrator.server.getResult();

        this.board.boardList = new_board;
                
        let stringNewBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

        let gameOverString = 'game_over(' + stringNewBoard + ')';
        this.gameOrchestrator.server.makePrologRequest(gameOverString, null, null, false);
        let gameOverData = this.gameOrchestrator.server.getResult();
        console.log(gameOverData);
        if (gameOverData.length != 0) {
            console.log("endBoard");
            this.gameOrchestrator.changeState(new GameStateEnd(this.gameOrchestrator, this.board));

            this.gameOrchestrator.createGameStats(gameOverData);
        }
    }

    handlePicking(tile, currentTileId) {
        if (tile.isDiff) {
            let move = this.board.convertId(this.previousTileId);  // [Row, Column]
            let orientation = this.board.getOrientation(this.previousTileId, currentTileId);
            let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

            let validString = 'valid_move(' + move[0] + '-' + move[1] + '-' + orientation + ',' + stringBoard + ')';
            this.gameOrchestrator.server.makePrologRequest(validString, null, null, false);
            let valid_result = this.gameOrchestrator.server.getResult();

            if (valid_result == "valid") {
                // --- Game move --- //
                let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.currentTurnColor, this.whiteTexture, this.blackTexture);
                let gameMove = new MyGameMove(this.gameOrchestrator.piecesList, piece, [this.previousTileId, currentTileId]);

                this.gameOrchestrator.lastMove = [this.previousTileId, currentTileId];
                this.gameOrchestrator.animation = new MyPieceAnimation();
                // --- Game move --- //
                this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, this.board));

                this.updateBoardProlog();

                this.changeTurn();
            }

            this.cleanPicked();
        }
        else {
            this.cleanPicked();
            this.getAdjacentTiles(currentTileId);
            
            this.previousTileId = currentTileId;
        }
    }

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

    choosePosition() {
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

    display() {
        this.choosePosition();
        
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
    }
}