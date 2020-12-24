class GameState {
    constructor(gameOrchestrator) {
        this.gameOrchestrator = gameOrchestrator;
    }

    adjacent_cells(id) {
        let row = ((id - 1) % this.boardSet.board.boardLength) + 1;
        let column = Math.floor((id - 1) / this.boardSet.board.boardLength) + 1;
        
        let prev_row = row - 1;
        let prev_column = column - 1;
        let next_row = row + 1;
        let next_column = column + 1;

        this.adjacent = [
            this.boardSet.board.getTile(row, prev_column), 
            this.boardSet.board.getTile(row, next_column), 
            this.boardSet.board.getTile(prev_row, column), 
            this.boardSet.board.getTile(next_row, column)
        ];

        for (var i = 0; i < this.adjacent.length; i++) {
            if(this.adjacent[i] != null) {
                this.adjacent[i].validMove(true);
            }
        }

    }

    clean_adjacent() {
        if(this.adjacent != null) {
            for (var i = 0; i < this.adjacent.length; i++) {
                if(this.adjacent[i] != null) {
                    this.adjacent[i].validMove(false);
                }
            }
        }
    }

    updateBoardProlog() {
        let move = this.boardSet.board.convertId(this.lastMove[0]);  // [Row, Column]
        let orientation = this.boardSet.board.getOrientation(this.lastMove[0], this.lastMove[1]);
        let stringBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");

        let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + this.currentTurnColor + ')';
        this.server.makePrologRequest(moveString, null, null, false);

        let new_board = this.server.getResult();

        this.boardSet.board.boardList = new_board;
                
        let stringNewBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");

        let gameOverString = 'game_over(' + stringNewBoard + ')';
        this.server.makePrologRequest(gameOverString, null, null, false);
        let gameOverData = this.server.getResult();

        if (gameOverData.length != 0) {

            this.state = "End";

            this.createGameStats(gameOverData);
        }
    }

    changeTurn() {
        if(this.currentTurnColor == "white") {
            this.currentTurnColor = "black";
        } else {
            this.currentTurnColor = "white";
        }
    }

    choosePosition() {
		if (this.scene.pickMode == false) {
            let tile;
            let customId;
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					tile = this.scene.pickResults[i][0];
					if (tile) {
                        customId = this.scene.pickResults[i][1];

                        if (tile.isDiff) {
                            let move = this.boardSet.board.convertId(this.prevPicked);  // [Row, Column]
                            let orientation = this.boardSet.board.getOrientation(this.prevPicked, customId);
                            let stringBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");

                            let validString = 'valid_move(' + move[0] + '-' + move[1] + '-' + orientation + ',' + stringBoard + ')';
                            this.server.makePrologRequest(validString, null, null, false);
                            let valid_result = this.server.getResult();

                            if (valid_result == "valid") {
                                // --- Game move --- //
                                let piece = new MyPiece(this.scene, this.currentTurnColor, this.whiteTexture, this.blackTexture);
                                let gameMove = new MyGameMove(this.piecesList, piece, [this.prevPicked, customId]);

                                this.lastMove = [this.prevPicked, customId];
                                this.animation = new MyPieceAnimation();
                                // --- Game move --- //

                                this.updateBoardProlog();

                                
                                this.state = "Anime";

                                this.changeTurn();
                            }

                            this.clean_adjacent();
                        }
                        else {
                            this.clean_adjacent();
                            this.adjacent_cells(customId);
                            
                            this.prevPicked = customId;
                        }

                        console.log("Picked object: " + tile + ", with pick id " + customId + " Previous " + this.prevPicked);
                        console.log("------");
                    }
                    else {
                        this.clean_adjacent();
                    }
                }
                
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
		}
    }
}