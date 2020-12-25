class MyBoardSet {
    constructor(scene, boardList, boardDisplacement, auxBoardDisplacement) {
        this.scene = scene;

        this.boardDisplacement = boardDisplacement;
        this.auxBoardDisplacement =  auxBoardDisplacement;

        this.board = new MyBoard(scene, boardList, this.boardDisplacement);
        this.auxBoard = new MyAuxBoard(scene);

        this.pieceAnimated = false;
        this.pieceToPlay = new MyPiece(this.scene, 'white', null, null);

        // --- Textures change this ---//
        this.tileMaterial = new CGFappearance(this.scene);
        this.tilesTexture = new CGFtexture(this.scene, "scenes/images/decoration/flag.png");
        this.tileMaterial.setTexture(this.tilesTexture);
        // --- Textures change this ---//   
    }

    resetPiece() {
        //this.pieceToPlay = new MyPiece(this.scene, 'white', this.tilesTexture, this.tilesTexture);
        //this.pieceToPlay.updatePosition(this.offset*4 + 1, 4, this.offset*4 + 1, 5);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.auxBoardDisplacement[0], this.auxBoardDisplacement[1], this.auxBoardDisplacement[2]);
        this.auxBoard.display();

        if(!this.pieceAnimated) {
            this.pieceToPlay.display();
        }
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.boardDisplacement[0], this.boardDisplacement[1], this.boardDisplacement[2]);
        this.board.display();
        this.scene.popMatrix();
    }
}