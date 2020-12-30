class MyBoardSet {
    constructor(scene, boardList, boardDisplacement, auxBoardDisplacement, boardTexture, auxBoardTexture, whiteTileTexture, blackTileTexture) {
        this.scene = scene;

        this.whiteTileTexture = whiteTileTexture;
        this.blackTileTexture = blackTileTexture;
        this.boardTexture = boardTexture;
        this.auxBoardTexture = auxBoardTexture;
        this.size = boardList.length;

        if (this.size == 7) {
            this.boardDisplacement = [boardDisplacement[0] + 2, boardDisplacement[1], boardDisplacement[2] + 2];
        }
        else if (this.size == 9) {
            this.boardDisplacement = [boardDisplacement[0] + 1, boardDisplacement[1], boardDisplacement[2] + 1];
        }
        else {
            this.boardDisplacement = boardDisplacement;
        }

        this.board = new MyBoard(scene, boardList, this.boardDisplacement, boardTexture);
        this.auxBoard = new MyAuxBoard(scene, this.auxBoardTexture);
        this.pieceToPlay = new MyPiece(this.scene, 'white', this.blackTileTexture, this.whiteTileTexture);
        this.pieceStack = new MyPiece(this.scene, 'black', this.blackTileTexture, this.whiteTileTexture);
        
        this.auxBoardDisplacement =  auxBoardDisplacement;

        this.pieceAnimated = false;

        this.turn = "white";
    }

    resetPiece() {
        if (this.turn == "white") {
            this.pieceToPlay = new MyPiece(this.scene, 'white', this.whiteTileTexture, this.blackTileTexture);
            this.pieceStack = new MyPiece(this.scene, 'black', this.whiteTileTexture, this.blackTileTexture);
            
            this.turn = "black";
        } else {
            this.pieceToPlay = new MyPiece(this.scene, 'black', this.whiteTileTexture, this.blackTileTexture);
            this.pieceStack = new MyPiece(this.scene, 'white', this.whiteTileTexture, this.blackTileTexture);
            

            this.turn = "white";
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