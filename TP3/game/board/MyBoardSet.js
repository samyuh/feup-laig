/**
 * MyBoardSet
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Array} boardList - the list representation of the board, received from the Prolog server
 * @param {Array} boardDisplacement - the displacement of the board in the scene, in the format [dx, dy, dz]
 * @param {Array} auxBoardDisplacement - the displacement of the auxiliary board in the scene, in the format [dx, dy, dz]
 * @param {CGFtexture} boardTexture - the texture of the game board
 * @param {CGFtexture} auxBoardTexture - the texture of the auxiliary board
 * @param {CGFtexture} whiteTileTexture - the texture of the white part of the pieces
 * @param {CGFtexture} blackTileTexture - the texture of the black part of the pieces
 */
class MyBoardSet {
    constructor(scene, boardList, boardDisplacement, auxBoardDisplacement, boardTexture, auxBoardTexture, whiteTileTexture, blackTileTexture) {
        this.scene = scene;

        // -- Tiles -- //
        this.whiteTileTexture = whiteTileTexture;
        this.blackTileTexture = blackTileTexture;

        this.pieceToPlay = new MyPiece(this.scene, 'black', this.whiteTileTexture, this.blackTileTexture);
        this.pieceStack = new MyPiece(this.scene, 'white', this.whiteTileTexture, this.blackTileTexture);

        // -- Board Textures -- //
        this.boardTexture = boardTexture;
        this.auxBoardTexture = auxBoardTexture;
        
        // -- Board Size and Displacement
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

        this.auxBoardDisplacement =  auxBoardDisplacement;

        this.board = new MyBoard(scene, boardList, this.boardDisplacement, boardTexture);
        this.auxBoard = new MyAuxBoard(scene, this.auxBoardTexture);

        this.pieceAnimated = false;
        this.turn = "white";
    }

    /**
     * Update the texture of boards
     * @param {Texture} whiteTexture - texture of the white part of the piece
     * @param {Texture} blackTexture - texture of the black part of the piece
     * @param {Texture} boardTexture - texture of the main board
     * @param {Texture} auxBoardTexture - texture of the auxiliary board
     */
    updateTexture(whiteTexture, blackTexture, boardTexture, auxBoardTexture) {
        this.whiteTileTexture = whiteTexture;
        this.blackTileTexture = blackTexture;

        this.pieceToPlay.whiteTexture = whiteTexture;
        this.pieceToPlay.blackTexture = blackTexture;
        this.pieceToPlay.whiteTexture = whiteTexture;
        this.pieceToPlay.blackTexture = blackTexture;

        this.boardTexture = boardTexture;
        this.auxBoardTexture = auxBoardTexture;

        this.board.updateTexture(boardTexture, whiteTexture, blackTexture);

        this.auxBoard.updateTexture(this.auxBoardTexture);
    }

    /**
     * Update the displacement of boards
     * @param {Array} boardDisplacement - displacement of the board
     * @param {Array} auxBoardDisplacement - displacement of the  auxiliary board
     */
    updateBoardDisplacement(boardDisplacement, auxBoardDisplacement) {
        if (this.size == 7) {
            this.boardDisplacement = [boardDisplacement[0] + 2, boardDisplacement[1], boardDisplacement[2] + 2];
        }
        else if (this.size == 9) {
            this.boardDisplacement = [boardDisplacement[0] + 1, boardDisplacement[1], boardDisplacement[2] + 1];
        }
        else {
            this.boardDisplacement = boardDisplacement;
        }

        this.board.boardDisplacement = this.boardDisplacement
        this.auxBoardDisplacement = auxBoardDisplacement;
    }
    
    /**
     * Updates the piece to play and the piece on the stack, depending on the current turn of the game
     * @param {String} color - the color of the player to play in the current turn
     */
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

    /**
     * Display function, called periodically, which calls the display function of the board, the piece to be played, and the piece in the stack
     */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.auxBoardDisplacement[0], this.auxBoardDisplacement[1], this.auxBoardDisplacement[2]);
        this.auxBoard.display();

        if(!this.pieceAnimated) {
            this.pieceToPlay.display(); 
            this.scene.translate(0, -0.7, 0);
            this.pieceStack.display();
        }
        
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(this.boardDisplacement[0], this.boardDisplacement[1], this.boardDisplacement[2]);
        this.board.display();
        this.scene.popMatrix();
    }
}