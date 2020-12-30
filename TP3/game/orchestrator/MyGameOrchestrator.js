/**
 * MyGameOrchestrator
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
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

        // Player type
        this.player = {
            Player: '1', Random: '2', Intelligent: '3'
        };

        this.player1 = this.player.Player;
        this.player2 = this.player.Player;

        this.boardSize = '7';
        this.timeout = 30;
    }

    /**
     * Initializes the game board, the turn (White Player starts playing), and updates the current game state depending on the user preferences
     */
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
        this.gameInfo = new MyGameInfo(this.scene, "white", this.timeout, this.spriteSheet);

        this.turn = "white";
        this.piecesList = this.boardSet.board.pieceList; // Pieces on board

        this.updatePlayerState(this.player1);
    }

    /**
     * Changes the turn of the game, updating the game states if user changed any player configuration
     */
    changeTurn() {
        let player = null;
        if(this.turn == "white") {
            this.turn = "black";
            this.gameInfo.turn = "black";
            player = this.player2;
        } else {
            this.turn = "white";
            this.gameInfo.turn = "white";
            player = this.player1;
        }
        this.updatePlayerState(player);
    }

    /**
     * Updates the state of the game, depending on the type of the player of the current turn
     * @param {integer} player - the player of the current turn
     */
    updatePlayerState(player) {
        if (player == 1) {
            this.changeState(new GameStateGame(this, this.boardSet.board));
        } else if (player == 2) {
            this.changeState(new GameStateBot(this, this.boardSet.board, "random"));
        } else if (player == 3) {
            this.changeState(new GameStateBot(this, this.boardSet.board, "hard"));
        }
    }

    /**
     * Updates the state of the game
     * @param {GameState Object} state - the new state of the game
     */
    changeState(state) {
        this.concreteState = state;
    }

    /**
     * Initializes the graph of the scene, storing its textures
     * @param {SceneGraph Object} sceneGraph - the graph of the scene
     */
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

    /**
     * Initializes the game, after the scene if fully loaded
     */
    initGame() {
        if(this.graphLoaded) {
            this.initBoard();
        }
    }

    /**
     * Initializes the movie of the game, if the user presses the "Movie" button on the interface
     */
    movie() {
        // if gamestate = end
        this.boardSet.board.pieceList = [];
        this.changeState(new GameStateAnimator(this, this.gameSequence));
    }

    /**
     * Resets the board, if the user presses the "Reset" button on the interface, returning to Player VS Player mode
     */
    reset() {
        this.initBoard();

        this.changeState(new GameStateGame(this, this.boardSet.board));
    }

    /**
     * Undoes the last move, if the user presses the "Undo" button on the interface
     */
    undo() {
        if(!(this.concreteState instanceof GameStateGame)) {
            this.changeState(new GameStateGame(this, this.boardSet.board));
        }

        if (this.boardSet.board.pieceList.length == 0) {
            return;
        }

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

    /**
     * Presents the game info to the screen, after the end of the game
     * @param {String} status - cause of the end of the game (Board full or Timeout)
     * @param {Array} gameOverData - game info, with the winner and its score
     */
    createGameStats(status, gameOverData) {
        this.gameInfo = new MyGameEndInfo(this.scene, status, gameOverData, this.spriteSheet);
    }

    /**
     * Update function, called periodically, which calls the update function of the current state
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.concreteState.update(elapsedTime);
    }

    /**
     * Display function, called periodically, which calls the display function of the current state
     */
    display() {
        this.concreteState.display();
    }

    /**
     * Processes a node 
     * @param {Node} parentNode - the parent node of the node being processed
     * @param {Node} parentMaterial - the material of the parent node of the node being processed
     * @param {Node} parentTexture - the texture of the parent node of the node being processed
     */
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