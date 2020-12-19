class MyGameOrchestrator {
	constructor(scene) {
        this.scene = scene;
        this.graph = null;

        this.board = null;
        this.auxBoard = null;
        this.pieces = null;

        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.theme;
        
        this.prologInterface = new MyPrologInterface();
        

        this.prologInterface.testar();

    }

    initGraph(sceneGraph) {
        this.graph = sceneGraph;

        this.board = sceneGraph.board;
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

    display() {
        this.board.display();
        this.auxBoardRight.display();
        this.auxBoardLeft.display();

        this.scene.registerForPick(100, this.pieces);
        this.pieces.display();

        this.scene.clearPickRegistration();

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
                this.graph.processNode(currentNode.descendants[i], currentMaterial, currentTexture);
            }
        }
        this.scene.popMatrix();
    }
}