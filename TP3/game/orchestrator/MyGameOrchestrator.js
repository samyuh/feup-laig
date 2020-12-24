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
        // Movie -> Displays the Movie with game Sequence maybe? // this.gameSequence = new MyGameSequence();
        // Menu -> Menu to choose! (Or in html)
        this.concreteState = new GameStateLoading(this, this.board);

        // PROLOG Connection
        this.server = new MyServer();
        
        // -- Player Turn -- //
        this.whiteTurn = new MySpriteText(this.scene, "Turn: white");
        this.blackTurn = new MySpriteText(this.scene, "Turn: black");
        
        // -- REFACTOR -- //
        this.lavaAnim = new MyWaveAnimation(this.scene);
        
        this.initBoard();
    }

    changeState(state) {
        this.concreteState = state;
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

        this.boardSet = new MyBoardSet(this.scene, board);
        this.board = this.boardSet.board;
        this.piecesList = this.board.pieceList; // Pieces on board
        this.currentTurnColor = "white";
    }

    initGraph(sceneGraph) {
        this.graph = sceneGraph;

        this.concreteState = new GameStateGame(this, this.board);
    }

    /* Interface */
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
    }

    createGameStats(gameOverData) {
        this.gameWinner = new MySpriteText(this.scene, "Winner: " +  gameOverData[0]);
        this.gameScore = new MySpriteText(this.scene, "Score: " +  gameOverData[1]);
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

    /* Update */
    update(time) {
        this.concreteState.update(time);
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