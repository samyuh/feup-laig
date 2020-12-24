class MyGameOrchestrator {
	constructor(scene) {
        this.scene = scene;
        this.graph = null;


        this.stateEnum = {
            "Loading" : 0,
            "Menu" : 1,
            "WhiteTurn" : 2,
            "BlackTurn" : 3,
            "EndGame" : 4,
        }

        //------ Game Variables ----- //
        this.currentTurnColor = "white";
        //------ Game Variables ----- //
        // ----- All Time Variables ---- //
        this.server = new MyServer();
        this.gameSequence = new MyGameSequence(); // TO DO
        //this.animator
        this.whiteTurn = new MySpriteText(this.scene, "Turn: white");
        this.blackTurn = new MySpriteText(this.scene, "Turn: black");

        this.adjacent = null;
        this.piecesList = [];

        this.animateMove = false;

        this.prevPicked = null; 
        this.gameEnded = false;
        // ----- All Time Variables ---- //

        // REFACTOR
        this.lavaAnim = new MyWaveAnimation(this.scene);

        this.whiteTexture = new CGFtexture(scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(scene, "scenes/images/black.jpg");
        // REFACTOR

        this.initialBoard();
    }

    /* Init Function */
    initialBoard() {
        let boardString = 'initial(' + 7 + ')';
        
        try {
            this.server.makePrologRequest(boardString, null, null, false);
        }
        catch(err) {
            console.log('Prolog server not initialized!');
        }

        let board = this.server.getResult();

        this.boardSet = new MyBoardSet(this.scene, board);
        this.boardSet.board.createTiles();
    }

    initGraph(sceneGraph) {
        this.graph = sceneGraph;
    }

    /* Interface */
    reset() {
        this.initialBoard();
        this.piecesList = [];

        this.currentTurnColor = "white";
    }

    undo() {
        if (this.piecesList.length == 0)
            return;

        let stringBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");

        let piece = this.piecesList.pop();

        let undoString = 'undo(' + stringBoard + ',' + piece.z + '-' + piece.x + '-' + piece.zb + '-' + piece.xb + ')';
        console.log('PEDIDO: ');
        console.log(undoString);
        this.server.makePrologRequest(undoString, null, null, false);

        let new_board = this.server.getResult();
        this.boardSet.board.boardList = new_board;
    }

    /* Update */
    update(time) {
        //this.animator.update(time);
        if(this.animation != null) {
            this.animation.update(time);
        }
        this.lavaAnim.update(time);
    }

    /* Picking */
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
            console.log("Game Ended!");
            this.createGameStats(gameOverData);
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

                                
                                this.animateMove = true;

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
    // ------ Picking ------ //

    // ---- Game Stats ----- //
    displayGameStats() {
        this.scene.pushMatrix();
        this.scene.translate(1, 6, 0);
        this.gameWinner.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 5, 0);
        this.gameScore.display();
        this.scene.popMatrix();
    }

    createGameStats(gameOverData) {
        this.gameWinner = new MySpriteText(this.scene, "Winner: " +  gameOverData[0]);
        this.gameScore = new MySpriteText(this.scene, "Score: " +  gameOverData[1]);
        this.gameEnded = true;
    }

    displayTurn() {
        this.scene.pushMatrix();
        this.scene.translate(1, 6, 0);
        if (this.currentTurnColor == "white")
            this.whiteTurn.display();
        else
            this.blackTurn.display();
        this.scene.popMatrix();
    }

    changeTurn() {
        if(this.currentTurnColor == "white") {
            this.currentTurnColor = "black";
        } else {
            this.currentTurnColor = "white";
        }
    }

    display() {
        if(this.animateMove) {
            this.animation.display();
            this.animateMove = false;
        } else {
            // Picking
            this.choosePosition();
        }
            // -- Board -- //
            if (this.boardSet.board != undefined)
                this.boardSet.display();

            if (this.gameEnded) {
                this.displayGameStats();
            }
            else {
                this.displayTurn();
            }
        
        // -- Board -- //

        // -- Piece Display -- //
        for(var i = 0; i < this.piecesList.length; i++) {
            this.piecesList[i].display();
        }
        // -- Piece Display -- //
        
        // -- Lava -- //
        this.lavaAnim.apply();
        // -- Lava -- //

        this.processNode(this.graph.idRoot, this.graph.nodes[this.graph.idRoot].material, this.graph.nodes[this.graph.idRoot].texture);
    }

    processNode(parentNode, parentMaterial, parentTexture) {
        let currentNode = this.graph.nodes[parentNode];

        // ------- Material ------ //
        let currentMaterial;

        switch (currentNode.material) {
            // -- If node material is null, then it will inherit parent's material
            case "null":
                currentMaterial = parentMaterial;
                break;
            // -- Otherwise, it will have the material ID
            default:
                currentMaterial = this.graph.materials[currentNode.material];
                break;
        }

        // -------- Texture ------ //
        let currentTexture;

        switch (currentNode.texture) {
            // -- If node texture is clear, then it will don't have texture
            case "clear":
                currentTexture = "null";
                break;
            // -- If node texture is null, then it will inherit parent's texture
            case "null":
                currentTexture = parentTexture;
                break;
            // -- Otherwise, it will have the texture ID
            default:
                currentTexture = currentNode.texture;
                break;
        }

        // Bind texture   
        if (currentTexture == "null") {
            currentMaterial.setTexture(null);
        } else {
            currentMaterial.setTexture(this.graph.textures[currentTexture]);
            currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
        }

        currentMaterial.apply();

        // ------ Transformation ------ //
        this.scene.pushMatrix();
        this.scene.multMatrix(currentNode.transformation);

        let display;
        if(currentNode.animationID != null) {
            display = this.graph.keyframesAnimation[currentNode.animationID].apply();
        }

        if (display != 0) {
            // ------ Display Leaves ------ //
            for (let i = 0; i < this.graph.nodes[parentNode].leaves.length; i++) {
                currentNode.leaves[i].display();
                currentMaterial.apply();
            }

            // ------ Process next node ------ //
            for (var i = 0; i < currentNode.descendants.length; i++) {
                this.processNode(currentNode.descendants[i], currentMaterial, currentTexture);
            }
        }
        this.scene.popMatrix();
    }
}