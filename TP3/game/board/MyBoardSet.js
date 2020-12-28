class MyBoardSet {
    constructor(scene, boardList, boardDisplacement, auxBoardDisplacement, boardTexture, auxBoardTexture, whiteTileTexture, blackTileTexture) {
        this.scene = scene;

        this.boardDisplacement = boardDisplacement;
        this.auxBoardDisplacement =  auxBoardDisplacement;

        this.whiteTileTexture = whiteTileTexture;
        this.blackTileTexture = blackTileTexture;
        this.boardTexture = boardTexture;
        this.auxBoardTexture = auxBoardTexture;

        this.board = new MyBoard(scene, boardList, this.boardDisplacement, boardTexture);
        this.pieceToPlay = new MyPiece(this.scene, 'white', this.blackTileTexture, this.whiteTileTexture);
        this.auxBoard = new MyAuxBoard(scene, this.auxBoardTexture);

        this.pieceAnimated = false;
    }

    resetPiece(color) {
        this.pieceToPlay = new MyPiece(this.scene, color, this.blackTileTexture, this.whiteTileTexture);
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