class MyGameOrchestrator {
	constructor(scene) {
        this.scene = scene;
        this.graph = null;

        this.board = null;
        this.auxBoard = null;
        this.pieces = null;
        this.adjacent = null;

        this.gameSequence = new MyGameSequence();
        this.theme;
        
        this.prologInterface = new MyPrologInterface();
        this.server = new MyServer();
        
        this.prevPicked = null;

        this.initialBoard();

        this.selectedTexture = new CGFtexture(scene, "scenes/images/white.jpg");   // MUDAR FUTURAMENTE
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
        
        this.pieces = sceneGraph.piece;
    }

    update(graph) {
        this.graph = graph;
    }

    updateTime(time) {
        this.animator.update(time);
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

        this.pieces.updatePosition(rowP, columnP, rowA, columnA);
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
                            this.putPiece(this.prevPicked, customId);
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

        this.pieces.display();

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