/**
 * MyGameOrchestrator
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
class MyGameOrchestrator {
	constructor(scene) {
        this.scene = scene;
        this.graph = null; // -- SceneGraph
        this.allLoaded = false;

        // -- Menu -- //
        this.unselectMenu = false;
        this.unselectGameMenu = false;
        this.timeUntilUnselect = 0;

        // -- Current Game State -- //
        this.concreteState = new GameStateLoading(this, null);

        // PROLOG Connection
        this.server = new MyServer();

        // -- Board Settings, Player, more -- //
        this.lastCamera = null;
        this.turn = "white"; // White always start
        this.boardSize = '7';
        this.timeout = 30;

        this.player = {
            Player: '1', 
            Random: '2', 
            Intelligent: '3'
        };

        this.player1 = this.player.Player;
        this.player2 = this.player.Player;

        // -- Common background text textures -- //
        this.backgroundText = new CGFtexture(this.scene, "./scenes/images/menus/text-background.png");
    }

    /**
     * Initializes the graph of the scene, storing its textures
     * @param {SceneGraph Object} sceneGraph - the graph of the scene
     */
    initGraph(sceneGraph) {
        this.graph = sceneGraph;

        this.spriteSheet = this.graph.spriteSheet;

        // -- Board -- //
        this.boardDisplacement = this.graph.boardDisplacement;
        this.boardTexture = this.graph.boardTexture;

        // -- Aux Board -- //
        this.auxBoardDisplacement = this.graph.auxBoardDisplacement;
        this.auxBoardTexture = this.graph.auxBoardTexture;

        // -- Piece -- //
        this.whiteTexture = this.graph.whiteTexture;
        this.blackTexture = this.graph.blackTexture;

        // -- Main Menu -- //
        this.mainMenuDisplacement = this.graph.mainMenuDisplacement;
        this.mainMenuTextures = this.graph.mainMenuTextures;

        // -- In Game Menu -- //
        this.infoBoardDisplacement = this.graph.infoBoardDisplacement;
        this.infoBoardTextures = this.graph.infoBoardTextures;

        // -- Game Cameras -- //
        this.menuCamera = this.graph.menuCamera;
        this.whiteCamera = this.graph.whiteCamera;
        this.blackCamera = this.graph.blackCamera;
        
        this.menu = new MyMenu(this, this.scene, this.spriteSheet, this.mainMenuDisplacement, this.mainMenuTextures);
        this.gameMenu = new MyGameMenu(this, this.scene, this.infoBoardDisplacement, this.infoBoardTextures);

        if (!(this.concreteState instanceof GameStateLoading)) {
           this.gameInfo.updatePosition(this.infoBoardDisplacement);

            // -- Update Board Displacement -- //
           this.boardSet.updateBoardDisplacement(this.boardDisplacement, this.auxBoardDisplacement);

           // -- Update Values of Texture on boardSet
           this.boardSet.updateTexture(this.whiteTexture, this.blackTexture, this.boardTexture, this.auxBoardTexture);

           // -- Update Game Sequence Values -- //
           for(let i = 0; i < this.gameSequence.moves.length; i++) {
                this.gameSequence.moves[i].startPosition = this.auxBoardDisplacement;
                this.gameSequence.moves[i].finalPosition = 
                    this.boardSet.board.getPieceFinalPosition(
                        this.gameSequence.moves[i].coordinates[0], 
                        this.gameSequence.moves[i].coordinates[1]
                    );
            }

           if ((this.concreteState instanceof GameStateAnime) || (this.concreteState instanceof GameStateMovie)) {
               this.concreteState.updatePosition(this.auxBoardDisplacement, this.whiteTexture, this.blackTexture);
           }
        } 
        else {
            this.initBoard(false);

            this.concreteState.reset();
            this.concreteState.setMenuCamera(this.menuCamera);
            this.lastCamera = this.menuCamera;
        }
    }

    /**
     * Initializes the game board, the turn (White Player starts playing), and updates the current game state depending on the user preferences
     */
    initBoard(startGame) {
        let boardString = 'initial(' + this.boardSize + ')';
        
        let p = this.server.promiseRequest(boardString, null, null);
        p.then((request) => {
            let board = request;

            // -- GameBoard -- //
            this.timeout = Math.floor(this.timeout); // Because of interface input
            this.boardSet = new MyBoardSet(this.scene, board, this.boardDisplacement, this.auxBoardDisplacement, this.boardTexture, this.auxBoardTexture, this.whiteTexture, this.blackTexture);
            this.gameInfo = new MyGameInfo(this.scene, this.turn, this.player1, this.player2, this.infoBoardDisplacement, this.timeout, this.spriteSheet, this.backgroundText);
            this.piecesList = this.boardSet.board.pieceList;
            this.gameInfo.turn = "white";
            this.turn = "white";

            if(startGame) {
                this.gameSequence = new MyGameSequence();
                this.updatePlayerState(this.player1);
                if(this.player1 == 1) {
                    this.scene.updateCamera(this.whiteCamera);
                    this.lastCamera = this.whiteCamera;
                }
                else if(this.player2 == 1) {
                    this.scene.updateCamera(this.blackCamera);
                    this.lastCamera = this.blackCamera;
                } else {
                    this.scene.updateCamera(this.whiteCamera);
                    this.lastCamera = this.whiteCamera;
                }
            }
            else {
                this.concreteState.board = this.boardSet.board;
            }

            this.allLoaded = true;
        });
    }

    /**
     * Changes the turn of the game, updating the game states if user changed any player configuration
     */
    changeTurn() {
        let currentPlayer = null;
        if(this.turn == "white") {
            this.turn = "black";
            this.gameInfo.turn = "black";
            this.gameInfo.blackPlayer = this.player2;
            currentPlayer = this.player2;
            if(currentPlayer == 1) {
                this.scene.updateCamera(this.blackCamera);
                this.lastCamera = this.blackCamera;
            }
        } else {
            this.turn = "white";
            this.gameInfo.turn = "white";
            this.gameInfo.whitePlayer = this.player1;
            currentPlayer = this.player1;
            if(currentPlayer == 1) {
                this.scene.updateCamera(this.whiteCamera);
                this.lastCamera = this.whiteCamera;
            }
        }
        this.updatePlayerState(currentPlayer);
    }

    /*
     *
     */
    returnGame() {
        let currentPlayer = null;

        if(this.turn == "white") {
            currentPlayer = this.player1;
        } else if(this.turn == "black") {
            currentPlayer = this.player2;
        }
        this.updatePlayerState(currentPlayer);
    }

    /**
     * Updates the state of the game, depending on the type of the player of the current turn
     * @param {integer} player - the player of the current turn
     */
    updatePlayerState(player) {
        if (player == 1) {
            this.changeState(new GameStateTurn(this, this.boardSet.board));
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

    // --- Menus Functions --- //

    /**
     * 
     */
    changeMenu() {
        this.unselectGameMenu = true;
        this.timeUntilUnselect = 0;

        this.scene.updateCamera(this.menuCamera);
        this.lastCamera = this.menuCamera;
        this.changeState(new GameStateLoading(this, this.boardSet.board));
    }

    /**
     * 
     */
    changeBoardSize(size) {
        this.boardSize = size;

        this.initBoard(false);
    }

    /**
     * 
     */
    changePlayer(player, type) {
        if(player == "one") {
            if (type == 1) {
                this.player1 = this.player.Player;
            } else if (type == 2) {
                this.player1 = this.player.Random;
            } else if (type == 3) {
                this.player1 = this.player.Intelligent;
            }
        } else if (player == "two") {
            if (type == 1) {
                this.player2 = this.player.Player;
            } else if (type == 2) {
                this.player2 = this.player.Random;
            } else if (type == 3) {
                this.player2 = this.player.Intelligent;
            }
        }
    }

    /**
     * Initializes the movie of the game, if the user presses the "Movie" button on the interface
     */
    movie() {
        this.unselectGameMenu = true;
        this.timeUntilUnselect = 0;

        if((this.concreteState instanceof GameStateAnime) || (this.concreteState instanceof GameStateLoading) || (this.concreteState instanceof GameStateMovie)) {
            return;
        }

        if (this.boardSet.board.pieceList.length == 0) {
            return;
        }

        if (this.concreteState instanceof GameStateTurn)
            this.concreteState.cleanPicked();

        this.boardSet.board.pieceList = [];
        if(this.concreteState instanceof GameStateEnd) {
            this.changeState(new GameStateMovie(this, this.boardSet.board, this.gameSequence, "end"));
        }
        else {
            this.changeState(new GameStateMovie(this, this.boardSet.board, this.gameSequence, "turn"));
        }
    }

    /**
     * Resets/Init a new game with the
     */
    reset() {
        this.unselectMenu = true;
        this.unselectGameMenu = true;
        this.timeUntilUnselect = 0;
        
        this.initBoard(true);
    }

    /**
     * Undoes the last move, if the user presses the "Undo" button on the interface
     */
    undo() {
        this.unselectGameMenu = true;
        this.timeUntilUnselect = 0;

        if(!(this.concreteState instanceof GameStateTurn)) {
            return;
        }
        if (this.boardSet.board.pieceList.length == 0) {
            return;
        }

        if(this.player1 != 1 || this.player2 != 1) { // Se for vs bots
            if (this.boardSet.board.pieceList.length == 1) { // First time black plays
                return;
            }

            this.gameSequence.undo();
            let stringBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");
            let piece = this.boardSet.board.pieceList.pop();

            let piece_row = piece.z + 1;
            let piece_column = piece.x + 1;
            let piece_secondary_row = piece.zb + 1;
            let piece_secondary_column = piece.xb + 1;

            let undoString = 'undo(' + stringBoard + ',' + piece_row + '-' + piece_column + '-' + piece_secondary_row + '-' + piece_secondary_column + ')';
            let p = this.server.promiseRequest(undoString, null, null);

            p.then((request) => {
                this.boardSet.board.boardList = request;

                this.gameSequence.undo();
                let stringBoard2 = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");
                let piece2 = this.boardSet.board.pieceList.pop();

                let piece_row2 = piece2.z + 1;
                let piece_column2 = piece2.x + 1;
                let piece_secondary_row2 = piece2.zb + 1;
                let piece_secondary_column2 = piece2.xb + 1;

                let undoString2 = 'undo(' + stringBoard2 + ',' + piece_row2 + '-' + piece_column2 + '-' + piece_secondary_row2 + '-' + piece_secondary_column2 + ')';
                return this.server.promiseRequest(undoString2, null, null); 
            
            
            }).then((request) => {
                this.boardSet.board.boardList = request;

                if (this.boardSet.board.pieceList.length != 0) {
                    let stringNewBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");
                    let groupsString = 'groups(' + stringNewBoard + ')';
                    
                    return this.server.promiseRequest(groupsString, null, null, false);
                }
                else {
                    return null;
                }
            }).then((request) => {
                if (request == null) {
                    this.gameInfo.updateGroups(0, 0);
                } else {
                    let groupsData = request;
                    groupsData[0] = groupsData[0] || 1;
                    groupsData[1] = groupsData[1] || 1;
                    this.gameInfo.updateGroups(groupsData[0], groupsData[1]);
                }
            });
        } else {
            this.gameSequence.undo();
            let stringBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");
            let piece = this.boardSet.board.pieceList.pop();

            let piece_row = piece.z + 1;
            let piece_column = piece.x + 1;
            let piece_secondary_row = piece.zb + 1;
            let piece_secondary_column = piece.xb + 1;

            let undoString = 'undo(' + stringBoard + ',' + piece_row + '-' + piece_column + '-' + piece_secondary_row + '-' + piece_secondary_column + ')';
            let p = this.server.promiseRequest(undoString, null, null);

            p.then((request) => {
                this.boardSet.board.boardList = request;
                
                this.boardSet.resetPiece();
                this.changeTurn();
    
                if (this.boardSet.board.pieceList.length != 0) {
                    let stringNewBoard = JSON.stringify(this.boardSet.board.boardList).replaceAll("\"", "");
                    let groupsString = 'groups(' + stringNewBoard + ')';
                    
                    return this.server.promiseRequest(groupsString, null, null, false);
                }
                else {
                    return null;
                }
            }).then((request) => {
                if (request == null) {
                    this.gameInfo.updateGroups(0, 0);
                } else {
                    let groupsData = request;
                    groupsData[0] = groupsData[0] || 1;
                    groupsData[1] = groupsData[1] || 1;
                    this.gameInfo.updateGroups(groupsData[0], groupsData[1]);
                }
            });
        }
    }

    // --- End of Menus Function --- //

    /**
     * Presents the game info to the screen, after the end of the game
     * @param {String} status - cause of the end of the game (Board full or Timeout)
     * @param {Array} gameOverData - game info, with the winner and its score
     */
    createGameStats(status, gameOverData) {
        this.gameInfo = new MyGameEndInfo(this.scene, status, gameOverData, this.infoBoardDisplacement, this.spriteSheet, this.backgroundText);
    }

    pickMenu() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {
					let obj = this.scene.pickResults[i][0];
					if (obj) {
                        let objId = this.scene.pickResults[i][1];

                        if((obj instanceof MyTile) && (this.concreteState instanceof GameStateTurn)) {
                            this.concreteState.handlePicking(obj, objId);
                        }
                        if(obj instanceof MyButton) {
                            this.menu.unselectButton(obj.radioType);
                            obj.apply();
                        }
                    }
                    else {
                        if (this.concreteState instanceof GameStateTurn)
                            this.concreteState.cleanPicked();
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
		}
    }

    /**
     * Update function, called periodically, which calls the update function of the current state
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.concreteState.update(elapsedTime);

        // -- Menus Update -- //
        this.timeUntilUnselect += elapsedTime;
        if(this.unselectMenu && this.timeUntilUnselect > 0.8) {
            this.menu.unselectButton(null);
            this.unselectMenu = false;
        }
        if(this.unselectGameMenu && this.timeUntilUnselect > 0.8) {
            this.gameMenu.unselectButton(null);
            this.unselectGameMenu = false;
        }
    }

    /**
     * Display function, called periodically, which calls the display function of the current state
     */
    display() {
        this.pickMenu();
        this.concreteState.display();

        // -- Menus and Scene Display -- //
        this.menu.display();
        this.gameMenu.display();
        this.processNode(this.graph.idRoot, this.graph.nodes[this.graph.idRoot].material, this.graph.nodes[this.graph.idRoot].texture);
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