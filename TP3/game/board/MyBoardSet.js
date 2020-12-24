class MyBoardSet {
    constructor(scene, boardList) {
        this.scene = scene;

        this.board = new MyBoard(scene, boardList);
        this.offset = this.board.boardLength/2;
        this.auxBoard = new MyAuxBoard(scene);

        this.tileMaterial = new CGFappearance(this.scene);
        this.tilesTexture = new CGFtexture(this.scene, "scenes/images/decoration/flag.png");
        this.tileMaterial.setTexture(this.tilesTexture);

        this.pieceToPlay = new MyPiece(this.scene, 'white', this.tilesTexture, this.tilesTexture);
        this.pieceToPlay.updatePosition(this.offset*4 + 1, 4, this.offset*4 + 1, 5);
    }

    resetPiece() {
        this.pieceToPlay = new MyPiece(this.scene, 'white', this.tilesTexture, this.tilesTexture);
        this.pieceToPlay.updatePosition(this.offset*4 + 1, 4, this.offset*4 + 1, 5);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.offset*3, -19, 0);
        this.auxBoard.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.offset - 1, -19, -this.offset - 1);
        this.board.display();
        
        this.pieceToPlay.display();
        for(var i = 0; i < this.board.pieceList.length; i++) {
            this.board.pieceList[i].display();
        }
        this.scene.popMatrix();
    }
}