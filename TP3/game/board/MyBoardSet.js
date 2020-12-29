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
        this.auxBoard = new MyAuxBoard(scene, this.auxBoardTexture);
        this.pieceToPlay = new MyPiece(this.scene, 'white', this.blackTileTexture, this.whiteTileTexture);
        this.pieceStack = new MyPiece(this.scene, 'black', this.blackTileTexture, this.whiteTileTexture);
        
        this.pieceAnimated = false;
    }

    resetPiece(color) {
        if(color == "white") {
            this.pieceToPlay = new MyPiece(this.scene, 'white', this.blackTileTexture, this.whiteTileTexture);
            this.pieceStack = new MyPiece(this.scene, 'black', this.blackTileTexture, this.whiteTileTexture);
        } else {
            this.pieceToPlay = new MyPiece(this.scene, 'black', this.blackTileTexture, this.whiteTileTexture);
            this.pieceStack = new MyPiece(this.scene, 'white', this.blackTileTexture, this.whiteTileTexture);
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.auxBoardDisplacement[0], this.auxBoardDisplacement[1], this.auxBoardDisplacement[2]);
        this.auxBoard.display();

        if(!this.pieceAnimated) {
            this.pieceToPlay.display(); 
            this.scene.translate(0, -1, 0);
            this.pieceStack.display();
        }
        
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.boardDisplacement[0], this.boardDisplacement[1], this.boardDisplacement[2]);
        this.board.display();
        this.scene.popMatrix();
    }
}