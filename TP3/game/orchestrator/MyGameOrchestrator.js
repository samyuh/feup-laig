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
        this.concreteState = new GameStateLoading(this, this.board);

        // -- Game Sequence -- //
        this.gameSequence = new MyGameSequence();

        // PROLOG Connection
        this.server = new MyServer();

        // Scene
        this.boardDisplacement = [-5, -19, -5];
        this.auxBoardDisplacement = [10, -19, 0];

        this.player = {
            Player: '1', Random: '2', Intelligent: '3'
        };

        this.player1 = this.player.Player;
        this.player2 = this.player.Player;
        this.timeout = 30;
        
        // -- Textures -- //
        this.boardTexture = new CGFtexture(scene, "scenes/images/wood.jpg");
        this.auxBoardTexture = new CGFtexture(scene, "scenes/images/decoration/flag.png");
        this.whiteTexture = new CGFtexture(this.scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(this.scene, "scenes/images/black.jpg");

        this.spriteSheet = new MySpriteSheet(scene, "./scenes/images/spritesheet-alphabet.jpg", 8, 6);

        this.difficulty = "random";
        this.difficultyHard = "hard";
        
        this.initBoard();
    }

    /* Init Function */
    initBoard() {
        let boardString = 'initial(' + 7 + ')';
        
        try {
            this.server.makePrologRequest(boardString, null, null, false);
        }
        catch(err) {
            console.log('Prolog server not initialized!');
        }

        let board = this.server.getResult();

        this.boardSet = new MyBoardSet(this.scene, board, this.boardDisplacement, this.auxBoardDisplacement, this.boardTexture, this.auxBoardTexture, this.whiteTexture, this.blackTexture);
        this.gameInfo = new MyGameInfo(this.scene, "white", this.boardDisplacement, this.spriteSheet);

        this.board = this.boardSet.board;
        this.turn = "white";
        this.piecesList = this.board.pieceList; // Pieces on board

        this.graphLoaded = false;
    }

    changeTurn() {
        console.log(this.player1);
        console.log(this.player2);
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
            this.concreteState = new GameStateGame(this, this.board);
        } else if (this.player1 == 2) {
            this.concreteState = new GameStateBot(this, this.board, "random");
        } else if (this.player1 == 3) {
            this.concreteState = new GameStateBot(this, this.board, "hard");
        }
    }

    updatePlayerState2() {
        if (this.player2 == 1) {
            this.concreteState = new GameStateGame(this, this.board);
        } else if (this.player2 == 2) {
            this.concreteState = new GameStateBot(this, this.board, "random");
        } else if (this.player2 == 3) {
            this.concreteState = new GameStateBot(this, this.board, "hard");
        }
    }

    changeState(state) {
        this.concreteState = state;
    }

    initGraph(sceneGraph) {
        this.graph = sceneGraph;
        
        this.graphLoaded = true;

        this.updatePlayerState1();
    }

    initGame() {
        if(this.graphLoaded) {
            this.updatePlayerState1();
        }
    }

    /* Interface */
    movie() {
        // if gamestate = end
        this.board.pieceList = [];
        this.changeState(new GameStateAnimator(this, this.gameSequence));
    }

    reset() {
        this.initBoard();

        this.changeState(new GameStateGame(this, this.board));
    }

    undo() {
        if(!(this.concreteState instanceof GameStateGame)) {
            this.changeState(new GameStateGame(this, this.board));
        }

        if (this.board.pieceList.length == 0)
            return;

        let stringBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");

        let piece = this.board.pieceList.pop();

        let undoString = 'undo(' + stringBoard + ',' + piece.z + '-' + piece.x + '-' + piece.zb + '-' + piece.xb + ')';
        console.log('PEDIDO: ');
        console.log(undoString);
        this.server.makePrologRequest(undoString, null, null, false);

        let new_board = this.server.getResult();
        this.boardSet.board.boardList = new_board;

        this.gameSequence.pop();
        //this.gameInfo = new MyGameInfo(this.scene, turn);
    }

    createGameStats(status, gameOverData) {
        this.gameInfo = new MyGameEndInfo(this.scene, status, gameOverData, this.boardDisplacement, this.spriteSheet);
    }

    /* Update */
    update(elapsedTime) {
        this.concreteState.update(elapsedTime);
        if (!(this.concreteState instanceof GameStateGame)) {
            return;
        }
    }

    // --- General Display --- //
    display() {
        this.concreteState.display();
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