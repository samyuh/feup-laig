class MyGameOrchestrator {
	constructor(scene) {
        this.scene = scene;
        this.graph = null;

        // Concrete State 
        // Loading -> Loading Graph
        // Game -> Game
        // Anime -> Piece Animation
        // End - > End Game
        // TODO:
        // Movie -> Displays the Movie with game Sequence maybe? // 
        // Menu -> Menu to choose! (Or in html)
        this.concreteState = new GameStateLoading(this, null);

        // -- Game Sequence -- //
        this.gameSequence = new MyGameSequence();

        // PROLOG Connection
        this.server = new MyServer();

        // Scene
        this.player = {
            Player: '1', Random: '2', Intelligent: '3'
        };

        this.player1 = this.player.Player;
        this.player2 = this.player.Player;
        this.boardSize = '7';
        this.timeout = 30;
    }

    /* Init Function */
    initBoard() {
        let boardString = 'initial(' + this.boardSize + ')';
        
        try {
            this.server.makePrologRequest(boardString, null, null, false);
        }
        catch(err) {
            console.log('Prolog server not initialized!');
        }

        let board = this.server.getResult();

        this.boardSet = new MyBoardSet(this.scene, board, this.boardDisplacement, this.auxBoardDisplacement, this.boardTexture, this.auxBoardTexture, this.whiteTexture, this.blackTexture);
        this.gameInfo = new MyGameInfo(this.scene, "white", this.boardDisplacement, this.timeout, this.spriteSheet);

        //this.board = this.boardSet.board;
        this.turn = "white";
        this.piecesList = this.boardSet.board.pieceList; // Pieces on board

        this.updatePlayerState1();
    }

    changeTurn() {
        if(this.turn == "white") {
            this.turn = "black";
            this.gameInfo.turn = "black";
            this.updatePlayerState2();
        } else {
            this.turn = "white";
            this.gameInfo.turn = "white";
            this.updatePlayerState1();
        }
    }

    updatePlayerState1() {
        if (this.player1 == 1) {
            this.concreteState = new GameStateGame(this, this.boardSet.board);
        } else if (this.player1 == 2) {
            this.concreteState = new GameStateBot(this, this.boardSet.board, "random");
        } else if (this.player1 == 3) {
            this.concreteState = new GameStateBot(this, this.boardSet.board, "hard");
        }
    }

    updatePlayerState2() {
        if (this.player2 == 1) {
            this.concreteState = new GameStateGame(this, this.boardSet.board);
        } else if (this.player2 == 2) {
            this.concreteState = new GameStateBot(this, this.boardSet.board, "random");
        } else if (this.player2 == 3) {
            this.concreteState = new GameStateBot(this, this.boardSet.board, "hard");
        }
    }

    changeState(state) {
        this.concreteState = state;
    }

    initGraph(sceneGraph) {
        this.graph = sceneGraph;
        
        this.graphLoaded = true;

        this.boardDisplacement = this.graph.boardDisplacement;
        this.auxBoardDisplacement = this.graph.auxBoardDisplacement;

        this.boardTexture = this.graph.boardTexture;
        this.auxBoardTexture = this.graph.auxBoardTexture;
        this.whiteTexture = this.graph.whiteTexture;
        this.blackTexture = this.graph.blackTexture;

        this.spriteSheet = this.graph.spriteSheet;

        this.initBoard();
    }

    initGame() {
        if(this.graphLoaded) {
            this.initBoard();
        }
    }

    /* Interface */
    movie() {
        // if gamestate = end
        this.boardSet.board.pieceList = [];
        this.changeState(new GameStateAnimator(this, this.gameSequence));
    }

    reset() {
        this.initBoard();

        this.changeState(new GameStateGame(this, this.boardSet.board));
    }

    undo() {
        if(!(this.concreteState instanceof GameStateGame)) {
            this.changeState(new GameStateGame(this, this.boardSet.board));
        }

        if (this.boardSet.board.pieceList.length == 0)
            return;

        let stringBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");

        let piece = this.boardSet.board.pieceList.pop();

        let piece_row = piece.z + 1;
        let piece_column = piece.x + 1;
        let piece_secondary_row = piece.zb + 1;
        let piece_secondary_column = piece.xb + 1;

        let undoString = 'undo(' + stringBoard + ',' + piece_row + '-' + piece_column + '-' + piece_secondary_row + '-' + piece_secondary_column + ')';
        this.server.makePrologRequest(undoString, null, null, false);

        let new_board = this.server.getResult();
        this.boardSet.board.boardList = new_board;

        this.changeTurn();

        if (this.boardSet.board.pieceList.length == 0)
            this.gameInfo.updateGroups(0, 0);
        else {
            let stringNewBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");
            let groupsString = 'groups(' + stringNewBoard + ')';
            this.server.makePrologRequest(groupsString, null, null, false);
            let groupsData = this.server.getResult();
            groupsData[0] = groupsData[0] || 1;
            groupsData[1] = groupsData[1] || 1;
            this.gameInfo.updateGroups(groupsData[0], groupsData[1]);
        }
        //this.gameSequence.pop();
        //this.gameInfo = new MyGameInfo(this.scene, turn);
    }

    createGameStats(status, gameOverData) {
        this.gameInfo = new MyGameEndInfo(this.scene, status, gameOverData, this.boardDisplacement, this.spriteSheet);
    }

    /* Update */
    update(elapsedTime) {
        this.concreteState.update(elapsedTime);
    }

    // --- General Display --- //
    display() {
        this.concreteState.display();

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