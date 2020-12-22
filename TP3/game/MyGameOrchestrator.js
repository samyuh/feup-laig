class MyGameOrchestrator {
	constructor(scene) {
        this.scene = scene;
        this.graph = null;

        this.board = null;
        this.auxBoard = null;
        this.currentPiece = null;
        this.adjacent = null;
        this.piecesList = [];

        this.gameSequence = new MyGameSequence();
        this.theme;
        
        this.prologInterface = new MyPrologInterface();
        this.server = new MyServer();
        
        this.prevPicked = null;

        this.lavaPlane = new MyPlane(this.scene, 50, 50);

        this.appearance = new CGFappearance(this.scene);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);


		this.waterTex = new CGFtexture(this.scene, "scenes/images/waterTex.jpg");
		this.waterMap = new CGFtexture(this.scene, "scenes/images/waterMap.jpg");

        this.appearance.setTexture(this.waterTex);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        this.waterShader = new CGFshader(this.scene.gl, "shaders/lava.vert", "shaders/lava.frag");

        this.waterShader.setUniformsValues({ timeFactor : 0 });
		this.waterShader.setUniformsValues({ waterTex: 2 });
        this.waterShader.setUniformsValues({ waterMap: 3 });
        
        
        
        this.initialBoard();
    }

    initialBoard() {
        let boardString = 'initial(' + 7 + ')';
        
        this.server.makePrologRequest(boardString, null, null, false);

        let board = this.server.getResult();

        this.board = new MyBoard(this.scene, board);
    }

    initGraph(sceneGraph) {
        this.graph = sceneGraph;

        //this.board = sceneGraph.board;
        this.auxBoard = sceneGraph.auxBoard;

        this.auxBoardRight = sceneGraph.auxBoardLeft;
        this.auxBoardLeft = sceneGraph.auxBoardRight;
        
        this.currentPiece = sceneGraph.piece;
    }

    update(graph) {
        this.graph = graph;
    }

    updateTime(time) {
        //this.animator.update(time);

        //console.log("time");

        this.waterShader.setUniformsValues({ timeFactor: time / 100 % 1000 });
    }

    adjacent_cells(id) {
        let row = ((id - 1) % this.board.boardLength) + 1;
        let column = Math.floor((id - 1) / this.board.boardLength) + 1;
        
        let prev_row = row - 1;
        let prev_column = column - 1;
        let next_row = row + 1;
        let next_column = column + 1;

        this.adjacent = [this.board.getTile(row, prev_column), this.board.getTile(row, next_column), this.board.getTile(prev_row, column), this.board.getTile(next_row, column)];

        //adjacent_cells.filter(function(val) { return val !== null; });

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

    putPiece(prev, actual) {
        let rowP = ((prev - 1) % this.board.boardLength) + 1;
        let columnP = Math.floor((prev - 1) / this.board.boardLength) + 1;

        let rowA = ((actual - 1) % this.board.boardLength) + 1;
        let columnA = Math.floor((actual - 1) / this.board.boardLength) + 1;

        this.currentPiece.updatePosition(rowP, columnP, rowA, columnA);
        this.currentPiece.changeTurn();
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
                            let move = this.board.convertId(this.prevPicked);  // [Row, Column]
                            let orientation = this.board.getOrientation(this.prevPicked, customId);

                            let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\\", "").replaceAll("\"", "");

                            let validString = 'valid_move(' + move[0] + '-' + move[1] + '-' + orientation + ',' + stringBoard + ')';
                            this.server.makePrologRequest(validString, null, null, false);
                            let valid_result = this.server.getResult();

                            if (valid_result == "valid") {
                                let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + this.currentPiece.turn + ')';
                                this.server.makePrologRequest(moveString, null, null, false);

                                let new_board = this.server.getResult();

                                this.board.boardList = new_board;
                                this.putPiece(this.prevPicked, customId);

                                let nP = new MyPiece(this.scene);
                                nP.updatePosition(this.currentPiece.x, this.currentPiece.z, this.currentPiece.xb, this.currentPiece.zb);
                                nP.turn = this.currentPiece.turn;
                                this.piecesList.push(nP);

                                let stringNewBoard = JSON.stringify(this.board.boardList).replaceAll("\\", "").replaceAll("\"", "");

                                let gameOverString = 'game_over(' + stringNewBoard + ')';
                                this.server.makePrologRequest(gameOverString, null, null, false);
                                let gameOverData = this.server.getResult();

                                if (gameOverData.length != 0) {
                                    console.log("Game Ended!")
                                }
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
                }
                
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
		}
    }
    
    display() {
        this.choosePosition();

        this.auxBoardRight.display();
        this.auxBoardLeft.display();
        
        if (this.board != undefined)
            this.board.display();

            this.scene.pushMatrix();
        this.appearance.apply();

        this.waterTex.bind(2);
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_S, this.scene.gl.MIRRORED_REPEAT);
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_T, this.scene.gl.MIRRORED_REPEAT);
		this.waterMap.bind(3);
		this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_S, this.scene.gl.MIRRORED_REPEAT);
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_T, this.scene.gl.MIRRORED_REPEAT);
        
        this.scene.translate(0, -50, 0);
        this.scene.scale(90, 50, 90);
        
        this.scene.setActiveShader(this.waterShader);
        this.lavaPlane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();

        this.currentPiece.display();

        for(var i = 0; i < this.piecesList.length; i++) {
            this.piecesList[i].display();
        }

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